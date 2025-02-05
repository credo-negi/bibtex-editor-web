import * as stylex from "@stylexjs/stylex"
import { useRef, useEffect, useState } from "react"
import { type Theme } from "../types/theme"
import { type ButtonStyle } from "../types/componentStyle"

interface RippleProps {
    parentRef: React.RefObject<HTMLElement>
    pressDuration?: number,
    releaseDuration?: number,
    disabled?: boolean,
    theme?: Theme,
    buttonStyle?: ButtonStyle,
    rippleWithKeyDown?: string[],
}

enum PointerState {
    IDLE = "idle",
    PRESSED = "pressed",
    RELEASED = "released",
    HOVERED = "hovered"
}

enum EffectState {
    IDLE = "idle",
    EXPANDING = "expanding",
    FADING = "fading",
}

type RippleState = {
    pointerState: PointerState,
    effectState: EffectState,
    time: number,
    pressAnimation?: Animation,
    releaseAnimation?: Animation,
    rippleStartEvent?: PointerEvent,
}

const PRESS_DURATION = 175
const RELEASE_DURATION = 450
const RIPPLE_START_SCALE = 0
const RIPPLE_END_SCALE = 1

const style = stylex.create({
    ripple: {
        position: "absolute",
        width: "100%",
        height: "100%",
        left: "0",
        top: "0",
        pointerEvents: "none",
        userSelect: "none",
        "--ripple-color": "var(--md-sys-color-on-background)",
        "::after": {
            content: "''",
            position: "absolute",
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--ripple-color) 0%, transparent 90%)",
            // backgroundColor: "var(--md-sys-color-on-background)",
            pointerEvents: "none",
            opacity: 0,
            scale: 1,
        }
    },
    text_primary: {
        "--ripple-color": "var(--md-sys-color-primary)"
    },
    text_secondary: {
        "--ripple-color": "var(--md-sys-color-secondary)"
    },
    text_tertiary: {
        "--ripple-color": "var(--md-sys-color-tertiary)"
    },
    text_error: {
        "--ripple-color": "var(--md-sys-color-error)"
    },
    text_success: {
        "--ripple-color": "var(--md-sys-color-success)"
    },
    text_warning: {
        "--ripple-color": "var(--md-sys-color-warning)"
    },
    text_info: {
        "--ripple-color": "var(--md-sys-color-info)"
    },
    elevated_primary: {
        "--ripple-color": "var(--md-sys-color-on-primary)"
    },
    elevated_secondary: {
        "--ripple-color": "var(--md-sys-color-on-secondary)"
    },
    elevated_tertiary: {
        "--ripple-color": "var(--md-sys-color-on-tertiary)"
    },
    elevated_error: {
        "--ripple-color": "var(--md-sys-color-on-error)"
    },
    elevated_success: {
        "--ripple-color": "var(--md-sys-color-on-success)"
    },
    elevated_warning: {
        "--ripple-color": "var(--md-sys-color-on-warning)"
    },
    elevated_info: {
        "--ripple-color": "var(--md-sys-color-on-info)"
    },
    filled_primary: {
        "--ripple-color": "var(--md-sys-color-on-primary)"
    },
    filled_secondary: {
        "--ripple-color": "var(--md-sys-color-on-secondary)"
    },
    filled_tertiary: {
        "--ripple-color": "var(--md-sys-color-on-tertiary)"
    },
    filled_error: {
        "--ripple-color": "var(--md-sys-color-on-error)"
    },
    filled_success: {
        "--ripple-color": "var(--md-sys-color-on-success)"
    },
    filled_warning: {
        "--ripple-color": "var(--md-sys-color-on-warning)"
    },
    filled_info: {
        "--ripple-color": "var(--md-sys-color-on-info)"
    },
    filled_tonal_primary: {
        "--ripple-color": "var(--md-sys-color-primary)"
    },
    filled_tonal_secondary: {
        "--ripple-color": "var(--md-sys-color-secondary)"
    },
    filled_tonal_tertiary: {
        "--ripple-color": "var(--md-sys-color-tertiary)"
    },
    filled_tonal_error: {
        "--ripple-color": "var(--md-sys-color-error)"
    },
    filled_tonal_success: {
        "--ripple-color": "var(--md-sys-color-success)"
    },
    filled_tonal_warning: {
        "--ripple-color": "var(--md-sys-color-warning)"
    },
    filled_tonal_info: {
        "--ripple-color": "var(--md-sys-color-info)"
    },
    outlined_primary: {
        "--ripple-color": "var(--md-sys-color-primary)"
    },
    outlined_secondary: {
        "--ripple-color": "var(--md-sys-color-secondary)"
    },
    outlined_tertiary: {
        "--ripple-color": "var(--md-sys-color-tertiary)"
    },
    outlined_error: {
        "--ripple-color": "var(--md-sys-color-error)"
    },
    outlined_success: {
        "--ripple-color": "var(--md-sys-color-success)"
    },
    outlined_warning: {
        "--ripple-color": "var(--md-sys-color-warning)"
    },
    outlined_info: {
        "--ripple-color": "var(--md-sys-color-info)"
    },
})

