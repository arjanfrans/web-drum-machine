import { TransportPositionUpdatedEvent } from "./events/TransportPositionUpdatedEvent"
import * as Tone from "tone"
import { Config } from "../Config"
import { TransportEmitter } from "./TransportEmitter"
import { TransportStatusEnum } from "./TransportStatusEnum"
import { SequenceLoopInterface } from "../SequenceLoopInterface"
import { SequenceDrawLoopInterface } from "../SequenceDrawLoopInterface"

export class Transport implements SequenceLoopInterface, SequenceDrawLoopInterface {
    public readonly emitter: TransportEmitter
    private transportPosition: number = 0
    public transportStatus: TransportStatusEnum = TransportStatusEnum.Stopped
    private sequenceSteps: number = 16

    constructor(config: Config) {
        this.sequenceSteps = config.sequenceSteps

        this.emitter = new TransportEmitter(this)
        Tone.Transport.loopStart = 0
        Tone.Transport.loopEnd = "2m"
        Tone.Transport.loop = true
    }

    public get bpm(): number {
        return Math.round(Tone.Transport.bpm.value)
    }

    public stop(): void {
        Tone.Transport.stop()
    }

    public start(): void {
        Tone.Transport.start()
    }

    public pause(): void {
        Tone.Transport.pause()
    }

    public set bpm(value: number) {
        Tone.Transport.bpm.value = value
    }

    public sequenceUpdate(time: number, index: number) {
        this.transportPosition = index
    }

    public sequenceDraw(time: number, index: number) {
        if (this.transportStatus === TransportStatusEnum.Started) {
            this.emitter.emit(new TransportPositionUpdatedEvent(index))
        }
    }
}
