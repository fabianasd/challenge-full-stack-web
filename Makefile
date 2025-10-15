.PHONY: build debug login logs

build: 
	docker compose build --no-cache api

debug: 
	docker compose up -d

login:
	docker compose run -w /app api /bin/bash

logs: 
	docker compose logs api --tail=10 -f