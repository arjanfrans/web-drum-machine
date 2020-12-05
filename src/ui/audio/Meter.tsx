import React from "react";
import {Canvas} from "../component/Canvas";
import styles from "./Meter.module.css"
import {MeterCanvas} from "./canvas/MeterCanvas";

export const Meter = ({listener, ...props}: any) => {
    const meterCanvas = new MeterCanvas({
        minValue: -48,
        maxValue: 12,
        redThreshold: 0,
        yellowThreshold: -6
    });

    const updateValue = (value: number): void => {
        meterCanvas.value = value;
    }

    listener(updateValue);

    return (
        <div className={styles.container} {...props}>
            <Canvas draw={(context: CanvasRenderingContext2D, frameCount: number) => meterCanvas.draw(context, frameCount)}/>
        </div>
    )
}

