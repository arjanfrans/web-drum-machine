import * as Tone from "tone";
import { EffectsRack } from "../EffectsRack";
import { BusEmitter } from "./BusEmitter";

export class Bus {
    public readonly channel: Tone.Channel;
    public readonly effectsRack: EffectsRack;
    public readonly emitter: BusEmitter;

    constructor(public readonly id: string, public name: string) {
        this.emitter = new BusEmitter(this);
        this.channel = new Tone.Channel(0, 0);
        this.channel.receive(id);
        this.channel.toDestination();
        this.effectsRack = new EffectsRack(this.channel, this.channel.context.destination);
    }
}