import React from "react";
import styles from "./SequencerCell.module.css"

interface SequencerCellProps {
    isActive: boolean
    index: number
    highlight: boolean
    setCell: (value: boolean) => void
}

export class SequencerCell extends React.Component<SequencerCellProps, {}> {
    private onToggle () {
        this.props.setCell(!this.props.isActive)
    }

    public render() {
        return (
            <div
                onClick={this.onToggle.bind(this)}
                key={this.props.index}
                className={[this.props.isActive ? styles.activeCell : styles.inactiveCell, this.props.highlight ? styles.currentNote : ''].join(' ')}
            />
        )
    }

}
