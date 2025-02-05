import * as stylex from "@stylexjs/stylex";
import { useRef } from "react";
import Ripple from "./Ripple";

interface ListProps extends Exclude<React.HTMLAttributes<HTMLDivElement>, "children"> {
    styleXStyles?: stylex.StaticStyles;
}

interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
    text: string;
    icon?: React.ReactNode;
    focusable?: boolean;
    disabled?: boolean;
    styleXStyles?: stylex.StyleXStyles;
}

const style = stylex.create({
    base: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "360px",
        overflow: "hidden",
        backgroundColor: "var(--md-sys-color-surface-container-lowest)",
    },
    item: {
        display: "flex",
        width: "100%",
        height: "48px",
        padding: "0 16px",
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
        backgroundColor: "var(--md-sys-color-surface-container-lowest)",
        color: "var(--md-sys-color-on-surface)",
        alignItems: "center",
        "-webkit-tap-highlight-color": "transparent",
        borderRadius: "4px",
        userSelect: "none",
        "::before": {
            content: "''",
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "var(--md-sys-color-primary)",
            opacity: 0,
            transition: "opacity 150ms",
            pointerEvents: "none",
            userSelect: "none",
        },
        ":hover": {
            "::before": {
                opacity: 0.12,
            },
        },
    },
    item__disabled: {
        opacity: 0.38,
        cursor: "default",
        ":hover": {
            "::before": {
                opacity: 0,
            },
        },
    },
    item__icon: {
        width: "40px",
        paddingRight: "16px",
        fill: "var(--md-sys-color-on-surface)",
    },
    item__text: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "0.875rem",
    },
});

const Wrapper = ({ children, styleXStyles }: ListProps) => {
    return (
        <div {...stylex.props(style.base, styleXStyles)}>
            {children}
        </div>
    )
}

const Item = ({ 
    text, 
    icon, 
    styleXStyles,
    focusable = true, 
    disabled = false,
    ...rest 
}: ListItemProps) => {
    const ref = useRef<HTMLDivElement>(null);
    return (
        <div 
            {...stylex.props(style.item, styleXStyles, disabled && style.item__disabled)}
            tabIndex={focusable && !disabled ? 0 : undefined}
            ref={ref}
            {...rest}
        >
            <Ripple parentRef={ref} disabled={disabled} />
            {icon && <div {...stylex.props(style.item__icon)}>{icon}</div>}
            <div {...stylex.props(style.item__text)}>{text}</div>
        </div>
    )
}

export const List = {
    Wrapper,
    Item,
};