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

echo "Iniciando LEME Contratos..."
echo "Aplicando migrations do banco. Se o PostgreSQL ainda estiver iniciando, o sistema vai tentar novamente."

attempt=1
max_attempts=12
until npx prisma migrate deploy; do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "ERRO: não foi possível conectar/aplicar migrations no PostgreSQL depois de $max_attempts tentativas."
    echo "Confira a DATABASE_URL, principalmente host, usuário, senha e nome do banco."
    exit 1
  fi
  echo "PostgreSQL ainda não respondeu. Tentativa $attempt/$max_attempts. Nova tentativa em 5 segundos..."
  attempt=$((attempt + 1))
  sleep 5
done

echo "Criando/atualizando usuário administrador e dados iniciais..."
node scripts/seed.mjs

echo "LEME Contratos pronto. Subindo Next.js na porta 3000..."
exec npm run start
