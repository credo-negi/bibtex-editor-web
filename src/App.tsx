// input type=file で，Bibtexファイルを読み込む
// ファイルの中身をパースして，オブジェクトの配列に格納する
// それを表示する
import * as stylex from "@stylexjs/stylex"
import BibTeXEditor from "./components/BibTeXEditor/BibTeXEditor"
import { useBibTeXData } from "./context/BibTeXDataContext"
import { useDesignSkin } from "./context/DesignSkinContext"
import TopHeader from "./components/TopHeader"
import IconButton from "./components/IconButton"
import SideBar, { useSideBar } from "./components/SideBar"
import { useCallback, useState } from "react"

const style = stylex.create({
    app: {
        backgroundColor: "var(--md-sys-color-background)",
        color: "var(--md-sys-color-on-background)",
        fontFamily: "Roboto, Noto Sans JP, sans-serif",
        height: "100dvh",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        gridTemplateColumns: "auto 1fr",
        gap: {
            default: "16px",
            "@media (max-width: 768px)": "0px",
            "@media (max-height: 440px)": "0px",
        },
        boxSizing: "border-box",
    },
    heroSection: {
        gridColumn: "1 / 3",
    },
    sideBar: {
    },
    contentSection: {
        gridColumn: "2 / 3",
        height: "100%",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "1fr",
        gap: "16px",
        paddingRight: {
            default: "16px",
            "@media (max-width: 768px)": "0px",
            "@media (max-height: 440px)": "0px",
        },
        paddingBottom: {
            default: "16px",
            "@media (max-width: 768px)": "0px",
            "@media (max-height: 440px)": "0px",
        }
    },
    contentHeader__primarySection: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "8px",
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    contentHeader__secondarySection: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "8px",
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    content: {
        backgroundColor: "var(--md-sys-color-surface-container-lowest)",
        color: "var(--md-sys-color-on-surface)",
        borderRadius: {
            default: "16px",
            "@media (max-width: 768px)": "16px 16px 0px 0px",
        },
        height: "100%",
        overflow: "hidden",
    },
    scrim: {
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        width: "100dvw",
        height: "100dvh",
        backgroundColor: "var(--md-sys-color-on-background)",
        zIndex: 999,
        opacity: 0,
        transition: "opacity 250ms",
        pointerEvents: "none",
    },
    scrim__open: {
        opacity: 0.48,
        pointerEvents: "auto",
    },
})

const App = () => {
    const { colorScheme, setColorScheme, screen } = useDesignSkin()
    const { fileName } = useBibTeXData()
    const [pointerEnterSideBar, setPointerEnterSideBar] = useState(false)
    const { sideBarOpen, setSideBarOpen, sideBarState } = useSideBar()
    const handleClickColorScheme = () => {
        setColorScheme(colorScheme === "light" ? "dark" : "light")
    }

    const handleClickSideBar = () => {
        setSideBarOpen(!sideBarOpen)
    }
    const handleMouseEnterSideBar = useCallback(() => {
        if (!sideBarOpen) {
            setPointerEnterSideBar(true)
            setSideBarOpen(true)
        } else {
            setPointerEnterSideBar(false)
        }
    }, [sideBarOpen, setSideBarOpen])
    const handleMouseLeaveSideBar = useCallback(() => {
        if (!pointerEnterSideBar) return;
        setSideBarOpen(false)
    }, [pointerEnterSideBar, setSideBarOpen])

    const handleScrimClick = () => {
        setSideBarOpen(false);
    }
    return (
        <div {...stylex.props(style.app)}>
            <TopHeader styleXStyles={style.heroSection}>
                <IconButton onClick={handleClickSideBar}>
                    {sideBarOpen
                        ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M120-240v-80h520v80H120Zm664-40L584-480l200-200 56 56-144 144 144 144-56 56ZM120-440v-80h400v80H120Zm0-200v-80h520v80H120Z" /></svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>}
                </IconButton>
                <p>
                    {(fileName && fileName !== "") ? fileName : "BibTeX Editor"}
                </p>
                <IconButton onClick={handleClickColorScheme}>
                    {colorScheme === "light"
                        ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z" /></svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z" /></svg>
                    }
                </IconButton>
            </TopHeader>
            <SideBar
                styleXStyles={style.sideBar}
                onMouseEnter={handleMouseEnterSideBar}
                onMouseLeave={handleMouseLeaveSideBar}
            />
            {screen !== "desktop" &&
                <div {...stylex.props(
                    style.scrim,
                    sideBarState.startsWith('open') && style.scrim__open
                )}
                    aria-hidden={!sideBarOpen}
                    onClick={handleScrimClick}
                ></div>
            }
            <section {...stylex.props(style.contentSection)}>
                <BibTeXEditor styleXStyles={style.content} />
            </section>
        </div>
    )
}

export default App
