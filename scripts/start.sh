#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "ERRO: DATABASE_URL não foi configurada. Configure as variáveis de ambiente no EasyPanel."
  exit 1
fi

if [ -z "$APP_SECRET" ]; then
  echo "ERRO: APP_SECRET não foi configurado. Configure as variáveis de ambiente no EasyPanel."
  exit 1
fi

export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"

echo "Iniciando LEME Contratos..."
echo "Porta interna do app: $PORT"
echo "Host de escuta: $HOSTNAME"
echo "Sincronizando tabelas do PostgreSQL. Se o banco ainda estiver iniciando, o sistema vai tentar novamente."

attempt=1
max_attempts=24
until ./node_modules/.bin/prisma db push --skip-generate; do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "ERRO: não foi possível conectar/sincronizar o PostgreSQL depois de $max_attempts tentativas."
    echo "Confira a DATABASE_URL, principalmente host, usuário, senha codificada com %40 e nome do banco."
    exit 1
  fi
  echo "PostgreSQL ainda não respondeu ou Prisma ainda não conseguiu sincronizar. Tentativa $attempt/$max_attempts. Nova tentativa em 5 segundos..."
  attempt=$((attempt + 1))
  sleep 5
done

echo "Criando/atualizando usuário administrador e dados iniciais..."
node scripts/seed.mjs

echo "LEME Contratos pronto. Subindo Next.js em http://0.0.0.0:$PORT ..."
exec ./node_modules/.bin/next start -H 0.0.0.0 -p "$PORT"
