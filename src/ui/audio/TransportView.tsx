import React from "react";
import {TrackView} from "./TrackView";
import {TransportControlView} from "./TransportControlView";
import {AudioEngine} from "../../audio/AudioEngine";
import {TrackEvent} from "../../events/TrackEvent";
import {TransportPositionUpdatedEvent} from "../../events/TransportPositionUpdatedEvent";

interface TransportViewProps {
    engine: AudioEngine
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
        this.props.engine.emitter.on(TrackEvent, (event: TrackEvent) => {
            this.forceUpdate();
        })

        this.props.engine.emitter.on(TransportPositionUpdatedEvent, (event: TransportPositionUpdatedEvent) => {
            this.setState({
                transportPosition: event.transportPosition
            })
        })
    }

    private handleToggleNote(trackId: string, noteIndex: number, isActive: boolean) {
        const track = this.props.engine.tracks.get(trackId);

        if (track) {
            track.updateSequenceNote(noteIndex, isActive);
            this.forceUpdate();
        }

    }

    public render() {
        const trackViews = [];
        for (const [id, track] of this.props.engine.tracks.entries()) {
            trackViews.push(
                <TrackView key={id} track={track}
                           transportPosition={this.state.transportPosition}
                           onToggleNote={this.handleToggleNote.bind(this)}
                />
            );
        }

        return (
            <>
                <TransportControlView engine={this.props.engine}/>
                <table style={{width: '100%'}}>
                    <tbody>
                    {trackViews}
                    </tbody>
                </table>
            </>
        )
    }
}
