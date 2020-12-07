import styles from "./VerticalVolumeSlider.module.css";
import React from "react";
import {VerticalRangeSlider} from "./base/slider/VerticalRangeSlider";

type VerticalVolumeSliderProps = {
    value?: number
    onChange: (value: number) => void
}

export const VerticalVolumeSlider = ({ value, onChange}: VerticalVolumeSliderProps) => {
    if (value === undefined) {
        value = -32
    }

    value = Math.round(value);

    return (
        <div className={styles.container}>
            <VerticalRangeSlider
                value={value}
                onChange={onChange}
                min={-32}
                max={6}
                step={1}
                datalist={[{label: -32, value: -32 }, {label: 0, value: 0}, {label: 6, value: 6}]}
            />
            <div className={value <= 0 ? styles.label : `${styles.label} ${styles.colorRed}`}>
                { value > 0 ? `+${value}` : `${value}` }db
            </div>
        </div>
    )
}
