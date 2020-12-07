import React from "react";
import {Bus} from "../../audio/bus/Bus";
import {UpdateChannelVolumeEvent} from "../../audio/track/events/UpdateChannelVolumeEvent";
import styles from "./BusTrackView.module.css"
import {PanningSlider} from "../component/PanningSlider";
import {UpdateChannelPanningEvent} from "../../audio/track/events/UpdatePanningVolumeEvent";
import {SoloChannelEvent} from "../../audio/track/events/SoloChannelEvent";
import {MuteChannelEvent} from "../../audio/track/events/MuteChannelEvent";
import {ToggleButton} from "../component/ToggleButton";
import {VerticalVolumeSlider} from "../component/VerticalVolumeSlider";
import {Meter} from "./meters/Meter";
import {TrackOutputVolumeUpdatedEvent} from "../../audio/track/events/TrackOutputVolumeUpdatedEvent";

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

    private meterListener = (updateValue: (values: number[]) => void): void => {
        this.props.bus.emitter.on(TrackOutputVolumeUpdatedEvent, (event: TrackOutputVolumeUpdatedEvent) => {
            updateValue([event.leftVolume, event.rightVolume])
        });
    }

    public render() {
        const {bus} = this.props;

        const updatePanning = (value: number) => {
            if (value !== bus.channel.pan.value) {
                bus.emitter.emit(new UpdateChannelPanningEvent(value));
                this.setState({
                    pan: value
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

        const updateVolume = (value: number) => {
            if (value !== bus.channel.volume.value) {
                bus.emitter.emit(new UpdateChannelVolumeEvent(value));
                this.setState({
                    volume: value
                })
            }
        }

        return (
            <div className={styles.container}>
                <PanningSlider
                    value={this.state.pan}
                    onChange={updatePanning}
                />
                <div className={styles.meter}>
                    <Meter
                        direction="vertical"
                        width={20}
                        height={110}
                        style={{display: 'inline-block'}}
                        onUpdate={this.meterListener}
                    />
                </div>
                <div className={styles.volume} title="Volume">
                   <VerticalVolumeSlider onChange={updateVolume} value={this.state.volume} />
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
