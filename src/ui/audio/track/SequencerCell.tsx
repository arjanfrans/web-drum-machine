import React from "react";
import {SetTrackNoteEvent} from "../../../audio/track/events/SetTrackNoteEvent";
import {Track} from "../../../audio/track/Track";
import styles from "./SequencerCell.module.css"

interface SequencerCellProps {
    track: Track
    index: number
    highlight: boolean
}

interface SequencerCellState {
    isActive: boolean
}

export class SequencerCell extends React.Component<SequencerCellProps, SequencerCellState> {
    constructor(props: SequencerCellProps) {
        super(props);

        this.state = {
            isActive: props.track.sequenceNotes[props.index],
        }
    }


    private onToggle () {
        this.props.track.emitter.emit(new SetTrackNoteEvent(this.props.index, !this.state.isActive));

        this.setState({
            isActive: !this.state.isActive
        });
    }

    public render() {
        return (
            <div
                onClick={this.onToggle.bind(this)}
                key={this.props.index}
                className={[this.state.isActive ? styles.activeCell : styles.inactiveCell, this.props.highlight ? styles.currentNote : ''].join(' ')}
            />
        )
    }

}
