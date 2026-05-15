# PRD — Sistema de Controle de Vagas TFD (Tratamento Fora do Domicílio)

**Versão:** 2.0  
**Data:** Março/2026  
**Status:** Revisado — substitui a versão 1.0

---

## 1. Visão Geral

Este documento descreve os requisitos para o desenvolvimento de um sistema de controle de vagas para o Tratamento Fora do Domicílio (TFD). O objetivo é substituir o uso atual de documentos Word e planilhas armazenados no Google Drive por um sistema centralizado, seguro e organizado.

> **Nota sobre terminologia:** Este sistema **não é um sistema de filas**. O modelo de negócio real é de **reserva de vagas em viagens específicas**. Um paciente obtém (ou não) uma vaga em uma viagem com data, destino e capacidade definidos. Não existe posição de espera — ou há vaga disponível, ou o paciente busca outra viagem.

---

## 2. Objetivos do Sistema

- Controlar a solicitação e autorização de vagas em viagens TFD.
- Gerenciar rotas, viagens e ocupação de vagas por paciente e acompanhante.
- Registrar o histórico de viagens e ausências de cada paciente.
- Armazenar documentos de suporte ao TFD.
- Gerar a lista de pacientes para o setor de transporte em formato PDF.

---

## 3. Escopo

O sistema cobre o controle administrativo do TFD, desde a solicitação de vaga até a geração da lista para o setor de transporte. Não inclui regulação médica externa nem integração com sistemas estaduais.

---

## 4. Fluxo do Processo TFD

1. O paciente solicita uma vaga para uma viagem TFD (demanda espontânea, regulação ou encaminhamento).
2. A recepcionista verifica a disponibilidade de vagas nas viagens compatíveis com a data da consulta do paciente.
3. Se houver vaga na viagem ideal (a mais próxima antes da consulta), a vaga é reservada.
4. Se a viagem ideal estiver lotada, a recepcionista analisa e realoca manualmente o paciente para a viagem anterior disponível.
5. Os dados são enviados ao setor de transporte via PDF gerado pelo sistema.
6. No dia da viagem, o paciente deve comparecer. Em caso de ausência, a vaga é perdida e uma nova solicitação deve ser feita do zero.

---

## 5. Regras de Negócio

- A reserva de vaga é definitiva após autorização.
- A ausência não justificada implica perda da vaga, sem recolocação automática — o paciente deve realizar nova solicitação.
- Se uma viagem for cancelada (veículo quebrado, feriado, etc.), o gestor cancela a viagem no sistema, as vagas são liberadas e a comunicação com os pacientes é feita manualmente fora do sistema.
- Acompanhantes ocupam vagas no veículo e devem ser contabilizados na capacidade.
- Um veículo serve apenas um destino (ou rota) por viagem.
- A recepcionista realoca pacientes manualmente quando necessário — o sistema apoia com visibilidade das vagas, mas não realoca automaticamente.
- **Campo obrigatório na reserva:** a data da consulta do paciente, pois define qual é a última viagem viável antes do atendimento.

---

## 6. Perfis e Usuários

O sistema deve possuir autenticação por usuário e autorização por cargo. Cada usuário pertence a um único perfil, e as permissões determinam quais ações podem ser executadas no sistema.

| Perfil            | Permissões                                                                 |
| ----------------- | -------------------------------------------------------------------------- |
| **Coordenador**   | Visualiza tudo, edita tudo e cria outros usuários                          |
| **Recepcionista** | Visualiza, cria e edita pacientes; cria reservas de viagens                |
| **Transporte**    | Visualiza as informações necessárias para operação e impressão das viagens |

Regras de acesso:

- Todos os usuários devem se autenticar para acessar o sistema, exceto endpoints técnicos públicos, como verificação de saúde.
- Apenas o Coordenador pode criar, editar, ativar ou desativar usuários.
- O Coordenador possui permissão total sobre cadastros, rotas, viagens, reservas, relatórios e usuários.
- A Recepcionista pode consultar informações operacionais, manter o cadastro de pacientes e criar/atualizar reservas de viagem.
- O perfil Transporte é somente leitura, voltado à consulta das listas e informações necessárias para a execução das viagens.

