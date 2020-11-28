import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {TransportView} from "./ui/audio/TransportView";
import {AudioEngine} from "./audio/AudioEngine";
import {CONFIG} from "./config";
import {MixerView} from "./ui/audio/MixerView";

const version = process.env.REACT_APP_VERSION

interface JukeboxState {
    engine: AudioEngine|null
}

export class Jukebox extends React.Component<{}, JukeboxState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            engine: null
        }

    }

    private async startEngine()
    {
        const engine = new AudioEngine(CONFIG);
        await engine.init();

        this.setState({
            engine
        })
    }

    private renderStart(): React.ReactNode
    {
        return <div>
           <button onClick={() => this.startEngine()}>Start making music!</button>
        </div>
    }

    public render(): React.ReactNode {
        if (!this.state.engine) {
            return this.renderStart();
        }

        return <>
            <TransportView
                sendBuses={[...this.state.engine.buses.keys()]}
                transport={this.state.engine.transport}
                tracks={[...this.state.engine.tracks.values()]}
            />
            <MixerView buses={[...this.state.engine.buses.values()]} />
        </>
    }
}

ReactDOM.render(
    <React.StrictMode>
        <Jukebox/>
        <hr/>
        &copy; Arjan Frans 2020 | <a target="_blank" rel="noopener noreferrer" href="https://github.com/arjanfrans/web-drum-machine">Source Code</a> | Version: {version}
    </React.StrictMode>,
    document.getElementById('root')
);

