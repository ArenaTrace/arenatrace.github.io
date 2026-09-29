# arenatrace.github.io

バスケットボール会場のデータベース「アリーナ図鑑」。
<https://arenatrace.github.io>

## このリポジトリについて

**ここのHTMLは直接編集しない。** すべて生成物で、次のコマンドで作り直される。

```
cd ../bleague-stamp-rally
python3 tools/gen-site.py
```

正となるデータはアプリ側にある。

| 内容 | 場所 |
|---|---|
| 会場・チームのデータ | `bleague-stamp-rally/src/data/arenas.json` |
| 会場ごとのTips | `bleague-stamp-rally/src/data/venue_tips.json` |
| テンプレート | `bleague-stamp-rally/tools/gen-site.py` |
| CSS / JS | `bleague-stamp-rally/tools/site-assets/` |

アプリのデータを直せばサイトも追随する。二重管理を避けるための構成。

## 構成

```
/                     会場一覧（絞り込み・並び替え）
/venues/<id>/         会場ごとのページ
/about/               編集方針・出典・権利
/sitemap.xml
```

## 権利

本サイトは特定のリーグ・クラブの公式サイトではなく、提携・後援関係もない。
会場名・クラブ名は事実を説明するために使用している。図形商標は使用していない。
