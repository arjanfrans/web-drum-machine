import { Config } from "./Config";
import { SampleTrack } from "./SampleTrack";
import * as Tone from "tone";
import { AudioState, TransportStatusEnum } from "./AudioState";

export class AudioEngine {
    public readonly tracks: Map<string, SampleTrack> = new Map<
        string,
        SampleTrack
    >();
    private initialized: boolean = false;
    private drawCallback?: (state: AudioState) => void;
    public readonly state: AudioState;

    constructor(private readonly config: Config) {
        this.state = {
            transportStatus: TransportStatusEnum.Stopped,
            transportPosition: 0,
        };
    }

    public async init() {
        for (const trackData of this.config.trackData) {
            const track = new SampleTrack(
                trackData.id,
                trackData.name,
                trackData.sample,
                trackData.sequenceNotes
            );

            track.player.toDestination();

            this.tracks.set(trackData.id, track);
        }
        await Tone.loaded();
        await Tone.start();

        Tone.Transport.bpm.value = 96;
        Tone.Transport.loopStart = 0;
        Tone.Transport.loopEnd = "2m";
        Tone.Transport.loop = true;

        new Tone.Sequence(
            (time, index) => {
                this.state.transportPosition = index;

                Tone.Draw.schedule(() => {
                    if (this.drawCallback) {
                        this.drawCallback(this.state);
                    }
                }, time);
            },
            AudioEngine.arrayIndexes(this.config.sequenceSteps),
            "8n"
        ).start(0);

        this.initialized = true;
    }

    private static arrayIndexes(length: number): Array<number> {
        const result = [];

        for (let i = 0; i < length; i++) {
            result.push(i);
        }

        return result;
    }

    public setDrawCallback(callback: (state: AudioState) => void) {
        this.drawCallback = callback;
    }

    public startTransport() {
        Tone.Transport.start();

        this.state.transportStatus = TransportStatusEnum.Started;
    }

    public pauseTransport(): void {
        Tone.Transport.pause();

        this.state.transportStatus = TransportStatusEnum.Paused;
    }

    public stopTransport(): void {
        Tone.Transport.stop();

        this.state.transportPosition = 0;
        this.state.transportStatus = TransportStatusEnum.Stopped;
    }
}
