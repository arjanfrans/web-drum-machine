import * as Tone from "tone";
import { EventEmitter } from "../events/EventEmitter";
import { TrackEvent } from "../events/track/TrackEvent";
import { UpdateChannelVolumeEvent } from "../events/track/UpdateChannelVolumeEvent";
import { SoloChannelEvent } from "../events/track/SoloChannelEvent";
import { MuteChannelEvent } from "../events/track/MuteChannelEvent";
import { UpdateChannelPanningEvent } from "../events/track/UpdatePanningVolumeEvent";

export class SampleTrack {
    public readonly player: Tone.Player;
    private sequence?: Tone.Sequence;
    public readonly emitter: EventEmitter = new EventEmitter();
    public readonly channel: Tone.Channel;

    constructor(
        public readonly id: string,
        public name: string,
        private sample: string,
        public readonly sequenceNotes: boolean[]
    ) {
        this.player = new Tone.Player(sample);
        this.channel = new Tone.Channel(-6, 0);
        this.player.connect(this.channel);
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
