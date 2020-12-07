import styles from "./RangeSlider.module.css";
import React from "react";

type VerticalRangeSliderProps = {
    min: number
    max: number
    step: number
    value: number
    onChange: (value: number) => void
    datalist: { label: string | number, value: string | number }[]
}

let componentCount = 0;

export const VerticalRangeSlider = ({min, max, step, datalist, value, onChange}: VerticalRangeSliderProps) => {
    componentCount += 1;

    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        const value = Number.parseFloat(event.currentTarget.value);

        onChange(value);
    }

    return (
        <div className={styles.verticalContainer}>
            <input
                type="range"
                step={step}
                min={min}
                max={max}
                list={`VerticalRangeSlider_${componentCount}`}
                className={`${styles.verticalSlider} ${styles.slider}`}
                defaultValue={value}
                onChange={handleChange}
            />
            <datalist id={`VerticalRangeSlider_${componentCount}`}>
                {datalist.map(({label, value}, index: number) => <option key={index} value={value}>{label}</option>)}
            </datalist>
        </div>
    );
}
