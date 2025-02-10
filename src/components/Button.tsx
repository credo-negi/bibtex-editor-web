import * as stylex from "@stylexjs/stylex";
import { forwardRef, useImperativeHandle, useRef } from "react";
import Ripple from "./Ripple";
import { type Theme } from "../types/theme";
import CJKBottomOffset from "./CJKBottomOffset";

type ButtonStyle = "elevated" | "filled" | "text" | "outlined" | "filled_tonal";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    buttonStyle?: ButtonStyle;
    theme?: Theme;
    size?: "small" | "medium" | "large" | "fab";
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    shrink?: boolean;
    styleXStyles?: stylex.StyleXStyles;
}

const focusKeyFrames = stylex.keyframes({
    from: {
        outlineOffset: "10px",
    },
    to: {
        outlineOffset: "2px",
    },
});

const style = stylex.create({
    button: {
        fontFamily: "var(--font-family)",
        fontWeight: "400",
        letterSpacing: "0.075em",
        fontSize: "0.875rem",
        height: "var(--button-height)",
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        boxSizing: "border-box",
        border: "var(--border-width) solid var(--button-text-color)",
        borderRadius: "var(--border-radius, 20px)",
        padding: 0,
        maxWidth: "100%",
        "--border-width": "0px",
        "--button-text-color": "var(--md-sys-color-on-background)",
        "--button-background-color": "transparent",
        "--outline-color": "var(--md-sys-color-on-background)",
        "--icon-size": "24px",
        "--icon-margin": "16px",
        "--button-height": "40px",
        backgroundColor: "var(--button-background-color)",
        color: "var(--button-text-color)",
        overflow: "hidden",
        cursor: "pointer",
        fill: "var(--button-text-color)",
        transition: "max-width 250ms",
        userSelect: "none",
        "::before": {
            content: "''",
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "var(--button-text-color)",
            opacity: 0,
            transition: "opacity 150ms",
            pointerEvents: "none",
        },
        ":hover": {
            "::before": {
                opacity: 0.12,
            },
        },
        ":focus-visible": {
            outline: "2px solid var(--outline-color)",
            outlineOffset: "2px",
            animation: `${focusKeyFrames} 150ms forwards var(--transition-ease-out)`,
        }
    },
    button__small: {
        "--button-height": "32px",
        "--icon-size": "24px",
        "--border-radius": "16px",
    },
    button__medium: {
        "--button-height": "40px",
        "--icon-size": "24px",
        "--border-radius": "20px",
    },
    button__large: {
        "--button-height": "48px",
        "--icon-size": "24px",
        "--border-radius": "24px",
    },
    button__fab: {
        "--button-height": "56px",
        "--icon-size": "24px",
        "--border-radius": "24px",
    },
    button__shrink: {
        maxWidth: "var(--button-height)",
        minWidth: "var(--button-height)",
    },
    centerSection: {
        boxSizing: "border-box",
        display: "flex",
        height: "100%",
        alignItems: "center",
        overflow: "hidden",
        maxWidth: "100%",
        transition: "max-width 250ms, opacity 250ms",
        padding: "0 24px",
    },
    centerSection__withLeading: {
        paddingLeft: "48px",
    },
    centerSection__withTrailing: {
        paddingRight: "48px",
    },
    centerSection__withLeading__outlined: {
        paddingLeft: "47px",
    },
    centerSection__withTrailing__outlined: {
        paddingRight: "47px",
    },
    mainText: {
        display: "flex",
        alignItems: "center",
        whiteSpace: "nowrap",
    },
    centerSection__shrink: {
        maxWidth: "0",
        opacity: 0,
    },
    icon: {
        position: "absolute",
        "--translateX": "16px",
    },
    icon__outlined: {
        position: "absolute",
        "--translateX": "15px",
    },
    leading: {
        left: "0",
        translate: "calc(var(--translate-x) * 1) 0",
        transition: "translate 250ms",
    },
    trailing: {
        right: "0",
        translate: "calc(var(--translate-x) * -1) 0",
        transition: "translate 250ms",
    },
    icon__shrink: {
        "--translateX": "8px",
    },
    icon__shrink__small: {
        "--translateX": "4px",
    },
    icon__shrink__small__outlined: {
        "--translateX": "3px",
    },
    icon__shrink__medium: {
        "--translateX": "8px",
    },
    icon__shrink__medium__outlined: {
        "--translateX": "7px",
    },
    icon__shrink__large: {
        "--translateX": "12px",
    },
    icon__shrink__large__outlined: {
        "--translateX": "11px",
    },
    icon__shrink__fab: {
        "--translateX": "16px",
    },
    icon__shrink__fab__outlined: {
        "--translate-x": "15px",
    },

    text_primary: {
        "--button-text-color": "var(--md-sys-color-primary)",
        "--button-background-color": "transparent",
        "--outline-color": "var(--md-sys-color-primary)",
    },
    text_secondary: {
        "--button-text-color": "var(--md-sys-color-secondary)",
        "--button-background-color": "transparent",
        "--outline-color": "var(--md-sys-color-secondary)",
    },
    text_tertiary: {
        "--button-text-color": "var(--md-sys-color-tertiary)",
        "--button-background-color": "transparent",
        "--outline-color": "var(--md-sys-color-tertiary)",
    },
    text_error: {
        "--button-text-color": "var(--md-sys-color-error)",
        "--button-background-color": "transparent",
        "--outline-color": "var(--md-sys-color-error)",
    },
    text_success: {
        "--button-text-color": "var(--md-sys-color-success)",
        "--button-background-color": "transparent",
        "--outline-color": "var(--md-sys-color-success)",
    },
    text_warning: {
        "--button-text-color": "var(--md-sys-color-warning)",
        "--button-background-color": "transparent",
        "--outline-color": "var(--md-sys-color-warning)",
    },
    text_info: {
        "--button-text-color": "var(--md-sys-color-info)",
        "--button-background-color": "transparent",
        "--outline-color": "var(--md-sys-color-info)",
    },
    elevated: {
        "--button-text-color": "var(--md-sys-color-on-background)",
        "--button-background-color": "var(--md-sys-color-background)",
        "--outline-color": "var(--md-sys-color-background)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    elevated_primary: {
        "--button-text-color": "var(--md-sys-color-on-primary)",
        "--button-background-color": "var(--md-sys-color-primary)",
        "--outline-color": "var(--md-sys-color-primary)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    elevated_secondary: {
        "--button-text-color": "var(--md-sys-color-on-secondary)",
        "--button-background-color": "var(--md-sys-color-secondary)",
        "--outline-color": "var(--md-sys-color-secondary)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    elevated_tertiary: {
        "--button-text-color": "var(--md-sys-color-on-tertiary)",
        "--button-background-color": "var(--md-sys-color-tertiary)",
        "--outline-color": "var(--md-sys-color-tertiary)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    elevated_error: {
        "--button-text-color": "var(--md-sys-color-on-error)",
        "--button-background-color": "var(--md-sys-color-error)",
        "--outline-color": "var(--md-sys-color-error)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    elevated_success: {
        "--button-text-color": "var(--md-sys-color-on-success)",
        "--button-background-color": "var(--md-sys-color-success)",
        "--outline-color": "var(--md-sys-color-success)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    elevated_warning: {
        "--button-text-color": "var(--md-sys-color-on-warning)",
        "--button-background-color": "var(--md-sys-color-warning)",
        "--outline-color": "var(--md-sys-color-warning)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    elevated_info: {
        "--button-text-color": "var(--md-sys-color-on-info)",
        "--button-background-color": "var(--md-sys-color-info)",
        "--outline-color": "var(--md-sys-color-info)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    filled: {
        "--button-text-color": "var(--md-sys-color-on-background)",
        "--button-background-color": "var(--md-sys-color-background)",
        "--outline-color": "var(--md-sys-color-background)",
    },
    filled_primary: {
        "--button-text-color": "var(--md-sys-color-on-primary)",
        "--button-background-color": "var(--md-sys-color-primary)",
        "--outline-color": "var(--md-sys-color-primary)",
    },
    filled_secondary: {
        "--button-text-color": "var(--md-sys-color-on-secondary)",
        "--button-background-color": "var(--md-sys-color-secondary)",
        "--outline-color": "var(--md-sys-color-secondary)",
    },
    filled_tertiary: {
        "--button-text-color": "var(--md-sys-color-on-tertiary)",
        "--button-background-color": "var(--md-sys-color-tertiary)",
        "--outline-color": "var(--md-sys-color-tertiary)",
    },
    filled_error: {
        "--button-text-color": "var(--md-sys-color-on-error)",
        "--button-background-color": "var(--md-sys-color-error)",
        "--outline-color": "var(--md-sys-color-error)",
    },
    filled_success: {
        "--button-text-color": "var(--md-sys-color-on-success)",
        "--button-background-color": "var(--md-sys-color-success)",
        "--outline-color": "var(--md-sys-color-success)",
    },
    filled_warning: {
        "--button-text-color": "var(--md-sys-color-on-warning)",
        "--button-background-color": "var(--md-sys-color-warning)",
        "--outline-color": "var(--md-sys-color-warning)",
    },
    filled_info: {
        "--button-text-color": "var(--md-sys-color-on-info)",
        "--button-background-color": "var(--md-sys-color-info)",
        "--outline-color": "var(--md-sys-color-info)",
    },
    filled_tonal: {
        "--button-text-color": "var(--md-sys-color-on-surface-container)",
        "--button-background-color": "var(--md-sys-color-surface-container)",
        "--outline-color": "var(--md-sys-color-surface-container)",
    },
    filled_tonal_primary: {
        "--button-text-color": "var(--md-sys-color-on-primary-container)",
        "--button-background-color": "var(--md-sys-color-primary-container)",
        "--outline-color": "var(--md-sys-color-primary-container)",
    },
    filled_tonal_secondary: {
        "--button-text-color": "var(--md-sys-color-on-secondary-container)",
        "--button-background-color": "var(--md-sys-color-secondary-container)",
        "--outline-color": "var(--md-sys-color-secondary-container)",
    },
    filled_tonal_tertiary: {
        "--button-text-color": "var(--md-sys-color-on-tertiary-container)",
        "--button-background-color": "var(--md-sys-color-tertiary-container)",
        "--outline-color": "var(--md-sys-color-tertiary-container)",
    },
    filled_tonal_error: {
        "--button-text-color": "var(--md-sys-color-on-error-container)",
        "--button-background-color": "var(--md-sys-color-error-container)",
        "--outline-color": "var(--md-sys-color-error-container)",
    },
    filled_tonal_success: {
        "--button-text-color": "var(--md-sys-color-on-success-container)",
        "--button-background-color": "var(--md-sys-color-success-container)",
        "--outline-color": "var(--md-sys-color-success-container)",
    },
    filled_tonal_warning: {
        "--button-text-color": "var(--md-sys-color-on-warning-container)",
        "--button-background-color": "var(--md-sys-color-warning-container)",
        "--outline-color": "var(--md-sys-color-warning-container)",
    },
    filled_tonal_info: {
        "--button-text-color": "var(--md-sys-color-on-info-container)",
        "--button-background-color": "var(--md-sys-color-info-container)",
        "--outline-color": "var(--md-sys-color-info-container)",
    },
    outlined: {
        "--button-text-color": "var(--md-sys-color-on-background)",
        "--button-background-color": "transparent",
        "--border-width": "1px",
        "--icon-margin": "15px",
        "--outline-color": "var(--md-sys-color-background)",
    },
    outlined_primary: {
        "--button-text-color": "var(--md-sys-color-primary)",
        "--button-background-color": "transparent",
        "--border-width": "1px",
        "--outline-color": "var(--md-sys-color-primary)",
    },
    outlined_secondary: {
        "--button-text-color": "var(--md-sys-color-secondary)",
        "--button-background-color": "transparent",
        "--border-width": "1px",
        "--outline-color": "var(--md-sys-color-secondary)",
    },
    outlined_tertiary: {
        "--button-text-color": "var(--md-sys-color-tertiary)",
        "--button-background-color": "transparent",
        "--border-width": "1px",
        "--outline-color": "var(--md-sys-color-tertiary)",
    },
    outlined_error: {
        "--button-text-color": "var(--md-sys-color-error)",
        "--button-background-color": "transparent",
        "--border-width": "1px",
        "--outline-color": "var(--md-sys-color-error)",
    },
    outlined_success: {
        "--button-text-color": "var(--md-sys-color-success)",
        "--button-background-color": "transparent",
        "--border-width": "1px",
        "--outline-color": "var(--md-sys-color-success)",
    },
    outlined_warning: {
        "--button-text-color": "var(--md-sys-color-warning)",
        "--button-background-color": "transparent",
        "--border-width": "1px",
        "--outline-color": "var(--md-sys-color-warning)",
    },
    outlined_info: {
        "--button-text-color": "var(--md-sys-color-info)",
        "--button-background-color": "transparent",
        "--border-width": "1px",
        "--outline-color": "var(--md-sys-color-info)",
    },
    disabled: {
        pointerEvents: "none",
        opacity: 0.24,
        "--button-text-color": "var(--md-sys-color-on-background)",
        "--button-background-color": "var(--md-sys-color-background)",
        "--outline-color": "var(--md-sys-color-background)",
    },
    disabled__text: {
        pointerEvents: "none",
        opacity: 0.24,
        "--button-text-color": "var(--md-sys-color-on-background)",
        "--button-background-color": "transparent",
        "--outline-color": "var(--md-sys-color-background)",
    },
    disabled__filled: {
        pointerEvents: "none",
        opacity: 0.24,
        "--button-text-color": "var(--md-sys-color-background)",
        "--button-background-color": "var(--md-sys-color-on-background)",
        "--outline-color": "var(--md-sys-color-background)",
    },
    disabled__outlined: {
        pointerEvents: "none",
        opacity: 0.24,
        "--button-text-color": "var(--md-sys-color-on-background)",
        "--button-background-color": "transparent",
        "--outline-color": "var(--md-sys-color-background)",
    },
    disabled__filled_tonal: {
        pointerEvents: "none",
        opacity: 0.24,
        "--button-text-color": "var(--md-sys-color-on-surface)",
        "--button-background-color": "var(--md-sys-color-surface-container)",
        "--outline-color": "var(--md-sys-color-surface-container)",
    },
    disabled__elevated: {
        pointerEvents: "none",
        opacity: 0.24,
        "--button-text-color": "var(--md-sys-color-on-background)",
        "--button-background-color": "var(--md-sys-color-background)",
        "--outline-color": "var(--md-sys-color-background)",
    },
});

