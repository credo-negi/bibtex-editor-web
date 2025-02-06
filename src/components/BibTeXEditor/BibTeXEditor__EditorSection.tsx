import { BibTeXEntryNames, type BibTeXObject } from '../../types/BibTeXTypes';
import BibTeXParser from '../../BibTeXParser/BibTeXParser';
import { useBibTeXData } from '../../context/BibTeXDataContext';
import * as stylex from '@stylexjs/stylex';
import TextField from '../TextField/TextField';
import IconButton from '../IconButton';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDesignSkin } from '../../context/DesignSkinContext';
import Select from '../TextField/Select';
import { convertBibTeXObject2BibTeXString } from '../../BibTeXParser/BibTeXConverter';
import Input from '../TextField/Input';
import Tooltip from '../Tooltip';
import Chip from '../Chip';

interface BibTeXEditorSectionProps {
    itemIndex: number;
}

const openAnimation = stylex.keyframes({
    from: {
        opacity: 0,
        translate: "0 56px",
    },
    to: {
        opacity: 1,
        translate: "0 0",
    },
});

const style = stylex.create({
    base: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "auto 1fr",
    },
    base__phone: {
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        zIndex: 100,
        backgroundColor: "var(--md-sys-color-surface)",
        overflow: "hidden",
        borderLeft: "none",
        translate: "0 56px",
        opacity: 0,
        transition: "250ms var(--transition-ease-out-expo)",
    },
    base__phone__open: {
        opacity: 1,
        translate: "0 0",
        animation: `${openAnimation} 250ms var(--transition-ease-out-expo), forwards`,
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "56px",
        width: "100%",
        overflow: "hidden",
    },
    header__primarySection: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "0 16px",
        width: "calc(100% - 56px)",
    },
    header__primarySection__title: {
        // １行表示，はみ出る分は３点リーダー
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "100%",
        fontSize: "1.125rem",
    },
    content: {
        height: "100%",
        padding: "0 16px 16px 16px",
        overflowY: "auto",
    },
    content__phone: {
        height: "100%",
        overflowY: "auto",
        backgroundColor: "var(--md-sys-color-surface-container-lowest)",
        padding: "16px",
        borderRadius: "16px 16px 0 0",
    },
    attributesSection: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
    },
    textField: {
        margin: "8px 0",
        width: "100%",
    }
});

