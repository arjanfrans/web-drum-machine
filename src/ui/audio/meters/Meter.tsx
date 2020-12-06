import React from "react";
import {Canvas} from "../../component/Canvas";
import {MeterCanvas, MeterCanvasDirection} from "./canvas/MeterCanvas";

type MeterProps = {
    onUpdate: (updateValue: (values: number[]) => void) => void
    direction: 'horizontal' | 'vertical'
    style: React.CSSProperties
} & React.HTMLAttributes<HTMLDivElement>

export class Meter extends React.Component<MeterProps, {}> {
    private readonly canvas: MeterCanvas

    constructor(props: MeterProps) {
        super(props);

        this.canvas = new MeterCanvas({
            width: 40,
            height: 200,
            minValue: -48,
            maxValue: 12,
            redThreshold: 0,
            yellowThreshold: -6,
            direction: props.direction,
            channels: 2
        });
    }

    public shouldComponentUpdate(nextProps: Readonly<MeterProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        return false
    }

    public render() {
        const { direction, style, onUpdate, ...rest} = this.props;

        const updateValue = (values: number[]): void => {
            this.canvas.values = values;
        }

       onUpdate(updateValue);

        let styleHorizontal = {width: `${this.canvas.height}px`, height: `${this.canvas.width}px`};
        let styleVertical = {width: `${this.canvas.width}px`, height: `${this.canvas.height}px`};

        const mergedStyle = {
            ...(direction === MeterCanvasDirection.horizontal ? styleHorizontal : styleVertical),
            ...style
        }

        return (
            <div style={mergedStyle} {...rest}>
                <Canvas
                    draw={(context: CanvasRenderingContext2D, frameCount: number) => this.canvas.draw(context, frameCount)}/>
            </div>
        )
    }
}

