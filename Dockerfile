FROM node:23-slim

WORKDIR /app

COPY package*.json ./

RUN apt-get update -y && apt-get install -y openssl

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]