---

## 7. Direito a Acompanhante

A prioridade **não altera a alocação de vagas** — a ordem de reserva é determinada pela disponibilidade no momento da solicitação. A classificação de prioridade serve exclusivamente para determinar o **direito a acompanhante**, que ocupa uma vaga adicional no veículo.

**Critérios que garantem direito a acompanhante:**

- Apresentação de laudo médico
- Idade acima de 60 anos _(validado automaticamente pelo sistema via data de nascimento)_
- Idade abaixo de 18 anos _(validado automaticamente pelo sistema via data de nascimento)_
- Paciente oncológico
- Paciente em hemodiálise
- Deficiência auditiva
- Analfabetismo

**Tipos de prioridade registrados (apenas para fins de identificação do paciente):**

- Urgência médica
- Judicial
- Oncológico
- Criança
- Idoso
- Regulação

---

## 8. Rotas e Viagens

### 8.1 Modelo de dados

O sistema distingue entre **Rota** (configuração recorrente) e **Viagem** (instância específica de uma rota em uma data).

**Rota** define: destino(s), dias fixos de operação, capacidade padrão e tipo de transporte.  
**Viagem** é uma instância da rota em uma data específica, com status próprio (ativa ou cancelada) e capacidade que pode diferir do padrão.

### 8.2 Rotas existentes

| Rota                 | Destino(s)                 | Frequência              | Observação                                                    |
| -------------------- | -------------------------- | ----------------------- | ------------------------------------------------------------- |
| Juazeiro / Petrolina | Juazeiro BA e Petrolina PE | Segunda a Sexta         | Mesma rota, mesmo veículo, vagas compartilhadas               |
| Salvador             | Salvador BA                | Domingo, Terça e Quinta | —                                                             |
| Remanso              | Remanso BA                 | Sob demanda             | Criada pelo gestor conforme demanda para o Hospital São Pedro |

### 8.3 Regras de gestão de viagens

- As rotas são pré-cadastradas com seus dias fixos. O sistema gera as instâncias de viagem automaticamente (ou sob confirmação do gestor).
- O gestor pode adicionar viagens extras (ex: sábado para Salvador) ou cancelar uma viagem específica.
- Viagens de Remanso são criadas manualmente pelo gestor quando há pacientes com procedimentos no Hospital São Pedro.

### 8.4 Rota Juazeiro / Petrolina

Apesar de compartilharem o mesmo veículo e as vagas serem contabilizadas em conjunto, cada paciente deve ter seu **destino final registrado individualmente** (Juazeiro ou Petrolina), pois a lista do motorista precisa dessa informação para a operação da viagem.

### 8.5 Tipos de transporte

- Ônibus
- Carro
- Ambulância

_Exemplo de referência: ônibus para Salvador com capacidade entre 24 e 27 vagas._

---

## 9. Dados do Paciente

Campos obrigatórios no cadastro:

- Nome completo
- CPF
- Cartão SUS
- Data de nascimento _(usada para validação automática de direito a acompanhante)_
- Telefone
- Endereço completo

---

## 10. Reserva de Vaga

Cada reserva registra:

- Paciente
- Viagem (rota + data)
- Destino final do paciente (obrigatório para rotas com múltiplas paradas, ex: Juazeiro ou Petrolina)
- **Data da consulta do paciente** _(obrigatório — define a viagem viável mais próxima)_
- Se tem direito a acompanhante (validado automaticamente para idade; informado manualmente para demais critérios)
- Dados do acompanhante (quando aplicável): nome e dados básicos
- Documentos médicos anexados (encaminhamento de consulta, pedido de exame, autorização de cirurgia)
- Status da reserva: `confirmada` | `ausente` | `cancelada`

---

## 11. Documentos

É obrigatório anexar documentos que comprovem a necessidade do TFD, tais como encaminhamentos de consulta, pedidos de exame e autorizações de cirurgia. Os documentos são armazenados no sistema sem controle de validade — servem apenas como registro de suporte.

