import React from "react";
import {StartTransportEvent} from "../../events/transport/StartTransportEvent";
import {StopTransportEvent} from "../../events/transport/StopTransportEvent";
import {PauseTransportEvent} from "../../events/transport/PauseTransportEvent";
import {Transport} from "../../audio/Transport"

interface TransportControlViewProps {
    transport: Transport
}

interface TransportControlViewState {
    enableStart: boolean
    enablePause: boolean
    enableStop: boolean
    bpm: number
}

export class TransportControlView extends React.Component<TransportControlViewProps, TransportControlViewState> {
    constructor(props: TransportControlViewProps) {
        super(props);

        this.state = {
            enableStart: true,
            enablePause: false,
            enableStop: false,
            bpm: 96
        }
    }

    private handleStartClick()
    {
        this.setState({
            enableStart: false,
            enablePause: true,
            enableStop: true
        })

        this.props.transport.emitter.emit(new StartTransportEvent())
    }

    private handleStopClick()
    {
        this.setState({
            enableStart: true,
            enablePause: false,
            enableStop: false
        })

        this.props.transport.emitter.emit(new StopTransportEvent())
    }

    private handlePauseClick()
    {
        this.setState({
            enableStart: true,
            enablePause: false,
            enableStop: true
        })

        this.props.transport.emitter.emit(new PauseTransportEvent())
    }

    public render() {
        return (
            <div>
                <button disabled={!this.state.enableStart} onClick={() => this.handleStartClick()}>Start</button>
                <button disabled={!this.state.enablePause} onClick={() => this.handlePauseClick()}>Pause</button>
                <button disabled={!this.state.enableStop} onClick={() => this.handleStopClick()}>Stop</button>
            </div>
        )
    }
}
