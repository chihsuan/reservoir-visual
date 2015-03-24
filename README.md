# reservoir-visual

## Develop

Using [canner](https://github.com/Canner/canner) to generate HTML files 

Install canner

```
sudo npm install -g canner
```

after install canner, if you want to generate html files, just type.

```
canner build
```
the settings are all in `./canner.json`, template is in `index.hbs`

## Data update

First, using [TaiwanReservoirAPI](https://github.com/washwashsleep/TaiwanReservoirAPI) to update all information.

```
python update_data_by_API.py
```

Then, using `update_latest_data.py` to fresh latest data. (only part of the reservoirs)

```
python update_latest_data.py
```

## Thanks
Thanks to washwashsleep members for [TaiwanReservoirAPI](https://github.com/washwashsleep/TaiwanReservoirAPI)

## License
MIT
