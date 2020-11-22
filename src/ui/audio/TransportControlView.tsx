import React from "react";
import {AudioEngine} from "../../audio/AudioEngine";

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
        this.props.engine.startTransport();

        this.setState({
            enableStart: false,
            enablePause: true,
            enableStop: true
        })
    }

    private handleStopClick()
    {
        this.props.engine.stopTransport();

        this.setState({
            enableStart: true,
            enablePause: false,
            enableStop: false
        })
    }

    private handlePauseClick()
    {
        this.props.engine.pauseTransport();

        this.setState({
            enableStart: true,
            enablePause: false,
            enableStop: true
        })
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
