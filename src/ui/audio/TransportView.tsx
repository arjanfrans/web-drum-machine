import React from "react";
import {TrackView} from "./track/TrackView";
import {TransportControlView} from "./TransportControlView";
import {TransportPositionUpdatedEvent} from "../../audio/transport/events/TransportPositionUpdatedEvent";
import {Transport} from "../../audio/transport/Transport"
import {Track} from "../../audio/track/Track";
import {SetTrackNoteEvent} from "../../audio/track/events/SetTrackNoteEvent";
import styles from "./TransportView.module.css"
import {AudioEngine} from "../../audio/AudioEngine";

interface TransportViewProps {
    audioEngine: AudioEngine
    transport: Transport
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

    private static handleToggleNote(track: Track, noteIndex: number, isActive: boolean) {
        track.emitter.emit(new SetTrackNoteEvent(noteIndex, isActive));
    }

    public render() {
        const trackViews = [];

        for (const track of this.props.tracks) {
            trackViews.push(
                <TrackView key={track.id} track={track}
                   sendBuses={this.props.sendBuses}
                   transportPosition={this.state.transportPosition}
                   onToggleNote={TransportView.handleToggleNote.bind(this)}
                />
            );
        }

        return (
            <>
                <TransportControlView transport={this.props.transport} audioEngine={this.props.audioEngine}/>
                <div className={styles.transportGrid}>
                    {trackViews}
                </div>
            </>
        )
    }
}
