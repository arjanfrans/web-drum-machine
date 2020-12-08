import React from "react";
import styles from "./VerticalTrackControl.module.css"
import {Track} from "../../../audio/track/Track";
import {EffectsTab} from "./control-tabs/EffectsTab";
import {SendsTab} from "./control-tabs/SendsTab";
import {ControlTab} from "./control-tabs/ControlTab";
import {Keyboard} from "../../Keyboard";

interface VerticalTrackControlProps {
    track: Track
    updateActiveTab: (tab: string) => void
}

interface VerticalTrackControlState {
    activeTab: string
}

export class VerticalTrackControl extends React.Component<VerticalTrackControlProps, VerticalTrackControlState> {
    public static TABS = ["CTL", "EFX", "SND"]

    constructor(props: VerticalTrackControlProps) {
        super(props);

        this.state = {
            activeTab: VerticalTrackControl.TABS[0]
        }
    }


    private changeTab(tab: string): void {
        this.setState({
            activeTab: tab
        })
    }

    private renderTabButton(name: string)
    {
        return (
            <button
                className={`${(this.state.activeTab === name ? styles.activeTab : '')} ${styles.tabButton}`}
                onClick={() => {
                    if (Keyboard.isShiftDown()) {
                        this.props.updateActiveTab(name)
                    } else {
                        this.changeTab(name)
                    }
                }}
            >
                {name}
            </button>
        )
    }

    public render() {
        const {track} = this.props
        const {activeTab } = this.state

        let tab = null;

        if (activeTab === VerticalTrackControl.TABS[0]) {
            tab = <div className={styles.tab}><ControlTab track={track}/></div>
        } else if (activeTab === VerticalTrackControl.TABS[1]) {
            tab = <div className={styles.tab}><EffectsTab track={track}/></div>
        } else {
            tab = <div className={styles.tab}><SendsTab track={track}/></div>
        }

        return (
            <div className={styles.container}>
                <div className={styles.tabs}>
                    {this.renderTabButton(VerticalTrackControl.TABS[0])}
                    {this.renderTabButton(VerticalTrackControl.TABS[1])}
                    {this.renderTabButton(VerticalTrackControl.TABS[2])}
                </div>
                <div>
                    {tab}
                </div>
                <div className={styles.name}>
                    {track.name}
                </div>
            </div>
        );
    }
}
