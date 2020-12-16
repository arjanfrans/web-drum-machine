import React from 'react';
import {AudioEngine} from "../audio/AudioEngine";
import {TransportView} from "./audio/TransportView";
import {Mixer} from "./audio/Mixer";

interface DrumMachineProps {
    engine: AudioEngine
}

export class DrumMachine extends React.Component<DrumMachineProps, {}> {
    public render(): React.ReactNode {
        return <>
            <TransportView
                sendBuses={[...this.props.engine.buses.keys()]}
                transport={this.props.engine.transport}
                tracks={[...this.props.engine.tracks.values()]}
                masterTrack={this.props.engine.masterTrack}
                sequencer={this.props.engine.sequencer}
            />
            <Mixer
                buses={[...this.props.engine.buses.values()]}
                tracks={[...this.props.engine.tracks.values()]}
                audioEngine={this.props.engine}
            />
        </>
    }
}
