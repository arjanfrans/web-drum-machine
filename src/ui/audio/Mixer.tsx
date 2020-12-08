import React from "react";
import styles from "./Mixer.module.css"
import {Bus} from "../../audio/bus/Bus";
import {BusTrackView} from "./BusTrackView";
import {AudioEngine} from "../../audio/AudioEngine";
import {Track} from "../../audio/track/Track";
import {VerticalTrackControl} from "./track/VerticalTrackControl";

interface MixerViewProps {
    buses: Bus[]
    tracks: Track[]
    audioEngine: AudioEngine
}

export class Mixer extends React.Component<MixerViewProps, {}> {
    public render() {
        const busTracks = this.props.buses.map((bus: Bus) => {
            return <BusTrackView key={bus.id} bus={bus}/>;
        });

        const tracks = this.props.tracks.map((track: Track) => {
            return <VerticalTrackControl key={track.id} track={track}/>;
        });

        return (
            <div className={styles.container}>
                {tracks}
                {busTracks}
            </div>
        );
    }
}
