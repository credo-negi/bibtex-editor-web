import { BibTeXEntries, isBibTeXEntryName, optionalFieldNames } from "../types/BibTeXTypes";
import type { BibTeXObject } from "../types/BibTeXTypes";


/**
 * 二つの文字列の編集距離を計算する
 * @param s1 文字列1
 * @param s2 文字列2
 * @returns 編集距離
 */
const levensteinDistance = (s1: string, s2: string): number => {

    // どちらかの文字列が空の場合はもう片方の文字列の長さを返す
    if (s1.length === 0) return s2.length;
    if (s2.length === 0) return s1.length;

    // 二次元配列を初期化する．このとき，
    // dp[i][j] は s1 の i 文字目までと s2 の j 文字目までの最小編集距離を表す
    const dp: number[][] = Array.from({ length: s1.length + 1 }, 
        (_, i) => Array.from({ length: s2.length + 1 }, 
            (_, j) => i === 0 ? j : j === 0 ? i : 0));

    // dp を計算する
    for (let i = 1; i <= s1.length; i++) {
        for (let j = 1; j <= s2.length; j++) {
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + (s1[i - 1] === s2[j - 1] ? 0 : 1)
            );
        }
    }

    // 編集距離を返す
    return dp[s1.length][s2.length];
}

/**
 * タイプに最も近いBibTeXエントリータイプを返す
 * @param type タイプ
 * @returns 最も近いBibTeXエントリータイプ
 */
const findClosestBibTeXEntryType = (type: string): string => {
    const entryTypes = Object.keys(BibTeXEntries);

    let minDistance = Infinity;
    let closestType = "";
    for (const entryType of entryTypes) {
        const distance = levensteinDistance(type, entryType);
        if (distance < minDistance) {
            minDistance = distance;
            closestType = entryType;
        }
    }
    // minDistance が 3 以上の場合は unknown を返す
    return minDistance < 3 ? closestType : "unknown";
}

/**
 * BibTeXオブジェクトを整形する
 * @param BibtexObject BibTeXオブジェクト
 * @returns 整形されたBibTeXオブジェクト
 */
export const lintBibTeXObject = (BibtexObject: BibTeXObject): BibTeXObject => {
    const { selected, isOpen } = BibtexObject;
    let { type } = BibtexObject;
    const oldType = BibtexObject.type;

    // タイプが不正な場合は最も近いタイプに変更
    type = isBibTeXEntryName(type) ? type : findClosestBibTeXEntryType(type);
    // preamble, comment, unknown はそのまま返す
    if (type === "preamble" || type === "comment" || type === "unknown") {
        BibtexObject.type = type;
        return BibtexObject;

    // fields を持つエントリーの場合
    } else if ("fields" in BibtexObject) {
        const { fields, citeKey } = BibtexObject;

        // citeKey が空の場合は警告を追加
        const citeKeyWarning = (citeKey === "") && "引用キーがありません";

        // 必須フィールドと推奨フィールドを追加
        const newFields: Record<string, string> = {};

        // 必須フィールドと推奨フィールドを追加
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

        // 未知のフィールドで，空欄のものを削除
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

        // 警告を追加
        const warnings = (citeKeyWarning ? [citeKeyWarning] : []).concat(
            oldType !== type ? [`タイプが変更されました: ${oldType} -> ${type}`] : [],
            emptyRequiredFields.length > 0 ? [`空欄の必須フィールド: ${emptyRequiredFields.join(", ")}`] : [],
            unknownFields.length > 0 ? [`未知のフィールドが含まれています: ${unknownFields.join(", ")}`] : [],
            deletedUnknownFields.length > 0 ? [`未知のフィールドで空欄のものを削除しました: ${deletedUnknownFields.join(", ")}`] : [],
            emptyOptionalFields.length > 0 ? [`空欄の推奨フィールド: ${emptyOptionalFields.join(", ")}`] : []
        );
        return {
            type: type,
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

/**
 * BibTeXオブジェクトの配列を整形する
 * @param BibtexObjectArray BibTeXオブジェクトの配列
 * @returns 整形されたBibTeXオブジェクトの配列
 */
const lintBibTeXObjectArray = (BibtexObjectArray: BibTeXObject[]): BibTeXObject[] => {
    return BibtexObjectArray.map(lintBibTeXObject);
}

export default lintBibTeXObjectArray;