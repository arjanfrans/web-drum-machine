import { TransportPositionUpdatedEvent } from "./events/TransportPositionUpdatedEvent";
import * as Tone from "tone";
import { Config } from "../Config";
import { ArrayHelper } from "../../util/ArrayHelper";
import { TransportEmitter } from "./TransportEmitter";
import { TransportStatusEnum } from "./TransportStatusEnum";

export class Transport {
    public readonly emitter: TransportEmitter;
    private transportPosition: number = 0;
    public transportStatus: TransportStatusEnum = TransportStatusEnum.Stopped;
    private sequenceSteps: number = 16;

    constructor(config: Config) {
        this.sequenceSteps = config.sequenceSteps;

        this.emitter = new TransportEmitter(this);
    }

    public get bpm(): number {
        return Math.round(Tone.Transport.bpm.value);
    }

    public stop(): void {
        Tone.Transport.stop();
    }

    public start(): void {
        Tone.Transport.start();
    }

    public pause(): void {
        Tone.Transport.pause();
    }

    public set bpm(value: number) {
        Tone.Transport.bpm.value = value;
    }

    public async init() {
        const buffer = await Tone.Offline(({ transport }) => {
            transport.bpm.value = 96;
            transport.loopStart = 0;
            transport.loopEnd = "2m";
            transport.loop = true;

            new Tone.Sequence(
                (time, index) => {
                    this.transportPosition = index;

                    Tone.Draw.schedule(() => {
                        if (this.transportStatus === TransportStatusEnum.Started) {
                            this.emitter.emit(new TransportPositionUpdatedEvent(index));
                        }
                    }, time);
                },
                ArrayHelper.indexes(this.sequenceSteps),
                "8n"
            ).start(0);
        }, 4);

        console.log(buffer);
    }
}
