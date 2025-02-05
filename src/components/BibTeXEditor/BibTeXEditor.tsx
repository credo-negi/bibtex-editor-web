import { useCallback, useState } from "react";
import { useToast, ToastType, ToastState } from "../../context/ToastContext";
import { useBibTeXData } from "../../context/BibTeXDataContext";
import { useDesignSkin } from "../../context/DesignSkinContext";
import BibTeXEditorList from "./BibTeXEditorList";
import * as stylex from "@stylexjs/stylex";
import { BibTeXObject } from "../../types/BibTeXTypes";
import BibTeXParser from "../../BibTeXParser/BibTeXParser";
import Button from "../Button";
import BibTeXEditor__EditorSection from "./BibTeXEditor__EditorSection";
import CheckBox from "../CheckBox";
import Tooltip from "../Tooltip";
import { DropDownList } from "../DropDownList";

export interface BibTeXEditorProps {
    styleXStyles?: stylex.StyleXStyles
}

const style = stylex.create({
    BibTeXEditor: {
        borderRadius: "16px",
        minHeight: "100%",
        position: "relative",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        gridTemplateColumns: "100% 0",
        transition: "grid-template-columns 250ms var(--transition-ease-out-expo)",
    },
    BibTeXEditor__header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        height: "48px",
        borderBottom: "1px solid var(--md-sys-color-background)",
        gridColumn: "1 / 3",
    },
    BibTeXEditor__header__primarySection: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        fontSize: "0.875rem",
    },
    BibTeXEditor__header__selectAll: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
        gap: "8px",
    },
    BibTeXEditor__history_controller: {
        display: "flex",
        gap: "8px",
    },
    BibTeXEditor__header__ButtonList: {
        display: "flex",
        gap: "8px",
        justifyContent: "flex-end",
    },
    BibTeXEditor__EditorOpen: {
        gridTemplateColumns: "50% 50%",
    },
    BibTeXEditor_BibTeXEditorListWrapper: {
        height: "100%",
        overflowY: "auto",
    },
    BibTeXEditor_DragoverIndicator: {
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        pointerEvents: "none",
        backgroundColor: "var(--md-sys-color-on-surface)",
        opacity: 0,
        transition: "opacity 150ms",
        userSelect: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.5em",
        color: "var(--md-sys-color-surface)",
    },
    BibTeXEditor_DragoverIndicator__dragover: {
        opacity: 0.48,
    },
    BibTeXEditor_AddEntriesBox: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "100%",
        padding: "16px",
        position: "relative",
        overflow: "hidden",
        gridRow: "2 / 3",
    },
    BibTeXEditor_AddEntriesBox__PrimaryText: {
        fontSize: "1.5em",
    },
    BibTeXEditor_AddEntriesBox__ButtonList: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
    },
    word: {
        display: "inline-block",
    }
});

