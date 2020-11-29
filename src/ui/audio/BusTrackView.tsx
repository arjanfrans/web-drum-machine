import React from "react";
import {Bus} from "../../audio/bus/Bus";
import {UpdateChannelVolumeEvent} from "../../audio/track/events/UpdateChannelVolumeEvent";
import styles from "./BusTrackView.module.css"

interface BusTrackViewProps {
    bus: Bus
}

interface BusTrackViewState {
    volume: number
}

export class BusTrackView extends React.Component<BusTrackViewProps, BusTrackViewState> {
    constructor(props: BusTrackViewProps) {
        super(props);

        this.state = {
            volume: props.bus.channel.volume.value
        }
    }

    public render() {
        const {bus} = this.props;

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
                <input className={styles.slider} type="range" step="0.01" min="-1" max="1" list="tickmarks"/>
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
                <div className={styles.name}>
                    {bus.name}
                </div>
            </div>
        );
    }
}
