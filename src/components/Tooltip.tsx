import { useCallback, useState, useRef } from "react";
import * as stylex from "@stylexjs/stylex";
import type { Theme } from "../types/theme";
interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    contents: string[];
    position?: "top" | "bottom" | "left" | "right";
    theme?: Theme | "default";
    disabled?: boolean;
}

const style = stylex.create({
    Tooltip__wrapper: {
        display: "inline-block",
        position: "relative",
    },
    Tooltip__tooltip: {
        position: "fixed",
        top: "0",
        zIndex: 100,
        backgroundColor: "var(--tooltip-color, --md-sys-color-on-surface)",
        color: "var(--tooltip-on-color, --md-sys-color-surface)",
        padding: "5px",
        borderRadius: "5px",
        fontSize: "12px",
        display: "none",
        opacity: 0,
        transition: "opacity 0.1s",
    },
    Tooltip__tooltip__show: {
        display: "block",
    },
    Tooltip__tooltip__default: {
        "--tooltip-color": "var(--md-sys-color-on-surface)",
        "--tooltip-on-color": "var(--md-sys-color-surface)",
    },
    Tooltip__tooltip__primary: {
        "--tooltip-color": "var(--md-sys-color-on-primary-container)",
        "--tooltip-on-color": "var(--md-sys-color-primary-container)",
    },
    Tooltip__tooltip__secondary: {
        "--tooltip-color": "var(--md-sys-color-on-secondary-container)",
        "--tooltip-on-color": "var(--md-sys-color-secondary-container)",
    },
    Tooltip__tooltip__tertiary: {
        "--tooltip-color": "var(--md-sys-color-on-tertiary-container)",
        "--tooltip-on-color": "var(--md-sys-color-tertiary-container)",
    },
    Tooltip__tooltip__error: {
        "--tooltip-color": "var(--md-sys-color-on-error-container)",
        "--tooltip-on-color": "var(--md-sys-color-error-container)",
    },
    Tooltip__tooltip__success: {
        "--tooltip-color": "var(--md-sys-color-on-success-container)",
        "--tooltip-on-color": "var(--md-sys-color-success-container)",
    },
    Tooltip__tooltip__warning: {
        "--tooltip-color": "var(--md-sys-color-on-warning-container)",
        "--tooltip-on-color": "var(--md-sys-color-warning-container)",
    },
    Tooltip__tooltip__info: {
        "--tooltip-color": "var(--md-sys-color-on-info-container)",
        "--tooltip-on-color": "var(--md-sys-color-info-container)",
    },
})

const Tooltip = ({
    children, contents, position = "bottom", theme = "default", disabled, ...props
}: TooltipProps) => {
    const [show, setShow] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const tooltipWrapperRef = useRef<HTMLDivElement>(null);
    // ポインターが乗った時に表示
    const handleEnter = useCallback(async (
        event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>
    ) => {
        if (disabled) return;
        if (event.type === "touchstart") {
            // event.preventDefault();
            await new Promise((resolve) => self.setTimeout(resolve, 100));
        }
        setShow(true);
        if (tooltipRef.current && tooltipWrapperRef.current) {
            const tooltipDom = tooltipRef.current;
            const tooltipWrapperDom = tooltipWrapperRef.current;
            const tooltipWrapperRect = tooltipWrapperDom.getBoundingClientRect();
            const tooltipRect = tooltipDom.getBoundingClientRect();
            switch (position) {
                case "top":
                    tooltipDom.style.top = `${tooltipWrapperRect.top - tooltipRect.height}px`;
                    tooltipDom.style.left = `${tooltipWrapperRect.left + tooltipWrapperRect.width / 2}px`;
                    tooltipDom.style.transformOrigin = "left bottom";
                    break;
                case "bottom":
                    tooltipDom.style.top = `${tooltipWrapperRect.bottom}px`;
                    tooltipDom.style.left = `${tooltipWrapperRect.left + tooltipWrapperRect.width / 2}px`;
                    tooltipDom.style.transformOrigin = "left top";
                    break;
                case "left":
                    tooltipDom.style.top = `${tooltipWrapperRect.top + tooltipWrapperRect.height / 2}px`;
                    tooltipDom.style.left = `${tooltipWrapperRect.left - tooltipRect.width}px`;
                    tooltipDom.style.transformOrigin = "right top";
                    break;
                case "right":
                    tooltipDom.style.top = `${tooltipWrapperRect.top + tooltipWrapperRect.height / 2}px`;
                    tooltipDom.style.left = `${tooltipWrapperRect.right}px`;
                    tooltipDom.style.transformOrigin = "left top";
                    break;
            }
            const animation = tooltipDom.animate([
                { opacity: 0, transform: "scale(0.9)" },
                { opacity: 1, transform: "scale(1)" },
            ], {
                duration: 100,
                fill: "forwards",
            });
            return () => {
                animation.cancel();
            };
        }
    }, [position]);
    // ポインターが外れた時に非表示
    const handleLeave = useCallback(async (
        event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>
    ) => {
        if (event.type === "touchend") {
            await new Promise((resolve) => self.setTimeout(resolve, 5000));
        }
        if (tooltipRef.current) {
            const tooltipDom = tooltipRef.current;
            const animation = tooltipDom.animate([
                { opacity: 1, transform: "scale(1)" },
                { opacity: 0, transform: "scale(0.9)" },
            ], {
                duration: 100,
                fill: "forwards",
            });
            animation.onfinish = () => {
                setShow(false);
            };
            return () => animation.cancel();
        } else {
            setShow(false);
        }
    }, []);

    return (
        <div {...stylex.props(style.Tooltip__wrapper)}
        onMouseLeave={handleLeave}
        onMouseEnter={handleEnter}
        onTouchStart={handleEnter}
        onTouchEnd={handleLeave}
        ref={tooltipWrapperRef}
        >
            {children}
            <div 
            {...stylex.props(style.Tooltip__tooltip, show && style.Tooltip__tooltip__show, style[`Tooltip__tooltip__${theme}`])}
            {...props} ref={tooltipRef}>
                {contents.map((content, index) => (
                    <div key={index}>{content}</div>
                ))}
            </div>
        </div>
    )
}

export default Tooltip;