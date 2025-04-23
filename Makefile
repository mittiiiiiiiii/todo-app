install:
	docker compose up -d
	make migrate

app:
	docker compose exec app bash:

stop:
	docker compose stop

restart:
	make down
	make install

logs:
	docker compose logs -f

start:
	docker compose start

down:
	docker compose down

up:
	docker compose up -d

migrate:
	docker compose exec app npx prisma migrate dev --name init
	docker compose exec app npx prisma generate

reset:
	docker compose exec app npx prisma migrate reset --force
	make migrate

studio:
	docker compose exec app npx prisma studio