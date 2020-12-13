import styles from "./SendControl.module.css";
import {VolumeSlider} from "../../../component/VolumeSlider";
import React from "react";
import {Track} from "../../../../audio/track/Track";
import {UpdateSendVolumeEvent} from "../../../../audio/track/events/UpdateSendVolumeEvent";
import {Send} from "../../../../audio/track/Send";
import {ToggleButton} from "../../../component/ToggleButton";
import {EnableSendEvent} from "../../../../audio/track/events/EnableSendEvent";
import {DisableSendEvent} from "../../../../audio/track/events/DisableSendEvent";

type SendControlProps = {
    name: string
    track: Track
    send: Send
}

type SendControlState = {
    volume: number
    enabled: boolean
}

export class SendControl extends React.Component<SendControlProps, SendControlState> {
    constructor(props: SendControlProps) {
        super(props);

        console.log(props.send.volume)
        this.state = {
            volume: props.send.volume,
            enabled: props.send.isEnabled(),
        }
    }

    private updateVolume(value: number) {
        this.props.track.emitter.emit(new UpdateSendVolumeEvent(this.props.name, value));

        this.setState({
            volume: value
        })
    }

    private enableSend() {
        if (!this.state.enabled) {
            this.props.track.emitter.emit(new EnableSendEvent(this.props.name));

            this.setState({
                enabled: true
            })
        }
    }

    private disableSend() {
        if (this.state.enabled) {
            this.props.track.emitter.emit(new DisableSendEvent(this.props.name));

            this.setState({
                enabled: false
            })
        }
    }

    public render() {
        return (
            <div key={this.props.name} title={`Send: ${this.props.name}`} className={styles.container}>
                <div className={styles.sendLabel}>
                    {this.props.name}
                </div>
                <div className={styles.enableButton}>
                    <ToggleButton
                        isActive={!this.state.enabled}
                        onClick={() => this.state.enabled ? this.disableSend() : this.enableSend()}
                        label={!this.state.enabled ? 'Off' : 'On'}
                        activeColor={'lightcoral'}
                    />
                </div>
                <div className={styles.volumeSlider}>
                    <VolumeSlider
                        onChange={this.updateVolume.bind(this)}
                        value={this.state.volume}
                    />
                </div>
            </div>
        );
    }
}
