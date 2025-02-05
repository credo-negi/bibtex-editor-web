import { ToastState, useToast } from "../context/ToastContext";
import * as stylex from "@stylexjs/stylex"
import Button from "./Button";


const enterToast = stylex.keyframes({
    from: {
        translate: "0 calc(100% + 16px)",
        opacity: 0,
    },
    to: {
        translate: "0 0",
        opacity: 1,
    },
});
const exitToast = stylex.keyframes({
    from: {
        translate: "0 0",
        opacity: 1,
    },
    to: {
        translate: "0 calc(100% + 16px)",
        opacity: 0,
    },
});
const style = stylex.create({
    toastContainer: {
        position: "fixed",
        left: "8px",
        bottom: "0",
        width: "min(480px, calc(100% - 16px))",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        pointerEvents: "none",
        zIndex: 1000,
    },
    toast: {
        padding: "0 16px",
        minHeight: "48px",
        backgroundColor: "#333",
        color: "#fff",
        borderRadius: "8px",
        boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        pointerEvents: "auto",
    },
    toast_success: {
        backgroundColor: "var(--md-sys-color-success-container)",
        color: "var(--md-sys-color-on-success-container)",
    },
    toast_error: {
        backgroundColor: "var(--md-sys-color-error-container)",
        color: "var(--md-sys-color-on-error-container)",
    },
    toast_warning: {
        backgroundColor: "var(--md-sys-color-warning-container)",
        color: "var(--md-sys-color-on-warning-container)",
    },
    toast_info: {
        backgroundColor: "var(--md-sys-color-info-container)",
        color: "var(--md-sys-color-on-info-container)",
    },
    toast_entering: {
        animation: `${enterToast} 250ms forwards`,
        animationTimingFunction: "var(--transition-ease-out-back)",
    },
    toast_exitting: {
        animation: `${exitToast} 250ms ease forwards`,
        animationTimingFunction: "var(--transition-ease-in-back)",
    },

});

const Toast = () => {
    const { messages, removeMessage } = useToast()

    return (
        messages && <div {...stylex.props(style.toastContainer)}>
        {messages && messages.map((msg, index) => (
            <div key={index} {
                ...stylex.props(style.toast, style[`toast_${msg.type}`], 
                (msg.state === ToastState.EXITTING 
                    ? style.toast_exitting 
                    : (msg.state != ToastState.ENTERED 
                    ? style.toast_entering : {})
                ))}>
                <div>
                    {msg.text}
                </div>
                <Button onClick={() => removeMessage(msg.id)} size="small" theme={msg.type}>
                    Close
                </Button>
            </div>
        ))}
        </div>
    );
};

export default Toast;
