import React from "react";
import {Track} from "../../../audio/track/Track";
import {UpdateChannelVolumeEvent} from "../../../audio/track/events/UpdateChannelVolumeEvent";
import {SoloChannelEvent} from "../../../audio/track/events/SoloChannelEvent";
import {MuteChannelEvent} from "../../../audio/track/events/MuteChannelEvent";
import {UpdateChannelPanningEvent} from "../../../audio/track/events/UpdatePanningVolumeEvent";
import {TrackEvent} from "../../../audio/track/events/TrackEvent";
import {VolumeSlider} from "../../component/VolumeSlider";
import styles from "./TrackControlView.module.css"
import {PanningSlider} from "../../component/PanningSlider";
import {ToggleButton} from "../../component/ToggleButton";
import {SetChannelReverbEvent} from "../../../audio/track/events/SetChannelReverbEvent";
import {SetChannelChorusEvent} from "../../../audio/track/events/SetChannelChorusEvent";
import {Meter} from "../meters/Meter";
import {TrackOutputVolumeUpdatedEvent} from "../../../audio/track/events/TrackOutputVolumeUpdatedEvent";

interface TrackControlProps {
    track: Track
}

interface TrackControlState {
    volume: number
    pan: number;
    solo: boolean
    mute: boolean
    enableReverb: boolean
    enableChorus: boolean
}

export class TrackControlView extends React.Component<TrackControlProps, TrackControlState> {
    constructor(props: TrackControlProps) {
        super(props);

        this.state = {
            pan: props.track.channel.pan.value,
            volume: props.track.channel.volume.value,
            solo: props.track.channel.solo,
            mute: props.track.channel.mute,
            enableReverb: props.track.effectsRack.isEnabled("reverb"),
            enableChorus: props.track.effectsRack.isEnabled("chorus")
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
            <div className={styles.container}>
                <div>
                    <VolumeSlider onChange={updateVolume} value={this.state.volume}/>
                </div>
                <div>
                    <PanningSlider onChange={updatePanning} value={this.state.pan}/>
                </div>
                <div className={styles.name}>
                    {track.name}
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
                    <ToggleButton
                        onClick={enableReverb}
                        isActive={!this.state.enableReverb}
                        label={"R"}
                        activeColor={'darkgreen'}
                        title={"Reverb"}
                    />
                    <ToggleButton
                        onClick={enableChorus}
                        isActive={!this.state.enableChorus}
                        label={"C"}
                        activeColor={'cyan'}
                        title={"Chorus"}
                    />
                </div>
                <div>
                    <Meter
                        className={styles.meter}
                        direction="horizontal"
                        width={10}
                        height={100}
                        style={{display: 'inline-block'}}
                        onUpdate={this.meterListener}
                    />
                </div>
            </div>
        );
    }
}
