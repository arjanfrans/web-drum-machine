import { EventEmitter } from "../events/EventEmitter";
import { StopTransportEvent } from "../events/transport/StopTransportEvent";
import { TransportPositionUpdatedEvent } from "../events/transport/TransportPositionUpdatedEvent";
import * as Tone from "tone";
import { StartTransportEvent } from "../events/transport/StartTransportEvent";
import { PauseTransportEvent } from "../events/transport/PauseTransportEvent";
import { UpdateBpmTransportEvent } from "../events/transport/UpdateBpmTransportEvent";
import { Config } from "./Config";
import { TransportStatusUpdatedEvent } from "../events/transport/TransportStatusUpdatedEvent";

export enum TransportStatusEnum {
    Started = "started",
    Stopped = "stopped",
    Paused = "paused",
}

export class Transport {
    public readonly emitter: EventEmitter = new EventEmitter();
    private transportPosition: number = 0;
    private transportStatus: TransportStatusEnum = TransportStatusEnum.Stopped;
    private sequenceSteps: number = 16;

    constructor(config: Config) {
        this.sequenceSteps = config.sequenceSteps;
    }

    public get bpm(): number {
        return Math.round(Tone.Transport.bpm.value);
    }

    public init() {
        Tone.Transport.bpm.value = 96;
        Tone.Transport.loopStart = 0;
        Tone.Transport.loopEnd = "2m";
        Tone.Transport.loop = true;

        this.emitter.on(StopTransportEvent, () => {
            this.transportStatus = TransportStatusEnum.Stopped;
            this.emitter.emit(new TransportPositionUpdatedEvent(0));
            this.emitter.emit(new TransportStatusUpdatedEvent(TransportStatusEnum.Stopped));
            Tone.Transport.stop();
        });
        this.emitter.on(StartTransportEvent, () => {
            this.transportStatus = TransportStatusEnum.Started;
            this.emitter.emit(new TransportStatusUpdatedEvent(TransportStatusEnum.Started));
            Tone.Transport.start();
        });
        this.emitter.on(PauseTransportEvent, () => {
            this.transportStatus = TransportStatusEnum.Paused;
            this.emitter.emit(new TransportStatusUpdatedEvent(TransportStatusEnum.Stopped));
            Tone.Transport.pause();
        });
        this.emitter.on(UpdateBpmTransportEvent, (event: UpdateBpmTransportEvent) => {
            Tone.Transport.bpm.value = event.bpm;
        });

        new Tone.Sequence(
            (time, index) => {
                this.transportPosition = index;

                Tone.Draw.schedule(() => {
                    if (this.transportStatus === TransportStatusEnum.Started) {
                        this.emitter.emit(new TransportPositionUpdatedEvent(index));
                    }
                }, time);
            },
            Transport.arrayIndexes(this.sequenceSteps),
            "8n"
        ).start(0);
    }

    private static arrayIndexes(length: number): Array<number> {
        const result = [];

        for (let i = 0; i < length; i++) {
            result.push(i);
        }

        return result;
    }
}
