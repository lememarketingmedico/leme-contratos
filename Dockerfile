FROM node:20-bookworm-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Necessário para o Prisma funcionar corretamente dentro do Docker.
# Sem isso o EasyPanel pode mostrar erro de OpenSSL/libssl.
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Importante: usar npm ci e instalar devDependencies no build.
# Isso evita o npx baixar Prisma 7 automaticamente no EasyPanel.
RUN npm ci --include=dev

COPY . .

# Confere se o repositório enviado ao EasyPanel está completo.
RUN test -f lib/db.ts && test -f lib/auth.ts && test -f lib/contractHtml.ts && test -f lib/n8nPdf.ts

# Usa o Prisma local fixado no package-lock, não o Prisma mais novo da internet.
RUN ./node_modules/.bin/prisma generate
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "./scripts/start.sh"]
