import React from "react";
import {Canvas} from "../component/Canvas";
import styles from "./Meter.module.css"

export const Meter = ({ listener , ...props}: any) => {
    let curVal = 0;
    let width = 20;
    let height = 100;
    // Settings
    let max = 100;
    let boxCount = 25;
    let boxCountRed = 5;
    let boxCountYellow = 5;
    let boxGapFraction = 0.2;
    let jitter = 0;

    // Colours
    let redOn = 'rgba(255,47,30,0.9)';
    let redOff = 'rgba(64,12,8,0.9)';
    let yellowOn = 'rgba(255,215,5,0.9)';
    let yellowOff = 'rgba(64,53,0,0.9)';
    let greenOn = 'rgba(53,255,30,0.9)';
    let greenOff = 'rgba(13,64,8,0.9)';

    let boxHeight = height / (boxCount + (boxCount + 1) * boxGapFraction);
    let boxGapY = boxHeight * boxGapFraction;

    let boxWidth = width - (boxGapY * 2);
    let boxGapX = (width - boxWidth) / 2;


    const isOn = (id: any, val: any) =>  {
        // We need to scale the input value (0-max)
        // so that it fits into the number of boxes
        var maxOn = Math.ceil((val / max) * boxCount);
        return (id <= maxOn);
    }

    const getBoxColor = (id: any, val: any) => {
        // on colours
        if (id > boxCount - boxCountRed) {
            return isOn(id, val) ? redOn : redOff;
        }
        if (id > boxCount - boxCountRed - boxCountYellow) {
            return isOn(id, val) ? yellowOn : yellowOff;
        }
        return isOn(id, val) ? greenOn : greenOff;
    }

    const drawBoxes = (c: CanvasRenderingContext2D, val: any) => {
        c.save();
        c.translate(boxGapX, boxGapY);
        for (var i = 0; i < boxCount; i++) {
            var id =  Math.abs(i - (boxCount - 1)) + 1;;

            c.beginPath();
            c.rect(0, 0, boxWidth, boxHeight);
            c.fillStyle = getBoxColor(id, val);
            c.fill();
            c.translate(0, boxHeight + boxGapY);
        }
        c.restore();
    }

    const draw = (context: CanvasRenderingContext2D, frameCount: number) => {
        const c = context;
        let targetVal = 0

        // Gradual approach
        if (curVal <= targetVal) {
            curVal += (targetVal - curVal) / 5;
        } else {
            curVal -= (curVal - targetVal) / 5;
        }

        // Apply jitter
        if (jitter > 0 && curVal > 0) {
            let amount = (Math.random() * jitter * max);
            if (Math.random() > 0.5) {
                amount = -amount;
            }
            curVal += amount;
        }
        if (curVal < 0) {
            curVal = 0;
        }

        c.save();
        c.beginPath();
        c.rect(0, 0, width, height);
        c.fillStyle = 'rgb(32,32,32)';
        c.fill();
        c.restore();
        drawBoxes(c, curVal);
    };

    const updateValue = (value: number): void => {
        curVal = value * max;
    }

    listener(updateValue);

    return (
        <div className={styles.container} {...props}>
            <Canvas draw={draw}/>
        </div>
    )
}

