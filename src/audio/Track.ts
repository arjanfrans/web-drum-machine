import * as Tone from "tone";
import { EventEmitter } from "../events/EventEmitter";
import { TrackEvent } from "../events/track/TrackEvent";
import { UpdateChannelVolumeEvent } from "../events/track/UpdateChannelVolumeEvent";
import { SoloChannelEvent } from "../events/track/SoloChannelEvent";
import { MuteChannelEvent } from "../events/track/MuteChannelEvent";
import { UpdateChannelPanningEvent } from "../events/track/UpdatePanningVolumeEvent";
import { SetChannelReverbEvent } from "../events/track/SetChannelReverbEvent";
import { SetChannelChorusEvent } from "../events/track/SetChannelChorusEvent";
import { EffectsRack } from "./EffectsRack";
import { SetTrackNoteEvent } from "../events/track/SetTrackNoteEvent";
import { Decibels } from "tone/Tone/core/type/Units";
import { UpdateSendVolumeEvent } from "../events/track/UpdateSendVolumeEvent";

export class Track {
    public readonly player: Tone.Player;
    private sequence?: Tone.Sequence;
    public readonly emitter: EventEmitter = new EventEmitter();
    public readonly channel: Tone.Channel;
    public readonly effectsRack: EffectsRack;
    public readonly sends: Map<string, Tone.Gain<"decibels">> = new Map<string, Tone.Gain<"decibels">>();

    constructor(
        public readonly id: string,
        public name: string,
        private sample: string,
        public readonly sequenceNotes: boolean[]
    ) {
        this.player = new Tone.Player(sample);
        this.channel = new Tone.Channel(-6, 0);
        this.effectsRack = new EffectsRack(this.player, this.channel);

        this.player.connect(this.channel);

        const reverb = new Tone.Reverb({
            wet: 0.5,
            preDelay: 0.01,
        });
        const chorus = new Tone.Chorus({
            depth: 0.4,
            spread: 0.4,
            feedback: 0.4,
            wet: 0.7,
        });

        this.effectsRack.add("chorus", chorus);
        this.effectsRack.add("reverb", reverb, "chorus");
        this.effectsRack.disableEffect("chorus");
        this.effectsRack.disableEffect("reverb");

        this.channel.toDestination();

        this.updateSequence();

        this.emitter.on(SetTrackNoteEvent, (event: SetTrackNoteEvent) => {
            this.sequenceNotes[event.index] = event.isActive;

            this.emitter.emit(new TrackEvent(this));
        });

        this.emitter.on(UpdateChannelVolumeEvent, (event: UpdateChannelVolumeEvent) => {
            this.channel.volume.value = event.volume;
        });

        this.emitter.on(UpdateChannelPanningEvent, (event: UpdateChannelPanningEvent) => {
            this.channel.pan.value = event.pan;
        });

        this.emitter.on(SoloChannelEvent, (event: SoloChannelEvent) => {
            this.channel.solo = event.solo;

            this.emitter.emit(new TrackEvent(this));
        });

        this.emitter.on(MuteChannelEvent, (event: MuteChannelEvent) => {
            this.channel.mute = event.mute;

            this.emitter.emit(new TrackEvent(this));
        });

        this.emitter.on(SetChannelReverbEvent, (event: SetChannelReverbEvent) => {
            if (event.enable) {
                this.effectsRack.enableEffect("reverb");
            } else {
                this.effectsRack.disableEffect("reverb");
            }
        });

        this.emitter.on(SetChannelChorusEvent, (event: SetChannelChorusEvent) => {
            if (event.enable) {
                this.effectsRack.enableEffect("chorus");
            } else {
                this.effectsRack.disableEffect("chorus");
            }
        });

        this.emitter.on(UpdateSendVolumeEvent, (event: UpdateSendVolumeEvent) => {
            this.send(event.bus, event.volume);
        });
    }

    public send(bus: string, volume: Decibels = 0): void {
        const sendKnob = this.channel.send(bus, volume);

        this.sends.set(bus, sendKnob);
    }

    public getSend(bus: string): Tone.Gain<"decibels"> | null {
        return this.sends.get(bus) || null;
    }

    private updateSequence(): void {
        this.sequence = new Tone.Sequence(
            (time, index) => {
                if (this.sequenceNotes[index]) {
                    this.player.start(time, 0, "16t");
                }
            },
            Array.from(this.sequenceNotes.keys()),
            "8n"
        ).start();
    }
}
