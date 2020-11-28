import { EventEmitter } from "../../events/EventEmitter";
import { StopTransportEvent } from "./events/StopTransportEvent";
import { TransportPositionUpdatedEvent } from "./events/TransportPositionUpdatedEvent";
import { TransportStatusUpdatedEvent } from "./events/TransportStatusUpdatedEvent";
import * as Tone from "tone";
import { StartTransportEvent } from "./events/StartTransportEvent";
import { PauseTransportEvent } from "./events/PauseTransportEvent";
import { UpdateBpmTransportEvent } from "./events/UpdateBpmTransportEvent";
import { Transport } from "./Transport";
import { TransportStatusEnum } from "./TransportStatusEnum";

export class TransportEmitter extends EventEmitter {
    constructor(private readonly transport: Transport) {
        super();

        this.on(StopTransportEvent, () => {
            transport.transportStatus = TransportStatusEnum.Stopped;
            this.emit(new TransportPositionUpdatedEvent(0));
            this.emit(new TransportStatusUpdatedEvent(TransportStatusEnum.Stopped));
            Tone.Transport.stop();
        });
        this.on(StartTransportEvent, () => {
            transport.transportStatus = TransportStatusEnum.Started;
            this.emit(new TransportStatusUpdatedEvent(TransportStatusEnum.Started));
            Tone.Transport.start();
        });
        this.on(PauseTransportEvent, () => {
            transport.transportStatus = TransportStatusEnum.Paused;
            this.emit(new TransportStatusUpdatedEvent(TransportStatusEnum.Stopped));
            Tone.Transport.pause();
        });
        this.on(UpdateBpmTransportEvent, (event: UpdateBpmTransportEvent) => {
            Tone.Transport.bpm.value = event.bpm;
        });
    }
}
