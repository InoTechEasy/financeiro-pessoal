-- Script de Seed para Dados de Dimensão (Padrão de Fábrica)
-- Este script insere dados padrão que serão compartilhados entre todos os usuários
-- Usando IDs numéricos auto increment e user_id null para dados do sistema

-- Tipos de Lançamentos (IDs fixos: 1, 2, 3, 4)
INSERT INTO d_tipos_lancamentos (id_tipo_lancamento, user_id, nome, descricao, ativo) VALUES
(1, NULL, 'Receita', 'Entrada de dinheiro', true),
(2, NULL, 'Despesa', 'Saída de dinheiro', true),
(3, NULL, 'Investimento', 'Aplicação financeira', true),
(4, NULL, 'Transferência', 'Transferência entre contas', true);

-- Tipos de Pagamentos (IDs fixos: 1, 2, 3, 4, 5, 6, 7)
INSERT INTO d_tipos_pagamentos (id_tipo_pagamento, user_id, nome, descricao, ativo) VALUES
(1, NULL, 'Dinheiro', 'Pagamento em espécie', true),
(2, NULL, 'Cartão de Crédito', 'Pagamento com cartão de crédito', true),
(3, NULL, 'Cartão de Débito', 'Pagamento com cartão de débito', true),
(4, NULL, 'PIX', 'Pagamento via PIX', true),
(5, NULL, 'Transferência Bancária', 'Transferência entre contas bancárias', true),
(6, NULL, 'Boleto', 'Pagamento via boleto bancário', true),
(7, NULL, 'Cheque', 'Pagamento via cheque', true);

-- Categorias de Despesas
-- Categorias principais (IDs fixos: 1-8)
INSERT INTO d_categorias_despesas (id_categoria_despesa, user_id, nome, descricao, ativo, id_pai) VALUES
(1, NULL, 'Alimentação', 'Gastos com alimentação', true, NULL),
(2, NULL, 'Transporte', 'Gastos com transporte', true, NULL),
(3, NULL, 'Moradia', 'Gastos com moradia', true, NULL),
(4, NULL, 'Saúde', 'Gastos com saúde', true, NULL),
(5, NULL, 'Educação', 'Gastos com educação', true, NULL),
(6, NULL, 'Lazer', 'Gastos com lazer', true, NULL),
(7, NULL, 'Vestuário', 'Gastos com roupas e acessórios', true, NULL),
(8, NULL, 'Outros', 'Outros gastos não categorizados', true, NULL);

-- Subcategorias de Alimentação (IDs fixos: 9-11)
INSERT INTO d_categorias_despesas (id_categoria_despesa, user_id, nome, descricao, ativo, id_pai) VALUES
(9, NULL, 'Supermercado', 'Compras de supermercado', true, 1),
(10, NULL, 'Restaurante', 'Refeições fora de casa', true, 1),
(11, NULL, 'Lanches', 'Lanches rápidos', true, 1);

-- Subcategorias de Transporte (IDs fixos: 12-14)
INSERT INTO d_categorias_despesas (id_categoria_despesa, user_id, nome, descricao, ativo, id_pai) VALUES
(12, NULL, 'Combustível', 'Abastecimento de veículos', true, 2),
(13, NULL, 'Transporte Público', 'Passagens de ônibus, metrô, etc.', true, 2),
(14, NULL, 'Manutenção Veículo', 'Manutenção e reparos de veículos', true, 2);

-- Subcategorias de Moradia (IDs fixos: 15-18)
INSERT INTO d_categorias_despesas (id_categoria_despesa, user_id, nome, descricao, ativo, id_pai) VALUES
(15, NULL, 'Aluguel', 'Pagamento de aluguel', true, 3),
(16, NULL, 'Água/Luz/Gás', 'Contas de utilities', true, 3),
(17, NULL, 'Internet/Telefone', 'Contas de telecomunicações', true, 3),
(18, NULL, 'Condomínio', 'Taxa de condomínio', true, 3);

-- Subcategorias de Saúde (IDs fixos: 19-21)
INSERT INTO d_categorias_despesas (id_categoria_despesa, user_id, nome, descricao, ativo, id_pai) VALUES
(19, NULL, 'Farmácia', 'Medicamentos e produtos farmacêuticos', true, 4),
(20, NULL, 'Consultas Médicas', 'Consultas com médicos e especialistas', true, 4),
(21, NULL, 'Planos de Saúde', 'Mensalidade de planos de saúde', true, 4);

-- Subcategorias de Educação (IDs fixos: 22-24)
INSERT INTO d_categorias_despesas (id_categoria_despesa, user_id, nome, descricao, ativo, id_pai) VALUES
(22, NULL, 'Cursos', 'Cursos e treinamentos', true, 5),
(23, NULL, 'Livros', 'Compra de livros e materiais', true, 5),
(24, NULL, 'Mensalidade Escolar', 'Mensalidade de escolas e faculdades', true, 5);

-- Subcategorias de Lazer (IDs fixos: 25-27)
INSERT INTO d_categorias_despesas (id_categoria_despesa, user_id, nome, descricao, ativo, id_pai) VALUES
(25, NULL, 'Cinema/Teatro', 'Ingressos para shows, cinema, teatro', true, 6),
(26, NULL, 'Viagens', 'Gastos com viagens', true, 6),
(27, NULL, 'Hobbies', 'Gastos com hobbies pessoais', true, 6);

-- Receitas (IDs fixos: 1-6)
INSERT INTO d_receitas (id_receita, user_id, nome, descricao, ativo) VALUES
(1, NULL, 'Salário', 'Renda mensal fixa', true),
(2, NULL, 'Freelance', 'Renda de trabalhos freelance', true),
(3, NULL, 'Comissões', 'Renda de comissões', true),
(4, NULL, 'Aluguel', 'Renda de aluguéis', true),
(5, NULL, 'Dividendos', 'Renda de investimentos', true),
(6, NULL, 'Outros', 'Outras fontes de renda', true);

-- Investimentos (IDs fixos: 1-8)
INSERT INTO d_investimentos (id_investimento, user_id, nome, descricao, ativo) VALUES
(1, NULL, 'Ações', 'Investimento em ações', true),
(2, NULL, 'CDB', 'Certificado de Depósito Bancário', true),
(3, NULL, 'LCI/LCA', 'Letras de Crédito Imobiliário/Agropecuário', true),
(4, NULL, 'Tesouro Direto', 'Títulos públicos', true),
(5, NULL, 'Fundos Imobiliários', 'Investimento em FIIs', true),
(6, NULL, 'Criptomoedas', 'Investimento em criptomoedas', true),
(7, NULL, 'Poupança', 'Poupança tradicional', true),
(8, NULL, 'Outros', 'Outros tipos de investimentos', true);
