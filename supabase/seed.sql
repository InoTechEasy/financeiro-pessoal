-- Script de Seed para Dados de Dimensão (Padrão de Fábrica)
-- Este script insere dados padrão que serão compartilhados entre todos os usuários

-- Tipos de Lançamentos
INSERT INTO d_tipos_lancamentos (id_tipo_lancamento, nome, descricao, ativo) VALUES
('a299ddc7-269c-452b-87d3-474af2a745bb', 'RECEITA', 'Entrada de dinheiro', true),
('b3a8e5f2-4c1d-4e9f-a1b2-c3d4e5f6a7b8', 'DESPESA', 'Saída de dinheiro', true),
('c4b9f6a3-5d2e-5f0a-b2c3-d4e5f6a7b8c9', 'INVESTIMENTO', 'Aplicação financeira', true),
('d5c0a7b4-6e3f-6g1b-c3d4-e5f6a7b8c9d0', 'TRANSFERENCIA', 'Transferência entre contas', true)
ON CONFLICT (id_tipo_lancamento) DO NOTHING;

-- Tipos de Pagamentos
INSERT INTO d_tipos_pagamentos (id_tipo_pagamento, nome, descricao, ativo) VALUES
('e6d1b8c5-7f4g-7h2c-d4e5-f6a7b8c9d0e1', 'Dinheiro', 'Pagamento em espécie', true),
('f7e2c9d6-8g5h-8i3d-e5f6-a7b8c9d0e1f2', 'Cartão de Crédito', 'Pagamento com cartão de crédito', true),
('g8f3d0e7-9h6i-9j4e-f6a7-b8c9d0e1f2a3', 'Cartão de Débito', 'Pagamento com cartão de débito', true),
('h9g4e1f8-0i7j-0k5f-a7b8-c9d0e1f2a3b4', 'PIX', 'Pagamento via PIX', true),
('i0h5f2g9-1j8k-1l6g-b8c9-d0e1f2a3b4c5', 'Transferência Bancária', 'Transferência entre contas bancárias', true),
('j1i6g3h0-2k9l-2m7h-c9d0-e1f2a3b4c5d6', 'Boleto', 'Pagamento via boleto bancário', true),
('k2j7h4i1-3l0m-3n8i-d0e1-f2a3b4c5d6e7', 'Cheque', 'Pagamento via cheque', true)
ON CONFLICT (id_tipo_pagamento) DO NOTHING;

