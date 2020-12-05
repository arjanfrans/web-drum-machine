import React from 'react'
import {useCanvas} from "../hooks/useCanvas"

type CanvasProps = {
    draw: (context: CanvasRenderingContext2D, frameCount: number) => void
} & React.HTMLAttributes<HTMLCanvasElement>

export const Canvas = ({ draw, ...rest }: CanvasProps) => {
    const canvasRef = useCanvas(draw)

    return <canvas ref={canvasRef} {...rest}/>
}