const BibTeXEditor = ({ styleXStyles, ...props }: BibTeXEditorProps) => {
    const { 
        BibTeXData, 
        setBibTeXData, 
        addBibTeXData, 
        removeBibTeXData, 
        isOpenIndex, 
        editorState, 
        handleClickToInputBibFile, 
        setFileName, 
        exportBibTeXFile,
        history,
        undo,
        redo,
    } = useBibTeXData();
    const { nextId, addMessage } = useToast();
    const { screen } = useDesignSkin();
    const [dragOver, setDragOver] = useState(false);
    // selected: BibTeXDataのうちselected: trueとなっている要素のインデックスを格納
    const selected = BibTeXData ? BibTeXData.reduce((acc: number[], item, index) => {
        if (item.selected) {
            acc.push(index);
        }
        return acc;
    }, []) : null;
    const handleSelectAll = useCallback(() => {
        if (selected === null || selected.length < BibTeXData.length) {
            setBibTeXData(BibTeXData.map((item) => ({ ...item, selected: true })), false);
        } else {
            setBibTeXData(BibTeXData.map((item) => ({ ...item, selected: false })), false);
        }
    }, [selected, BibTeXData, setBibTeXData]);

    const parseBibTeX = useCallback((input: string): BibTeXObject[] => {
        const myBibTeXParser = new BibTeXParser(input);
        const items = myBibTeXParser.parse();
        return items;
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        const reader = new FileReader();
        setFileName("loading...");
        reader.onload = (e) => {
            setFileName("");
            const result = e.target?.result as string;
            try {
                const items = parseBibTeX(result);
                if (items.length < 1) {
                    throw new Error("BibTeXファイルの読み込みに失敗しました");
                }
                addBibTeXData(items);
                addMessage({ type: ToastType.SUCCESS, text: "BibTeXファイルの読み込みに成功しました", id: nextId, state: ToastState.NONE });

            } catch (error) {
                const message = error || "BibTeXファイルの読み込みに失敗しました";
                addMessage({ type: ToastType.ERROR, text: `${message}`, id: nextId, state: ToastState.NONE });
            }
        };
        reader.readAsText(file);
    }, [parseBibTeX, addBibTeXData, addMessage, nextId, setFileName]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    }, []);
    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const handleClickDeleteButton = useCallback(() => {
        if (selected !== null && selected.length > 0) {
            removeBibTeXData(selected);
        }
    }, [selected, removeBibTeXData]);

    const handleClickExportButton = useCallback(() => {
        if (selected === null || selected.length < 1) {
            return;
        }
        exportBibTeXFile(selected);
    }, [selected, exportBibTeXFile]);

    const handleClickBracedValuesButton = useCallback(() => {
        if (selected === null || selected.length < 1) {
            return;
        }
        const newBibTeXData = BibTeXData.map((item, index) => {
            if (selected.includes(index) && "fields" in item) {
                return {
                    ...item,
                    fields: Object.keys(item.fields).reduce((acc, key) => {
                        // key が人名や地名，年月日などの場合，そのまま追加
                        if (key.match(/^(author|editor|publisher|institution|school|address|organization|month|year|day|volume|number|pages|chapter|edition|series)$/)) {
                            acc[key] = item.fields[key];
                            return acc;
                        }
                        // item.fields[key]のうち，中かっこで囲まれていない大文字を中かっこで囲む
                        const before = item.fields[key];
                        let value = "";
                        let braceFlag = false;
                        let eqFlag = false;
                        let bkSlashFlag = false;
                        for (const char of before) {
                            // 数式環境の場合，eqFlagを立てて，その間は中かっこを追加しない
                            if (char.match(/\$/)) {
                                eqFlag = !eqFlag;
                            }
                            // バックスラッシュがある場合，bkSlashを立てて，英数字が続く場合は中かっこを追加しない
                            if (char.match(/\\/)) {
                                bkSlashFlag = true;
                            } else if (bkSlashFlag && !char.match(/[A-Za-z0-9]/)) {
                                bkSlashFlag = false;
                            }
                            if (eqFlag || bkSlashFlag) {
                                value += char;
                                continue;
                            }
                            if (char.match(/\{/)) {
                                // char が大文字で，braceFlagがfalseの場合，中かっこを追加
                                braceFlag = true;
                            } else if (char.match(/\}/)) {
                                braceFlag = false;
                            } else if (char.match(/[A-Z0-9]/) && !braceFlag) {
                                value += "{";
                                braceFlag = true;
                            } else if (!char.match(/[A-Z0-9]/) && braceFlag) {
                                value += "}";
                                braceFlag = false;
                            }
                            value += char;
                        }
                        if (braceFlag) {
                            value += "}";
                            braceFlag = false;
                        }
                        acc[key] = value;
                        return acc;
                    }, {} as Record<string, string>)
                };
            }
            return item;
        });
        setBibTeXData(newBibTeXData);
    }, [selected, BibTeXData, setBibTeXData]);

    return (
        <section {...stylex.props(
            style.BibTeXEditor,
            styleXStyles,
            (editorState === "open" && screen !== "phone"
                && style.BibTeXEditor__EditorOpen)
        )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}>
            <section {...stylex.props(style.BibTeXEditor__header)}>
                <section {...stylex.props(style.BibTeXEditor__header__primarySection)}>
                    <section {...stylex.props(style.BibTeXEditor__header__selectAll)}>
                        <Tooltip
                            contents={["全て選択"]}
                            disabled={BibTeXData === null || BibTeXData.length < 1}
                        >
                            <CheckBox
                                checked={selected !== null && selected.length > 0 && selected.length === BibTeXData.length}
                                indeterminate={selected !== null && selected.length > 0 && selected.length < BibTeXData.length}
                                id="BibTeXEditor__selectAll"
                                name="BibTeXEditor__selectAll"
                                onChange={handleSelectAll}
                                disabled={BibTeXData === null || BibTeXData.length < 1}
                            />
                        </Tooltip>
                        <span>
                            {selected !== null && selected.length > 0 && `${selected.length} 件選択中`}
                        </span>
                    </section>
                    <section {...stylex.props(style.BibTeXEditor__history_controller)}>
                        <Button
                            buttonStyle="text"
                            theme="secondary"
                            onClick={undo}
                            disabled={history.prev.length < 1}
                            shrink={true}
                            leading={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z"/></svg>}
                        >
                        </Button>
                        <Button
                            buttonStyle="text"
                            theme="secondary"
                            onClick={redo}
                            disabled={history.next.length < 1}
                            shrink={true}
                            leading={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M396-200q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252L544-744l56-56 200 200-200 200-56-56 104-104H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h284v80H396Z"/></svg>}
                        ></Button>
                    </section>
                </section>
                <section {...stylex.props(style.BibTeXEditor__header__ButtonList)}>
                    <Button
                        buttonStyle="filled"
                        disabled={selected === null || selected.length === 0}
                        shrink={screen === "phone"}
                        onClick={handleClickExportButton}
                        leading={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M480-337q-8 0-15-2.5t-13-8.5L308-492q-12-12-11.5-28t11.5-28q12-12 28.5-12.5T365-549l75 75v-286q0-17 11.5-28.5T480-800q17 0 28.5 11.5T520-760v286l75-75q12-12 28.5-11.5T652-548q11 12 11.5 28T652-492L508-348q-6 6-13 8.5t-15 2.5ZM240-160q-33 0-56.5-23.5T160-240v-80q0-17 11.5-28.5T200-360q17 0 28.5 11.5T240-320v80h480v-80q0-17 11.5-28.5T760-360q17 0 28.5 11.5T800-320v80q0 33-23.5 56.5T720-160H240Z" /></svg>}
                    >
                        エクスポート
                    </Button>
                    <Button
                        buttonStyle="filled_tonal"
                        theme="error"
                        disabled={selected === null || selected.length < 1}
                        shrink={screen === "phone"}
                        onClick={handleClickDeleteButton}
                        leading={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>}
                    >
                        削除
                    </Button>
                    <DropDownList.Root
                        label={({ onClick }) => (
                            <Button
                                buttonStyle="text"
                                theme="secondary"
                                onClick={onClick}
                                disabled={selected === null || selected.length < 1}
                                shrink={screen === "phone"}
                                trailing={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" /></svg>}
                            >
                                その他
                            </Button>
                        )}
                        horizontal="left"
                    >
                        <DropDownList.Item
                            label="大文字を中かっこで囲む"
                            onClick={handleClickBracedValuesButton}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M560-160v-80h120q17 0 28.5-11.5T720-280v-80q0-38 22-69t58-44v-14q-36-13-58-44t-22-69v-80q0-17-11.5-28.5T680-720H560v-80h120q50 0 85 35t35 85v80q0 17 11.5 28.5T840-560h40v160h-40q-17 0-28.5 11.5T800-360v80q0 50-35 85t-85 35H560Zm-280 0q-50 0-85-35t-35-85v-80q0-17-11.5-28.5T120-400H80v-160h40q17 0 28.5-11.5T160-600v-80q0-50 35-85t85-35h120v80H280q-17 0-28.5 11.5T240-680v80q0 38-22 69t-58 44v14q36 13 58 44t22 69v80q0 17 11.5 28.5T280-240h120v80H280Z"/></svg>}
                        />
                    </DropDownList.Root>
                    
                </section>
            </section>
            {
                (BibTeXData && BibTeXData.length > 0)
                    ?
                    <section {...stylex.props(style.BibTeXEditor_BibTeXEditorListWrapper)}>
                        <BibTeXEditorList {...props} />
                    </section>
                    :
                    <div {...stylex.props(style.BibTeXEditor_AddEntriesBox)}>
                        <p {...stylex.props(style.BibTeXEditor_AddEntriesBox__PrimaryText)}>
                            <span {...stylex.props(style.word)}>BibTeXファイルを</span>
                            <span {...stylex.props(style.word)}>ドロップして</span>
                            <span {...stylex.props(style.word)}>エントリーを追加</span>
                        </p>
                        <p>または</p>
                        <div {...stylex.props(style.BibTeXEditor_AddEntriesBox__ButtonList)}>
                            <Button theme="primary"
                                buttonStyle="filled"
                                onClick={handleClickToInputBibFile}
                                leading={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M240-160q-33 0-56.5-23.5T160-240v-80q0-17 11.5-28.5T200-360q17 0 28.5 11.5T240-320v80h480v-80q0-17 11.5-28.5T760-360q17 0 28.5 11.5T800-320v80q0 33-23.5 56.5T720-160H240Zm200-486-75 75q-12 12-28.5 11.5T308-572q-11-12-11.5-28t11.5-28l144-144q6-6 13-8.5t15-2.5q8 0 15 2.5t13 8.5l144 144q12 12 11.5 28T652-572q-12 12-28.5 12.5T595-571l-75-75v286q0 17-11.5 28.5T480-320q-17 0-28.5-11.5T440-360v-286Z"/></svg>}
                            >ファイルを選択</Button>
                            <Button theme="primary"
                                buttonStyle="outlined"
                                onClick={() => addBibTeXData([{ type: "article", citeKey: "", fields: {} }])}
                                leading={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="M200-200h57l391-391-57-57-391 391v57Zm-40 80q-17 0-28.5-11.5T120-160v-97q0-16 6-30.5t17-25.5l505-504q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L313-143q-11 11-25.5 17t-30.5 6h-97Zm600-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>}
                            >手動で追加</Button>
                        </div>
                    </div>
            }
            {
                (editorState !== "closed" && isOpenIndex !== null) &&
                <BibTeXEditor__EditorSection itemIndex={isOpenIndex} />
            }
            <div
                {...stylex.props(style.BibTeXEditor_DragoverIndicator, dragOver
                    && style.BibTeXEditor_DragoverIndicator__dragover)}
                aria-hidden="true" // ドラッグオーバー時にスクリーンリーダーに読み上げさせない
            >
                <p>ドロップして追加</p>
            </div>
        </section>
    );
}

export default BibTeXEditor;