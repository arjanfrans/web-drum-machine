import React from "react";
import {SequencerCell} from "./SequencerCell";
import styles from "./PatternTrackView.module.css";
import {TrackLabel} from "../track/TrackLabel";

type PatternTrackViewProps = {
    name: string
    sequence: boolean[]
    highlightIndex: number
    setCell: (cell: number, value: boolean) => void
}

export class PatternTrackView extends React.Component<PatternTrackViewProps, {}> {
    public render() {
        const cells = this.props.sequence.map((value, index) => {
            const setCell = (cellValue: boolean) => this.props.setCell(index, cellValue);

            return (
                <SequencerCell setCell={setCell} key={index} isActive={value} index={index}
                               highlight={this.props.highlightIndex === index}/>
            )
        })

        return (
            <div className={styles.container}>
                <TrackLabel name={this.props.name}/>
                <div className={styles.cells} style={{'gridTemplateColumns': `repeat(${cells.length}, 1fr)`}}>
                    {cells}
                </div>
            </div>
        )
    }
}
