-- Inserir dados na tabela "User"
INSERT INTO "User" (name, email, hashed_password, gender, updated_at)
VALUES 
  ('João', 'joao@example.com', 'senha123', 'Maculino', current_timestamp),
  ('Maria', 'maria@example.com', 'senha456', 'Feminino', current_timestamp),
  ('Pedro', 'pedro@example.com', 'senha789', 'Maculino', current_timestamp);


-- Inserir dados na tabela Department
INSERT INTO "Department" (name, acronym, address, created_by_id, updated_at)
VALUES 
  ('Vendas', 'VND', 'Rua das Vendas, 123', 1, current_timestamp),
  ('RH', 'RH', 'Avenida dos Recursos Humanos, 456', 1, current_timestamp),
  ('TI', 'TI', 'Travessa da Tecnologia, 789', 1, current_timestamp);

-- Inserir dados na tabela Folder
INSERT INTO "Folder" (name, parent_folder_id, created_by_id, updated_at)
VALUES 
  ('Pasta 1', NULL, 1, current_timestamp),
  ('Pasta 2', NULL, 1, current_timestamp),
  ('Subpasta 1', 1, 1, current_timestamp),
  ('Subpasta 2', 1, 1, current_timestamp);

-- Inserir dados na tabela Document
INSERT INTO "Document" (name, document_url, city, date, subject, header, author_id, receiver_id, sender_id, department_id, folder_id, updated_at)
VALUES 
  ('Documento 1', 'http://url1.com', 'Cidade 1', '2023-01-01', 'Assunto 1', 'Cabeçalho 1', 1, 2, 3, 1, NULL, current_timestamp),
  ('Documento 2', 'http://url2.com', 'Cidade 2', '2023-02-02', 'Assunto 2', 'Cabeçalho 2', 2, 3, 1, 2, 3, current_timestamp);

-- Inserir dados na tabela Repository
INSERT INTO "Repository" (name, description, department_id, created_by_id, updated_at)
VALUES 
  ('Repositório 1', 'Descrição 1', 1, 1, current_timestamp),
  ('Repositório 2', 'Descrição 2', 2, 2, current_timestamp);

-- Inserir dados na tabela Attachment
INSERT INTO "Attachment" (name, attachment_url, type, repository_id, document_id, created_by_id, updated_at)
VALUES 
  ('Anexo 1', 'http://anexo1.com', 'PDF', 1, NULL, 1, current_timestamp),
  ('Anexo 2', 'http://anexo2.com', 'PNG', 2, 1, 2, current_timestamp);

-- Inserir dados na tabela Stamp
INSERT INTO "Stamp" (description, created_by_id, updated_at)
VALUES 
  ('Carimbo 1', 1, current_timestamp),
  ('Carimbo 2', 2, current_timestamp);
