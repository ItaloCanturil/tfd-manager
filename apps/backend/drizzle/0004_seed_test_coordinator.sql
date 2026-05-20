INSERT INTO "users" (
  "id",
  "name",
  "username",
  "password_hash",
  "role",
  "is_active"
)
VALUES (
  '11111111-1111-4111-8111-111111111111',
  'Gestor Teste TFD',
  'gestor.teste',
  'tfd-test-gestor-1:df29faaddb710ef05d7de4be65727a89637262938b7fb1f78c70ecc905d69e5d1f469298f0b4fbc727d5913badfaebb2db851762eb198af1ac6dd5838ff239a8',
  'COORDINATOR',
  true
)
ON CONFLICT ("username") DO NOTHING;
