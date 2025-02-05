import { useCallback, useEffect, useRef, useState } from "react";
import * as stylex from "@stylexjs/stylex";

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultChecked?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const style = stylex.create({
  base: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    position: "relative",
    userSelect: "none",
    justifyContent: "center",
    overflow: "hidden",
    "-webkit-tap-highlight-color": "transparent",
    "::before": {
      content: "''",
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      backgroundColor: "var(--md-sys-color-primary)",
      opacity: 0,
      transition: "opacity 75ms",
      pointerEvents: "none",
      userSelect: "none",
    },
    ":hover": {
      "::before": {
        opacity: 0.12,
      },
    },
  },
  base__onFocus: {
    "::before": {
      opacity: 0.12,
    },
  },
  base__disabled: {
    cursor: "not-allowed",
    pointerEvents: "none",
    opacity: 0.38,
  },
  checkBox: {
    opacity: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  checkmarkBox: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    boxSizing: "border-box",
    pointerEvents: "none",
    userSelect: "none",
    width: "20px",
    height: "20px",
    margin: "10px",
    border: "2px solid var(--md-sys-color-primary)",
    borderRadius: "4px",
    overflow: "hidden",
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
    },
  },
  checkmarkBox__checked: {
    "::before": {
      transition: "none",
      opacity: 1,
    },
  },
  checkmarkBox__indeterminate: {
    "::before": {
      transition: "none",
      opacity: 1,
    },
  },
  checkmark: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    width: "100%",
    height: "100%",
    color: "var(--md-sys-color-on-primary)",
    strokeDashoffset: 100,
    opacity: 0,
    transition: "opacity 150ms",
    pointerEvents: "none",
  },
  hyphen: {
    position: "absolute",
    top: "50%",
    left: "50%",
    scale: "0 1",
    width: "10px",
    height: "2px",
    backgroundColor: "var(--md-sys-color-on-primary)",
    borderRadius: "2px",
    opacity: 0,
    translate: "-50% -50%",
    transformOrigin: "center",
    transition: "scale 150ms, opacity 150ms",
  },
  hyphen__indeterminate: {
    scale: "1 1",
    opacity: 1,
  },
  checkmark__checked: {
    opacity: 1,
    strokeDashoffset: 0,
    transition: "stroke-dashoffset 1000ms",
  },
});

const CheckBox = ({
  defaultChecked,
  checked,
  indeterminate,
  onChange,
  disabled,
  ...props
}: CheckBoxProps) => {
  const ref = useRef<HTMLLabelElement>(null);
  const checkBoxRef = useRef<HTMLInputElement>(null);
  const [onFocus, setOnFocus] = useState(false);

  useEffect(() => {
    if (checkBoxRef.current) {
      checkBoxRef.current.indeterminate = indeterminate || false;
    }
  }, [indeterminate]);
  // tabキーでフォーカスされたときのスタイル
  const handleFocus = useCallback(() => {
    setOnFocus(true);
  }, []);
  // フォーカスが外れた場合
  const handleBlur = useCallback(() => {
    setOnFocus(false);
  }, []);

  return (
    <label {...stylex.props(
      style.base, 
      onFocus && style.base__onFocus,
      disabled && style.base__disabled
    )}
      ref={ref}
    >
      {/* <Ripple parentRef={ref} /> */}
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={checkBoxRef}
        {...props}
        {...stylex.props(style.checkBox)}
      />
      <span {...stylex.props(style.checkmarkBox, (checked || indeterminate) && style.checkmarkBox__checked)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={100}
          strokeDashoffset={100}
          {...stylex.props(style.checkmark, checked && style.checkmark__checked)}
        >
          <polyline points="4 12 9 17 20 6" />
        </svg>
        <span {...stylex.props(style.hyphen, (indeterminate && !checked) && style.hyphen__indeterminate)}>
        </span>
      </span>
    </label>
  );
}

export default CheckBox;