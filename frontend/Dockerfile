FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas os arquivos de dependências
COPY package*.json ./

# Instala dependências com cache eficiente
RUN npm ci

# Copia o restante do código
COPY . .

# Gera build de produção com output standalone
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copia só o necessário para rodar
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expõe a porta usada pelo Next.js
EXPOSE 3000

CMD ["node", "server.js"]