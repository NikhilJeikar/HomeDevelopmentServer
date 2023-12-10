venv: requirements.txt
	python3 -m venv .venv
	source .venv/bin/activate
	pip3 install -r requirements.txt

start-backend:
	source .venv/bin/activate && python3 main.py

start-ui:
	cd ui && npm start

start-db:
	cd docker && docker compose up


