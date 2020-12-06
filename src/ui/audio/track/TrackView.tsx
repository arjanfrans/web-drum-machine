import React from "react";
import {Track} from "../../../audio/track/Track";
import {TrackEvent} from "../../../audio/track/events/TrackEvent";
import {TrackControlView} from "./TrackControlView";
import styles from "./TrackView.module.css"
import {SequencerCell} from "./SequencerCell";
import {Sends} from "./Sends";

interface TrackViewProps {
    track: Track
    sendBuses: string[]
    transportPosition: number;

    onToggleNote(track: Track, noteIndex: number, isActive: boolean): void
}

interface TrackViewState {
    volume: number
    pan: number;
    solo: boolean
    mute: boolean
    enableReverb: boolean
    enableChorus: boolean
}

export class TrackView extends React.Component<TrackViewProps, TrackViewState> {
    constructor(props: TrackViewProps) {
        super(props);

        this.state = {
            pan: props.track.channel.pan.value,
            volume: props.track.channel.volume.value,
            solo: props.track.channel.solo,
            mute: props.track.channel.mute,
            enableReverb: props.track.effectsRack.isEnabled("reverb"),
            enableChorus: props.track.effectsRack.isEnabled("chorus")
        }
    }

    public componentDidMount() {
        this.props.track.emitter.on(TrackEvent, (event: TrackEvent) => {
            this.forceUpdate();
        })

    }


    public render() {
        const {track} = this.props;

        const columns = track.sequenceNotes.map((value, index) => {
            return <SequencerCell key={index} track={this.props.track} index={index} highlight={this.props.transportPosition === index} />
        });

        return (
            <>
                <div>
                    <TrackControlView track={track}/>
                </div>
                <div className={styles.trackGrid} style={{'gridTemplateColumns': `repeat(${columns.length}, 1fr)`}}>
                    {columns}
                </div>
                <div>
                    <Sends track={track}/>
                </div>
            </>)
            ;
    }
}
