import styles from "./VolumeSlider.module.css";
import React from "react";

export const VolumeSlider = (props: any) => (
    <div className={styles.container}>
        <input
            className={styles.slider} type="range" step="1" min="-32" max="6" list="VolumeSliderTicks"
            {...props}
        />
        <datalist id="VolumeSliderTicks" className={styles.sliderTicks}>
            <option value="-32"></option>
            <option value="0"></option>
            <option value="6"></option>
        </datalist>
    </div>
)
