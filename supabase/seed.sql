-- Script de Seed para Dados de Dimensão (Padrão de Fábrica)
-- Este script insere dados padrão que serão compartilhados entre todos os usuários

-- Tipos de Lançamentos
INSERT INTO d_tipos_lancamentos (id_tipo_lancamento, nome, descricao, ativo) VALUES
('1', 'RECEITA', 'Entrada de dinheiro', true),
('2', 'DESPESA', 'Saída de dinheiro', true),
('3', 'INVESTIMENTO', 'Aplicação financeira', true),
('4', 'TRANSFERENCIA', 'Transferência entre contas', true)
ON CONFLICT (id_tipo_lancamento) DO NOTHING;

-- Tipos de Pagamentos
INSERT INTO d_tipos_pagamentos (id_tipo_pagamento, nome, descricao, ativo) VALUES
('1', 'Dinheiro', 'Pagamento em espécie', true),
('2', 'Cartão de Crédito', 'Pagamento com cartão de crédito', true),
('3', 'Cartão de Débito', 'Pagamento com cartão de débito', true),
('4', 'PIX', 'Pagamento via PIX', true),
('5', 'Transferência Bancária', 'Transferência entre contas bancárias', true),
('6', 'Boleto', 'Pagamento via boleto bancário', true),
('7', 'Cheque', 'Pagamento via cheque', true)
ON CONFLICT (id_tipo_pagamento) DO NOTHING;

-- Categorias de Despesas
INSERT INTO d_categorias_despesas (id_categoria_despesa, nome, descricao, ativo, id_pai) VALUES
-- Categorias principais
('1', 'Alimentação', 'Gastos com alimentação', true, NULL),
('2', 'Transporte', 'Gastos com transporte', true, NULL),
('3', 'Moradia', 'Gastos com moradia', true, NULL),
('4', 'Saúde', 'Gastos com saúde', true, NULL),
('5', 'Educação', 'Gastos com educação', true, NULL),
('6', 'Lazer', 'Gastos com lazer', true, NULL),
('7', 'Vestuário', 'Gastos com roupas e acessórios', true, NULL),
('8', 'Outros', 'Outros gastos não categorizados', true, NULL),
-- Subcategorias de Alimentação
('9', 'Supermercado', 'Compras de supermercado', true, '1'),
('10', 'Restaurante', 'Refeições fora de casa', true, '1'),
('11', 'Lanches', 'Lanches rápidos', true, '1'),
-- Subcategorias de Transporte
('12', 'Combustível', 'Abastecimento de veículos', true, '2'),
('13', 'Transporte Público', 'Passagens de ônibus, metrô, etc.', true, '2'),
('14', 'Manutenção Veículo', 'Manutenção e reparos de veículos', true, '2'),
-- Subcategorias de Moradia
('15', 'Aluguel', 'Pagamento de aluguel', true, '3'),
('16', 'Água/Luz/Gás', 'Contas de utilities', true, '3'),
('17', 'Internet/Telefone', 'Contas de telecomunicações', true, '3'),
('18', 'Condomínio', 'Taxa de condomínio', true, '3'),
-- Subcategorias de Saúde
('19', 'Farmácia', 'Medicamentos e produtos farmacêuticos', true, '4'),
('20', 'Consultas Médicas', 'Consultas com médicos e especialistas', true, '4'),
('21', 'Planos de Saúde', 'Mensalidade de planos de saúde', true, '4'),
-- Subcategorias de Educação
('22', 'Cursos', 'Cursos e treinamentos', true, '5'),
('23', 'Livros', 'Compra de livros e materiais', true, '5'),
('24', 'Mensalidade Escolar', 'Mensalidade de escolas e faculdades', true, '5'),
-- Subcategorias de Lazer
('25', 'Cinema/Teatro', 'Ingressos para shows, cinema, teatro', true, '6'),
('26', 'Viagens', 'Gastos com viagens', true, '6'),
('27', 'Hobbies', 'Gastos com hobbies pessoais', true, '6')
ON CONFLICT (id_categoria_despesa) DO NOTHING;

-- Receitas
INSERT INTO d_receitas (id_receita, nome, descricao, ativo) VALUES
('1', 'Salário', 'Renda mensal fixa', true),
('2', 'Freelance', 'Renda de trabalhos freelance', true),
('3', 'Comissões', 'Renda de comissões', true),
('4', 'Aluguel', 'Renda de aluguéis', true),
('5', 'Dividendos', 'Renda de investimentos', true),
('6', 'Outros', 'Outras fontes de renda', true)
ON CONFLICT (id_receita) DO NOTHING;

-- Investimentos
INSERT INTO d_investimentos (id_investimento, nome, descricao, ativo) VALUES
('1', 'Ações', 'Investimento em ações', true),
('2', 'CDB', 'Certificado de Depósito Bancário', true),
('3', 'LCI/LCA', 'Letras de Crédito Imobiliário/Agropecuário', true),
('4', 'Tesouro Direto', 'Títulos públicos', true),
('5', 'Fundos Imobiliários', 'Investimento em FIIs', true),
('6', 'Criptomoedas', 'Investimento em criptomoedas', true),
('7', 'Poupança', 'Poupança tradicional', true),
('8', 'Outros', 'Outros tipos de investimentos', true)
ON CONFLICT (id_investimento) DO NOTHING;
