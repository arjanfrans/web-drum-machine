import React from "react";
import {Track} from "../../../audio/track/Track";
import {TrackEvent} from "../../../audio/track/events/TrackEvent";
import {TrackLabel} from "./TrackLabel";

interface TrackViewProps {
    track: Track
    transportPosition: number;

    onToggleNote(track: Track, noteIndex: number, isActive: boolean): void
}

export class TrackView extends React.Component<TrackViewProps, {}> {
    public componentDidMount() {
        this.props.track.emitter.on(TrackEvent, (event: TrackEvent) => {
            this.forceUpdate();
        })

    }

    public render() {
        const {track} = this.props;

        return (
            <>
                <TrackLabel name={track.name}/>
            </>
        );
    }
}
