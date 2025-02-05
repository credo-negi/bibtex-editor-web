import { useState, useRef, useEffect, useCallback } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { TextFieldStyle } from '../../types/componentStyle';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    getValue?: (value: string) => void;
    error?: string;
    helperText?: string;
    styleXStyles?: StyleXStyles;
    textFieldStyle?: TextFieldStyle;
    defaultValue?: string;
    onSave?: (value: string) => void;
}

const style = stylex.create({
    base: {
        display: "inline-flex",
        flexDirection: "column",
        gap: "0.5em",
        position: "relative",
        backgroundColor: "var(--md-sys-color-surface-variant)",
        borderBottom: "1px solid var(--md-sys-color-on-surface)",
        borderRadius: "4px 4px 0 0",
        cursor: "text",
        fontSize: "16px",
        overflow: "hidden",
        "::before": {
            content: "''",
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "var(--md-sys-color-on-surface)",
            opacity: 0,
            transition: "opacity 150ms",
            pointerEvents: "none",
        },
        ":hover": {
            "::before": {
                opacity: 0.12,
            },
        },
    },
    textarea: {
        backgroundColor: "transparent",
        fontFamily: "var(--font-family)",
        fontSize: "inherit",
        color: "var(--md-sys-color-on-surface)",
        border: "0",
        padding: "0 16px 8px 16px",
        marginTop: "calc(1em + 8px)",
        resize: "vertical",
        ":focus": {
            outline: "none",
        },
    },
    label: {
        position: "absolute",
        top: "0",
        left: "16px",
        cursor: "text",
        translate: "0 calc(1em + 8px)",
        fontSize: "inherit",
        transition: "all 150ms",
        transformOrigin: "top left",
    },
    label_focused: {
        translate: "0 calc(8px * 3 / 4)",
        scale: "0.75",
        color: "var(--md-sys-color-primary)",
    },
});

const TextArea = ({ label, error, helperText, styleXStyles, id, defaultValue = "", onSave, ...props }: TextAreaProps) => {
    const { ...others } = props;
    const [focused, setFocused] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [text, setText] = useState(defaultValue);
    const timeOutRef = useRef<number | null>(null);
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.value = defaultValue || "";
        }
    }, [defaultValue]);
    const handleFocus = () => {
        textAreaRef.current?.focus();
        setFocused(true);
    };
    const handleBlur = () => {
        setFocused(false);
    };
    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setText(value);
        if (onSave) {
            if (timeOutRef.current) {
                clearTimeout(timeOutRef.current);
            }
            timeOutRef.current = setTimeout(() => {
                onSave(value);
            }, 100);
        }
    }, [onSave]);
    return (
        <div {...stylex.props(style.base, styleXStyles)}
          onClick={handleFocus}
        >
            {label && 
                <label 
                htmlFor={id} 
                {...stylex.props(style.label,
                    (focused || text != "") && style.label_focused
                )}
                >
                    {label}
                </label>
            }
            <textarea
                id={id}
                defaultValue={defaultValue}
                onChange={handleChange}
                {...others}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...stylex.props(style.textarea)}
                ref={textAreaRef}
            />
            {error && <p>{error}</p>}
            {helperText && <p>{helperText}</p>}
        </div>
    );
}

export default TextArea;