import React from "react";
import {Track} from "../../../audio/track/Track";
import {UpdateChannelVolumeEvent} from "../../../audio/track/events/UpdateChannelVolumeEvent";
import {SoloChannelEvent} from "../../../audio/track/events/SoloChannelEvent";
import {MuteChannelEvent} from "../../../audio/track/events/MuteChannelEvent";
import {UpdateChannelPanningEvent} from "../../../audio/track/events/UpdatePanningVolumeEvent";
import {TrackEvent} from "../../../audio/track/events/TrackEvent";
import {VolumeSlider} from "../../component/VolumeSlider";
import styles from "./HorizontalTrackControl.module.css"
import {PanningSlider} from "../../component/PanningSlider";
import {ToggleButton} from "../../component/ToggleButton";
import {Meter} from "../meters/Meter";
import {TrackOutputVolumeUpdatedEvent} from "../../../audio/track/events/TrackOutputVolumeUpdatedEvent";

interface HorizontalTrackControlProps {
    track: Track
}

interface HorizontalTrackControlState {
    volume: number
    pan: number;
    solo: boolean
    mute: boolean
}

export class HorizontalTrackControl extends React.Component<HorizontalTrackControlProps, HorizontalTrackControlState> {
    constructor(props: HorizontalTrackControlProps) {
        super(props);

        this.state = {
            pan: props.track.channel.pan.value,
            volume: props.track.channel.volume.value,
            solo: props.track.channel.solo,
            mute: props.track.channel.mute,
        }
    }

    public componentDidMount() {
        this.props.track.emitter.on(TrackEvent, (event: TrackEvent) => {
            this.forceUpdate();
        })
    }

    private meterListener = (updateValue: (values: number[]) => void): void => {
        this.props.track.emitter.on(TrackOutputVolumeUpdatedEvent, (event: TrackOutputVolumeUpdatedEvent) => {
            updateValue([event.leftVolume, event.rightVolume])
        });
    }

    public render() {
        const {track} = this.props;

        const updateVolume = (value: number) => {
            if (value !== track.channel.volume.value) {
                track.emitter.emit(new UpdateChannelVolumeEvent(value));
                this.setState({
                    volume: value
                })
            }
        }

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

        return (
            <div className={styles.container}>
                <div>
                    <VolumeSlider onChange={updateVolume} value={this.state.volume}/>
                </div>
                <div>
                    <PanningSlider onChange={updatePanning} value={this.state.pan}/>
                </div>
                <div className={styles.name}>
                    <div>
                        {track.name}
                    </div>
                    <div>
                        <Meter
                            className={styles.meter}
                            direction="horizontal"
                            width={20}
                            height={140}
                            style={{display: 'inline-block'}}
                            onUpdate={this.meterListener}
                        />
                    </div>
                </div>

                <div className={styles.toggleContainer}>
                    <ToggleButton
                        onClick={soloChannel}
                        isActive={!this.state.solo}
                        activeColor={'goldenrod'}
                        label="S"
                        title={"Solo"}
                    />
                    <ToggleButton
                        onClick={muteChannel}
                        isActive={!this.state.mute}
                        activeColor={'darkred'}
                        label="M"
                        title={"Mute"}
                    />
                </div>
            </div>
        );
    }
}
