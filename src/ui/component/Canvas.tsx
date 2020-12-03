import React from 'react'
import {useCanvas} from "../hooks/useCanvas"

export const Canvas = (props: any) => {
    const { draw, ...rest } = props
    const canvasRef = useCanvas(draw)

    return <canvas ref={canvasRef} {...rest}/>
}
