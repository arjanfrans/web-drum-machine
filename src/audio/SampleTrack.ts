import * as Tone from "tone";
import { EventEmitter } from "../events/EventEmitter";
import { TrackEvent } from "../events/TrackEvent";

export class SampleTrack {
    public readonly player: Tone.Player;
    private sequence?: Tone.Sequence;
    public readonly emitter: EventEmitter = new EventEmitter();

    constructor(
        public readonly id: string,
        public name: string,
        private sample: string,
        public readonly sequenceNotes: boolean[]
    ) {
        this.player = new Tone.Player(sample);
        this.updateSequence();
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
