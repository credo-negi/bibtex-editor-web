import type { BibTeXEntry, BibTeXObject } from "../types/BibTeXTypes";

/**
 * BibTeXパーサークラス
 */
class BibTeXParser {
    private input: string;
    private position: number;

    /**
     * BibTeXパーサーを初期化する
     * @param {string} input - BibTeX形式の文字列
     */
    constructor(input: string) {
        /** @type {string} */
        this.input = input;
        /** @type {number} */
        this.position = 0;
    }

    /**
     * BibTeX形式の文字列を解析し，BibTeXオブジェクトの配列を返す
     * @returns {BibTeXObject[]} - BibTeXオブジェクトの配列
     */
    parse(): BibTeXObject[] {
        const objects: BibTeXObject[] = [];
        while (this.position < this.input.length) {
            this.skipWhitespace();
            if (this.peek() === "@") {
                objects.push(this.parseObject());
            } else {
                this.position++;
            }
        }
        return objects;
    }

    /**
     * BibTeX形式の文字列を解析し，BibTeXオブジェクトを返す
     * @returns {BibTeXObject} - BibTeXオブジェクト
     */
    private parseObject(): BibTeXObject {
        this.consume("@");
        const type = this.parseIdentifier();
        this.skipWhitespace();

        if (type.toLowerCase() === "preamble") {
            return { type: "preamble", value: this.parseString() };
        } else if (type.toLowerCase() === "comment") {
            return { type: "comment", value: this.parseString() };
        } else {
            return this.parseEntry(type);
        }
    }

    /**
     * BibTeXエントリーを解析する
     * @param type エントリータイプの文字列
     * @returns 文字列を解析して得られたエントリーオブジェクト
     */
    private parseEntry(type: string): BibTeXEntry {
        const warnings: string[] = [];
        this.consume("{");
        const citeKey = this.parseIdentifier();
        this.skipWhitespace();
        this.consume(",");
        const fields: Record<string, string> = {};
        while (this.peek() !== "}") {
            this.skipWhitespace();
            const fieldName = this.parseIdentifier();
            this.skipWhitespace();
            this.consume("=");
            this.skipWhitespace();
            const fieldValue = this.parseString();
            fields[fieldName] = fieldValue;
            this.skipWhitespace();
            if (this.peek() === ",") {
                this.consume(",");
            }
            this.skipWhitespace();
        }
        this.consume("}");
        return {
            type: type,
            citeKey, fields, warnings
        };
    }

    /**
     * BibTeXフィールドの値を解析する
     * @returns 中かっこまたはダブルクォートで囲まれた文字列の中身
     */
    private parseString(): string {
        if (this.peek() === "{") {
            return this.parseBracedText();
        } else if (this.peek() === '"') {
            return this.parseQuotedText();
        } else {
            throw new Error(`Unexpected character at position ${this.position}`);
        }
    }

    /**
     * BibTeXフィールドの値のうち，中かっこで囲まれた文字列を解析する
     * @returns 中かっこで囲まれた文字列
     */
    private parseBracedText(): string {
        this.consume("{");
        let text = "";
        let depth = 1;
        while (depth > 0) {
            const char = this.consume();
            if (char === "{") {
                depth++;
            } else if (char === "}") {
                depth--;
                if (depth === 0) break;
            }
            text += char;
        }
        return text;
    }

    /**
     * BibTeXフィールドの値のうち，ダブルクォートで囲まれた文字列を解析する
     * @returns ダブルクォートで囲まれた文字列
     */
    private parseQuotedText(): string {
        this.consume('"');
        let text = "";
        while (this.peek() !== '"') {
            text += this.consume();
        }
        this.consume('"');
        return text;
    }

    /**
     * BibTeXエントリーキーまたはフィールド名として使える文字列を解析する
     * @returns エントリーキーまたはフィールド名として使える文字列
     */
    private parseIdentifier(): string {
        let identifier = "";
        while (this.isAlphanumeric(this.peek()) || this.peek() === "-" || this.peek() === "_" || this.peek() === ":") {
            identifier += this.consume();
        }
        return identifier;
    }

    /**
     * 文字列がアルファベットまたは数字であるかどうかを判定する
     * @param char 文字列
     * @returns 文字列がアルファベットまたは数字であるかどうか
     */
    private isAlphanumeric(char: string): boolean {
        return /^[a-zA-Z0-9]$/.test(char);
    }

    /**
     * 空白文字（スペース, タブ, 改行など）や，コメントをスキップする
     */
    private skipWhitespace(): void {
        while (this.position < this.input.length) {
            const char = this.peek();
            if (/\s/.test(char)) {
                // 空白文字（スペース, タブ, 改行など）をスキップ
                this.position++;
            } else if (char === "%") {
                // コメントをスキップ（% 以降の行を無視）
                while (this.position < this.input.length && this.peek() !== "\n") {
                    this.position++;
                }
            } else {
                break;
            }
        }
    }

    /**
     * 現在の位置の文字を返す
     * @returns 現在の位置の文字
     */
    private peek(): string {
        return this.input[this.position] || "";
    }

    /**
     * 現在の位置の文字を返し，位置を一つ進める
     * @param expected 期待される文字
     * @returns 現在の位置の文字
     */
    private consume(expected?: string): string {
        const char = this.input[this.position];
        if (expected && char !== expected) {
            throw new Error(`Expected '${expected}', but found '${char}' at position ${this.position}`);
        }
        this.position++;
        return char;
    }
}

export default BibTeXParser;