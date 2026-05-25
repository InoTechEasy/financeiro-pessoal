-- Script de Seed para Dados de Dimensão (Padrão de Fábrica)
-- Este script insere dados padrão que serão compartilhados entre todos os usuários

-- Tipos de Lançamentos
INSERT INTO d_tipos_lancamentos (id_tipo_lancamento, nome, descricao, ativo) VALUES
(gen_random_uuid(), 'RECEITA', 'Entrada de dinheiro', true),
(gen_random_uuid(), 'DESPESA', 'Saída de dinheiro', true),
(gen_random_uuid(), 'INVESTIMENTO', 'Aplicação financeira', true),
(gen_random_uuid(), 'TRANSFERENCIA', 'Transferência entre contas', true)
ON CONFLICT DO NOTHING;

-- Tipos de Pagamentos
INSERT INTO d_tipos_pagamentos (id_tipo_pagamento, nome, descricao, ativo) VALUES
(gen_random_uuid(), 'Dinheiro', 'Pagamento em espécie', true),
(gen_random_uuid(), 'Cartão de Crédito', 'Pagamento com cartão de crédito', true),
(gen_random_uuid(), 'Cartão de Débito', 'Pagamento com cartão de débito', true),
(gen_random_uuid(), 'PIX', 'Pagamento via PIX', true),
(gen_random_uuid(), 'Transferência Bancária', 'Transferência entre contas bancárias', true),
(gen_random_uuid(), 'Boleto', 'Pagamento via boleto bancário', true),
(gen_random_uuid(), 'Cheque', 'Pagamento via cheque', true)
ON CONFLICT DO NOTHING;

-- Categorias de Despesas
-- Primeiro inserir as categorias principais
WITH categorias_principais AS (
  INSERT INTO d_categorias_despesas (id_categoria_despesa, nome, descricao, ativo, id_pai) VALUES
  (gen_random_uuid(), 'Alimentação', 'Gastos com alimentação', true, NULL),
  (gen_random_uuid(), 'Transporte', 'Gastos com transporte', true, NULL),
  (gen_random_uuid(), 'Moradia', 'Gastos com moradia', true, NULL),
  (gen_random_uuid(), 'Saúde', 'Gastos com saúde', true, NULL),
  (gen_random_uuid(), 'Educação', 'Gastos com educação', true, NULL),
  (gen_random_uuid(), 'Lazer', 'Gastos com lazer', true, NULL),
  (gen_random_uuid(), 'Vestuário', 'Gastos com roupas e acessórios', true, NULL),
  (gen_random_uuid(), 'Outros', 'Outros gastos não categorizados', true, NULL)
  RETURNING id_categoria_despesa, nome
)
-- Depois inserir as subcategorias referenciando os IDs das categorias principais
INSERT INTO d_categorias_despesas (id_categoria_despesa, nome, descricao, ativo, id_pai)
SELECT 
  gen_random_uuid(),
  sub.nome,
  sub.descricao,
  true,
  (SELECT id_categoria_despesa FROM categorias_principais WHERE nome = sub.categoria_pai)
FROM (
  VALUES 
    ('Supermercado', 'Compras de supermercado', 'Alimentação'),
    ('Restaurante', 'Refeições fora de casa', 'Alimentação'),
    ('Lanches', 'Lanches rápidos', 'Alimentação'),
    ('Combustível', 'Abastecimento de veículos', 'Transporte'),
    ('Transporte Público', 'Passagens de ônibus, metrô, etc.', 'Transporte'),
    ('Manutenção Veículo', 'Manutenção e reparos de veículos', 'Transporte'),
    ('Aluguel', 'Pagamento de aluguel', 'Moradia'),
    ('Água/Luz/Gás', 'Contas de utilities', 'Moradia'),
    ('Internet/Telefone', 'Contas de telecomunicações', 'Moradia'),
    ('Condomínio', 'Taxa de condomínio', 'Moradia'),
    ('Farmácia', 'Medicamentos e produtos farmacêuticos', 'Saúde'),
    ('Consultas Médicas', 'Consultas com médicos e especialistas', 'Saúde'),
    ('Planos de Saúde', 'Mensalidade de planos de saúde', 'Saúde'),
    ('Cursos', 'Cursos e treinamentos', 'Educação'),
    ('Livros', 'Compra de livros e materiais', 'Educação'),
    ('Mensalidade Escolar', 'Mensalidade de escolas e faculdades', 'Educação'),
    ('Cinema/Teatro', 'Ingressos para shows, cinema, teatro', 'Lazer'),
    ('Viagens', 'Gastos com viagens', 'Lazer'),
    ('Hobbies', 'Gastos com hobbies pessoais', 'Lazer')
) AS sub(nome, descricao, categoria_pai)
ON CONFLICT DO NOTHING;

-- Receitas
INSERT INTO d_receitas (id_receita, nome, descricao, ativo) VALUES
(gen_random_uuid(), 'Salário', 'Renda mensal fixa', true),
(gen_random_uuid(), 'Freelance', 'Renda de trabalhos freelance', true),
(gen_random_uuid(), 'Comissões', 'Renda de comissões', true),
(gen_random_uuid(), 'Aluguel', 'Renda de aluguéis', true),
(gen_random_uuid(), 'Dividendos', 'Renda de investimentos', true),
(gen_random_uuid(), 'Outros', 'Outras fontes de renda', true)
ON CONFLICT DO NOTHING;

-- Investimentos
INSERT INTO d_investimentos (id_investimento, nome, descricao, ativo) VALUES
(gen_random_uuid(), 'Ações', 'Investimento em ações', true),
(gen_random_uuid(), 'CDB', 'Certificado de Depósito Bancário', true),
(gen_random_uuid(), 'LCI/LCA', 'Letras de Crédito Imobiliário/Agropecuário', true),
(gen_random_uuid(), 'Tesouro Direto', 'Títulos públicos', true),
(gen_random_uuid(), 'Fundos Imobiliários', 'Investimento em FIIs', true),
(gen_random_uuid(), 'Criptomoedas', 'Investimento em criptomoedas', true),
(gen_random_uuid(), 'Poupança', 'Poupança tradicional', true),
(gen_random_uuid(), 'Outros', 'Outros tipos de investimentos', true)
ON CONFLICT DO NOTHING;
