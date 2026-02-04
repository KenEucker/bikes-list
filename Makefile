.PHONY: build up down restart shell composer npm install-deps setup

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

shell:
	docker-compose exec app bash

composer:
	docker-compose exec app composer $(ARGS)

npm:
	docker-compose exec app npm $(ARGS)

install-deps:
	docker-compose exec app composer install
	docker-compose exec app npm install

setup:
	docker-compose up -d db redis meilisearch
	sleep 5
	docker-compose exec app composer install
	docker-compose exec app npm install
	docker-compose exec app php artisan key:generate
	docker-compose exec app php artisan migrate

logs:
	docker-compose logs -f app

worker:
	docker-compose up -d worker