const Button = forwardRef(function Button (props: ButtonProps, ref: React.Ref<{ current: HTMLButtonElement | null }>) {
    const { 
        children, 
        leading, trailing, 
        buttonStyle = "text", 
        theme = "primary", 
        size = "medium", 
        shrink,
        styleXStyles,
        disabled,
        onClick,
        ...rest } = props;

    const localRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => ({
        current: localRef.current,
    }), [localRef]);

    return (
        <button 
            aria-disabled={disabled}
            onClick={!disabled || props["aria-disabled"] === "false" ? onClick : undefined}
            {...stylex.props(style.button, 
            buttonStyle !== "text" && style[`${buttonStyle}`],
            style[`${buttonStyle}_${theme}`], 
            style[`button__${size}`],
            styleXStyles,
            shrink && style.button__shrink,
            disabled && (style.disabled, style[`disabled__${buttonStyle}`])
        )} {...rest} ref={localRef}>
            <Ripple 
            parentRef={localRef}
            buttonStyle={buttonStyle}
            theme={theme}
            rippleWithKeyDown={["Enter", " "]}
            disabled={disabled}
            />
                {leading && 
                    <span 
                        {...stylex.props(
                            style[`icon${buttonStyle === "outlined" ? "__outlined" : ""}`],
                            style.leading,
                            shrink && style[`icon__shrink__${size}${buttonStyle === "outlined" ? "__outlined" : ""}`]
                        )}
                >
                    {leading}
                </span>}
                {children && 
                    <span {...stylex.props(
                        style.centerSection,
                        shrink ? style.centerSection__shrink : {},
                        leading 
                            ? (buttonStyle === "outlined" 
                                ? style.centerSection__withLeading__outlined 
                                : style.centerSection__withLeading) 
                            : {},
                        trailing 
                            ? (buttonStyle === "outlined" 
                                ? style.centerSection__withTrailing__outlined 
                                : style.centerSection__withTrailing)
                            : {},
                    )}>
                        <span {...stylex.props(style.mainText)}>
                            <CJKBottomOffset>
                                {children}
                            </CJKBottomOffset>
                        </span>
                    </span> 
                }
                {trailing && 
                    <span 
                        {...stylex.props(
                            style[`icon${buttonStyle === "outlined" ? "__outlined" : ""}`],
                            style.trailing, 
                            shrink && style[`icon__shrink__${size}${buttonStyle === "outlined" ? "__outlined" : ""}`]
                        )}
                    >
                    {trailing}
                </span>}
        </button>
    );
});

export default Button;