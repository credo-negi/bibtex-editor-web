import React, { useCallback, useRef } from "react";
import type { BibTeXObject } from "../../types/BibTeXTypes";
import { useBibTeXData } from "../../context/BibTeXDataContext";
import * as stylex from "@stylexjs/stylex";
import Ripple from "../Ripple";
import CheckBox from "../CheckBox";

interface BibTeXEditorListItemProps {
    item: BibTeXObject;
    itemIndex: number;
}

const focusKeyFrames = stylex.keyframes({
    from: {
        outlineOffset: "10px",
    },
    to: {
        outlineOffset: "0px",
    },
});

const style_BibTeXEditorList = stylex.create({
    base: {
        boxSizing: "border-box",
        padding: "2px 16px 16px 16px",
    },
});

const style_BibTeXEditorListItem = stylex.create({
    base: {
        display: "flex",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        "-webkit-tap-highlight-color": "transparent",
        "::before": {
            content: "''",
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "var(--md-sys-color-primary)",
            opacity: 0,
            transition: "opacity 150ms",
            pointerEvents: "none",
            userSelect: "none",
        },
        "::after": {
            content: "''",
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            opacity: 0,
            transition: "opacity 75ms",
            pointerEvents: "none",
            userSelect: "none",
        },
        ":hover": {
            "::before": {
                opacity: 0.12,
            },
        },
        ":focus-visible": {
            outline: "2px solid var(--md-sys-color-primary)",
            outlineOffset: "0px",
            animation: `${focusKeyFrames} 150ms var(--transition-ease-out)`,
        },
    },
    base__open: {
        gridTemplateRows: "max-content 1fr",
        outlineOffset: "-2px",
        "::before": {
            opacity: 0.12,
        },
        "::after": {
            opacity: 0.12,
        },
    },
    primarySection: {
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
    },
    secondarySection: {
        display: "flex",
        flexDirection: "column",
        padding: "16px 0",
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        gap: "8px",
    },
    attributesSection: {
        display: "flex",
        gap: "8px",
    },
    attributes__type: {
        color: "var(--md-sys-color-on-surface)",
        backgroundColor: "var(--md-sys-color-surface-container)",
        padding: "2px 4px",
        borderRadius: "4px",
        fontSize: "0.75em",
    },
    attributes__citeKey: {
        color: "var(--md-sys-color-on-surface)",
        backgroundColor: "var(--md-sys-color-surface-container)",
        padding: "2px 4px",
        borderRadius: "4px",
        fontSize: "0.75em",
    },
    attributes__rating: {
        color: "var(--md-sys-color-on-surface)",
        display: "flex",
        backgroundColor: "var(--md-sys-color-surface-container)",
        padding: "2px 4px",
        borderRadius: "4px",
        fontSize: "0.75em",
    },
    titleSection: {
        fontSize: "1.125em",
    },
    titleSection__open: {
        fontWeight: "bold",
    },
    divider: {
        border: "1px solid var(--md-sys-color-surface-container-low)",
        margin: "0",
    }
});

const BibTeXEditorList = () => {
    const { BibTeXData } = useBibTeXData();
    return (
        <div {...stylex.props(style_BibTeXEditorList.base)}>
            {BibTeXData.length > 0 ?
                BibTeXData.map((item, index) => (
                    <BibTeXEditorListItem
                        key={index}
                        itemIndex={index}
                        item={item}
                    />
                )) : (
                    <p>Empty</p>
                )}

        </div>
    );
}

const BibTeXEditorListItem = (props: BibTeXEditorListItemProps) => {
    const { isOpenIndex, setIsOpenIndex, updateBibTeXData } = useBibTeXData();
    const { item, itemIndex } = props;
    const itemRef = useRef<HTMLDivElement>(null);
    const displayTitle =
        item.type === "comment" ? "Comment" :
            item.type === "preamble" ? "Preamble" :
                ("fields" in item && item.fields.title)
                    ? item.fields.title
                    : "Untitled";

    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        // checkboxがクリックされた場合はリストアイテムのクリックイベントを無視
        if (e.target instanceof HTMLLabelElement || e.target instanceof HTMLInputElement) {
            return;
        }
        setIsOpenIndex(itemIndex);
    }, [itemIndex, setIsOpenIndex]);

    const handleInputEnterKey = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setIsOpenIndex(itemIndex);
        }
    }, [itemIndex, setIsOpenIndex]);

    const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateBibTeXData(itemIndex, { ...item, selected: e.target.checked }, false);
    }, [item, itemIndex, updateBibTeXData]);

    return (
        <>
            <section
                ref={itemRef}
                {...stylex.props(style_BibTeXEditorListItem.base, (isOpenIndex === itemIndex) && style_BibTeXEditorListItem.base__open)}
                role="button"
                tabIndex={itemIndex === isOpenIndex ? -1 : 0}
                onClick={handleClick}
                onKeyDown={handleInputEnterKey}
            >
                <Ripple parentRef={itemRef} />
                <section {...stylex.props(style_BibTeXEditorListItem.primarySection)}>
                    <CheckBox
                        checked={item.selected || false}
                        onChange={handleCheckboxChange}
                        id={`checkbox-${itemIndex}`}
                        name="BibTeXEditor-selected-item"
                    />
                </section>
                <section {...stylex.props(style_BibTeXEditorListItem.secondarySection)}>
                    <section {...stylex.props(style_BibTeXEditorListItem.attributesSection)}>
                        {"type" in item
                            && <span {...stylex.props(style_BibTeXEditorListItem.attributes__type)}>
                                @{item.type}
                            </span>}
                        {"citeKey" in item
                            && <span {...stylex.props(style_BibTeXEditorListItem.attributes__citeKey)}>
                                {`{${item.citeKey}}`}
                            </span>}
                        {"fields" in item && "rating" in item.fields
                            && <span {...stylex.props(style_BibTeXEditorListItem.attributes__rating)}>
                                { // item.fields.rating を数値に変換して，5段階評価を表示
                                    // i < item.fields.rating のとき，svgアイコンを表示
                                    // i >= item.fields.rating のとき，svgアイコンを表示しない
                                    Array.from({ length: 5 }, (_, i) => (
                                        <svg
                                            key={i}
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="1em" viewBox="0 -960 960 960"
                                            width="1em"
                                            fill={i < Number(item.fields.rating) ? "CurrentColor" : "transparent"}
                                        >
                                            <path 
                                                stroke="currentColor"
                                                strokeWidth="96"
                                                d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                                        </svg>
                                    ))
                                }
                            </span>}
                    </section>
                    <section {...stylex.props(style_BibTeXEditorListItem.titleSection, (isOpenIndex === itemIndex) && style_BibTeXEditorListItem.titleSection__open)}>
                        {displayTitle}
                    </section>
                </section>
            </section>
            <hr {...stylex.props(style_BibTeXEditorListItem.divider)} />
        </>
    )
}

export default BibTeXEditorList;