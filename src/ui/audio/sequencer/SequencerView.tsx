import React from "react";
import {Sequencer} from "../../../audio/sequencer/Sequencer";
import {PatternTrackView} from "./PatternTrackView";
import {Transport} from "../../../audio/transport/Transport";
import {TransportPositionUpdatedEvent} from "../../../audio/transport/events/TransportPositionUpdatedEvent";
import {SetPatternCellEvent} from "../../../audio/sequencer/events/SetPatternCellEvent";
import styles from "./SequencerView.module.css"
import {SequencerStepsUpdatedEvent} from "../../../audio/sequencer/events/SequencerStepsUpdatedEvent";

type SequencerViewProps = {
    sequencer: Sequencer
    transport: Transport
}

type SequencerViewState = {
    currentPattern: number
    transportPosition: number
}

export class SequencerView extends React.Component<SequencerViewProps, SequencerViewState> {
    constructor(props: SequencerViewProps) {
        super(props);

        this.state = {
            currentPattern: 0,
            transportPosition: 0
        }
    }

    componentDidMount() {
        this.props.transport.emitter.on(TransportPositionUpdatedEvent, (event: TransportPositionUpdatedEvent) => {
            this.setState({
                transportPosition: event.transportPosition
            })
        })

        this.props.sequencer.emitter.on(SequencerStepsUpdatedEvent, (event: SequencerStepsUpdatedEvent) => {
            this.forceUpdate()
        })
    }


    public render() {
        const pattern = this.props.sequencer.getPattern(this.state.currentPattern);
        const patternTrackElements = [];

        for (const [track, patternTrack] of pattern.tracks.entries()) {
            const setCell = (cell: number, value: boolean) => {
                this.props.sequencer.emitter.emit(new SetPatternCellEvent(this.state.currentPattern, track, cell, value))

                this.forceUpdate()
            }

            patternTrackElements.push(
                <PatternTrackView
                    key={track}
                    name={track}
                    setCell={setCell}
                    sequence={patternTrack.getSequence()}
                    highlightIndex={this.state.transportPosition}
                />
            )
        }

        return (
            <div className={styles.container}>
                {patternTrackElements}
            </div>
        )
    }
}
