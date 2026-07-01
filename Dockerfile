FROM node:20-bookworm-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV PRISMA_HIDE_UPDATE_MESSAGE=true
ENV npm_config_registry=https://registry.npmjs.org/

# Necessário para o Prisma funcionar corretamente dentro do Docker.
# Sem isso o EasyPanel pode mostrar erro de OpenSSL/libssl.
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copia só o package.json. Não copiamos package-lock aqui porque alguns locks gerados fora da VPS
# podem apontar para registries privados e travar o npm no EasyPanel.
COPY package.json ./

# Atualiza o npm e instala dependências sem usar package-lock.
# Isso evita o erro "Exit handler never called" e impede o npx de puxar Prisma 7.
RUN npm config set registry https://registry.npmjs.org/ \
  && npm install -g npm@10.9.2 --no-audit --no-fund \
  && npm --version \
  && npm install --include=dev --no-audit --no-fund --legacy-peer-deps --package-lock=false --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000 \
  && test -x ./node_modules/.bin/prisma \
  && ./node_modules/.bin/prisma --version

COPY . .

# Confere se o repositório enviado ao EasyPanel está completo.
RUN test -f lib/db.ts && test -f lib/auth.ts && test -f lib/contractHtml.ts && test -f lib/n8nPdf.ts

# Usa o Prisma local fixado no package.json, não o Prisma mais novo da internet.
RUN ./node_modules/.bin/prisma generate
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "./scripts/start.sh"]
