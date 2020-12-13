import { EventEmitter } from "../../events/EventEmitter"
import { UpdateChannelVolumeEvent } from "../track/events/UpdateChannelVolumeEvent"
import { UpdateChannelPanningEvent } from "../track/events/UpdatePanningVolumeEvent"
import { SoloChannelEvent } from "../track/events/SoloChannelEvent"
import { MuteChannelEvent } from "../track/events/MuteChannelEvent"
import { Bus } from "./Bus"

export class BusEmitter extends EventEmitter {
    constructor(private readonly bus: Bus) {
        super()

        this.on(UpdateChannelVolumeEvent, (event: UpdateChannelVolumeEvent) => {
            bus.channel.volume.value = event.volume
        })

        this.on(UpdateChannelPanningEvent, (event: UpdateChannelPanningEvent) => {
            bus.channel.pan.value = event.pan
        })

        this.on(SoloChannelEvent, (event: SoloChannelEvent) => {
            bus.channel.solo = event.solo
        })

        this.on(MuteChannelEvent, (event: MuteChannelEvent) => {
            bus.channel.mute = event.mute
        })
    }
}
