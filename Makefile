install:
	docker compose up -d

app:
	docker compose exec app bash

stop:
	docker compose down

up:
	make stop
	docker compose up -d