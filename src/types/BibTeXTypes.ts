/**
 * BibTeXエントリの名前の型定義
 */
export const BibTeXEntryNames = [
    "article", "book", "booklet", "conference", "glossdef", 
    "inbook", "incollection", "inproceedings",
    "jurthesis", "manual", "mastersthesis", "misc", 
    "periodical", "phdthesis", "proceedings", "techreport",
    "unpublished", "url", "electronic", "webpage", "preamble", "comment", "unknown"
]
export type BibTeXEntryName = typeof BibTeXEntryNames[number];
export const isBibTeXEntryName 
    = (name: string): name is BibTeXEntryName => {
        return BibTeXEntryNames.includes(name);
    }

/**
 * BibTeXエントリの型定義
 * @property description - エントリの説明
 * @property required - 必須フィールド
 * @property recommended - オプションフィールド
 */
export type BibTeXEntryTypes = {
    // key は，isBibTeXEntryName でチェックして，trueとなるもの
    [key: BibTeXEntryName]: {
        description?: {
            ja: string;
            en: string;
        };
        required: string[];
        recommended: string[];
    };
};

/**
 * BibTeXエントリの定義
 */
export const BibTeXEntries: BibTeXEntryTypes = {
    "article": {
        description: {
            ja: "ジャーナルや雑誌、新聞、定期刊行物の記事",
            en: "An article from a journal, magazine, newspaper, or other periodical."
        },
        required: ["title", "author", "journal", "year"],
        recommended: ["volume", "number", "pages", "month"]
    },
    "book": {
        description: {
            ja: "出版社がはっきりしている書籍",
            en: "A book where the publisher is clearly indifiable."
        },
        required: ["title", "author", "publisher", "year"],
        recommended: ["volume", "number", "series", "address", "editor", "edition", "month"]
    },
    "booklet": {
        description: {
            ja: "製本されているが、出版社や支援機関が明確でない印刷物",
            en: "A printed work that is bound, but does not have a clearly identifiable publisher or supporting institution."
        },
        required: ["title"],
        recommended: ["author", "howpublished", "address", "month", "year"]
    },
    "conference": {
        description: {
            ja: "会議録に掲載された論文",
            en: "An article that has been included in conference proceedings."
        },
        required: ["title", "author", "booktitle", "year"],
        recommended: ["editor", "volume", "pages", "number", "series", "address", "month", "organization", "publisher"]
    },
    "glossdef": {
        description: {
            ja: "用語集の定義",
            en: "A definition of a term in a glossary."
        },
        required: ["word", "description"],
        recommended: ["keywords", "sort-word", "short", "group", "title"]
    },
    "inbook": {
        description: {
            ja: "章などのセクション、または書籍内のページ範囲",
            en: "A section, such as a chapter, or a page range within a book."
        },
        required: ["title", "author", "chapter", "pages", "publisher", "year"],
        recommended: ["editor", "number", "volume", "series", "type", "address", "edition", "month"]
    },
    "incollection": {
        description: {
            ja: "本の中のタイトルのついた部分。 例えば、本を構成する大きな短編小説集の中の短編小説のようなもの。",
            en: "A titled section of a book. Such as a short story within the larger collection of short stories that make up the book."
        },
        required: ["title", "author", "booktitle", "publisher", "year"],
        recommended: ["editor", "volume", "number", "series", "type", "chapter", "pages", "address", "edition", "month"]
    },
    "inproceedings": {
        description: {
            ja: "会議録に掲載された論文。 `conference` と `inproceedings` の用法は同じです。 `conference`エントリは、Scribe との互換性のために含まれています。",
            en: "A paper that has been published in conference proceedings. The usage of `conference` and `inproceedings` is the same. The `conference` entry was included for Scribe compatibility."
        },
        required: ["title", "author", "booktitle", "year"],
        recommended: ["editor", "volume", "series", "pages", "address", "month", "organization", "publisher"]
    },
    "jurthesis": {
        description: {
            ja: "法学部の学位論文",
            en: "A thesis for a law degree."
        },
        required: ["title", "author", "school", "year"],
        recommended: ["type", "address", "month"]
    },
    "manual": {
        description: {
            ja: "新しい所有者に操作方法を説明するために、購入時に付属するようなマシンソフトの技術マニュアル。",
            en: "A technical manual for a machine software such as would come with a purchase to explain operation to the new owner."
        },
        required: ["title"],
        recommended: ["author", "organization", "address", "edition", "month", "year"]
    },
    "mastersthesis": {
        description: {
            ja: "修士学位論文",
            en: "A thesis written for the Master’s level degree."
        },
        required: ["title", "author", "school", "year"],
        recommended: ["type", "address", "month"]
    },
    "misc": {
        description: {
            ja: "他の入力タイプが出典と完全に一致しない場合に使用する。 ウェブページの引用によく使われるが、講義のスライドから個人的なメモまで何でもあり得る。",
            en: "Used if none of the other entry types quite match the source. Frequently used to cite web pages, but can be anything from lecture slides to personal notes."
        },
        required: [],
        recommended: ["title", "author", "howpublished", "month", "year"]
    },
    "periodical": {
        description: {
            ja: "定期刊行物",
            en: "A periodical."
        },
        required: ["title", "year", "author"],
        recommended: ["editor", "volume", "journal", "pages"]
    },
    "phdthesis": {
        description: {
            ja: "博士学位論文",
            en: "A thesis written for the PhD level degree."
        },
        required: ["title", "author", "school", "year"],
        recommended: ["type", "address", "month"]
    },
    "proceedings": {
        description: {
            ja: "会議録",
            en: "A conference proceeding."
        },
        required: ["title", "year"],
        recommended: ["editor", "number", "volume", "series", "address", "month", "publisher", "organization"]
    },
    "techreport": {
        description: {
            ja: "学校、政府機関、団体、企業などの機関が発行する報告書。 この項目タイプは、ホワイトペーパーやワーキングペーパーにもよく使われます。",
            en: "An institutionally published report such as a report from a school, a government organization, an organization, or a company. This entry type is also frequently used for white papers and working papers."
        },
        required: ["title", "author", "institution", "year"],
        recommended: ["type", "number", "address", "month"]
    },
    "unpublished": {
        description: {
            ja: "論文の草稿や準備中の原稿など、正式に出版されていない文書。",
            en: "A document that has not been officially published such as a paper draft or manuscript in preparation."
        },
        required: ["title", "author"],
        recommended: ["month", "year"]
    },
    "url": {
        description: {
            ja: "インターネット上のリソース",
            en: "A resource on the internet."
        },
        required: ["url"],
        recommended: ["urldate", "title", "author", "lastchecked"]
    },
    "electronic": {
        description: {
            ja: "電子書籍",
            en: "An electronic book."
        },
        required: ["title", "author"],
        recommended: ["urldate"]
    },
    "webpage": {
        description: {
            ja: "ウェブページ",
            en: "A webpage."
        },
        required: ["title", "url"],
        recommended: ["lastchecked", "year", "month"]
    },
    "preamble": {
        description: {
            ja: "BibTeXファイルのプリアンブル",
            en: "The preamble of a BibTeX file."
        },
        required: [],
        recommended: []
    },
    "comment": {
        description: {
            ja: "BibTeXファイルのコメント",
            en: "A comment in a BibTeX file."
        },
        required: [],
        recommended: []
    },
    "unknown": {
        description: {
            ja: "不明なエントリータイプ",
            en: "An unknown entry type."
        },
        required: [],
        recommended: []
    }
};
/**
 * BibTeXエントリの必須フィールドの名前の型定義
 */
