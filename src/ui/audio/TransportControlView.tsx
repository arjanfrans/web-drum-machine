import React from "react";
import {StartTransportEvent} from "../../audio/transport/events/StartTransportEvent";
import {StopTransportEvent} from "../../audio/transport/events/StopTransportEvent";
import {PauseTransportEvent} from "../../audio/transport/events/PauseTransportEvent";
import {Transport} from "../../audio/transport/Transport"
import {UpdateBpmTransportEvent} from "../../audio/transport/events/UpdateBpmTransportEvent";
import styles from "./TransportControlView.module.css"
import {PlayButton, PauseButton, StopButton } from "../component/buttons";
import {BpmInput} from "../component/inputs";

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
            bpm: props.transport.bpm
        }
    }

    private handleStartClick() {
        this.setState({
            enableStart: false,
            enablePause: true,
            enableStop: true
        })

        this.props.transport.emitter.emit(new StartTransportEvent())
    }

    private handleStopClick() {
        this.setState({
            enableStart: true,
            enablePause: false,
            enableStop: false
        })

        this.props.transport.emitter.emit(new StopTransportEvent())
    }

    private handlePauseClick() {
        this.setState({
            enableStart: true,
            enablePause: false,
            enableStop: true
        })

        this.props.transport.emitter.emit(new PauseTransportEvent())
    }

    private commitBpmChange(event: React.FormEvent<HTMLInputElement>): void {
        const bpm = Math.max(1, Math.min(Number.parseInt(event.currentTarget.value), 400));

        if (bpm !== this.state.bpm) {
            this.props.transport.emitter.emit(new UpdateBpmTransportEvent(bpm));
            this.setState({
                bpm
            });
        }
    }

    private static handleBpmChange(event: React.FormEvent<HTMLInputElement>): void {
        const bpm = Math.max(1, Math.min(Number.parseInt(event.currentTarget.value), 400));

        event.currentTarget.value = `${bpm}`;
    }

    public render() {
        return (
            <div className={styles.container}>
                <div>
                    <PlayButton className={styles.item} disabled={!this.state.enableStart} onClick={() => this.handleStartClick()} />
                    <PauseButton className={styles.item} disabled={!this.state.enablePause} onClick={() => this.handlePauseClick()} />
                    <StopButton className={styles.item} disabled={!this.state.enableStop} onClick={() => this.handleStopClick()} />
                </div>
                <div>
                    <BpmInput
                        className={styles.item}
                        defaultValue={this.state.bpm}
                        onChange={TransportControlView.handleBpmChange.bind(this)}
                        onBlur={this.commitBpmChange.bind(this)}
                        onMouseUp={this.commitBpmChange.bind(this)}
                    />
                </div>
            </div>
        )
    }
}
