import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {AudioEngine} from "./audio/AudioEngine";

export class Jukebox extends React.Component<{}, {}>{
    private audioEngine = new AudioEngine();

    public async componentDidMount(): Promise<void>
    {
        await this.audioEngine.load()
    }

    private handleStartClick(): void
    {
        this.audioEngine.start();
        console.log('click')
    }

    public render(): React.ReactNode
    {
        return <button onClick={() => this.handleStartClick()}>Start</button>
    }
}


ReactDOM.render(
  <React.StrictMode>
    <Jukebox />
  </React.StrictMode>,
  document.getElementById('root')
);

