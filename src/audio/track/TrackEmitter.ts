import { Track } from "./Track"
import { EventEmitter } from "../../events/EventEmitter"
import { UpdateChannelVolumeEvent } from "./events/UpdateChannelVolumeEvent"
import { UpdateChannelPanningEvent } from "./events/UpdatePanningVolumeEvent"
import { SoloChannelEvent } from "./events/SoloChannelEvent"
import { MuteChannelEvent } from "./events/MuteChannelEvent"
import { UpdateSendVolumeEvent } from "./events/UpdateSendVolumeEvent"
import { EnableTrackEffectEvent } from "./events/EnableTrackEffectEvent"
import { EnableSendEvent } from "./events/EnableSendEvent"
import { DisableSendEvent } from "./events/DisableSendEvent"

export class TrackEmitter extends EventEmitter {
    constructor(private readonly track: Track) {
        super()

        this.on(UpdateChannelVolumeEvent, (event: UpdateChannelVolumeEvent) => {
            track.channel.volume.value = event.volume
        })

        this.on(UpdateChannelPanningEvent, (event: UpdateChannelPanningEvent) => {
            track.channel.pan.value = event.pan
        })

        this.on(SoloChannelEvent, (event: SoloChannelEvent) => {
            track.solo = event.solo
        })

        this.on(MuteChannelEvent, (event: MuteChannelEvent) => {
            track.mute = event.mute
        })

        this.on(EnableTrackEffectEvent, (event: EnableTrackEffectEvent) => {
            if (event.enable) {
                track.effectsRack.enableEffect(event.effect)
            } else {
                track.effectsRack.disableEffect(event.effect)
            }
        })

        this.on(UpdateSendVolumeEvent, (event: UpdateSendVolumeEvent) => {
            const send = track.getSend(event.bus)

            send.volume = event.volume
        })

        this.on(EnableSendEvent, (event: EnableSendEvent) => {
            const send = track.getSend(event.bus)

            send.enable()
        })

        this.on(DisableSendEvent, (event: DisableSendEvent) => {
            const send = track.getSend(event.bus)

            send.disable()
        })
    }
}
