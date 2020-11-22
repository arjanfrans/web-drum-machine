import React from "react";

interface TrackViewProps {
    id: string
    name: string
    sequenceNotes: boolean[]
    transportPosition: number;

    onToggleNote(trackIndex: string, noteIndex: number, isActive: boolean): void
}

export class TrackView extends React.Component<TrackViewProps, {}> {
    public render() {
        const columns = this.props.sequenceNotes.map((value, index) => {
            return <td
                onClick={() => this.props.onToggleNote(this.props.id, index, !value)}
                key={index}
                className={[value ? "active-note" : "inactive-note", this.props.transportPosition === index ? 'current-note' : ''].join(' ')}
            />
        });

        return (
            <tr>
                <td>
                    <strong>{this.props.name}</strong>
                </td>
                {columns}
            </tr>)
            ;
    }
}
