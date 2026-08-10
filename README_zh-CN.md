# reservoir-visual

<!-- hy-mt2-i18n:start -->
[English](./README.md) | **中文** | [日本語](./README_ja.md) | [Español](./README_es.md)
<!-- hy-mt2-i18n:end -->


台湾水库水位可视化工具。

## 数据更新

水库数据会通过 GitHub Actions 工作流每日自动更新，该工作流使用 [TaiwanReservoirAPI](https://github.com/chihsuan/TaiwanReservoirAPI) 从政府网站抓取最新数据。

如需手动更新：

1. 启动 API 服务器：
   ```
   cd TaiwanReservoirAPI && node app.js
   ```
2. 运行更新脚本：
   ```
   python3 update_data.py
   ```

## 致谢

感谢 washwashsleep 团队的成员开发了 [TaiwanReservoirAPI](https://github.com/washwashsleep/TaiwanReservoirAPI)。

## 许可协议

MIT
