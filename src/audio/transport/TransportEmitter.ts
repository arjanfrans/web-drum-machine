import { EventEmitter } from "../../events/EventEmitter"
import { StopTransportEvent } from "./events/StopTransportEvent"
import { StartTransportEvent } from "./events/StartTransportEvent"
import { PauseTransportEvent } from "./events/PauseTransportEvent"
import { UpdateBpmTransportEvent } from "./events/UpdateBpmTransportEvent"
import { Transport } from "./Transport"

export class TransportEmitter extends EventEmitter {
    constructor(private readonly transport: Transport) {
        super()

        this.on(StopTransportEvent, () => {
            transport.stop()
        })

        this.on(StartTransportEvent, () => {
            transport.start()
        })

        this.on(PauseTransportEvent, () => {
            transport.pause()
        })

        this.on(UpdateBpmTransportEvent, (event: UpdateBpmTransportEvent) => {
            transport.bpm = event.bpm
        })
    }
}
