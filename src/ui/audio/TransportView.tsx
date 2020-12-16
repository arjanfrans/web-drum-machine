import React from "react";
import {TransportControlView} from "./TransportControlView";
import {TransportPositionUpdatedEvent} from "../../audio/transport/events/TransportPositionUpdatedEvent";
import {Transport} from "../../audio/transport/Transport"
import {Track} from "../../audio/track/Track";
import {MasterTrack} from "../../audio/track/MasterTrack";
import {Sequencer} from "../../audio/sequencer/Sequencer";
import {SequencerView} from "./sequencer/SequencerView";

interface TransportViewProps {
    masterTrack: MasterTrack
    transport: Transport
    sequencer: Sequencer
    tracks: Track[]
    sendBuses: string[]
}

interface TransportViewState {
    transportPosition: number
}

export class TransportView extends React.Component<TransportViewProps, TransportViewState> {
    constructor(props: TransportViewProps) {
        super(props);

        this.state = {
            transportPosition: 0
        }
    }

    public componentDidMount() {
        this.props.transport.emitter.on(TransportPositionUpdatedEvent, (event: TransportPositionUpdatedEvent) => {
            this.setState({
                transportPosition: event.transportPosition
            })
        })
    }

    public render() {
        return (
            <>
                <TransportControlView
                    transport={this.props.transport}
                    masterTrack={this.props.masterTrack}
                    sequencer={this.props.sequencer}
                />
                <SequencerView sequencer={this.props.sequencer} transport={this.props.transport}/>
            </>
        )
    }
}
