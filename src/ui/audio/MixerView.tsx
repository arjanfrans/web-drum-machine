import React from "react";
import {Bus} from "../../audio/bus/Bus";
import {BusTrackView} from "./BusTrackView";
import {AudioEngine} from "../../audio/AudioEngine";

interface MixerViewProps {
    buses: Bus[]
    audioEngine: AudioEngine
}

export class MixerView extends React.Component<MixerViewProps, {}> {
    public render() {
        const busTracks = this.props.buses.map((bus: Bus) => {
            return <BusTrackView key={bus.id} bus={bus}/>;
        });

        return (
            <div>
                {busTracks}
            </div>
        );
    }
}
