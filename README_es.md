# reservoir-visual

<!-- hy-mt2-i18n:start -->
[English](./README.md) | [中文](./README_zh-CN.md) | [日本語](./README_ja.md) | **Español**
<!-- hy-mt2-i18n:end -->


Visualización del nivel de agua en los embalses de Taiwán.

## Actualización de datos

Los datos de los embalses se actualizan diariamente mediante un flujo de trabajo de GitHub Actions que extrae los datos más recientes del sitio web del gobierno usando [TaiwanReservoirAPI](https://github.com/chihsuan/TaiwanReservoirAPI).

Para actualizar manualmente:

1. Inicie el servidor API:
   ```
   cd TaiwanReservoirAPI && node app.js
   ```
2. Ejecute el script de actualización:
   ```
   python3 update_data.py
   ```

## Agradecimientos

Agradecemos a los miembros de washwashsleep por [TaiwanReservoirAPI](https://github.com/washwashsleep/TaiwanReservoirAPI).

## Licencia

MIT
