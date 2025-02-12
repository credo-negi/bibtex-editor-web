import * as stylex from "@stylexjs/stylex";
import Button from "./Button";
import { useBibTeXData } from "../context/BibTeXDataContext";
import { useDesignSkin } from "../context/DesignSkinContext";
import { useState, useRef, createContext, useContext, useCallback } from "react";
import { DropDownList } from "./DropDownList";

interface SideBarProps extends React.HTMLAttributes<HTMLDivElement> {
    styleXStyles?: stylex.StaticStyles;
}

interface SideBarContextProps {
    sideBarOpen: boolean;
    sideBarState: "closed" | "closing" | "open" | "opening";
    setSideBarOpen: (value: boolean) => void;
    mouseEnterSideBarRef: { current: boolean };
    onMouseEnterSideBar: (event: React.MouseEvent) => void;
}

interface SideBarProviderProps {
    children: React.ReactNode;
}

const SideBarContext = createContext<SideBarContextProps | null>(null);
const SIDEBAR_ANIMATION_DURATION = 250;

export const SideBarProvider = ({ children }: SideBarProviderProps) => {
    const [sideBarOpen, _setSideBarOpen] = useState(false);
    const [sideBarState, setSideBarState] = useState<"closed" | "closing" | "opening" | "open">("closed");
    const mouseEnterSideBarRef = useRef(false);

    const setSideBarOpen = useCallback((value: boolean) => {
        let timer: number;
        if (value) {
            setSideBarState("opening");
            timer = self.setTimeout(() => {
                _setSideBarOpen(value);
                setSideBarState("open");
            }, SIDEBAR_ANIMATION_DURATION);
        } else {
            setSideBarState("closing");
            timer = self.setTimeout(() => {
                _setSideBarOpen(value);
                setSideBarState("closed");
            }, SIDEBAR_ANIMATION_DURATION);
        }
        return () => clearTimeout(timer);
    }, []);

    const onMouseEnterSideBar = useCallback((event: React.MouseEvent) => {
        if (sideBarOpen && !mouseEnterSideBarRef.current) return;
        mouseEnterSideBarRef.current = (event.type === "mouseenter");
        const timer = self.setTimeout(() => {
            if (mouseEnterSideBarRef.current) {
                setSideBarOpen(true);
            } else {
                setSideBarOpen(false);
            }
        }, SIDEBAR_ANIMATION_DURATION);
        return () => clearTimeout(timer);
    }, [sideBarOpen, setSideBarOpen]);

    return (
        <SideBarContext.Provider value={{ sideBarOpen, sideBarState, setSideBarOpen, mouseEnterSideBarRef, onMouseEnterSideBar }}>
            {children}
        </SideBarContext.Provider>
    )
}

export const useSideBar = () => {
    const context = useContext(SideBarContext);
    if (!context) {
        throw new Error("useSideBar must be used within a SideBarProvider");
    }
    return context;
}

const keyframes__opening = stylex.keyframes({
    from: {
        transform: "translateX(0)",
    },
    to: {
        transform: "translateX(256px)",
    },
});

const keyframes__closing = stylex.keyframes({
    from: {
        transform: "translateX(0px)",
    },
    to: {
        transform: "translateX(-256px)",
    },
});


const style = stylex.create({
    base: {
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: {
            default: "unset",
            "@media (max-width: 1024px)": "fixed",
        },
        top: {
            default: "unset",
            "@media (max-width: 1024px)": "0",
        },
        left: {
            default: "unset",
            "@media (max-width: 1024px)": "-256px",
        },
        translate: {
            default: "none",
            "@media (max-width: 1024px)": "0 0",
        },
        width: {
            default: "unset",
            "@media (max-width: 1024px)": "256px",
        },
        minWidth: {
            default: "64px",
            "@media (max-width: 1024px)": "256px",
        },
        maxWidth: {
            default: "64px",
            "@media (max-width: 1024px)": "256px",
        },
        height: "100%",
        backgroundColor: {
            default: "transparent",
            "@media (max-width: 1024px)": "var(--md-sys-color-surface-container)",
        },
        borderRadius: "0 16px 16px 0",
        zIndex: 1000,
        overflowY: "auto",
    },
    base__open: {
        minWidth: "256px",
        maxWidth: "256px",
        left: {
            default: "unset",
            "@media (max-width: 1024px)": "0px",
        },
        translate: "unset",
    },
    base__closed: {
        minWidth: "64px",
        maxWidth: "64px",
        left: {
            default: "unset",
            "@media (max-width: 1024px)": "-256px",
        },
        translate: "unset",
    },
    base__opening: {
        left: {
            default: "unset",
            "@media (max-width: 1024px)": "-256px",
        },
        animation: {
            default: "unset",
            "@media (max-width: 1024px)": `${keyframes__opening} ${SIDEBAR_ANIMATION_DURATION}ms forwards`,
        },
        maxWidth: "256px",
        minWidth: "256px",
        transition: {
            default: `max-width ${SIDEBAR_ANIMATION_DURATION}ms, min-width ${SIDEBAR_ANIMATION_DURATION}ms`,
            "@media (max-width: 1024px)": "none",
        },
    },
    base__closing: {
        left: {
            default: "unset",
            "@media (max-width: 1024px)": "0px",
        },
        animation: {
            default: "unset",
            "@media (max-width: 1024px)": `${keyframes__closing} ${SIDEBAR_ANIMATION_DURATION}ms forwards`,
        },
        transition: {
            default: `min-width ${SIDEBAR_ANIMATION_DURATION}ms`,
            "@media (max-width: 1024px)": "none",
        },
        maxWidth: "64px",
        minWidth: "64px",
    },
    fabContainer: {
        padding: "8px",
        position: "fixed",
    },
    fab: {
        transitionDelay: {
            default: "0",
            "@media (max-width: 1024px)": "0",
        },
    },
    primary__container: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "0%",
        display: "flex",
        flexDirection: "column",
    },
    secondary__container: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "8px",
        borderTop: "1px solid var(--md-sys-color-surface-divider)",
    },

})

