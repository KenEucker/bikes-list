FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY apps/admin/package.json apps/admin/
COPY packages/shared/package.json packages/shared/

RUN npm install

COPY . .

RUN npm run -w apps/admin build

EXPOSE 3002

CMD ["npm", "run", "-w", "apps/admin", "start"]
