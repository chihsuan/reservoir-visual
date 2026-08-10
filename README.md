# reservoir-visual

<!-- hy-mt2-i18n:start -->
**English** · [中文](./README_zh-CN.md) · [日本語](./README_ja.md) · [Español](./README_es.md)
<!-- hy-mt2-i18n:end -->

Taiwan reservoir water level visualization.

## Data Update

Reservoir data is updated daily via a GitHub Actions workflow that scrapes the latest data from the government website using [TaiwanReservoirAPI](https://github.com/chihsuan/TaiwanReservoirAPI).

To update manually:

1. Start the API server:
   ```
   cd TaiwanReservoirAPI && node app.js
   ```
2. Run the update script:
   ```
   python3 update_data.py
   ```

## Thanks

Thanks to washwashsleep members for [TaiwanReservoirAPI](https://github.com/washwashsleep/TaiwanReservoirAPI).

## License

MIT
