import * as Tone from "tone"
import { MasterOutputVolumeUpdatedEvent } from "../events/MasterOutputVolumeUpdatedEvent"
import { EventEmitter } from "../../events/EventEmitter"
import { Settings } from "../Settings"
import { DrawLoopInterface } from "../DrawLoopInterface"

export class MasterTrack implements DrawLoopInterface {
    public readonly meter: Tone.Meter = new Tone.Meter({ channels: 2, smoothing: Settings.meterSmoothing })
    public readonly emitter: EventEmitter = new EventEmitter()

    constructor() {
        this.channel.connect(this.meter)
    }

    get channel() {
        return Tone.getDestination()
    }

    public draw(): void {
        const value = this.meter.getValue()

        if (Array.isArray(value)) {
            this.emitter.emit(new MasterOutputVolumeUpdatedEvent(value[0], value[1]))
        } else {
            this.emitter.emit(new MasterOutputVolumeUpdatedEvent(value, value))
        }
    }
}
