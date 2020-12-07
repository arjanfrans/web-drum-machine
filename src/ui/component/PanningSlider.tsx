import styles from "./PanningSlider.module.css";
import React from "react";
import {HorizontalRangeSlider} from "./base/slider/HorizontalRangeSlider";

type PanningSliderProps = {
    value?: number
    onChange: (value: number) => void
}

export const PanningSlider = ({ value = 0, onChange}: PanningSliderProps) => {

    return (
        <div className={styles.container}>
            <HorizontalRangeSlider
                min={-1}
                max={1}
                step={0.01}
                value={value}
                onChange={onChange}
                datalist={[{label: 'L', value: -1}, {label: 'C', value: 0}, {label: 'R', value: 1}]}
            />
            <div className={styles.labels}>
                <span className={value === -1 ? styles.bold : ''}>L</span>
                <span className={value === 0 ? styles.bold : ''}>C</span>
                <span className={value === 1 ? styles.bold : ''}>R</span>
            </div>
        </div>
    )
}
