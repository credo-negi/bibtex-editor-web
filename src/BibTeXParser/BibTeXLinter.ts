import { BibTeXEntries, isBibTeXEntryName, optionalFieldNames } from "../types/BibTeXTypes";
import type { BibTeXObject } from "../types/BibTeXTypes";

export const lintBibTeXObject = (BibtexObject: BibTeXObject): BibTeXObject => {
    const { type, selected, isOpen } = BibtexObject;
    if (type === "preamble" || type === "comment" || type === "unknown") {
        return BibtexObject;
    } else if ("fields" in BibtexObject) {
        const { fields, citeKey } = BibtexObject;
        const citeKeyWarning = (citeKey === "") && "引用キーがありません";
        const newType = isBibTeXEntryName(type) ? type : "unknown";
        const newFields: Record<string, string> = {};
        const requiredFields = BibTeXEntries[type].required;
        const recommendedFields = BibTeXEntries[type].recommended;
        const missingRequiredFields: string[] = [];
        const emptyRequiredFields: string[] = [];
        const missingOptionalFields: string[] = [];
        const emptyOptionalFields: string[] = [];
        for (const field of requiredFields) {
            if (!(field in fields)) {
                missingRequiredFields.push(field);
                newFields[field] = "";
            } else {
                newFields[field] = fields[field];
                delete fields[field];
            }
            if (newFields[field] === "") {
                emptyRequiredFields.push(field);
            }
        }
        for (const field of recommendedFields) {
            if (!(field in fields)) {
                missingOptionalFields.push(field);
                newFields[field] = "";
            } else {
                newFields[field] = fields[field];
                delete fields[field];
            }
            if (newFields[field] === "") {
                emptyOptionalFields.push(field);
            }
        }
        for (const field of optionalFieldNames) {
            if (field in fields) {
                newFields[field] = fields[field];
                delete fields[field];
            } else {
                newFields[field] = "";
            }
        }
        const unknownFields = Object.keys(fields);
        const deletedUnknownFields: string[] = [];
        for (const field of unknownFields) {
            if (fields[field] === "") {
                delete fields[field];
                deletedUnknownFields.push(field);
            } else {
                newFields[field] = fields[field];
            }
        }
        const warnings = (citeKeyWarning ? [citeKeyWarning] : []).concat(
            newType !== type ? [`タイプが変更されました: ${type} -> ${newType}`] : [],
            emptyRequiredFields.length > 0 ? [`空欄の必須フィールド: ${emptyRequiredFields.join(", ")}`] : [],
            unknownFields.length > 0 ? [`未知のフィールドが含まれています: ${unknownFields.join(", ")}`] : [],
            deletedUnknownFields.length > 0 ? [`未知のフィールドで空欄のものを削除しました: ${deletedUnknownFields.join(", ")}`] : [],
            emptyOptionalFields.length > 0 ? [`空欄の推奨フィールド: ${emptyOptionalFields.join(", ")}`] : []
        );
        return {
            type: newType,
            citeKey,
            fields: newFields,
            warnings,
            selected,
            isOpen
        }
    } else {
        throw new Error("不正なBibTeXオブジェクトです");
    }
}

const lintBibTeXObjectArray = (BibtexObjectArray: BibTeXObject[]): BibTeXObject[] => {
    return BibtexObjectArray.map(lintBibTeXObject);
}

export default lintBibTeXObjectArray;