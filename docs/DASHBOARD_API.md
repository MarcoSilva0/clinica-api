# Dashboard API - Sistema de Clínica

Esta documentação descreve os endpoints da API de dashboard que atendem aos requisitos de exibição em tempo real para pacientes em painéis digitais.

## Características Principais

- ✅ **Acesso Público**: Todos os endpoints podem ser acessados sem autenticação
- ✅ **Dados em Tempo Real**: Informações atualizadas sobre agendamentos do dia atual
- ✅ **Filtros por Tipo de Exame**: Permite exibir apenas tipos específicos de exames
- ✅ **Cálculo de Tempo Médio**: Calcula tempo médio de atendimento baseado nos atendimentos finalizados do dia
- ✅ **Tempo Estimado de Espera**: Calcula estimativa de espera para cada paciente na fila

## Endpoints Disponíveis

### 1. Dashboard Completa - `GET /dashboard/real-time`

Retorna todos os dados necessários para a dashboard completa.

**Query Parameters:**
- `examTypeIds` (opcional): Lista de IDs de tipos de exame separados por vírgula
  - Exemplo: `?examTypeIds=uuid1,uuid2,uuid3`

**Resposta:**
```json
{
  "confirmed": [
    {
      "id": "uuid",
      "patient_name": "João Silva",
      "patient_cpf": "12345678901",
      "date_start": "2025-06-25T10:00:00.000Z",
      "examsType": {
        "id": "uuid",
        "name": "Raio-X",
        "defaultDuration": "30 minutos"
      },
      "estimatedWaitTimeMinutes": 45,
      "positionInQueue": 2
    }
  ],
  "finished": [
    {
      "id": "uuid",
      "patient_name": "Maria Santos",
      "patient_cpf": "98765432109",
      "date_start": "2025-06-25T09:00:00.000Z",
      "finishedDate": "2025-06-25T09:35:00.000Z",
      "examsType": {
        "id": "uuid",
        "name": "Raio-X"
      },
      "actualDurationMinutes": 35
    }
  ],
  "inProgress": [
    {
      "id": "uuid",
      "patient_name": "Pedro Costa",
      "patient_cpf": "11122233344",
      "date_start": "2025-06-25T10:30:00.000Z",
      "examsType": {
        "id": "uuid",
        "name": "Ultrassom"
      }
    }
  ],
  "averageTimes": [
    {
      "examTypeId": "uuid",
      "examTypeName": "Raio-X",
      "defaultDuration": "30 minutos",
      "averageTimeMinutes": 35
    }
  ],
  "currentDateTime": "2025-06-25T15:30:00.000Z"
}
```

### 2. Fila de Espera - `GET /dashboard/waiting-queue`

Retorna apenas os pacientes confirmados em espera.

**Resposta:**
```json
{
  "waitingPatients": [
    {
      "id": "uuid",
      "patient_name": "João Silva",
      "estimatedWaitTimeMinutes": 45,
      "positionInQueue": 2,
      "examsType": {
        "name": "Raio-X"
      }
    }
  ],
  "currentDateTime": "2025-06-25T15:30:00.000Z",
  "averageTimes": [...]
}
```

### 3. Atendimentos Finalizados - `GET /dashboard/finished-appointments`

Retorna apenas os atendimentos já finalizados do dia.

**Resposta:**
```json
{
  "finishedAppointments": [
    {
      "id": "uuid",
      "patient_name": "Maria Santos",
      "date_start": "2025-06-25T09:00:00.000Z",
      "finishedDate": "2025-06-25T09:35:00.000Z",
      "actualDurationMinutes": 35,
      "examsType": {
        "name": "Raio-X"
      }
    }
  ],
  "currentDateTime": "2025-06-25T15:30:00.000Z"
}
```

### 4. Resumo por Tipo de Exame - `GET /dashboard/exam-types-summary`

Retorna estatísticas resumidas por tipo de exame.

**Resposta:**
```json
[
  {
    "examType": {
      "examTypeId": "uuid",
      "examTypeName": "Raio-X",
      "defaultDuration": "30 minutos",
      "averageTimeMinutes": 35
    },
    "stats": {
      "confirmed": 3,
      "finished": 5,
      "inProgress": 1,
      "total": 9
    }
  }
]
```

### 5. Tipos de Exame Disponíveis - `GET /dashboard/exam-types`

Retorna a lista de tipos de exame ativos para configuração de filtros.

**Resposta:**
```json
[
  {
    "examTypeId": "uuid",
    "examTypeName": "Raio-X",
    "defaultDuration": "30 minutos",
    "averageTimeMinutes": 35
  },
  {
    "examTypeId": "uuid2",
    "examTypeName": "Ultrassom",
    "defaultDuration": "45 minutos",
    "averageTimeMinutes": 50
  }
]
```

### 6. Informações de Tempo - `GET /dashboard/time-info`

Retorna informações básicas de tempo e contadores.

**Resposta:**
```json
{
  "currentDateTime": "2025-06-25T15:30:00.000Z",
  "totalWaiting": 8,
  "totalFinished": 12,
  "totalInProgress": 2,
  "averageTimes": [...]
}
```

## Como Calcular Tempos

### Tempo Médio de Atendimento
- Calculado baseado nos atendimentos **finalizados** do dia atual
- Usa a diferença entre `date_start` e `finishedDate`
- Se não houver atendimentos finalizados, retorna 0

### Tempo Estimado de Espera
- **Para pacientes confirmados**: 
  - Considera posição na fila × tempo médio de atendimento
  - Adiciona tempo restante estimado dos atendimentos em andamento
- **Fórmula**: `(posição_na_fila × tempo_médio) + (atendimentos_em_andamento × tempo_médio/2)`

## Exemplos de Uso

### Dashboard para Raio-X apenas
```
GET /dashboard/real-time?examTypeIds=uuid-raio-x
```

### Dashboard para múltiplos tipos
```
GET /dashboard/real-time?examTypeIds=uuid-raio-x,uuid-ultrassom,uuid-tomografia
```

### Fila de espera para todos os tipos
```
GET /dashboard/waiting-queue
```

## Considerações Técnicas

1. **Atualização**: Recomenda-se fazer polling a cada 30-60 segundos para atualizar os dados
2. **Performance**: Os endpoints são otimizados para consultas rápidas
3. **Filtros**: Use filtros por tipo de exame para reduzir a carga visual em painéis
4. **Responsividade**: Dados formatados para fácil consumo por interfaces frontend

## Casos de Uso

1. **Painel Principal**: Use `/dashboard/real-time` para exibir informações completas
2. **Painel por Setor**: Use filtros `examTypeIds` para mostrar apenas tipos específicos
3. **Monitor de Fila**: Use `/dashboard/waiting-queue` para focar apenas na espera
4. **Histórico do Dia**: Use `/dashboard/finished-appointments` para mostrar atendimentos concluídos
5. **Configuração**: Use `/dashboard/exam-types` para permitir seleção de filtros na interface
