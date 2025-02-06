import { useState, useRef, useEffect, useCallback } from "react";
import * as stylex from "@stylexjs/stylex"
import type { Theme } from "../../types/theme";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: boolean;
    helperText?: string;
    styleXStyles?: stylex.StyleXStyles;
    defaultValue?: string;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    theme?: Theme | "default";
    styleType?: "filled" | "outlined";
    onSave?: (value: string) => void;
}

const style = stylex.create({
    base: {
        display: "inline-flex",
        boxSizing: "border-box",
        padding: "0 8px",
        height: "24px",
        borderRadius: "8px",
        backgroundColor: "var(--input-background, --md-sys-color-surface-variant)",
        border: "1px solid var(--input-color, --md-sys-color-on-surface-variant)",
        cursor: "text",
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
        border: "0",
        padding: "0",
        margin: "0",
        width: "100%",
        height: "100%",
        fontSize: "inherit",
        color: "inherit",
        fontWeight: "inherit",
        fontFamily: "inherit",
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
        justifyContent: "center",
    },
    trailing: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
})

const Input = ({
    label, 
    error, 
    helperText, 
    styleXStyles, 
    id, 
    defaultValue, 
    leading, 
    trailing, 
    styleType = "outlined", 
    onSave, 
    ...props
}: InputProps) => {
    // const { onChange } = props;
    const [forcused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [text, setText] = useState(defaultValue);
    const timeOutRef = useRef<number | null>(null);
    useEffect(() => {
        setText(defaultValue);
    }, [defaultValue]);
    const handleFocus = () => {
        inputRef.current?.focus();
        setFocused(true);
    };
    const handleBlur = () => {
        setFocused(false);
    };
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setText(value);

        if (timeOutRef.current) {
            clearTimeout(timeOutRef.current);
        }
        timeOutRef.current = self.setTimeout(() => {
            if (onSave) {
                onSave(value);
            }
        }, 1000);
        return () => {
            if (timeOutRef.current) {
                clearTimeout(timeOutRef.current);
            }
        }
    }, [onSave]);
    return (
        <div {...stylex.props(style.base, styleXStyles, style[`base__${styleType}`], forcused && style.base__focused)}
          onClick={handleFocus}
        >
            {leading && <div {...stylex.props(style.leading)}>{leading}</div>}
            {label && <label>{label}</label>}
            <input
                type="text"
                id={id}
                onChange={handleChange}
                {...props}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...stylex.props(style.input)}
                ref={inputRef}
                value={text}
            />
            {trailing && <div {...stylex.props(style.trailing)}>{trailing}</div>}
            {helperText && <p>{helperText}</p>}
            {error && <p>Error</p>}
        </div>
    );
}

export default Input;