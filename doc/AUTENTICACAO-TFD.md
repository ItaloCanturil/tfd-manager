# Autenticacao do TFD

## Estado atual

A autenticacao do TFD usa JWT Bearer emitido pelo backend NestJS. O login foi
alterado para trabalhar com `username` e `password`, substituindo o uso de
`email` como identificador de acesso.

## Conta de teste

Nao havia conta de teste cadastrada no backend. Foi adicionada uma migration
idempotente para criar um gestor de teste:

| Campo | Valor |
| --- | --- |
| Usuario | `gestor.teste` |
| Senha | `gestor123` |
| Perfil | `COORDINATOR` |
| Nome | `Gestor Teste TFD` |

A migration usa `ON CONFLICT ("username") DO NOTHING`, entao pode ser executada
mais de uma vez sem duplicar a conta.

## Endpoints

### `POST /api/auth/login`

Endpoint publico para autenticar um usuario ativo.

Body:

```json
{
  "username": "gestor.teste",
  "password": "gestor123"
}
```

Resposta:

```json
{
  "accessToken": "...",
  "user": {
    "id": "...",
    "name": "Gestor Teste TFD",
    "username": "gestor.teste",
    "role": "COORDINATOR",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### `GET /api/auth/me`

Endpoint protegido para validar a sessao atual.

Header:

```http
Authorization: Bearer <accessToken>
```

Resposta:

```json
{
  "id": "...",
  "name": "Gestor Teste TFD",
  "username": "gestor.teste",
  "role": "COORDINATOR"
}
```

## Fluxo no frontend

1. A tela de login exibe apenas `Usuario` e `Senha`.
2. O frontend envia `{ "username": "...", "password": "..." }` para
   `/api/auth/login`.
3. O `accessToken` retornado e armazenado em `localStorage` com a chave
   `tfd.accessToken`.
4. Ao abrir o app, o frontend chama `/api/auth/me` com o token salvo.
5. Se `/auth/me` retornar usuario valido, o dashboard autenticado e exibido.
6. Se o token estiver ausente ou invalido, a sessao local e removida e o login
   volta a ser exibido.

## Perfis

Os perfis continuam definidos pelo enum `user_role`:

| Role | Uso no produto |
| --- | --- |
| `COORDINATOR` | Gestor/coordenador. Pode acessar a acao `Criar conta`. |
| `RECEPTIONIST` | Recepcao. Fluxo de pacientes e agendamentos. |
| `TRANSPORT` | Transporte. Fluxo de viagens e passageiros. |

## Persistencia

A tabela `users` agora usa a coluna unica `username`. A migration
`0003_jittery_reptil.sql` renomeia `email` para `username`, preservando os
valores existentes em bancos ja criados.

Em bancos novos, a ordem das migrations e:

1. Criar tabelas base, incluindo `users.email`.
2. Renomear `users.email` para `users.username`.
3. Inserir a conta `gestor.teste`.
