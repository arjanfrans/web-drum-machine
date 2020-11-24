import { Config } from "./Config";
import { SampleTrack } from "./SampleTrack";
import * as Tone from "tone";
import { AudioState, TransportStatusEnum } from "./AudioState";
import { EventEmitter } from "../events/EventEmitter";
import { TransportPositionUpdatedEvent } from "../events/TransportPositionUpdatedEvent";
import { StopTransportEvent } from "../events/transport/StopTransportEvent";
import { StartTransportEvent } from "../events/transport/StartTransportEvent";
import { PauseTransportEvent } from "../events/transport/PauseTransportEvent";

export class AudioEngine {
    public readonly tracks: Map<string, SampleTrack> = new Map<string, SampleTrack>();
    private initialized: boolean = false;
    private drawCallback?: (state: AudioState) => void;
    public readonly emitter: EventEmitter = new EventEmitter();
    public readonly state: AudioState;

    constructor(private readonly config: Config) {
        this.state = {
            transportStatus: TransportStatusEnum.Stopped,
            transportPosition: 0,
        };

        this.emitter.on(StopTransportEvent, () => {
            this.state.transportStatus = TransportStatusEnum.Stopped;

            this.emitter.emit(new TransportPositionUpdatedEvent(0));
            Tone.Transport.stop();
        });
        this.emitter.on(StartTransportEvent, () => {
            this.state.transportStatus = TransportStatusEnum.Started;
            Tone.Transport.start();
        });
        this.emitter.on(PauseTransportEvent, () => {
            this.state.transportStatus = TransportStatusEnum.Paused;
            Tone.Transport.pause();
        });
    }

    public async init() {
        for (const trackData of this.config.trackData) {
            const track = new SampleTrack(trackData.id, trackData.name, trackData.sample, trackData.sequenceNotes);

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
                    if (this.state.transportStatus === TransportStatusEnum.Started) {
                        this.emitter.emit(new TransportPositionUpdatedEvent(index));
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
}
