import React from "react";
import {TrackView} from "./TrackView";
import {TransportControlView} from "./TransportControlView";
import {AudioEngine} from "../../audio/AudioEngine";
import {AudioState} from "../../audio/AudioState";

interface TransportViewProps {
    engine: AudioEngine
    audioState: AudioState
}

export class TransportView extends React.Component<TransportViewProps, {}> {
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
                <TrackView key={id} id={id} name={track.name} sequenceNotes={track.sequenceNotes}
                           transportPosition={this.props.audioState.transportPosition}
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
