import React from "react";
import {SampleTrack} from "../../audio/SampleTrack";
import {UpdateChannelVolumeEvent} from "../../events/track/UpdateChannelVolumeEvent";
import {SoloChannelEvent} from "../../events/track/SoloChannelEvent";
import {MuteChannelEvent} from "../../events/track/MuteChannelEvent";
import {UpdateChannelPanningEvent} from "../../events/track/UpdatePanningVolumeEvent";
import {SetChannelReverbEvent} from "../../events/track/SetChannelReverbEvent";
import {SetChannelChorusEvent} from "../../events/track/SetChannelChorusEvent";
import {TrackEvent} from "../../events/track/TrackEvent";

interface TrackViewProps {
    track: SampleTrack
    transportPosition: number;

    onToggleNote(track: SampleTrack, noteIndex: number, isActive: boolean): void
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
            enableReverb: false,
            enableChorus: false
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
            return <td
                onClick={() => this.props.onToggleNote(track, index, !value)}
                key={index}
                className={[value ? "active-note" : "inactive-note", this.props.transportPosition === index ? 'current-note' : ''].join(' ')}
            />
        });

        const updateVolume = (event: React.FormEvent<HTMLInputElement>) => {
            const volume = Number.parseInt(event.currentTarget.value);

            if (volume !== track.channel.volume.value) {
                track.emitter.emit(new UpdateChannelVolumeEvent(volume));
                this.setState({
                    volume
                })
            }
        }

        const updatePanning = (event: React.FormEvent<HTMLInputElement>) => {
            const pan = Number.parseFloat(event.currentTarget.value);

            if (pan !== track.channel.pan.value) {
                track.emitter.emit(new UpdateChannelPanningEvent(pan));
                this.setState({
                    pan
                })
            }
        }

        const soloChannel = () => {
            track.emitter.emit(new SoloChannelEvent(!track.channel.solo));
            this.setState({
                solo: !this.state.solo
            })
        }

        const muteChannel = () => {
            track.emitter.emit(new MuteChannelEvent(!track.channel.mute));

            this.setState({
                mute: !this.state.mute
            });
        }

        const enableReverb = () => {
            track.emitter.emit(new SetChannelReverbEvent(!this.state.enableReverb));

            this.setState({
                enableReverb: !this.state.enableReverb
            });
        }

        const enableChorus = () => {
            track.emitter.emit(new SetChannelChorusEvent(!this.state.enableChorus));

            this.setState({
                enableChorus: !this.state.enableChorus
            });
        }

        return (
            <>
                <tr>
                    <td>
                        <div>
                            <strong>{track.name}</strong>
                        </div>
                        <div style={{width: '150px'}}>
                            <span title="Panning">
                            P: <input onChange={updatePanning} type="range" step="0.01" min="-1" max="1"
                                      value={this.state.pan}/>
                              </span>

                            <button onClick={muteChannel}
                                    className={this.state.mute ? "unmute-button" : "mute-button"}>Mute
                            </button>
                            <button onClick={soloChannel}
                                    className={this.state.solo ? "unsolo-button" : "solo-button"}>Solo
                            </button>
                        </div>

                        <div>
                            <span title="Volume">
                                V: <input style={{width: '220px'}} onChange={updateVolume} type="range" step="1"
                                          min="-32"
                                          max="12"
                                          value={this.state.volume}/>
                            </span>
                        </div>
                    </td>
                    {columns}
                    <td style={{width: '100px'}}>
                        <span title={"Reverb"}>
                            <button onClick={enableReverb}
                                    className={this.state.enableReverb ? "active-reverb-button" : "inactive-reverb-button"}>Rvb
                            </button>
                        </span>
                        <span title={"Chorus"}>
                            <button onClick={enableChorus}
                                    className={this.state.enableChorus ? "active-chorus-button" : "inactive-chorus-button"}>Chr
                            </button>
                        </span>
                    </td>
                </tr>
            </>)
            ;
    }
}
