cd /home/ice479/reservoir-visual-data
python update_data_by_API.py
git pull
git add .
git commit -m 'update data'
git push origin data
