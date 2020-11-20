export class Sample {
    constructor(private context: AudioContext, private buffer: AudioBuffer) {}

    public play(time: number): void {
        const source = this.context.createBufferSource();

        source.buffer = this.buffer;
        source.connect(this.context.destination);

        source.start(time);
    }
}
