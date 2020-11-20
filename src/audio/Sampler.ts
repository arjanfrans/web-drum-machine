import { Sample } from "./Sample";

interface PlaySampleInterface {
    sample: Sample;
    bars: Array<Array<number>>;
}

export class Sampler {
    private samples: Array<PlaySampleInterface> = [];

    constructor(private context: AudioContext) {}

    public addSample(sample: Sample, bars: Array<Array<number>>) {
        this.samples.push({
            sample,
            bars,
        });
    }

    public play(countIn: number = 0) {
        // We'll start playing the rhythm 100 milliseconds from "now"
        const startTime = this.context.currentTime + 0.1;
        const tempo = 80; // BPM (beats per minute)
        const eighthNoteTime = 60 / tempo / 2;

        for (const playSample of this.samples) {
            const sample = playSample.sample;

            let time = startTime;

            for (let [bar, notes] of playSample.bars.entries()) {
                bar = bar + 1;
                time = time + bar * countIn * eighthNoteTime;

                for (let note of notes) {
                    note = note - 1;

                    const noteTime = time + note * eighthNoteTime;

                    sample.play(noteTime);
                }

                time = time + 8 * eighthNoteTime;
            }
        }
    }
}
