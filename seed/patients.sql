INSERT INTO "patients" (
  "name",
  "cpf",
  "sus_card",
  "birth_date",
  "rg",
  "phone"
)
VALUES
  (
    'Ana Paula Rodrigues',
    '12345678901',
    '700000000000001',
    '1985-03-14',
    'MG-12.345.678',
    '(31) 99911-0001'
  ),
  (
    'Bruno Henrique Almeida',
    '23456789012',
    '700000000000002',
    '1978-11-22',
    'SP-23.456.789',
    '(11) 99922-0002'
  ),
  (
    'Carla Mendes Ferreira',
    '34567890123',
    '700000000000003',
    '1992-07-08',
    'RJ-34.567.890',
    '(21) 99933-0003'
  ),
  (
    'Daniel Costa Lima',
    '45678901234',
    '700000000000004',
    '1969-01-30',
    'BA-45.678.901',
    '(71) 99944-0004'
  ),
  (
    'Elisa Nogueira Santos',
    '56789012345',
    '700000000000005',
    '2001-09-17',
    'PR-56.789.012',
    '(41) 99955-0005'
  ),
  (
    'Fabio Martins Oliveira',
    '67890123456',
    '700000000000006',
    '1988-05-05',
    'RS-67.890.123',
    '(51) 99966-0006'
  ),
  (
    'Gabriela Rocha Pereira',
    '78901234567',
    '700000000000007',
    '1974-12-03',
    'PE-78.901.234',
    '(81) 99977-0007'
  ),
  (
    'Helio Azevedo Barbosa',
    '89012345678',
    '700000000000008',
    '1959-04-26',
    'CE-89.012.345',
    '(85) 99988-0008'
  ),
  (
    'Isabela Gomes Ribeiro',
    '90123456789',
    '700000000000009',
    '1996-10-11',
    'SC-90.123.456',
    '(48) 99999-0009'
  ),
  (
    'Joao Victor Carvalho',
    '01234567890',
    '700000000000010',
    '1982-06-19',
    'GO-01.234.567',
    '(62) 99900-0010'
  )
ON CONFLICT ("cpf") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "sus_card" = EXCLUDED."sus_card",
  "birth_date" = EXCLUDED."birth_date",
  "rg" = EXCLUDED."rg",
  "phone" = EXCLUDED."phone",
  "updated_at" = now();
