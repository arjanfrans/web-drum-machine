import * as Tone from "tone"
import { MasterOutputVolumeUpdatedEvent } from "../events/MasterOutputVolumeUpdatedEvent"
import { EventEmitter } from "../../events/EventEmitter"
import { Settings } from "../Settings"
import { DrawLoopInterface } from "../DrawLoopInterface"

export class MasterTrack implements DrawLoopInterface {
    public readonly meter: Tone.Meter = new Tone.Meter({ channels: 2, smoothing: Settings.meterSmoothing })
    public readonly emitter: EventEmitter = new EventEmitter()
    private previousValues: number[] = [0, 0]

    constructor() {
        this.channel.connect(this.meter)
    }

    get channel() {
        return Tone.getDestination()
    }

    private shouldDraw(): boolean {
        const value = this.meter.getValue()

        if (Array.isArray(value)) {
            if (value[0] === Number.NEGATIVE_INFINITY && value[1] === Number.NEGATIVE_INFINITY) {
                return false
            }

            return value[0] !== this.previousValues[0] || value[1] !== this.previousValues[1]
        }

        if (value === Number.NEGATIVE_INFINITY) {
            return false
        }

        return value !== this.previousValues[0]
    }

    public draw(): void {
        const value = this.meter.getValue()

        if (this.shouldDraw()) {
            if (Array.isArray(value)) {
                this.emitter.emit(new MasterOutputVolumeUpdatedEvent(value[0], value[1]))
                this.previousValues = [value[0], value[1]]
            } else {
                this.emitter.emit(new MasterOutputVolumeUpdatedEvent(value, value))
                this.previousValues = [value, value]
            }
        }
    }
}
