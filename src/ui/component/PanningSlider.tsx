import styles from "./PanningSlider.module.css";
import React from "react";

export const PanningSlider = (props: any) => (
    <div className={styles.container}>
        <input
            className={styles.slider} type="range" step="0.01" min="-1" max="1" list="PanningSliderTicks"
            {...props}
        />
        <datalist id="PanningSliderTicks" className={styles.sliderTicks}>
            <option value="-1">L</option>
            <option value="0">C</option>
            <option value="1">R</option>
        </datalist>
    </div>
)