const SideBar = ({ styleXStyles, ...rest}: SideBarProps) => {
    const { handleClickToInputBibFile, addBibTeXData } = useBibTeXData();
    const { colorScheme, setColorScheme, contrast, setContrast } = useDesignSkin();
    const { screen } = useDesignSkin();
    const { sideBarState, onMouseEnterSideBar } = useSideBar();
    const FABref = useRef<{ current: HTMLButtonElement | null }>({ current: null });

    const handleClickToAddEmptyBibTeXData = () => {
        addBibTeXData([{
            type: "article",
            citeKey: "",
            fields: {},
        }])
    }

    return (
        <>
            <div 
                {...stylex.props(
                    style.base, 
                    styleXStyles, 
                    style[`base__${sideBarState}`],
                )}
                onMouseEnter={onMouseEnterSideBar}
                onMouseLeave={onMouseEnterSideBar}
                {...rest}
            >
                <section {...stylex.props(style.fabContainer)}>
                    <DropDownList.Root
                        label={({ onClick }) => (
                            <Button 
                                size="fab"
                                theme="primary"
                                buttonStyle="filled"
                                shrink={!sideBarState.startsWith("open") && screen === "desktop"}
                                leading={
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                                }
                                onClick={onClick}
                                ref={FABref}
                            >
                                エントリーを追加
                            </Button>
                        )}
                    >
                        <DropDownList.Item 
                            onClick={handleClickToInputBibFile} 
                            label="BibTeXファイルを追加"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M240-160q-33 0-56.5-23.5T160-240v-80q0-17 11.5-28.5T200-360q17 0 28.5 11.5T240-320v80h480v-80q0-17 11.5-28.5T760-360q17 0 28.5 11.5T800-320v80q0 33-23.5 56.5T720-160H240Zm200-486-75 75q-12 12-28.5 11.5T308-572q-11-12-11.5-28t11.5-28l144-144q6-6 13-8.5t15-2.5q8 0 15 2.5t13 8.5l144 144q12 12 11.5 28T652-572q-12 12-28.5 12.5T595-571l-75-75v286q0 17-11.5 28.5T480-320q-17 0-28.5-11.5T440-360v-286Z"/></svg>
                            }
                        />
                        <DropDownList.Item 
                            onClick={handleClickToAddEmptyBibTeXData} 
                            label="空のエントリーを追加"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M200-200h57l391-391-57-57-391 391v57Zm-40 80q-17 0-28.5-11.5T120-160v-97q0-16 6-30.5t17-25.5l505-504q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L313-143q-11 11-25.5 17t-30.5 6h-97Zm600-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                            }
                        />
                    </DropDownList.Root>
                </section>
                <section {...stylex.props(style.primary__container)}></section>
                <section {...stylex.props(style.secondary__container)}>
                    <Button
                        size="medium"
                        theme="tertiary"
                        buttonStyle="text"
                        shrink={!sideBarState.startsWith("open") && screen === "desktop"}
                        leading={
                            colorScheme === "light" 
                                ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>
                                : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>
                        }
                        onClick={() => setColorScheme(colorScheme === "light" ? "dark" : "light")}
                        shrinkDuration={SIDEBAR_ANIMATION_DURATION}
                    >
                        {colorScheme === "light" ? "ダークモードに変更" : "ライトモードに変更"}
                    </Button>
                    <Button
                        size="medium"
                        theme="tertiary"
                        buttonStyle="text"
                        shrink={!sideBarState.startsWith("open") && screen === "desktop"}
                        leading={
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-83q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z"/></svg>
                        }
                        onClick={() => setContrast(contrast === "high" ? "medium" : "high")}
                        shrinkDuration={SIDEBAR_ANIMATION_DURATION}
                    >
                        {contrast === "high" ? "コントラストを下げる" : "コントラストを上げる"}
                    </Button>
                </section>
            </div>
        </>
    );
}

export default SideBar;