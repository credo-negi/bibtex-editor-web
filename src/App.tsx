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
    const { screen } = useDesignSkin()
    const { fileName } = useBibTeXData()
    const { sideBarOpen, setSideBarOpen, sideBarState } = useSideBar()

    const handleClickSideBar = () => {
        setSideBarOpen(!sideBarOpen)
    }

    const handleScrimClick = () => {
        setSideBarOpen(false);
    }
    return (
        <div {...stylex.props(style.app)}>
            <TopHeader.root styleXStyles={style.heroSection}>
                <TopHeader.leftSection>
                    <IconButton onClick={handleClickSideBar}>
                        {sideBarOpen
                            ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M120-240v-80h520v80H120Zm664-40L584-480l200-200 56 56-144 144 144 144-56 56ZM120-440v-80h400v80H120Zm0-200v-80h520v80H120Z" /></svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>}
                    </IconButton>
                </TopHeader.leftSection>
                <TopHeader.centerSection>
                    {(fileName && fileName !== "") ? fileName : "BibTeX Editor"}
                </TopHeader.centerSection>
                <TopHeader.rightSection>
                </TopHeader.rightSection>
            </TopHeader.root>
            <SideBar
                styleXStyles={style.sideBar}
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