O armazenamento será feito no sistema de arquivos local via Docker Volume, eliminando custos de armazenamento em nuvem.

---

## 12. Histórico do Paciente

O sistema deve manter o histórico completo de cada paciente, incluindo: datas de viagem, destinos, status de comparecimento e registros de ausência. Esse histórico apoia a gestão e o controle administrativo.

---

## 13. Saídas do Sistema

| Saída                                             | Formato            | Destinatário           |
| ------------------------------------------------- | ------------------ | ---------------------- |
| Lista de pacientes por destino                    | PDF para impressão | Setor de transporte    |
| Lista de pacientes por viagem (com acompanhantes) | PDF para impressão | Setor de transporte    |
| Histórico de viagens por paciente                 | Tela do sistema    | Recepcionista / Gestor |

> O setor de transporte acessa o sistema somente como visualizador.

---

## 14. Stack Tecnológica e Arquitetura

| Componente                | Tecnologia                                                                  |
| ------------------------- | --------------------------------------------------------------------------- |
| Estilo de arquitetura     | Monorepo (Cliente-Servidor desacoplado)                                     |
| Backend                   | NestJS (Node.js) — API REST standalone                                      |
| Frontend                  | Next.js (App Router) + Tailwind CSS                                         |
| Banco de dados            | PostgreSQL                                                                  |
| ORM e migrations          | Drizzle ORM + Drizzle Kit                                                   |
| Infraestrutura            | Docker e Docker Compose                                                     |
| Armazenamento de arquivos | Sistema de arquivos local via Docker Volume mapeado para `/uploads` no host |

---

## 15. Estrutura de Diretórios do Monorepo

```
sist-tfd/
├── docker-compose.yml
├── README.md
├── .gitignore
│
├── docs/
│   └── PRD.md
│
├── backend/
│   ├── Dockerfile
│   ├── .env
│   ├── drizzle/
│   │   └── migrations geradas pelo Drizzle Kit
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/         # Autenticação e perfis de usuário
│   │   │   ├── patients/     # Cadastro e histórico de pacientes
│   │   │   ├── routes/       # Cadastro de rotas fixas
│   │   │   ├── trips/        # Instâncias de viagens (por data)
│   │   │   ├── bookings/     # Reservas de vagas por paciente
│   │   │   └── uploads/      # Armazenamento de documentos médicos
│   │   ├── db/
│   │   │   ├── schema.ts     # Schema Drizzle ORM
│   │   │   └── db.module.ts  # Conexão PostgreSQL
│   │   └── main.ts
│   └── uploads/
│
└── frontend/
    ├── Dockerfile
    ├── .env.local
    ├── public/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── hooks/
    │   ├── lib/
    │   └── types/
    └── tailwind.config.ts
```

---

## 16. Resumo das Principais Mudanças em Relação à Versão 1.0

| #   | Seção afetada           | Mudança                                                                                   |
| --- | ----------------------- | ----------------------------------------------------------------------------------------- |
| 1   | Título e visão geral    | Renomeado de "sistema de fila" para "sistema de reserva de vagas"                         |
| 2   | Regras de negócio       | Adicionado campo obrigatório `data_da_consulta` na reserva                                |
| 3   | Rotas e viagens         | Criada entidade `Rota` separada de `Viagem`; detalhadas as rotas existentes               |
| 4   | Rotas e viagens         | Rota Juazeiro/Petrolina documentada como rota compartilhada com destino final individual  |
| 5   | Regras de negócio       | Adicionado fluxo de cancelamento de viagem pelo gestor                                    |
| 6   | Prioridade              | Esclarecido que prioridade não altera alocação — serve apenas para direito a acompanhante |
| 7   | Acompanhante            | Incluída validação automática por data de nascimento (menor de 18 / maior de 60)          |
| 8   | Perfis e usuários       | Adicionada autenticação e autorização por três cargos: Coordenador, Recepcionista e Transporte |
| 9   | Saídas do sistema       | Especificado formato PDF para impressão; setor de transporte acessa o sistema como visualizador |
| 10  | Estrutura de diretórios | Adicionado módulo `routes/` e `bookings/` que estavam ausentes                            |
