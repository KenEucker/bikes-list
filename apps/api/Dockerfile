FROM node:20-bullseye-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl libssl1.1 \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY apps/admin/package.json apps/admin/
COPY packages/shared/package.json packages/shared/
COPY apps/api/prisma apps/api/prisma

RUN npm install

COPY . .

RUN npm run -w apps/api prisma generate
RUN npm run -w apps/api build

EXPOSE 3001

CMD ["npm", "run", "-w", "apps/api", "start"]
