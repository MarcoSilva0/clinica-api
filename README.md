# 🏥 ClinicUp API - Sistema de Gestão para Clínicas

[![NestJS](https://img.shields.io/badge/NestJS-10.0-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.6-darkgreen.svg)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

## 📋 Sobre o Projeto

**ClinicUp API** é um sistema completo de gestão para clínicas médicas, desenvolvido com **NestJS**, **TypeScript** e **PostgreSQL**. O sistema oferece funcionalidades avançadas para gerenciamento de pacientes, agendamentos, tipos de exames e dashboards em tempo real.

### 🎯 Principais Características

- ✅ **Sistema de Autenticação JWT** com controle de acesso por roles
- ✅ **Gestão Completa de Usuários** (Admin/Secretária)
- ✅ **Agendamento de Consultas** com status dinâmicos
- ✅ **Tipos de Exames** configuráveis
- ✅ **Lista de Espera** inteligente
- ✅ **Dashboard em Tempo Real** para painéis públicos
- ✅ **Sistema de Email** automatizado
- ✅ **Upload de Arquivos** (fotos de perfil)
- ✅ **Documentação Swagger** completa
- ✅ **Containerização Docker** para deploy
- ✅ **Middleware de Inicialização** do sistema

## 🚀 Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Superset JavaScript com tipagem estática
- **Prisma** - ORM moderno para TypeScript/Node.js
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **BCrypt** - Hash de senhas
- **Nodemailer** - Envio de emails
- **Multer** - Upload de arquivos
- **Swagger** - Documentação automática da API

### DevOps & Deploy
- **Docker** & **Docker Compose** - Containerização
- **Git** - Controle de versão
- **ESLint** & **Prettier** - Qualidade de código

## 📦 Funcionalidades Detalhadas

### 🔐 **Autenticação & Autorização**
- Login com email/senha
- JWT tokens com expiração
- Reset de senha via email
- Controle de acesso por roles (ADMIN/SECRETARIA)
- Middleware de verificação de inicialização

### 👥 **Gestão de Usuários**
- CRUD completo de usuários
- Upload de foto de perfil
- Alteração de email com confirmação
- Ativação/desativação de contas
- Busca e filtros avançados

### 📅 **Sistema de Agendamentos**
- Criação de agendamentos
- Múltiplos status (Agendado, Confirmado, Em Atendimento, etc.)
- Busca por paciente (CPF, nome, email)
- Filtros por data, tipo de exame, status
- Lista de espera automática

### 🔬 **Tipos de Exames**
- Cadastro de tipos de exames
- Duração padrão configurável
- Ativação/desativação
- Vinculação com agendamentos

### 📊 **Dashboard em Tempo Real**
- **Dashboard Pública** (sem autenticação) para painéis
- Fila de espera em tempo real
- Atendimentos em progresso
- Histórico de atendimentos finalizados
- Tempo médio por tipo de exame
- Estimativa de tempo de espera
- Filtros por tipo de exame

### 📧 **Sistema de Email**
- Templates personalizados
- Reset de senha
- Confirmação de alterações
- Notificações automáticas

### 🗂️ **Upload de Arquivos**
- Upload de fotos de perfil
- Validação de tamanho (max 2MB)
- Armazenamento organizado por pastas

## 🛠️ Como Executar o Projeto

### 📋 Pré-requisitos
- **Docker** e **Docker Compose** instalados
- **Git** para clonar o repositório
- Porta **3001** disponível para a API
- Porta **5432** disponível para PostgreSQL

### 🚀 Execução Rápida (Recomendado)

1. **Clone o repositório:**
   ```bash
   git clone [url-do-repositorio]
   cd clinica-api
   ```

2. **Execute o script de apresentação:**
   ```bash
   chmod +x start-presentation.sh
   ./start-presentation.sh
   ```

3. **Acesse a aplicação:**
   - **API**: http://localhost:3001
   - **Swagger**: http://localhost:3001/api
   - **Health Check**: http://localhost:3001/health

### ⚙️ Execução Manual

1. **Configure o ambiente:**
   ```bash
   cp .env.presentation .env
   # Edite o .env se necessário
   ```

2. **Suba os containers:**
   ```bash
   docker-compose up --build -d
   ```

3. **Execute as migrações:**
   ```bash
   docker-compose exec api_clinicup yarn prisma migrate deploy
   docker-compose exec api_clinicup yarn prisma generate
   ```

### 🔧 Desenvolvimento Local

```bash
# Instalar dependências
yarn install

# Configurar banco local
createdb clinicadb

# Executar migrações
yarn prisma migrate dev

# Modo desenvolvimento
yarn start:dev

# Visualizar banco de dados
yarn prisma studio
```

## 📡 Endpoints da API

### 🔐 Autenticação (`/auth`)
- `POST /auth/login` - Login do usuário
- `GET /auth/profile` - Perfil do usuário logado
- `POST /auth/request-password-reset` - Solicitar reset de senha
- `POST /auth/reset-password` - Redefinir senha
- `POST /auth/reset-temporary-password` - Reset de senha temporária

### 👥 Usuários (`/users`)
- `GET /users` - Listar usuários (paginado)
- `POST /users` - Criar usuário
- `GET /users/:id` - Buscar usuário por ID
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Remover usuário
- `PATCH /users/:id/status` - Alterar status ativo/inativo
- `PATCH /users/:id/photo` - Atualizar foto do usuário
- `POST /users/:id/request-change-email` - Solicitar mudança de email
- `POST /users/:id/confirm-email-change` - Confirmar mudança de email

### 📅 Agendamentos (`/appoiments`)
- `GET /appoiments` - Listar agendamentos (paginado, público)
- `POST /appoiments` - Criar agendamento
- `GET /appoiments/:id` - Buscar agendamento por ID
- `PUT /appoiments/:id` - Atualizar agendamento
- `PATCH /appoiments/:id/status` - Alterar status do agendamento
- `POST /appoiments/:cpf/confirmed` - Agendamentos confirmados por CPF (público)

### 🔬 Tipos de Exames (`/exams-types`)
- `GET /exams-types` - Listar tipos de exames (público)
- `POST /exams-types` - Criar tipo de exame
- `GET /exams-types/:id` - Buscar tipo de exame por ID
- `PUT /exams-types/:id` - Atualizar tipo de exame
- `DELETE /exams-types/:id` - Remover tipo de exame
- `PATCH /exams-types/:id/status` - Alterar status ativo/inativo

### 📊 Dashboard (`/dashboard`) - **Público**
- `GET /dashboard/real-time` - Dashboard completa em tempo real
- `GET /dashboard/waiting-queue` - Fila de espera
- `GET /dashboard/finished-appointments` - Atendimentos finalizados
- `GET /dashboard/exam-types-summary` - Resumo por tipo de exame
- `GET /dashboard/exam-types` - Tipos de exame ativos
- `GET /dashboard/time-info` - Informações de tempo

### 📊 Dashboard Admin (`/dashboard`) - **Autenticado**
- `GET /dashboard` - Estatísticas administrativas

### ⚙️ Configuração do Sistema (`/setup`) - **Setup Inicial**
- `POST /setup` - Configuração inicial do sistema (público)
- `GET /setup/status` - Status de inicialização (público)
- `PUT /setup/max-wait-time` - Atualizar tempo máximo de espera
- `GET /setup/max-wait-time` - Obter tempo máximo de espera (público)

### 📎 Upload (`/upload`)
- `GET /upload/:path` - Visualizar arquivo
- `GET /upload/:folder/:path` - Visualizar arquivo em pasta

## 🔒 Autenticação e Autorização

### Roles do Sistema
- **ADMIN**: Acesso completo ao sistema
- **SECRETARIA**: Acesso limitado às funcionalidades operacionais

### Endpoints Públicos (sem autenticação)
- Todos os endpoints de `/dashboard/*`
- `/setup/status` e `/setup` (apenas configuração inicial)
- `/appoiments` (listagem e consulta por CPF)
- `/exams-types` (apenas listagem)
- `/auth/login`, `/auth/request-password-reset`, `/auth/reset-password`

## 📊 Dashboard Público

O sistema possui uma **dashboard pública** especialmente desenvolvida para exibição em **painéis digitais** ou **TVs** nas clínicas:

### Características da Dashboard
- ✅ **Acesso sem autenticação**
- ✅ **Atualização em tempo real**
- ✅ **Fila de espera com estimativas**
- ✅ **Status dos atendimentos**
- ✅ **Filtros por tipo de exame**
- ✅ **Tempo médio de atendimento**
- ✅ **Responsiva para diferentes tamanhos de tela**

### Casos de Uso
1. **Painel Principal**: `GET /dashboard/real-time`
2. **Monitor de Fila**: `GET /dashboard/waiting-queue`
3. **Histórico do Dia**: `GET /dashboard/finished-appointments`
4. **Por Setor**: Use `?examTypeIds=uuid1,uuid2` para filtrar

## 🗄️ Banco de Dados

### Principais Modelos
- **Users** - Usuários do sistema (Admin/Secretária)
- **Appoiments** - Agendamentos de consultas
- **ExamTypes** - Tipos de exames disponíveis
- **SystemConfig** - Configurações gerais do sistema
- **ResetEmail** - Tokens para reset de email

### Status dos Agendamentos
- `SCHEDULED` - Agendado
- `CONFIRMED` - Confirmado
- `WAITING_APPOIMENT` - Aguardando atendimento
- `IN_APPOINTMENT` - Em atendimento
- `FINISIHED` - Finalizado
- `CANCELED` - Cancelado
- `GIVEN_UP` - Desistência
- `NO_SHOW` - Não compareceu

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
yarn start:dev          # Modo desenvolvimento com watch
yarn start:debug        # Modo debug
yarn start:prod         # Modo produção

# Build e Deploy
yarn build              # Build da aplicação
docker-compose up       # Subir com Docker

# Banco de Dados
yarn prisma migrate dev # Criar/aplicar migrações
yarn prisma studio      # Interface visual do banco
yarn prisma generate    # Gerar cliente Prisma

# Testes
yarn test               # Testes unitários
yarn test:e2e          # Testes end-to-end
yarn test:cov          # Coverage dos testes

# Qualidade de Código
yarn lint              # ESLint
yarn format           # Prettier
```

## 📁 Estrutura do Projeto

```
src/
├── auth/              # Autenticação e autorização
├── users/             # Gestão de usuários
├── appoiments/        # Sistema de agendamentos
├── exam-types/        # Tipos de exames
├── dashboard/         # Dashboard administrativo
├── system-config/     # Configurações do sistema
├── upload/            # Upload de arquivos
├── mailer/            # Sistema de emails
├── prisma/            # Configuração do Prisma
└── core/              # Utilitários e decorators
```

## 🐳 Docker

O projeto inclui configuração completa para Docker:

- **Dockerfile** otimizado com multi-stage build
- **docker-compose.yml** com PostgreSQL e healthchecks
- **Migrations automáticas** na inicialização
- **Volumes persistentes** para dados do banco

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvimento

Desenvolvido para otimizar a gestão de clínicas médicas com foco em:
- **Performance** e **escalabilidade**
- **Experiência do usuário**
- **Segurança** dos dados
- **Facilidade de deploy**
- **Dashboards em tempo real**

---

**📱 API Documentation**: http://localhost:3001/api
**🔗 Health Check**: http://localhost:3001/health
**📊 Dashboard**: http://localhost:3001/dashboard/real-time
