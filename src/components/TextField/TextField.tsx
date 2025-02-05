import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    type?: "textarea";
    id: string;
    label?: string;
    error?: string;
    helperText?: string;
    styleXStyles?: StyleXStyles;
    defaultValue?: string;
    onSave?: (value: string) => void;
}

type InputProps = React.ComponentPropsWithoutRef<'input'> & {
    type?: "text" | "password" | "email" | "number" | "tel" | "url" | "search" | "date" | "time" | "datetime-local" | "month" | "week" | "color" | "file";
    id: string;
    label?: string;
    error?: string;
    helperText?: string;
    styleXStyles?: StyleXStyles;
    defaultValue?: string;
    onSave?: (value: string) => void;
}

const style = stylex.create({
    base: {
        display: "inline-flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: "var(--md-sys-color-surface-container)",
        borderRadius: "4px 4px 0 0",
        minHeight: "48px",
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
        padding: "calc(1em + 8px) 16px 8px 16px",
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
        translate: "0 1rem",
        fontSize: "inherit",
        transition: "all 150ms",
        transformOrigin: "top left",
    },
    label_focused: {
        translate: "0 calc(8px * 3 / 4)",
        scale: "0.75",
        color: "var(--md-sys-color-primary)",
    },
    indicator: {
        position: "absolute",
        bottom: "0",
        left: "0",
        width: "100%",
        height: "3px",
        backgroundColor: "var(--md-sys-color-on-surface)",
        transform: "scaleY(0.33)",
        transformOrigin: "bottom center",
        transition: "transform 75ms, background-color 75ms",
        zIndex: 2,
    },
    indicator_focused: {
        transform: "scaleY(1)",
        backgroundColor: "var(--md-sys-color-primary)",
    },
});

const TextField = (props: TextAreaProps | InputProps) => {
    const { label, error, helperText, styleXStyles, id, defaultValue, type, onSave, ...etc } = props;
    const rest = (type === "textarea" ? etc as React.TextareaHTMLAttributes<HTMLTextAreaElement> : etc as React.ComponentPropsWithoutRef<'input'>);
    const { onChange } = rest;
    
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [text, setText] = useState(defaultValue);
    const timeOutRef = useRef<number | null>(null);
    useEffect(() => {
        setText(defaultValue);
    }, [defaultValue]);
    const handleFocus = () => {
        textAreaRef.current?.focus();
        inputRef.current?.focus();
        setFocused(true);
    };
    const handleBlur = () => {
        setFocused(false);
    };
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setText(value);
        // onChangeの引数の型を確認
        if (onChange) {
            onChange(e as React.ChangeEvent<HTMLInputElement> & React.ChangeEvent<HTMLTextAreaElement>);
        }

        if (timeOutRef.current) {
            clearTimeout(timeOutRef.current);
        }
        timeOutRef.current = setTimeout(() => {
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
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setText(value);

        if (onChange) {
            onChange(e as React.ChangeEvent<HTMLInputElement> & React.ChangeEvent<HTMLTextAreaElement>);
        }

        if (timeOutRef.current) {
            clearTimeout(timeOutRef.current);
        }
        timeOutRef.current = setTimeout(() => {
            if (onSave) {
                onSave(value);
            }
        }, 1000);
        return () => {
            if (timeOutRef.current) {
                clearTimeout(timeOutRef.current);
            }
        }
    }
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
            {type === "textarea" 
            ? <textarea
                id={id}
                value={text}
                onChange={handleTextAreaChange}
                {...etc as React.ComponentPropsWithoutRef<'textarea'>}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...stylex.props(style.textarea)}
                ref={textAreaRef}
            />
            : <input
                type={type}
                id={id}
                value={text}
                onChange={handleChange}
                {...etc as React.ComponentPropsWithoutRef<'input'>}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...stylex.props(style.textarea)}
                ref={inputRef}
            /> }
            <div {...stylex.props(style.indicator, focused && style.indicator_focused)} />
            {error && <p>{error}</p>}
            {helperText && <p>{helperText}</p>}
        </div>
    );
}

export default TextField;