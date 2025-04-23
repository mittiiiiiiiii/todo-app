install:
	docker compose up -d
	docker compose exec app npx prisma migrate dev --name init
	docker compose exec app npx prisma generate

app:
	docker compose exec app bash

stop:
	docker compose down

up:
	make stop
	docker compose up -d