import * as stylex from "@stylexjs/stylex";
import { createContext, useCallback, useContext, useState, useRef, useEffect } from 'react';
import { BibTeXObject } from '../types/BibTeXTypes';
import BibTeXParser from '../BibTeXParser/BibTeXParser';
import lintBibTeXObjectArray, { lintBibTeXObject } from '../BibTeXParser/BibTeXLinter';
import { useToast, ToastType, ToastState } from './ToastContext';
import convertBibTeXObjectArray2BibTeXString from "../BibTeXParser/BibTeXConverter";

export interface BibTeXDataContextProps {
    BibTeXData: BibTeXObject[];
    isOpenIndex: number| null;
    editorState: "open" | "closed" | "closing";
    fileName: string;
    history: BibTeXDataHistory;
    setFileName: (name: string) => void;
    setIsOpenIndex: (index: number | null) => void;
    setBibTeXData: (data: BibTeXObject[], history?: boolean) => void;
    addBibTeXData: (data: BibTeXObject[]) => void;
    removeBibTeXData: (index: number[]) => void;
    updateBibTeXData: (index: number, data: BibTeXObject, history?: boolean) => void;
    clearBibTeXData: () => void;
    handleClickToInputBibFile: () => void;
    exportBibTeXFile: (list: BibTeXObject[] | number[], filename?: string) => void;
    undo: () => void;
    redo: () => void;
}

interface BibTeXDataProviderProps {
    children: React.ReactNode;
}

interface BibTeXDataHistory {
    prev: BibTeXObject[][];
    next: BibTeXObject[][];
}

const BibTeXDataContext = createContext<BibTeXDataContextProps | null>(null);

const style = stylex.create({
    input: {
        display: "none",
    }
});

const HISTORY_LENGTH = 20;

