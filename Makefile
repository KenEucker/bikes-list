.PHONY: build up down restart shell composer npm install-deps setup env reset-env

# Ensure laravel/.env exists before compose (env_file requires it to exist)
env:
	@test -f laravel/.env || (cp laravel/.env.example laravel/.env 2>/dev/null && echo "Created laravel/.env from .env.example") || (touch laravel/.env && echo "Created empty laravel/.env")

# Reset laravel/.env to clean state from .env.example (removes corruption/duplicates)
reset-env:
	@cp laravel/.env.example laravel/.env && echo "Reset laravel/.env from .env.example"

# Merge root .env into laravel/.env (runs on HOST before up - container never touches .env)
merge-env:
	@if [ -f .env ] && [ -f laravel/.env ]; then php docker/merge-env.php laravel/.env .env && echo "Merged .env into laravel/.env"; fi

build: env
	docker-compose build

up: env merge-env
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
