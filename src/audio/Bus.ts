import * as Tone from "tone";
import { EffectsRack } from "./EffectsRack";
import { EventEmitter } from "../events/EventEmitter";
import { UpdateChannelVolumeEvent } from "../events/track/UpdateChannelVolumeEvent";
import { UpdateChannelPanningEvent } from "../events/track/UpdatePanningVolumeEvent";
import { SoloChannelEvent } from "../events/track/SoloChannelEvent";
import { MuteChannelEvent } from "../events/track/MuteChannelEvent";

export class Bus {
    public readonly channel: Tone.Channel;
    public readonly effectsRack: EffectsRack;
    public readonly emitter: EventEmitter = new EventEmitter();

    constructor(public readonly id: string, public name: string) {
        this.channel = new Tone.Channel(-6, 0);
        this.channel.receive(id);
        this.channel.toDestination();
        this.effectsRack = new EffectsRack(this.channel, this.channel.context.destination);

        this.emitter.on(UpdateChannelVolumeEvent, (event: UpdateChannelVolumeEvent) => {
            this.channel.volume.value = event.volume;
        });

        this.emitter.on(UpdateChannelPanningEvent, (event: UpdateChannelPanningEvent) => {
            this.channel.pan.value = event.pan;
        });

        this.emitter.on(SoloChannelEvent, (event: SoloChannelEvent) => {
            this.channel.solo = event.solo;
        });

        this.emitter.on(MuteChannelEvent, (event: MuteChannelEvent) => {
            this.channel.mute = event.mute;
        });
    }
}
