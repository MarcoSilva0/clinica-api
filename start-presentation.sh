#!/bin/bash

echo "🚀 Preparando ambiente para apresentação da Clínica API..."

if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env para apresentação..."
    cp .env.presentation .env
    echo "✅ Arquivo .env configurado automaticamente para apresentação"
else
    echo "📋 Arquivo .env já existe. Usando configuração atual."
    echo "💡 Para usar configuração de apresentação: cp .env.presentation .env"
fi

echo "🧹 Limpando containers antigos..."
docker-compose down -v

echo "🔨 Construindo e iniciando os serviços..."
docker-compose up --build -d

echo "⏳ Aguardando serviços ficarem prontos..."
sleep 10

echo "📊 Executando migrações do banco de dados..."
docker-compose exec api_clinicup yarn prisma migrate deploy

echo "🔧 Gerando cliente Prisma..."
docker-compose exec api_clinicup yarn prisma generate

echo "✅ Verificando status dos serviços..."
docker-compose ps

echo ""
echo "🎉 Aplicação pronta para apresentação!"
echo "📱 API disponível em: http://localhost:3001"
echo "🗄️  Banco de dados disponível em: localhost:5432"
echo ""
echo "Para ver os logs: docker-compose logs -f"
echo "Para parar: docker-compose down"
