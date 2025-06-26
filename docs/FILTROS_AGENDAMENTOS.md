# Filtros e Ordenação de Agendamentos

Esta documentação descreve como usar os filtros e ordenação na API de agendamentos.

## Endpoint

`GET /appoiments`

## Parâmetros de Filtro

### Paginação
- `page` (number): Número da página (padrão: 1)
- `pageSize` (number): Número de itens por página (padrão: 10)

### Filtros de Busca
- `search` (string): Busca por nome, email, CPF ou telefone do paciente
- `examsTypeId` (string): Filtrar por ID do tipo de exame
- `status` (AppoimentsStatus): Filtrar por status do agendamento
- `startDate` (string): Data de início para filtro por período (formato: YYYY-MM-DD)
- `endDate` (string): Data de fim para filtro por período (formato: YYYY-MM-DD)

## Ordenação Múltipla

### Nova Funcionalidade - Array de Ordenação
Use o parâmetro `orderBy` como um array de objetos para ordenação múltipla:

```json
{
  "orderBy": [
    { "field": "status", "direction": "asc" },
    { "field": "date_start", "direction": "desc" },
    { "field": "confirmationDate", "direction": "asc" }
  ]
}
```

### Campos Disponíveis para Ordenação
- `createdAt`: Data de criação do agendamento
- `status`: Status do agendamento
- `confirmationDate`: Data de confirmação
- `date_start`: Data/hora de início do agendamento

### Direções de Ordenação
- `asc`: Crescente
- `desc`: Decrescente

## Exemplos de Uso

### 1. Ordenação Simples (Retrocompatibilidade)
```bash
GET /appoiments?singleOrderBy=createdAt&orderDirection=desc
```

### 2. Ordenação Múltipla - Prioridade por Status, depois por Data
```bash
GET /appoiments?orderBy[0][field]=status&orderBy[0][direction]=asc&orderBy[1][field]=date_start&orderBy[1][direction]=desc
```

### 3. Filtro Completo com Ordenação Múltipla
```bash
GET /appoiments?search=João&status=CONFIRMED&startDate=2025-06-25&endDate=2025-06-30&orderBy[0][field]=status&orderBy[0][direction]=asc&orderBy[1][field]=confirmationDate&orderBy[1][direction]=desc
```

### 4. Usando JSON no Body (para requisições POST se necessário)
```json
{
  "page": 1,
  "pageSize": 20,
  "search": "João Silva",
  "status": "CONFIRMED",
  "startDate": "2025-06-25",
  "endDate": "2025-06-30",
  "orderBy": [
    { "field": "status", "direction": "asc" },
    { "field": "date_start", "direction": "desc" },
    { "field": "confirmationDate", "direction": "asc" }
  ]
}
```

## Casos de Uso Comuns

### 1. Lista de Agendamentos Priorizados
Ordenar por status (pendentes primeiro) e depois por data de agendamento:
```json
{
  "orderBy": [
    { "field": "status", "direction": "asc" },
    { "field": "date_start", "direction": "asc" }
  ]
}
```

### 2. Agendamentos Confirmados Mais Recentes
Filtrar apenas confirmados e ordenar por data de confirmação:
```json
{
  "status": "CONFIRMED",
  "orderBy": [
    { "field": "confirmationDate", "direction": "desc" }
  ]
}
```

### 3. Dashboard de Atendimento
Ordenar por status e hora de início para visualização em tempo real:
```json
{
  "startDate": "2025-06-25",
  "endDate": "2025-06-25",
  "orderBy": [
    { "field": "status", "direction": "asc" },
    { "field": "date_start", "direction": "asc" }
  ]
}
```

## Resposta da API

A resposta segue o padrão de paginação:

```json
{
  "data": [...], // Array de agendamentos
  "totalPages": 10,
  "currentPage": 1,
  "totalItems": 95
}
```

## Status de Agendamentos

Os possíveis valores para o campo `status` são definidos no enum `AppoimentsStatus` do Prisma.