const BibTeXEditor__EditorSection
    = ({ itemIndex }: BibTeXEditorSectionProps) => {
        const { BibTeXData, updateBibTeXData, editorState, setIsOpenIndex } = useBibTeXData();
        const { screen } = useDesignSkin();
        const ref = useRef<HTMLDivElement>(null);

        // itemIndex が変更されたら，閉じるボタンにフォーカスを合わせる
        useEffect(() => {
            // ref.currentの中のinputまたはtextareaにフォーカスを合わせる
            if (screen === "desktop") {
                const target = ref.current?.querySelector("input, textarea");
                if (target instanceof HTMLElement) {
                    target.focus();
                }
            }
        }, [itemIndex, screen]);


        const item = BibTeXData[itemIndex];
        const title = 
            item ? (
                ("type" in item && item.type === "comment") ? "Comment" :
                ("item" in item && item.type === "preamble") ? "Preamble" :
                ("fields" in item && item.fields.title) ? item.fields.title : "Untitled")
            : "";

            const handleCloseButtonClick = useCallback(() => {
                const timer = self.setTimeout(() => {
                    setIsOpenIndex(null);
                }, 150);
                return () => clearTimeout(timer);
            }, [setIsOpenIndex]);
    
            const handleEntryTypeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
                const typeValue = event.target.value as BibTeXObject["type"];
                let newItem: BibTeXObject;
                if (item.type === typeValue) return;
                if ("value" in item && 
                    (item.type === "comment" && typeValue === "preamble")) {
                    newItem = { type: typeValue, value: item.value };
                } else if ("value" in item &&
                    (item.type === "preamble" && typeValue === "comment")) {
                    newItem = { type: typeValue, value: item.value };
                } else if ("value" in item) {
                    // item.value の `@xxx{`の部分を変更
                    const newValue = item.value.replace(/^@[a-zA-Z]+/, `@${typeValue}`);
                    const myBibTeXParser = new BibTeXParser(newValue);
                    newItem = myBibTeXParser.parse()[0];
                } else if (typeValue === "comment") {
                    newItem = { type: typeValue, value: convertBibTeXObject2BibTeXString(item) };
                } else if (typeValue === "preamble") {
                    newItem = { type: typeValue, value: convertBibTeXObject2BibTeXString(item) };
                } else if ("fields" in item) {
                    newItem = { ...item,  type: typeValue };
                } else {
                    newItem = { type: typeValue, citeKey: "", fields: {} };
                }
                updateBibTeXData(itemIndex, newItem);
            }, [itemIndex, item, updateBibTeXData]);
    
            const handleCiteKeyChange = useCallback((value: string) => {
                updateBibTeXData(itemIndex, { ...item, citeKey: value });
            }, [itemIndex, item, updateBibTeXData]);

        if (itemIndex === null) return null;

        if (item) return (
            <section {...stylex.props(
                style.base,
                (screen === "phone" && style.base__phone),
                (screen === "phone" && editorState === "open" && style.base__phone__open)
            )} ref={ref}>
                <section {...stylex.props(style.header)}>
                    <section {...stylex.props(style.header__primarySection)}>
                        <div {...stylex.props(style.header__primarySection__title)}>
                            {title}
                        </div>
                    </section>
                    <section>
                        <IconButton
                            onClick={handleCloseButtonClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                        </IconButton>
                    </section>
                </section>
                <section {...stylex.props(style[screen === "phone" ? "content__phone" : "content"])}>
                    <section {...stylex.props(style.attributesSection)}>
                        <Select
                            id={`entry-type-${itemIndex}`}
                            options={BibTeXEntryNames}
                            value={item.type}
                            leading="@"
                            onChange={handleEntryTypeChange}
                        />
                        {"citeKey" in item && 
                            <Input
                                id={`cite-key-${itemIndex}`}
                                defaultValue={item.citeKey}
                                leading="{"
                                trailing="}"
                                onSave={handleCiteKeyChange}
                            />
                        }
                        {("warnings" in item && item.warnings && item.warnings.length > 0) &&
                            <Tooltip
                                contents={item.warnings}
                            >
                                <Chip 
                                    theme="warning"
                                    size="small"

                                    leadingIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="000000"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/></svg>}
                                >
                                    {item.warnings.length}
                                </Chip>
                            </Tooltip>
                        }
                    </section>
                    {"value" in item
                        && <BibTeXEditorTextField
                            fieldKey="value"
                            value={item.value}
                            item={item}
                            index={itemIndex}
                            fieldIndex={0}
                            styleXStyles={style.textField}
                        />
                    }
                    {"fields" in item
                        && Object.entries(item.fields).map(([key, value], i) => (
                            <BibTeXEditorTextField
                                key={i}
                                fieldKey={key}
                                value={value}
                                item={item}
                                index={itemIndex}
                                fieldIndex={i}
                                styleXStyles={style.textField}
                            />
                        ))
                    }
                </section>

            </section>
        );
    };

interface BibTeXEditorTextFieldProps {
    fieldKey: string;
    value: string;
    item: BibTeXObject;
    index: number;
    fieldIndex: number;
    styleXStyles?: stylex.StyleXStyles;
}

const BibTeXEditorTextField = ({ fieldKey, value, item, styleXStyles, index, fieldIndex }: BibTeXEditorTextFieldProps) => {
    const { updateBibTeXData } = useBibTeXData();
    const handleSave = useCallback((value: string) => {
        if ("fields" in item) {
            updateBibTeXData(index, { ...item, fields: { ...item.fields, [fieldKey]: value } });
        } else if ("value" in item) {
            updateBibTeXData(index, { ...item, value });
        }
    }, [fieldKey, item, index, updateBibTeXData]);
    return (
        <TextField
            type={(fieldKey === "abstract" || fieldKey === "value") ? "textarea" : "text"}
            id={`field-${index}-${fieldIndex}`}
            label={fieldKey}
            defaultValue={value || ""}
            styleXStyles={styleXStyles}
            onSave={handleSave}
        />
    )
}

export default BibTeXEditor__EditorSection;