import * as stylex from "@stylexjs/stylex"
import type { Theme } from '../types/theme';
interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    theme?: Theme;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    button?: boolean;
    size?: "small" | "medium" | "large";
}

const style = stylex.create({
    Chip: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "0 16px",
        borderRadius: "8px",
        height: "32px",
        backgroundColor: "var(--chip-background, --md-sys-color-surface)",
        color: "var(--chip-color, --md-sys-color-on-surface)",
        fontSize: "14px",
    },
    Chip_leadingIcon: {
        width: "18px",
        fill: "var(--chip-color, --md-sys-color-on-surface)",
    },
    Chip_primary: {
        "--chip-background": "var(--md-sys-color-primary-container)",
        "--chip-color": "var(--md-sys-color-on-primary-container)",
    },
    Chip_secondary: {
        "--chip-background": "var(--md-sys-color-secondary-container)",
        "--chip-color": "var(--md-sys-color-on-secondary-container)",
    },
    Chip_tertiary: {
        "--chip-background": "var(--md-sys-color-tertiary-container)",
        "--chip-color": "var(--md-sys-color-on-tertiary-container)",
    },
    Chip_error: {
        "--chip-background": "var(--md-sys-color-error-container)",
        "--chip-color": "var(--md-sys-color-on-error-container)",
    },
    Chip_success: {
        "--chip-background": "var(--md-sys-color-success-container)",
        "--chip-color": "var(--md-sys-color-on-success-container)",
    },
    Chip_warning: {
        "--chip-background": "var(--md-sys-color-warning-container)",
        "--chip-color": "var(--md-sys-color-on-warning-container)",
    },
    Chip_info: {
        "--chip-background": "var(--md-sys-color-info-container)",
        "--chip-color": "var(--md-sys-color-on-info-container)",
    },
    Chip_small: {
        height: "24px",
    },
    Chip_medium: {
        height: "32px",
    },
    Chip_large: {
        height: "40px",
    },
});

const Chip = ({
    children,
    theme = 'primary',
    leadingIcon,
    trailingIcon,
    button = false,
    size = "medium",
    ...props
}: ChipProps) => {
    return (
        button 
            ? <div {...stylex.props(style.Chip, style[`Chip_${theme}`], style[`Chip_${size}`])} {...props}>
                {leadingIcon
                    ? <div {...stylex.props(style.Chip_leadingIcon)}>{leadingIcon}</div>
                    : null
                }
                <div>{children}</div>
                {trailingIcon
                    ? <div>{trailingIcon}</div>
                    : null
                }
            </div>
            : <div {...stylex.props(style.Chip, style[`Chip_${theme}`], style[`Chip_${size}`])} {...props}>
                {leadingIcon
                    ? <div {...stylex.props(style.Chip_leadingIcon)}>{leadingIcon}</div>
                    : null
                }
                <div>{children}</div>
                {trailingIcon
                    ? <div>{trailingIcon}</div>
                    : null
                }
            </div>
    );
}

export default Chip;