-- Categorias de Despesas
INSERT INTO d_categorias_despesas (id_categoria_despesa, nome, descricao, ativo, id_pai) VALUES
-- Categorias principais
('l3k8i5j2-4m1n-4o9j-e1f2-a3b4c5d6e7f8', 'Alimentação', 'Gastos com alimentação', true, NULL),
('m4l9j6k3-5n2o-5p0k-f2a3-b4c5d6e7f8a9', 'Transporte', 'Gastos com transporte', true, NULL),
('n5m0k7l4-6o3p-6q1l-a3b4-c5d6e7f8a9b0', 'Moradia', 'Gastos com moradia', true, NULL),
('o6n1l8m5-7p4q-7r2m-b4c5-d6e7f8a9b0c1', 'Saúde', 'Gastos com saúde', true, NULL),
('p7o2m9n6-8q5r-8s3n-c5d6-e7f8a9b0c1d2', 'Educação', 'Gastos com educação', true, NULL),
('q8p3n0o7-9r6s-9t4o-d6e7-f8a9b0c1d2e3', 'Lazer', 'Gastos com lazer', true, NULL),
('r9q4o1p8-0s7t-0u5p-e7f8-a9b0c1d2e3f4', 'Vestuário', 'Gastos com roupas e acessórios', true, NULL),
('s0r5p2q9-1t8u-1v6q-f8a9-b0c1d2e3f4a5', 'Outros', 'Outros gastos não categorizados', true, NULL),
-- Subcategorias de Alimentação
('t1s6q3r0-2u9v-2w7r-a9b0-c1d2e3f4a5b6', 'Supermercado', 'Compras de supermercado', true, 'l3k8i5j2-4m1n-4o9j-e1f2-a3b4c5d6e7f8'),
('u2t7r4s1-3v0w-3x8s-b0c1-d2e3f4a5b6c7', 'Restaurante', 'Refeições fora de casa', true, 'l3k8i5j2-4m1n-4o9j-e1f2-a3b4c5d6e7f8'),
('v3u8s5t2-4w1x-4y9t-c1d2-e3f4a5b6c7d8', 'Lanches', 'Lanches rápidos', true, 'l3k8i5j2-4m1n-4o9j-e1f2-a3b4c5d6e7f8'),
-- Subcategorias de Transporte
('w4v9t6u3-5x2y-5z0u-d2e3-f4a5b6c7d8e9', 'Combustível', 'Abastecimento de veículos', true, 'm4l9j6k3-5n2o-5p0k-f2a3-b4c5d6e7f8a9'),
('x5w0u7v4-6y3z-6a1v-e3f4-a5b6c7d8e9f0', 'Transporte Público', 'Passagens de ônibus, metrô, etc.', true, 'm4l9j6k3-5n2o-5p0k-f2a3-b4c5d6e7f8a9'),
('y6x1v8w5-7z4a-7b2w-f4a5-b6c7d8e9f0a1', 'Manutenção Veículo', 'Manutenção e reparos de veículos', true, 'm4l9j6k3-5n2o-5p0k-f2a3-b4c5d6e7f8a9'),
-- Subcategorias de Moradia
('z7y2w9x6-8a5b-8c3x-a5b6-c7d8e9f0a1b2', 'Aluguel', 'Pagamento de aluguel', true, 'n5m0k7l4-6o3p-6q1l-a3b4-c5d6e7f8a9b0'),
('a8z3x0y7-9b6c-9d4y-b6c7-d8e9f0a1b2c3', 'Água/Luz/Gás', 'Contas de utilities', true, 'n5m0k7l4-6o3p-6q1l-a3b4-c5d6e7f8a9b0'),
('b9a4y1z8-0c7d-0e5z-c7d8-e9f0a1b2c3d4', 'Internet/Telefone', 'Contas de telecomunicações', true, 'n5m0k7l4-6o3p-6q1l-a3b4-c5d6e7f8a9b0'),
('c0b5z2a9-1d8e-1f6a-d8e9-f0a1b2c3d4e5', 'Condomínio', 'Taxa de condomínio', true, 'n5m0k7l4-6o3p-6q1l-a3b4-c5d6e7f8a9b0'),
-- Subcategorias de Saúde
('d1c6a3b0-2e9f-2g7b-e9f0-a1b2c3d4e5f6', 'Farmácia', 'Medicamentos e produtos farmacêuticos', true, 'o6n1l8m5-7p4q-7r2m-b4c5-d6e7f8a9b0c1'),
('e2d7b4c1-3f0g-3h8c-f0a1-b2c3d4e5f6a7', 'Consultas Médicas', 'Consultas com médicos e especialistas', true, 'o6n1l8m5-7p4q-7r2m-b4c5-d6e7f8a9b0c1'),
('f3e8c5d2-4g1h-4i9d-a1b2-c3d4e5f6a7b8', 'Planos de Saúde', 'Mensalidade de planos de saúde', true, 'o6n1l8m5-7p4q-7r2m-b4c5-d6e7f8a9b0c1'),
-- Subcategorias de Educação
('g4f9d6e3-5h2i-5j0e-b2c3-d4e5f6a7b8c9', 'Cursos', 'Cursos e treinamentos', true, 'p7o2m9n6-8q5r-8s3n-c5d6-e7f8a9b0c1d2'),
('h5g0e7f4-6i3j-6k1f-c3d4-e5f6a7b8c9d0', 'Livros', 'Compra de livros e materiais', true, 'p7o2m9n6-8q5r-8s3n-c5d6-e7f8a9b0c1d2'),
('i6h1f8g5-7j4k-7l2g-d4e5-f6a7b8c9d0e1', 'Mensalidade Escolar', 'Mensalidade de escolas e faculdades', true, 'p7o2m9n6-8q5r-8s3n-c5d6-e7f8a9b0c1d2'),
-- Subcategorias de Lazer
('j7i2g9h6-8k5l-8m3h-e5f6-a7b8c9d0e1f2', 'Cinema/Teatro', 'Ingressos para shows, cinema, teatro', true, 'q8p3n0o7-9r6s-9t4o-d6e7-f8a9b0c1d2e3'),
('k8j3h0i7-9l6m-9n4i-f6a7-b8c9d0e1f2a3', 'Viagens', 'Gastos com viagens', true, 'q8p3n0o7-9r6s-9t4o-d6e7-f8a9b0c1d2e3'),
('l9k4i1j8-0m7n-0o5j-a7b8-c9d0e1f2a3b4', 'Hobbies', 'Gastos com hobbies pessoais', true, 'q8p3n0o7-9r6s-9t4o-d6e7-f8a9b0c1d2e3')
ON CONFLICT (id_categoria_despesa) DO NOTHING;

