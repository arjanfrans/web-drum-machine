import {log} from "./util/console" // must be the first import
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {AudioEngine} from "./audio/AudioEngine";
import {CONFIG} from "./config";
import {DrumMachine} from "./ui/DrumMachine";
import * as Tone from "tone"
import {Footer} from "./ui/Footer";

log(`Starting app: ${process.env.REACT_APP_NAME}`);

type AppProps = {
    engine?: AudioEngine
}

type AppState = {
    engine?: AudioEngine
}

const createEngine = async () => {
    const engine = new AudioEngine(CONFIG);

    await engine.init();

    return engine;
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            engine: props.engine
        }
    }
    private async start() {
        this.setState({
            engine: await createEngine()
        })
    }

    public render() {
        if (!this.state.engine) {
            return (
                <button onClick={this.start.bind(this)}>
                    Click here to start!
                </button>
            )
        }

        return (
            <>
                <DrumMachine engine={this.state.engine}/>
                <Footer/>
            </>
        );
    }
}

(async () => {
    const state = Tone.context.state
    let engine = undefined;

    if (state === "suspended") {
        // engine = await createEngine()
    }

    ReactDOM.render(
        <React.StrictMode>
            {state}
            <App engine={engine}/>
        </React.StrictMode>,
        document.getElementById('root')
    );
})()