export const optionalFieldNames = [
    "abstract", "note", "keywords", "rating", "doi", "isbn", "issn", "issue"
]

/**
 * 一般的なBibTeX項目の型定義
 * @property type - 項目のタイプ．"preamble"または"comment"以外の文字列
 * @property citeKey - 引用キー
 * @property fields - フィールド．キーと値のペア
 * @property warnings - 警告
 */
export type BibTeXEntry = {
    // type: preamble, comment 以外のstring
    type: Exclude<BibTeXEntryName, "preamble" | "comment">; 
    citeKey: string;
    fields: Record<string, string>;
    warnings?: string[];
    selected?: boolean;
    isOpen?: boolean;
};

/**
 * BibTeX項目のうち，プリアンブルの型定義
 * @property type - 項目のタイプ．"preamble"のみ
 * @property value - プリアンブルの内容
 */
export type BibTeXPreamble = {
    type: "preamble";
    value: string;
    selected?: boolean;
    isOpen?: boolean;
};

/**
 * BibTeX項目のうち，コメントの型定義
 * @property type - 項目のタイプ．"comment"のみ
 * @property value - コメントの内容
 */
export type BibTeXComment = {
    type: "comment";
    value: string;
    selected?: boolean;
    isOpen?: boolean;
};

/**
 * BibTeX項目の型定義．プリアンブル，コメント，一般的なBibTeX項目のいずれか
 */
export type BibTeXObject = BibTeXEntry | BibTeXPreamble | BibTeXComment;
export const isBibTeXEntry = (object: BibTeXObject): object is BibTeXEntry => {
    return "citeKey" in object && "fields" in object;
}
export const isBibTeXPreamble = (object: BibTeXObject): object is BibTeXPreamble => {
    return "value" in object && "type" in object && object.type === "preamble";
}
export const isBibTeXComment = (object: BibTeXObject): object is BibTeXComment => {
    return "value" in object && "type" in object && object.type === "comment";
}