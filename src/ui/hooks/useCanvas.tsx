import { useRef, useEffect } from 'react'

export const useCanvas = (draw: any) => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current as any;
        const context = canvas.getContext('2d');

        if (!context == null) throw new Error('Could not get context');

        let frameCount = 0
        let animationFrameId: number|undefined

        const render = () => {
            frameCount++
            draw(context, frameCount)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return () => {
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId)
            }
        }
    }, [draw])

    return canvasRef
}
