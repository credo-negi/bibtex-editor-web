import type { BibTeXEntry, BibTeXEntryName, BibTeXObject } from "../types/BibTeXTypes";
import { BibTeXEntries, isBibTeXEntryName } from "../types/BibTeXTypes";
import { lintBibTeXObject } from "./BibTeXLinter";

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
      return lintBibTeXObject({ type: "preamble", value: this.parseString() });
    } else if (type.toLowerCase() === "comment") {
      return lintBibTeXObject({ type: "comment", value: this.parseString() });
    } else {
      return lintBibTeXObject(this.parseEntry((
        type in BibTeXEntries ? type : "unknown"
      )));
    }
  }

  private parseEntry(type: BibTeXEntryName): BibTeXEntry {
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
      type: isBibTeXEntryName(type) ? type : "unknown", 
      citeKey, fields, warnings };
  }

  private parseString(): string {
    if (this.peek() === "{") {
      return this.parseBracedText();
    } else if (this.peek() === '"') {
      return this.parseQuotedText();
    } else {
      throw new Error(`Unexpected character at position ${this.position}`);
    }
  }

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

  private parseQuotedText(): string {
    this.consume('"');
    let text = "";
    while (this.peek() !== '"') {
      text += this.consume();
    }
    this.consume('"');
    return text;
  }

  private parseIdentifier(): string {
    let identifier = "";
    while (this.isAlphanumeric(this.peek()) || this.peek() === "-" || this.peek() === "_" || this.peek() === ":") {
      identifier += this.consume();
    }
    return identifier;
  }

  private isAlphanumeric(char: string): boolean {
    return /^[a-zA-Z0-9]$/.test(char);
  }

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

  private peek(): string {
    return this.input[this.position] || "";
  }

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