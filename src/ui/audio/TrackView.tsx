import React from "react";
import {SampleTrack} from "../../audio/SampleTrack";

interface TrackViewProps {
    track: SampleTrack
    transportPosition: number;

    onToggleNote(trackIndex: string, noteIndex: number, isActive: boolean): void
}

export class TrackView extends React.Component<TrackViewProps, {}> {
    public render() {
        const { track } = this.props;

        const columns = track.sequenceNotes.map((value, index) => {
            return <td
                onClick={() => this.props.onToggleNote(track.id, index, !value)}
                key={index}
                className={[value ? "active-note" : "inactive-note", this.props.transportPosition === index ? 'current-note' : ''].join(' ')}
            />
        });

        return (
            <tr>
                <td>
                    <strong>{track.name}</strong>
                </td>
                {columns}
            </tr>)
            ;
    }
}
