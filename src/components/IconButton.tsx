import * as stylex from "@stylexjs/stylex";
import { useRef } from "react";
import Ripple from "./Ripple";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    // buttonStyle?: "elevated" | "filled" | "filled-tonal" | "outlined" | "text";
    size?: "ssmall" | "small" | "medium" | "large";
    theme?: "primary" | "secondary" | "tertiary" | "error" | "success" | "warning" | "info";
}

const focusKeyFrames = stylex.keyframes({
    from: {
        outlineOffset: "10px",
    },
    to: {
        outlineOffset: "0px",
    },
});

const style = stylex.create({
    iconButton: {
        height: "48px",
        width: "48px",
        borderRadius: "50%",
        border: "none",
        backgroundColor: "transparent",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "var(--md-sys-color-on-background)",
        fill: "var(--md-sys-color-on-background)",
        position: "relative",
        overflow: "hidden",
        "::before": {
            content: "''",
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            borderRadius: "50%",
            backgroundColor: "var(--md-sys-color-on-background)",
            opacity: 0,
            transition: "opacity 150ms",
        },
        ":hover": {
            "::before": {
                opacity: 0.12,
            },
        },
        ":focus-visible": {
            outline: "2px solid var(--md-sys-color-primary)",
            outlineOffset: "0px",
            animation: `${focusKeyFrames} 150ms var(--transition-ease-out) forwards`,
        },
    },
    iconButton_ssmall: {
        height: "32px",
        width: "32px",
    },
    iconButton_small: {
        height: "40px",
        width: "40px",
    },
    iconButton_medium: {
        height: "48px",
        width: "48px",
    },
    iconButton_large: {
        height: "56px",
        width: "56px",
    },
});

const IconButton = (props: IconButtonProps) => {
    const { 
        children, 
        // buttonStyle: _ = "text", 
        size = "medium", 
        ...rest 
    } = props;
    const ref = useRef<HTMLButtonElement>(null);
    return (
        <button {...stylex.props(style.iconButton, style[`iconButton_${size}`])} {...rest} ref={ref}>
            <Ripple 
                parentRef={ref}
                rippleWithKeyDown={["Enter", " "]} />
            {children}
        </button>
    );
}

export default IconButton;