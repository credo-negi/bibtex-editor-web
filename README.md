# BibTeX Editor Web

このプロジェクトは、BibTeXファイルを簡単に編集・管理するためのWebアプリケーションです。

## 特徴

- BibTeXファイルのインポートとエクスポート
- エントリの追加、編集、削除、検証

## インストール

以下のコマンドを実行して依存関係をインストールします。

```bash
npm install
```
> [!IMPORTANT]
> 現状、`vite-plugin-stylex`が`Vite 6`に正式対応できていないようです([Issue](https://github.com/HorusGoul/vite-plugin-stylex/issues/97))。インストール時は`--force`オプションをつけるか、Viteのバージョンを下げるしかなさそうです。

## 使用方法

開発サーバーを起動するには、以下のコマンドを実行します。

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスしてアプリケーションを使用できます。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
