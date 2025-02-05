import * as stylex from "@stylexjs/stylex"

interface TopHeaderProps {
    children: React.ReactNode;
    styleXStyles?: stylex.StyleXStyles;
}

const style = stylex.create({
    topHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: {
            default: "64px",
            "@media (max-width: 768px)": "56px",
            "@media (max-height: 440px)": "56px",
        },
        padding: {
            default: "0 8px",
            "@media (max-width: 768px)": "0",
        },
    },
    topHeader__leftSection: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    topHeader__rightSection: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    topHeader__centerSection: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
})

export const TopHeader__leftSection = ({
    children,
    styleXStyles,
}: TopHeaderProps) => {
    return (
        <div {...stylex.props(style.topHeader__leftSection, styleXStyles)}>
            {children}
        </div>
    );
}

export const TopHeader__rightSection = ({
    children,
    styleXStyles,
}: TopHeaderProps) => {
    return (
        <div {...stylex.props(style.topHeader__rightSection, styleXStyles)}>
            {children}
        </div>
    );
}

const TopHeader = ({
    children,
    styleXStyles,
}: TopHeaderProps) => {
    return (
        <header {...stylex.props(style.topHeader, styleXStyles)}>
            {children}
        </header>
    );
}

export default TopHeader;