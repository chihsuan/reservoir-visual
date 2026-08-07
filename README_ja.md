# reservoir-visual

<!-- hy-mt2-i18n:start -->
[English](./README.md) | [中文](./README_zh-CN.md) | **日本語** | [Español](./README_es.md)
<!-- hy-mt2-i18n:end -->


台湾の貯水池水位可視化ツール。

## データの更新

貯水池のデータは、[TaiwanReservoirAPI](https://github.com/chihsuan/TaiwanReservoirAPI)を使用して政府のウェブサイトから最新のデータを取得するGitHub Actionsワークフローにより、毎日更新されます。

手動で更新するには：

1. APIサーバーを起動します：
   ```
   cd TaiwanReservoirAPI && node app.js
   ```
2. 更新スクリプトを実行します：
   ```
   python3 update_data.py
   ```

## サポートしてくださった方々へ

[washwashsleep]のメンバーの皆様に、[TaiwanReservoirAPI](https://github.com/washwashsleep/TaiwanReservoirAPI)の開発にご協力いただき、感謝いたします。

## ライセンス

MIT
