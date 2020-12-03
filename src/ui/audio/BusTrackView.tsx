import React from "react";
import {Bus} from "../../audio/bus/Bus";
import {UpdateChannelVolumeEvent} from "../../audio/track/events/UpdateChannelVolumeEvent";
import styles from "./BusTrackView.module.css"
import {PanningSlider} from "../component/PanningSlider";
import {UpdateChannelPanningEvent} from "../../audio/track/events/UpdatePanningVolumeEvent";
import {SoloChannelEvent} from "../../audio/track/events/SoloChannelEvent";
import {MuteChannelEvent} from "../../audio/track/events/MuteChannelEvent";
import {ToggleButton} from "../component/ToggleButton";

interface BusTrackViewProps {
    bus: Bus
}

interface BusTrackViewState {
    volume: number
    pan: number;
    solo: boolean
    mute: boolean
}

export class BusTrackView extends React.Component<BusTrackViewProps, BusTrackViewState> {
    constructor(props: BusTrackViewProps) {
        super(props);

        this.state = {
            pan: props.bus.channel.pan.value,
            volume: props.bus.channel.volume.value,
            solo: props.bus.channel.solo,
            mute: props.bus.channel.mute,
        }
    }

    public render() {
        const {bus} = this.props;

        const updatePanning = (event: React.FormEvent<HTMLInputElement>) => {
            const pan = Number.parseFloat(event.currentTarget.value);

            if (pan !== bus.channel.pan.value) {
                bus.emitter.emit(new UpdateChannelPanningEvent(pan));
                this.setState({
                    pan
                })
            }
        }

        const soloChannel = () => {
            bus.emitter.emit(new SoloChannelEvent(!bus.channel.solo));
            this.setState({
                solo: !this.state.solo
            })
        }

        const muteChannel = () => {
            bus.emitter.emit(new MuteChannelEvent(!bus.channel.mute));

            this.setState({
                mute: !this.state.mute
            });
        }

        const updateVolume = (event: React.FormEvent<HTMLInputElement>) => {
            const volume = Number.parseInt(event.currentTarget.value);

            if (volume !== bus.channel.volume.value) {
                bus.emitter.emit(new UpdateChannelVolumeEvent(volume));
                this.setState({
                    volume
                })
            }
        }

        return (
            <div className={styles.container}>
                <PanningSlider
                    value={this.state.pan}
                    onChange={updatePanning}
                />
                <datalist id="tickmarks" className={styles.sliderticks}>
                    <option value="-1">L</option>
                    <option value="0">C</option>
                    <option value="1">R</option>
                </datalist>
               <div className={styles.center} title="Volume">
                    <input className={styles.verticalRange} onChange={updateVolume} type="range" step="1"
                           min="-32"
                           max="12"
                           value={this.state.volume}/>
                </div>
                <div className={styles.toggleContainer}>
                    <ToggleButton
                        onClick={soloChannel}
                        isActive={!this.state.solo}
                        activeColor={'goldenrod'}
                        label="S"
                    />
                    <ToggleButton
                        onClick={muteChannel}
                        isActive={!this.state.mute}
                        activeColor={'darkred'}
                        label="M"
                    />
                </div>
                <div className={styles.name}>
                    {bus.name}
                </div>
            </div>
        );
    }
}
