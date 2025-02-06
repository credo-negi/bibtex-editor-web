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
}

interface SideBarProviderProps {
    children: React.ReactNode;
}

const SideBarContext = createContext<SideBarContextProps | null>(null);

export const SideBarProvider = ({ children }: SideBarProviderProps) => {
    const [sideBarOpen, _setSideBarOpen] = useState(false);
    const [sideBarState, setSideBarState] = useState<"closed" | "closing" | "opening" | "open">("closed");

    const setSideBarOpen = useCallback((value: boolean) => {
        let timer: number;
        if (value) {
            setSideBarState("opening");
            timer = self.setTimeout(() => {
                _setSideBarOpen(value);
                setSideBarState("open");
            }, 250);
        } else {
            setSideBarState("closing");
            timer = self.setTimeout(() => {
                _setSideBarOpen(value);
                setSideBarState("closed");
            }, 250);
        }
        return () => clearTimeout(timer);
    }, []);

    return (
        <SideBarContext.Provider value={{ sideBarOpen, sideBarState, setSideBarOpen }}>
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
        height: "100%",
        backgroundColor: {
            default: "transparent",
            "@media (max-width: 1024px)": "var(--md-sys-color-surface-container)",
        },
        borderRadius: "0 16px 16px 0",
        transition: {
            default: "min-width 250ms",
            "@media (max-width: 1024px)": "none",
        },
        zIndex: 1000,
        overflowY: "auto",
    },
    base__open: {
        minWidth: "256px",
        left: {
            default: "unset",
            "@media (max-width: 1024px)": "0px",
        },
        translate: "unset",
    },
    base__closed: {
        minWidth: "64px",
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
            "@media (max-width: 1024px)": `${keyframes__opening} 250ms forwards`,
        },
        minWidth: "256px",
    },
    base__closing: {
        left: {
            default: "unset",
            "@media (max-width: 1024px)": "0px",
        },
        animation: {
            default: "unset",
            "@media (max-width: 1024px)": `${keyframes__closing} 250ms forwards`,
        }
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

})

const SideBar = ({ styleXStyles, ...rest}: SideBarProps) => {
    const { handleClickToInputBibFile, addBibTeXData } = useBibTeXData();
    const { screen } = useDesignSkin();
    const { sideBarState } = useSideBar();
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
            </div>
        </>
    );
}

export default SideBar;