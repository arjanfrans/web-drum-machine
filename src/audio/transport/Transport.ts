import { TransportPositionUpdatedEvent } from "./events/TransportPositionUpdatedEvent"
import * as Tone from "tone"
import { TransportEmitter } from "./TransportEmitter"
import { TransportStatusEnum } from "./TransportStatusEnum"
import { SequenceLoopInterface } from "../SequenceLoopInterface"
import { SequenceDrawLoopInterface } from "../SequenceDrawLoopInterface"
import { Sequencer } from "../sequencer/Sequencer"
import { TransportStatusUpdatedEvent } from "./events/TransportStatusUpdatedEvent"

export class Transport implements SequenceLoopInterface, SequenceDrawLoopInterface {
    public readonly emitter: TransportEmitter
    private transportPosition: number = 0
    public transportStatus: TransportStatusEnum = TransportStatusEnum.Stopped

    constructor() {
        this.emitter = new TransportEmitter(this)
        Tone.Transport.loopStart = 0
        Tone.Transport.loop = true
    }

    set steps(value: number) {
        const loopEnd = value / 8
        Tone.Transport.loopEnd = `${loopEnd}m`
    }

    public get bpm(): number {
        return Math.round(Tone.Transport.bpm.value)
    }

    public stop(): void {
        this.transportStatus = TransportStatusEnum.Stopped
        this.emitter.emit(new TransportPositionUpdatedEvent(0))
        this.emitter.emit(new TransportStatusUpdatedEvent(TransportStatusEnum.Stopped))

        Tone.Transport.stop()
    }

    public start(): void {
        this.transportStatus = TransportStatusEnum.Started
        this.emitter.emit(new TransportStatusUpdatedEvent(TransportStatusEnum.Started))

        Tone.Transport.start()
    }

    public pause(): void {
        this.transportStatus = TransportStatusEnum.Paused
        this.emitter.emit(new TransportStatusUpdatedEvent(TransportStatusEnum.Stopped))

        Tone.Transport.pause()
    }

    public set bpm(value: number) {
        Tone.Transport.bpm.value = value
    }

    public sequenceUpdate(time: number, index: number) {
        this.transportPosition = index
    }

    public shouldUpdate(index: number, sequencer: Sequencer): boolean {
        return this.transportStatus === TransportStatusEnum.Started
    }

    public sequenceDraw(time: number, index: number) {
        if (this.transportStatus === TransportStatusEnum.Started) {
            this.emitter.emit(new TransportPositionUpdatedEvent(index))
        }
    }
}
