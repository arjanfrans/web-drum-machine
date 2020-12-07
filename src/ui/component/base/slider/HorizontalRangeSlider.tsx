import styles from "./RangeSlider.module.css";
import React from "react";

type HorizontalRangeSliderProps = {
    min: number
    max: number
    step: number
    value: number
    onChange: (value: number) => void
    datalist: { label: string | number, value: string | number }[]
}

let componentCount = 0;

export const HorizontalRangeSlider = ({min, max, step, datalist, value, onChange}: HorizontalRangeSliderProps) => {
    componentCount += 1;

    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        const value = Number.parseFloat(event.currentTarget.value);

        onChange(value);
    }

    return (
        <>
            <input
                type="range"
                step={step}
                min={min}
                max={max}
                list={`RangeSlider_${componentCount}`}
                className={`${styles.horizontalSlider} ${styles.slider}`}
                defaultValue={value}
                onChange={handleChange}
            />
            <datalist id={`RangeSlider_${componentCount}`}>
                {datalist.map(({label, value}, index: number) => <option key={index} value={value}>{label}</option>)}
            </datalist>
        </>
    );
}
