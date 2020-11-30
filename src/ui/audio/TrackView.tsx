import React from "react";
import {Track} from "../../audio/track/Track";
import {UpdateChannelVolumeEvent} from "../../audio/track/events/UpdateChannelVolumeEvent";
import {SoloChannelEvent} from "../../audio/track/events/SoloChannelEvent";
import {MuteChannelEvent} from "../../audio/track/events/MuteChannelEvent";
import {UpdateChannelPanningEvent} from "../../audio/track/events/UpdatePanningVolumeEvent";
import {SetChannelReverbEvent} from "../../audio/track/events/SetChannelReverbEvent";
import {SetChannelChorusEvent} from "../../audio/track/events/SetChannelChorusEvent";
import {TrackEvent} from "../../audio/track/events/TrackEvent";
import {UpdateSendVolumeEvent} from "../../audio/track/events/UpdateSendVolumeEvent";
import {ToggleButton} from "../component/ToggleButton";
import {Color} from "../Color";
import {TrackControlView} from "./TrackControlView";

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

        const updateSendBus = (busName: string, volume: number) => {
            const send = track.getSend(busName);

            if (!send || volume !== send.gain.value) {
                track.emitter.emit(new UpdateSendVolumeEvent(busName, volume));
            }
        }

        const sendBuses = this.props.sendBuses.map((busName: string) => {
            const sendKnob = track.getSend(busName);

            return <div key={busName} title={`Send: ${busName}`}>
                <input style={{width: '140px'}}
                       onMouseUp={(event: React.FormEvent<HTMLInputElement>) => {
                           const volume = Number.parseInt(event.currentTarget.value);

                           updateSendBus(busName, volume)
                       }}
                       defaultValue={sendKnob?.gain.value || "-32"}
                       type="range" step="1"
                       min="-32"
                       max="12"
                />
            </div>
        });

        return (
            <>
                <tr>
                    <td>
                        <TrackControlView track={track}/>
                    </td>
                    {columns}
                    <td style={{width: '150px'}}>
                        <div>
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
                        </div>
                        <div>
                            {sendBuses}
                        </div>
                    </td>
                </tr>
            </>)
            ;
    }
}
