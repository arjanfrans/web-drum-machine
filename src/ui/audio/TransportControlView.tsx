import React from "react";
import {AudioEngine} from "../../audio/AudioEngine";
import {StartTransportEvent} from "../../events/transport/StartTransportEvent";
import {StopTransportEvent} from "../../events/transport/StopTransportEvent";
import {PauseTransportEvent} from "../../events/transport/PauseTransportEvent";

interface TransportControlViewProps {
    engine: AudioEngine
}

interface TransportControlViewState {
    enableStart: boolean
    enablePause: boolean
    enableStop: boolean
}

export class TransportControlView extends React.Component<TransportControlViewProps, TransportControlViewState> {
    constructor(props: TransportControlViewProps) {
        super(props);

        this.state = {
            enableStart: true,
            enablePause: false,
            enableStop: false
        }
    }

    private handleStartClick()
    {
        this.setState({
            enableStart: false,
            enablePause: true,
            enableStop: true
        })

        this.props.engine.emitter.emit(new StartTransportEvent())
    }

    private handleStopClick()
    {
        this.setState({
            enableStart: true,
            enablePause: false,
            enableStop: false
        })

        this.props.engine.emitter.emit(new StopTransportEvent())
    }

    private handlePauseClick()
    {
        this.setState({
            enableStart: true,
            enablePause: false,
            enableStop: true
        })

        this.props.engine.emitter.emit(new PauseTransportEvent())
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
