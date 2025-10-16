.PHONY: build debug login logs


build:
	docker-compose build

down:
	docker-compose down api

setup:
	docker network create shared-services 2>/dev/null & docker-compose run -w /application api /bin/bash -c "npm install && npx prisma generate && npx prisma migrate dev"

debug: down
	WATCH_FILES=1 DEBUG=1 docker-compose up -d

login:
	docker-compose run -w /application api /bin/bash

logs: 
	docker compose logs api --tail=10 -f

run-all: down build down setup down debug logs 