-- Receitas
INSERT INTO d_receitas (id_receita, nome, descricao, ativo) VALUES
('m0l5j2k9-1n8o-1p6k-b8c9-d0e1f2a3b4c5', 'Salário', 'Renda mensal fixa', true),
('n1m6k3l0-2o9p-2q7l-c9d0-e1f2a3b4c5d6', 'Freelance', 'Renda de trabalhos freelance', true),
('o2n7l4m1-3p0q-3r8m-d0e1-f2a3b4c5d6e7', 'Comissões', 'Renda de comissões', true),
('p3o8m5n2-4q1r-4s9n-e1f2-a3b4c5d6e7f8', 'Aluguel', 'Renda de aluguéis', true),
('q4p9n6o3-5r2s-5t0o-f2a3-b4c5d6e7f8a9', 'Dividendos', 'Renda de investimentos', true),
('r5q0o7p4-6s3t-6u1p-a3b4-c5d6e7f8a9b0', 'Outros', 'Outras fontes de renda', true)
ON CONFLICT (id_receita) DO NOTHING;

-- Investimentos
INSERT INTO d_investimentos (id_investimento, nome, descricao, ativo) VALUES
('s6r1p8q5-7t4u-7v2q-b4c5-d6e7f8a9b0c1', 'Ações', 'Investimento em ações', true),
('t7s2q9r6-8u5v-8w3r-c5d6-e7f8a9b0c1d2', 'CDB', 'Certificado de Depósito Bancário', true),
('u8t3r0s7-9v6w-9x4s-d6e7-f8a9b0c1d2e3', 'LCI/LCA', 'Letras de Crédito Imobiliário/Agropecuário', true),
('v9u4s1t8-0w7x-0y5t-e7f8-a9b0c1d2e3f4', 'Tesouro Direto', 'Títulos públicos', true),
('w0v5t2u9-1x8y-1z6u-f8a9-b0c1d2e3f4a5', 'Fundos Imobiliários', 'Investimento em FIIs', true),
('x1w6u3v0-2y9z-2a7v-a9b0-c1d2e3f4a5b6', 'Criptomoedas', 'Investimento em criptomoedas', true),
('y2x7v4w1-3z0a-3b8w-b0c1-d2e3f4a5b6c7', 'Poupança', 'Poupança tradicional', true),
('z3y8w5x2-4a1b-4c9x-c1d2-e3f4a5b6c7d8', 'Outros', 'Outros tipos de investimentos', true)
ON CONFLICT (id_investimento) DO NOTHING;
