import React from "react";
import {UpdateChannelVolumeEvent} from "../../../audio/track/events/UpdateChannelVolumeEvent";
import styles from "./VerticalTrackControl.module.css"
import {PanningSlider} from "../../component/PanningSlider";
import {UpdateChannelPanningEvent} from "../../../audio/track/events/UpdatePanningVolumeEvent";
import {SoloChannelEvent} from "../../../audio/track/events/SoloChannelEvent";
import {MuteChannelEvent} from "../../../audio/track/events/MuteChannelEvent";
import {ToggleButton} from "../../component/ToggleButton";
import {VerticalVolumeSlider} from "../../component/VerticalVolumeSlider";
import {Meter} from "../meters/Meter";
import {TrackOutputVolumeUpdatedEvent} from "../../../audio/track/events/TrackOutputVolumeUpdatedEvent";
import {Track} from "../../../audio/track/Track";
import {TrackEffects} from "./TrackEffects";
import {Sends} from "./Sends";

interface VerticalTrackControlProps {
    track: Track
}

interface VerticalTrackControlState {
    volume: number
    pan: number;
    solo: boolean
    mute: boolean
}

export class VerticalTrackControl extends React.Component<VerticalTrackControlProps, VerticalTrackControlState> {
    constructor(props: VerticalTrackControlProps) {
        super(props);

        this.state = {
            pan: props.track.channel.pan.value,
            volume: props.track.channel.volume.value,
            solo: props.track.channel.solo,
            mute: props.track.channel.mute,
        }
    }

    private meterListener = (updateValue: (values: number[]) => void): void => {
        this.props.track.emitter.on(TrackOutputVolumeUpdatedEvent, (event: TrackOutputVolumeUpdatedEvent) => {
            updateValue([event.leftVolume, event.rightVolume])
        });
    }

    public render() {
        const {track} = this.props;

        const updatePanning = (value: number) => {
            if (value !== track.channel.pan.value) {
                track.emitter.emit(new UpdateChannelPanningEvent(value));
                this.setState({
                    pan: value
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

        const updateVolume = (value: number) => {
            if (value !== track.channel.volume.value) {
                track.emitter.emit(new UpdateChannelVolumeEvent(value));
                this.setState({
                    volume: value
                })
            }
        }

        return (
            <div className={styles.container}>
                <div className={styles.sends}>
                    <Sends track={track}/>
                </div>
                <div className={styles.effects}>
                    <TrackEffects track={track}/>
                </div>
                <div className={styles.controls}>
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
                        {track.name}
                    </div>
                </div>
            </div>
        );
    }
}
