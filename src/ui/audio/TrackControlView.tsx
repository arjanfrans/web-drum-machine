import React from "react";
import {Track} from "../../audio/track/Track";
import {UpdateChannelVolumeEvent} from "../../audio/track/events/UpdateChannelVolumeEvent";
import {SoloChannelEvent} from "../../audio/track/events/SoloChannelEvent";
import {MuteChannelEvent} from "../../audio/track/events/MuteChannelEvent";
import {UpdateChannelPanningEvent} from "../../audio/track/events/UpdatePanningVolumeEvent";
import {TrackEvent} from "../../audio/track/events/TrackEvent";
import {VolumeSlider} from "../component/VolumeSlider";
import styles from "./TrackControlView.module.css"
import {PanningSlider} from "../component/PanningSlider";
import {ToggleButton} from "../component/ToggleButton";
import {Color} from "../Color";

interface TrackControlProps {
    track: Track
}

interface TrackControlState {
    volume: number
    pan: number;
    solo: boolean
    mute: boolean
}

export class TrackControlView extends React.Component<TrackControlProps, TrackControlState> {
    constructor(props: TrackControlProps) {
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

    public render() {
        const {track} = this.props;

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

        return (
            <div className={styles.container}>
                <div className={styles.row}>
                    <div className={styles.volume}>
                        <VolumeSlider onChange={updateVolume} value={this.state.volume}/>
                    </div>
                    <div className={styles.panning}>
                        <PanningSlider onChange={updatePanning} value={this.state.pan}/>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.name}>
                        {track.name}
                    </div>
                    <div className={styles.toggleContainer}>
                        <div className={styles.toggleContainerButtons}>
                            <ToggleButton
                                onClick={soloChannel}
                                isActive={!this.state.solo}
                                activeColor={Color.yellow}
                                label="S"
                            />
                            <ToggleButton
                                onClick={muteChannel}
                                isActive={!this.state.mute}
                                activeColor={Color.red}
                                label="M"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