export const BibTeXDataProvider = ({ children }: BibTeXDataProviderProps) => {
    const [BibTeXData, _setBibTeXData] = useState<BibTeXObject[]>([]);
    const [isOpenIndex, setIsOpenIndexState] = useState<number|null>(null);
    const [editorState, setEditorState] = useState<"open" | "closed" | "closing">("closed");
    const [fileName, setFileName] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { nextId, addMessage } = useToast();
    const [history, setHistory] = useState<BibTeXDataHistory>({ prev: [], next: [] });

    useEffect(() => {
        // null -> not nullのときにクエリパラメータを追加
        if (isOpenIndex !== null) {
            const url = new URL(window.location.href);
            url.searchParams.set("index", isOpenIndex.toString());
            window.history.pushState(null, "", url.toString());

            const onPopState = () => {
                setIsOpenIndex(null);
            }
            window.addEventListener("popstate", onPopState);
            return () => {
                window.removeEventListener("popstate", onPopState);
            }
        } else {
            // nullのときにクエリパラメータを削除
            const url = new URL(window.location.href);
            url.searchParams.delete("index");
            window.history.pushState(null, "", url.toString());
        }
    }, [isOpenIndex]);

    useEffect(() => {
        if ( BibTeXData.length === 0 ) {
            setFileName("");
            setEditorState("closed");
            setHistory({ prev: [], next: [] });
        }
    }, [BibTeXData]);

    const parseBibTeX = (input: string): BibTeXObject[] => {
        const myBibTeXParser = new BibTeXParser(input);
        const items = myBibTeXParser.parse();
        return items;
    }

    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.item(0)
        if (file) {
            const reader = new FileReader()
            setFileName("loading...");
            reader.onload = async (e) => {
                setFileName("");
                const result = e.target?.result as string
                try {
                    const items = parseBibTeX(result);
                    if (items.length < 1) {
                        throw new Error("BibTeXファイルの読み込みに失敗しました");
                    }
                    addBibTeXData(items);
                    addMessage({ type: ToastType.SUCCESS, text: "BibTeXファイルの読み込みに成功しました", id: nextId, state: ToastState.NONE });
                } catch (error) {
                    const message = error || "BibTeXファイルの読み込みに失敗しました"
                    addMessage({ type: ToastType.ERROR, text: `${message}`, id: nextId, state: ToastState.NONE })
                }
            }
            reader.readAsText(file)
        }
    }

    const handleClickToInputBibFile = () => {
        inputRef.current?.click();
    }

    const setIsOpenIndex = useCallback((index: number | null) => {
        let timer: number;
        if (index === null && editorState === "open") {
            setEditorState("closing");
            timer = setTimeout(() => {
                setEditorState("closed");
                setIsOpenIndexState(null);
            }, 250);
        } else if (index !== null) {
            setEditorState("open");
            setIsOpenIndexState(index);
        } else {
            setEditorState("closed");
            setIsOpenIndexState(index);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        }
    }, [editorState]);

    const setBibTeXData = useCallback((data: BibTeXObject[], history: boolean = true) => {
        const prev = BibTeXData;
        if (prev.length > 0 && history) {
            setHistory((history) => {
                const prevHistory = history.prev.length + 1 > HISTORY_LENGTH ? history.prev.slice(0, HISTORY_LENGTH-1) : history.prev;
                return {
                    prev: [prev, ...prevHistory],
                    next: [],
                }
            });
        }
        _setBibTeXData(data);
    }, [BibTeXData, history, _setBibTeXData]);

    const undo = useCallback(() => {
        if (history.prev.length > 0) {
            // prev の先頭を取り出す
            const prev = history.prev[0];
            if (prev) {
                setHistory((history) => {
                    const next = history.next.length + 1 > HISTORY_LENGTH ? history.next.slice(0, HISTORY_LENGTH-1) : history.next;
                    return {
                        prev: history.prev.slice(1),
                        next: [BibTeXData, ...next],
                    }
                });
                _setBibTeXData(prev);
            }
        }
    }, [history, _setBibTeXData, BibTeXData]);

    const redo = useCallback(() => {
        if (history.next.length > 0) {
            // next の先頭を取り出す
            const next = history.next[0];
            if (next) {
                setHistory((history) => {
                    const prev = history.prev.length + 1 > HISTORY_LENGTH ? history.prev.slice(0, HISTORY_LENGTH-1) : history.prev;
                    return {
                        prev: [BibTeXData, ...prev],
                        next: history.next.slice(1),
                    }
                });
                _setBibTeXData(next);
            }
        }
    }, [history, _setBibTeXData, BibTeXData]);


    const addBibTeXData = useCallback((data: BibTeXObject[]) => {
        setBibTeXData([...lintBibTeXObjectArray(data), ...BibTeXData]);
    }, [BibTeXData]);

    const removeBibTeXData = useCallback((index: number[]) => {
        const newData = BibTeXData.filter((_, i) => !index.includes(i));
        if (isOpenIndex !== null && index.includes(isOpenIndex)) {
            setIsOpenIndex(null);
        }
        setBibTeXData(newData);
    }, [BibTeXData, isOpenIndex, setIsOpenIndex, setBibTeXData]);

    const updateBibTeXData = useCallback((index: number, data: BibTeXObject, history: boolean = true) => {
        data = ("warnings" in data) ? { ...data, warnings: [] } : data;
        const newData = BibTeXData.map((d, i) => (i === index ? lintBibTeXObject(data) : d));
        setBibTeXData(newData, history);
    }, [BibTeXData]);

    const clearBibTeXData = useCallback(() => {
        setIsOpenIndex(null);
        setBibTeXData([]);
    }, [setIsOpenIndex, setBibTeXData]);

    const exportBibTeXFile = useCallback((
        list: BibTeXObject[] | number[],
        filename?: string
    ) => {
        let data: BibTeXObject[];
        if (typeof list[0] === "number") {
            data = list.map((i) => {
                if (typeof i === "number" && i < BibTeXData.length) {
                    return BibTeXData[i];
                } else {
                    return null;
                }
            }).filter((d) => d !== null);
        } else {
            data = list as BibTeXObject[];
        }
        const now = new Date();
        const datetime = {
            y: `${now.getFullYear()}`,
            m: `${now.getMonth() + 1}`.padStart(2, "0"),
            d: `${now.getDate()}`.padStart(2, "0"),
            h: `${now.getHours()}`.padStart(2, "0"),
            i: `${now.getMinutes()}`.padStart(2, "0"),
            s: `${now.getSeconds()}`.padStart(2, "0"),
        }
        const ymd_his = `${datetime.y}${datetime.m}${datetime.d}_${datetime.h}${datetime.i}${datetime.s}`;
        filename = filename || `export_${ymd_his}.bib`
        const stringified = convertBibTeXObjectArray2BibTeXString(data);
        const blob = new Blob([stringified], { type: "application/x-bibtex" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [BibTeXData]);

    return (
        <BibTeXDataContext.Provider 
            value={{ 
                BibTeXData, 
                setBibTeXData, 
                isOpenIndex, 
                editorState,
                fileName,
                history,
                setFileName,
                setIsOpenIndex, 
                addBibTeXData, 
                removeBibTeXData, 
                updateBibTeXData, 
                clearBibTeXData,
                handleClickToInputBibFile,
                exportBibTeXFile,
                undo,
                redo,
            }}
        >
            <input type="file" accept=".Bib"
                ref={inputRef}
                onChange={onChangeFile}
                {...stylex.props(style.input)}
            />
            {children}
        </BibTeXDataContext.Provider>
    );
}

export const useBibTeXData = () => {
    const context = useContext(BibTeXDataContext);
    if (!context) {
        throw new Error('useBibTeXData must be used within a BibTeXDataProvider');
    }
    return context;
}

export default BibTeXDataContext;