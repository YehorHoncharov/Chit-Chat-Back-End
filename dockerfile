FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install

COPY . .

RUN bunx prisma generate

RUN bun run build

RUN powershell -Command "New-Item -ItemType Directory -Force dist/generated | Out-Null; Copy-Item -Recurse -Force src/generated/* dist/generated" || true

EXPOSE 3000

CMD ["bun", "dist/index.js"]