const Ripple = (props: RippleProps) => {
    const { 
        parentRef, 
        pressDuration = PRESS_DURATION, 
        releaseDuration = RELEASE_DURATION, 
        disabled = false,
        theme = "primary",
        buttonStyle = "text",
        rippleWithKeyDown = [],
    } = props
    const [keyDown, setKeyDown] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const parent = parentRef.current
        const rippleElem = ref.current

        let rippleState: RippleState = {
            pointerState: PointerState.IDLE,
            effectState: EffectState.IDLE,
            time: 0,
        }

        if (!parent || !(parent instanceof HTMLElement)) return

        const shouldRippleEffect = (event: PointerEvent) => {
            return !disabled && event.isPrimary
        }

        const handlePointerEnter = (event: PointerEvent) => {
            if (!shouldRippleEffect(event) || !parent || !(parent instanceof HTMLElement)) return
            rippleState = {
                ...rippleState,
                pointerState: PointerState.HOVERED,
            }
        }

        const handlePointerLeave = (event: PointerEvent) => {
            if (!shouldRippleEffect(event) || !parent || !(parent instanceof HTMLElement)) return
            rippleState = {
                ...rippleState,
                pointerState: PointerState.IDLE,
            }
            if (rippleState.effectState !== EffectState.IDLE) {
                // End the effect
                startReleaseAnimation()
            }
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (!shouldRippleEffect(event) || !parent || !(parent instanceof HTMLElement)) return
            startPressAnimation(event)
        }
         const handlePointerUp = (event: PointerEvent) => {
            if (!shouldRippleEffect(event) || !parent || !(parent instanceof HTMLElement)) return
            startReleaseAnimation()
        }

        const handlePointerCancel = (event: PointerEvent) => {
            if (!shouldRippleEffect(event) || !parent || !(parent instanceof HTMLElement)) return
            rippleState = {
                ...rippleState,
                pointerState: PointerState.IDLE,
            }
        }

        const handleKeyDown = async (event: KeyboardEvent) => {
            if (!rippleWithKeyDown.includes(event.key) || disabled) return
            if (!parent || !(parent instanceof HTMLElement) || keyDown) return
            setKeyDown(true)
            // 要素の中央にポインターがあると仮定
            const { scrollX, scrollY } = window
            const { left, top, width, height } = parent.getBoundingClientRect()
            const documentX = left + scrollX
            const documentY = top + scrollY
            const pointerEvent = new PointerEvent("pointerdown", {
                pointerId: 0,
                pointerType: "mouse",
                clientX: documentX + width / 2,
                clientY: documentY + height / 2,
            })
            startPressAnimation(pointerEvent)
            await startReleaseAnimation()
            setKeyDown(false)
        }

        const getRipplePointerEventCoordinates = (event: PointerEvent) => {
            if (!parent || !(parent instanceof HTMLElement)) return { x: 0, y: 0 }
            const { scrollX, scrollY } = window
            const { left, top } = parent.getBoundingClientRect()
            const documentX = left + scrollX
            const documentY = top + scrollY
            const { pageX, pageY } = event
            return {
                x: pageX - documentX,
                y: pageY - documentY,
            }
        }

        const getRippleTranslationCoordinates = (positionEvent?: Event) => {
            if (!parent || !(parent instanceof HTMLElement)) {
                return { startPoint: { x: 0, y: 0 }, endPoint: { x: 0, y: 0 }, radius: 0 }
            } 
            const { width, height } = parent.getBoundingClientRect()
            const { x, y } = 
                (positionEvent instanceof PointerEvent) 
                ? getRipplePointerEventCoordinates(positionEvent) 
                : { x: width / 2, y: height / 2 }
            const diameter = Math.sqrt(width ** 2 + height ** 2) * 2
            return {
                startPoint: { x: x - diameter/2, y: y - diameter/2 },
                endPoint: { x: width / 2 - diameter/2, y: height / 2 - diameter/2 },
                diameter,
            }
        }

        const startPressAnimation = (event: PointerEvent) => {
            if (!parent || !(parent instanceof HTMLElement) || !rippleElem || !(rippleElem instanceof HTMLElement)) return
            rippleState.pressAnimation?.cancel()
            rippleState.releaseAnimation?.cancel()
            rippleState = {
                ...rippleState,
                pointerState: PointerState.PRESSED,
                time: Date.now(),
                rippleStartEvent: event,
                effectState: EffectState.EXPANDING,
                releaseAnimation: undefined,
            }
            const { startPoint, endPoint, diameter } = getRippleTranslationCoordinates(event)
            const translateStart = `translate(${startPoint.x}px, ${startPoint.y}px) scale(${RIPPLE_START_SCALE})`
            const translateEnd = `translate(${endPoint.x}px, ${endPoint.y}px) scale(${RIPPLE_END_SCALE})`
            const rippleSize = diameter ? `${diameter}px` : "100%"
            const pressAnimation = rippleElem.animate({
                top: [0, 0],
                left: [0, 0],
                height: [rippleSize, rippleSize],
                width: [rippleSize, rippleSize],
                transform: [translateStart, translateEnd],
                opacity: [0.24, 0.24],
            }, {
                pseudoElement: "::after",
                duration: pressDuration,
                easing: "linear",
                fill: "forwards",
            })
            rippleState = {
                ...rippleState,
                pressAnimation,
            }
        }

        async function startReleaseAnimation () {
            if (!parent || !(parent instanceof HTMLElement) || !rippleElem || !(rippleElem instanceof HTMLElement)) return
            rippleState = {
                ...rippleState,
                pointerState: PointerState.RELEASED,
                rippleStartEvent: undefined
            }
            const animation = rippleState.pressAnimation
            let pressAnimationPlayState = Infinity
            if (typeof animation?.currentTime === "number") {
                pressAnimationPlayState = animation.currentTime
            } else if (animation?.currentTime) {
                pressAnimationPlayState = animation.currentTime.to("ms").value
            }

            if (pressAnimationPlayState === Infinity) {
                return
            }

            // wait for the press animation to finish
            await new Promise((resolve) => {
                setTimeout(resolve, pressDuration - pressAnimationPlayState)
            })

            if (rippleState.pressAnimation !== animation) {
                return
            }
            const releaseAnimation = rippleElem.animate({
                opacity: [0.24, 0],
                scale: [RIPPLE_END_SCALE, RIPPLE_END_SCALE],
            }, {
                pseudoElement: "::after",
                duration: releaseDuration,
                easing: "ease-out",
                fill: "forwards",
            })
            rippleState = {
                ...rippleState,
                effectState: EffectState.IDLE,
                releaseAnimation,
            }
        }

        // add event listeners
        parent.addEventListener("pointerdown", handlePointerDown)
        parent.addEventListener("pointerup", handlePointerUp)
        parent.addEventListener("pointerenter", handlePointerEnter)
        parent.addEventListener("pointerleave", handlePointerLeave)
        parent.addEventListener("pointercancel", handlePointerCancel)
        parent.addEventListener("keydown", handleKeyDown)

        // useEffect cleanup
        return () => {
            parent.removeEventListener("pointerdown", handlePointerDown)
            parent.removeEventListener("pointerup", handlePointerUp)
            parent.removeEventListener("pointerenter", handlePointerEnter)
            parent.removeEventListener("pointerleave", handlePointerLeave)
            parent.removeEventListener("pointercancel", handlePointerCancel)
            parent.removeEventListener("keydown", handleKeyDown)
        }
    }, [parentRef, pressDuration, releaseDuration, disabled, theme, buttonStyle, rippleWithKeyDown, keyDown, ref])

    return <div {
        ...stylex.props(style.ripple, 
        (style[`${buttonStyle}_${theme}`]))} 
        ref={ref} />
}

export default Ripple;