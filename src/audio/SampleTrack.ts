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

export class SampleTrack {
    public readonly player: Tone.Player;
    private sequence?: Tone.Sequence;
    public readonly emitter: EventEmitter = new EventEmitter();
    public readonly channel: Tone.Channel;
    public readonly effectsRack: EffectsRack;

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
            preDelay: 0.2,
        });
        const chorus = new Tone.Chorus({
            depth: 0.4,
            spread: 0.2,
            feedback: 0.1,
            wet: 0.5,
        });

        this.effectsRack.add("chorus", chorus);
        this.effectsRack.add("reverb", reverb, "chorus");
        this.effectsRack.disableEffect("chorus");
        this.effectsRack.disableEffect("reverb");

        this.channel.toDestination();

        this.updateSequence();

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
    }

    public updateSequenceNote(index: number, value: boolean): void {
        this.sequenceNotes[index] = value;

        this.emitter.emit(new TrackEvent(this));
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
