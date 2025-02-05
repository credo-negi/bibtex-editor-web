import React from "react";

interface JPBottomOffsetProps {
    children: React.ReactNode;
}
const CJKBottomOffset = ({children}: JPBottomOffsetProps) => {
    // textの中のCJK文字列のみ，padding-bottomを追加する
    // textを一文字ずつ処理して，CJK文字列かどうかを判定する
    // CJK文字列の場合，padding-bottomを追加する
    // それ以外の場合，padding-bottomを追加しない
    if (typeof children !== "string") {
        return children;
    }
    const charNodes = children.split("").map((char, index) => {
        const isCJK = char.match(/[\u4E00-\u9FFF\u3040-\u30FF\u31F0-\u31FF\u3200-\u32FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/);
        return (
            <span key={index} style={{paddingBottom: isCJK ? "2px" : "0"}}>{char}</span>
        );
    });
    return (
        <>
            {charNodes}
        </>
    );
}
export default CJKBottomOffset;