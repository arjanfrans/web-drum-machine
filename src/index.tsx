import {log} from "./util/console"
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {AudioEngine} from "./audio/AudioEngine";
import {CONFIG} from "./config";
import {DrumMachine} from "./ui/DrumMachine";
import {Footer} from "./ui/Footer";

log(`Starting app: ${process.env.REACT_APP_NAME}`);

(async () => {
    const engine = new AudioEngine(CONFIG);

    await engine.init();

    ReactDOM.render(
        <React.StrictMode>
            <DrumMachine engine={engine}/>
            <Footer/>
        </React.StrictMode>,
        document.getElementById('root')
    );
})()

