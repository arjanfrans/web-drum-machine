import { BufferLoader } from "./BufferLoader";
import { Sample } from "./Sample";
import { Sampler } from "./Sampler";

export class AudioEngine {
    private sampler: Sampler;
    private readonly context: AudioContext;

    constructor() {
        this.context = new AudioContext();

        window.requestAnimationFrame = (function () {
            return (
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                }
            );
        })();

        this.context = new AudioContext();
        this.sampler = new Sampler(this.context);
    }

    public async load(): Promise<void> {
        const samples = new Map();

        samples.set("snare", "assets/snare.wav");
        samples.set("hh", "assets/hihat.wav");
        samples.set("kick", "assets/kick.wav");

        const context = new AudioContext();

        const bufferLoader = new BufferLoader(context, samples);

        const buffers = await bufferLoader.load();

        const snareBuffer = buffers.get("snare");

        if (snareBuffer) {
            const snare = new Sample(context, snareBuffer);

            this.sampler.addSample(snare, [
                [3, 7],
                [3, 7],
                [6, 7],
                [3, 7],
            ]);
        }

        const kickBuffer = buffers.get("kick");

        if (kickBuffer) {
            const kick = new Sample(context, kickBuffer);

            this.sampler.addSample(kick, [
                [1, 5],
                [1, 5],
                [1, 2, 3, 5],
                [1, 5, 6],
            ]);
        }

        const hihatBuffer = buffers.get("hh");

        if (hihatBuffer) {
            const hihat = new Sample(context, hihatBuffer);

            this.sampler.addSample(hihat, [
                [1, 2, 3, 4, 5, 6, 7, 8],
                [1, 2, 3, 4, 5, 6, 7, 8],
                [],
                [1, 2, 3, 4, 5, 6, 7, 8],
            ]);
        }
    }

    public start(): void {
        this.sampler.play(0);
    }
}
