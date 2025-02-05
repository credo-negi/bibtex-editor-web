import * as stylex from "@stylexjs/stylex";

export interface BottomBarProps {
    children: React.ReactNode;
    styleXStyles?: stylex.StyleXStyles;
}

const style = stylex.create({
    base: {
        position: "fixed",
        bottom: 0,
        zIndex: 100,
        width: "100%",
        height: "64px",
        backgroundColor: "var(--md-sys-color-surface-container)",
    }
});

const BottomBar = ({ children, styleXStyles }: BottomBarProps) => {
    return (
        <section {...stylex.props(style.base, styleXStyles)}>
            {children}
        </section>
    );
}

export default BottomBar;