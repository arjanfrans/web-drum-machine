import React from "react";
import {SampleTrack} from "../../audio/SampleTrack";
import {UpdateChannelVolumeEvent} from "../../events/track/UpdateChannelVolumeEvent";
import {SoloChannelEvent} from "../../events/track/SoloChannelEvent";
import {MuteChannelEvent} from "../../events/track/MuteChannelEvent";
import {UpdateChannelPanningEvent} from "../../events/track/UpdatePanningVolumeEvent";

interface TrackViewProps {
    track: SampleTrack
    transportPosition: number;

    onToggleNote(trackIndex: string, noteIndex: number, isActive: boolean): void
}

interface TrackViewState {
    volume: number
    pan: number;
    solo: boolean
    mute: boolean
}

export class TrackView extends React.Component<TrackViewProps, TrackViewState> {
    constructor(props: TrackViewProps) {
        super(props);

        this.state = {
            pan: props.track.channel.pan.value,
            volume: props.track.channel.volume.value,
            solo: props.track.channel.solo,
            mute: props.track.channel.mute
        }
    }

    public render() {
        const {track} = this.props;

        const columns = track.sequenceNotes.map((value, index) => {
            return <td
                onClick={() => this.props.onToggleNote(track.id, index, !value)}
                key={index}
                className={[value ? "active-note" : "inactive-note", this.props.transportPosition === index ? 'current-note' : ''].join(' ')}
            />
        });

        const updateVolume = (event: React.FormEvent<HTMLInputElement>) => {
            const volume = Number.parseInt(event.currentTarget.value);

            if (volume !== track.channel.volume.value) {
                this.setState({
                    volume
                })

                track.emitter.emit(new UpdateChannelVolumeEvent(volume));
            }
        }

        const updatePanning = (event: React.FormEvent<HTMLInputElement>) => {
            const pan = Number.parseFloat(event.currentTarget.value);

            if (pan !== track.channel.pan.value) {
                this.setState({
                    pan
                })

                track.emitter.emit(new UpdateChannelPanningEvent(pan));
            }
        }

        const soloChannel = () => {
            this.setState({
                solo: !this.state.solo
            })

            track.emitter.emit(new SoloChannelEvent(!track.channel.solo));
        }

        const muteChannel = () => {
            this.setState({
                mute: !this.state.mute
            });

            track.emitter.emit(new MuteChannelEvent(!track.channel.mute));
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

                            <button onMouseUp={muteChannel}
                                    className={this.state.mute ? "unmute-button" : "mute-button"}>Mute
                            </button>
                            <button onMouseUp={soloChannel}
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
                </tr>
            </>)
            ;
    }
}
