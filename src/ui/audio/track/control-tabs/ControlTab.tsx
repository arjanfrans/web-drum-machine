import styles from "./ControlTab.module.css";
import {PanningSlider} from "../../../component/PanningSlider";
import {Meter} from "../../meters/Meter";
import {VerticalVolumeSlider} from "../../../component/VerticalVolumeSlider";
import {ToggleButton} from "../../../component/ToggleButton";
import React from "react";
import {Track} from "../../../../audio/track/Track";
import {UpdateChannelPanningEvent} from "../../../../audio/track/events/UpdatePanningVolumeEvent";
import {SoloChannelEvent} from "../../../../audio/track/events/SoloChannelEvent";
import {MuteChannelEvent} from "../../../../audio/track/events/MuteChannelEvent";
import {UpdateChannelVolumeEvent} from "../../../../audio/track/events/UpdateChannelVolumeEvent";
import {TrackOutputVolumeUpdatedEvent} from "../../../../audio/track/events/TrackOutputVolumeUpdatedEvent";

interface ControlTabProps {
    track: Track
}

interface ControlTabState {
    volume: number
    pan: number;
    solo: boolean
    mute: boolean
}

export class ControlTab extends React.Component<ControlTabProps, ControlTabState>  {
    constructor(props: ControlTabProps) {
        super(props);

        this.state = {
            pan: props.track.channel.pan.value,
            volume: props.track.channel.volume.value,
            solo: props.track.channel.solo,
            mute: props.track.channel.mute,
        }
    }

    private updatePanning = (value: number) => {
        if (value !== this.props.track.channel.pan.value) {
            this.props.track.emitter.emit(new UpdateChannelPanningEvent(value));
            this.setState({
                pan: value
            })
        }
    }

    private soloChannel = () => {
        this.props.track.emitter.emit(new SoloChannelEvent(!this.props.track.channel.solo));
        this.setState({
            solo: !this.state.solo
        })
    }

    private muteChannel = () => {
        this.props.track.emitter.emit(new MuteChannelEvent(!this.props.track.channel.mute));

        this.setState({
            mute: !this.state.mute
        });
    }

    private updateVolume = (value: number) => {
        if (value !== this.props.track.channel.volume.value) {
            this.props.track.emitter.emit(new UpdateChannelVolumeEvent(value));
            this.setState({
                volume: value
            })
        }
    }

    private meterListener = (updateValue: (values: number[]) => void): void => {
        this.props.track.emitter.on(TrackOutputVolumeUpdatedEvent, (event: TrackOutputVolumeUpdatedEvent) => {
            updateValue([event.leftVolume, event.rightVolume])
        });
    }

    public render() {
        return (
            <>
                <PanningSlider
                    value={this.state.pan}
                    onChange={this.updatePanning}
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
                    <VerticalVolumeSlider onChange={this.updateVolume} value={this.state.volume}/>
                </div>
                <div className={styles.toggleContainer}>
                    <ToggleButton
                        onClick={this.soloChannel}
                        isActive={!this.state.solo}
                        activeColor={'goldenrod'}
                        label="S"
                    />
                    <ToggleButton
                        onClick={this.muteChannel}
                        isActive={!this.state.mute}
                        activeColor={'darkred'}
                        label="M"
                    />
                </div>
            </>
        )
    }
}
