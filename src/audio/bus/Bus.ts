import * as Tone from "tone";
import { EffectsRack } from "../EffectsRack";
import { BusEmitter } from "./BusEmitter";
import { TrackOutputVolumeUpdatedEvent } from "../track/events/TrackOutputVolumeUpdatedEvent";

export class Bus {
    public readonly channel: Tone.Channel;
    public readonly meter: Tone.Meter;
    public readonly effectsRack: EffectsRack;
    public readonly emitter: BusEmitter;

    constructor(public readonly id: string, public name: string) {
        this.emitter = new BusEmitter(this);
        this.channel = new Tone.Channel(0, 0);
        this.channel.receive(id);
        this.channel.toDestination();
        this.meter = new Tone.Meter({ channels: 2, smoothing: 0.3 });
        this.channel.connect(this.meter);
        this.effectsRack = new EffectsRack(this.channel, this.channel.context.destination);
    }

    public draw(): void {
        const value = this.meter.getValue();

        if (Array.isArray(value)) {
            this.emitter.emit(new TrackOutputVolumeUpdatedEvent(value[0], value[1]));
        } else {
            this.emitter.emit(new TrackOutputVolumeUpdatedEvent(value, value));
        }
    }
}
