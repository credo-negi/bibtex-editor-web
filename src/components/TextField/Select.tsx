import { useState, useRef } from "react";
import * as stylex from "@stylexjs/stylex";
import type { Theme } from "../../types/theme";

interface SelectProps {
    options: string[];
    id: string;
    label?: string;
    error?: boolean;
    helperText?: string;
    styleXStyles?: stylex.StyleXStyles;
    value?: string;
    defalueValue?: string;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    theme?: Theme | "default";
    styleType?: "filled" | "outlined";
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const style = stylex.create({
    base: {
        display: "inline-flex",
        boxSizing: "border-box",
        height: "24px",
        borderRadius: "8px",
        padding: "0 8px",
        backgroundColor: "var(--input-background, --md-sys-color-surface-variant)",
        border: "1px solid var(--input-color, --md-sys-color-on-surface-variant)",
        cursor: "pointer",
        color: "var(--input-color, --md-sys-color-on-surface-variant)",
        "--input-color": "var(--md-sys-color-on-surface)",
        ":hover": {
            "--input-color": "var(--md-sys-color-primary)",
            "--input-background": "var(--md-sys-color-surface)",
        },
    },
    base__filled: {
        border: "none",
    },
    base__outlined: {
    },
    base__focused: {
        "--input-color": "var(--md-sys-color-primary)",
        "--input-background": "var(--md-sys-color-surface)",
    },
    input: {
        backgroundColor: "transparent",
        position: "relative",
        appearance: "none",
        border: "0",
        margin: "0",
        width: "100%",
        height: "100%",
        fontSize: "inherit",
        color: "inherit",
        fontWeight: "inherit",
        fontFamily: "inherit",
        // 下向き三角形を右側に表示
        "::after": {
            content: "'\\25BC'",
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "var(--input-color, --md-sys-color-on-surface-variant)",
        },
        "::placeholder": {
            opacity: 0.5,
        },
        ":focus": {
            outline: "none",
        },
    },
    leading: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    trailing: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fill: "var(--input-color, --md-sys-color-on-surface-variant)",
    },
});

const Select = ({
    options,
    id,
    label,
    error,
    helperText,
    styleXStyles,
    value,
    leading,
    // trailing のデフォルトは下向きの三角
    trailing,
    theme,
    styleType = "outlined",
    ...props
}: SelectProps) => {
    const [focused, setFocused] = useState(false);
    const selectRef = useRef<HTMLSelectElement>(null);
    const handleBaseClick = () => {
        // クリックして展開
        selectRef.current?.focus();
    }

    return (
        <span {...stylex.props(
            style.base, 
            style[`base__${styleType}`], 
            focused && style.base__focused, 
            styleXStyles,
            theme === "default" && style.base__filled,
            )}
            onClick={handleBaseClick}
        >
            {leading && <div {...stylex.props(style.leading)}>{leading}</div>}
            {label && <label>{label}</label>}
            <select
                id={id}
                {...props}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                {...stylex.props(style.input)}
                value={value}
                ref={selectRef}
            >
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            {trailing && <div {...stylex.props(style.trailing)}>{trailing}</div>}
            {error && <p>{error}</p>}
            {helperText && <p>{helperText}</p>}
        </span>
    );
};

export default Select;