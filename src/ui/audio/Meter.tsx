import React from "react";
import {Canvas} from "../component/Canvas";
import {MeterCanvas, MeterCanvasDirection} from "./canvas/MeterCanvas";

export const Meter = ({listener, direction = MeterCanvasDirection.vertical, ...props}: any) => {
    const meterCanvas = new MeterCanvas({
        minValue: -48,
        maxValue: 12,
        redThreshold: 0,
        yellowThreshold: -6,
        direction
    });

    const updateValue = (value: number): void => {
        meterCanvas.value = value;
    }

    listener(updateValue);

    let styleHorizontal = {width: '100px', height: '20px'};
    let styleVertical = {width: '20px', height: '100px'};

    return (
        <div style={direction === MeterCanvasDirection.horizontal ? styleHorizontal : styleVertical} {...props}>
            <Canvas draw={(context: CanvasRenderingContext2D, frameCount: number) => meterCanvas.draw(context, frameCount)}/>
        </div>
    )
}

