FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package*.json ./
COPY tsconfig.json ./

RUN pnpm install

COPY . .

RUN pnpm run build

CMD ["node", "./dist/index.js"]