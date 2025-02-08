import { BibTeXObject, isBibTeXComment, isBibTeXEntry, isBibTeXPreamble } from '../types/BibTeXTypes';

/**
 * BibTeXオブジェクトをBibTeX文字列に変換する
 * @param BibTeXObject BibTeXオブジェクト
 * @returns BibTeX文字列
 */
export const convertBibTeXObject2BibTeXString = (BibTeXObject: BibTeXObject): string => {
    if (isBibTeXPreamble(BibTeXObject)) {
        // BibTeXObject.valueの先頭に@preamble{がある場合は削除
        const value = BibTeXObject.value.startsWith("@preamble{") ? BibTeXObject.value.slice(10, -1) : BibTeXObject.value;
        return `@preamble{${value}}`;
    } else if (isBibTeXComment(BibTeXObject)) {
        // BibTeXObject.valueの先頭に@comment{がある場合は削除
        const value = BibTeXObject.value.startsWith("@comment{") ? BibTeXObject.value.slice(9, -1) : BibTeXObject.value;
        return `@comment{${value}}`;
    } else if (isBibTeXEntry(BibTeXObject)) {
        const { type, citeKey, fields } = BibTeXObject;
        const fieldStrings = Object.entries(fields).map(([key, value]) => `${key} = {${value}}`);
        return `@${type}{${citeKey},\n${fieldStrings.join(",\n")}\n}`;
    } else {
        throw new Error("不正なBibTeXオブジェクトです");
    }
}

/**
 * BibTeXオブジェクトの配列をBibTeX文字列に変換する
 * @param BibTeXObjectArray BibTeXオブジェクトの配列
 * @returns BibTeX文字列
 */
const convertBibTeXObjectArray2BibTeXString = (BibTeXObjectArray: BibTeXObject[]): string => {
    return BibTeXObjectArray.map(convertBibTeXObject2BibTeXString).join("\n");
}

export default convertBibTeXObjectArray2BibTeXString;