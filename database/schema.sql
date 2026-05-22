-- ============================================
-- TABELAS DIMENSÃO
-- ============================================

-- dTipos_Lancamentos
CREATE TABLE public.d_tipos_lancamentos (
  id_tipo_lancamento UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(50) NOT NULL UNIQUE,
  descricao TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- dReceitas
DROP TABLE IF EXISTS public.d_receitas CASCADE;
CREATE TABLE public.d_receitas (
  id_receita UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  icone VARCHAR(50),
  cor_hex VARCHAR(7),
  ordem INTEGER,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- dInvestimentos
DROP TABLE IF EXISTS public.d_investimentos CASCADE;
CREATE TABLE public.d_investimentos (
  id_investimento UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  icone VARCHAR(50),
  cor_hex VARCHAR(7),
  ordem INTEGER,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- dCategorias_Despesas
CREATE TABLE public.d_categorias_despesas (
  id_categoria_despesa UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_pai UUID REFERENCES public.d_categorias_despesas(id_categoria_despesa) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  icone VARCHAR(50),
  cor_hex VARCHAR(7),
  ordem INTEGER,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(id_pai, nome)
);

-- dDocumentos
DROP TABLE IF EXISTS public.d_documentos CASCADE;
CREATE TABLE public.d_documentos (
  id_documento UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  icone VARCHAR(50),
  ordem INTEGER,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- dTipos_Pagamentos
CREATE TABLE public.d_tipos_pagamentos (
  id_tipo_pagamento UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- dBancos
CREATE TABLE public.d_bancos (
  id_banco UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  codigo_banco VARCHAR(10),
  tipo_conta VARCHAR(50),
  numero_conta VARCHAR(20),
  agencia VARCHAR(10),
  saldo_inicial NUMERIC(15,2) DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- dCartoes_Credito
CREATE TABLE public.d_cartoes_credito (
  id_cartao_credito UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_banco UUID NOT NULL REFERENCES public.d_bancos(id_banco) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  ultimos_digitos VARCHAR(4),
  bandeira VARCHAR(50),
  limite_credito NUMERIC(15,2),
  data_vencimento_fatura INTEGER,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- dFornecedores
CREATE TABLE public.d_fornecedores (
  id_fornecedor UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(150) NOT NULL,
  tipo VARCHAR(50),
  cpf_cnpj VARCHAR(20),
  email VARCHAR(100),
  telefone VARCHAR(20),
  endereco TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- dClientes
CREATE TABLE public.d_clientes (
  id_cliente UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(150) NOT NULL,
  tipo VARCHAR(50),
  cpf_cnpj VARCHAR(20),
  email VARCHAR(100),
  telefone VARCHAR(20),
  endereco TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABELA FATO
-- ============================================

CREATE TABLE public.f_lancamentos (
  id_lancamento UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_tipo_lancamento UUID NOT NULL REFERENCES public.d_tipos_lancamentos(id_tipo_lancamento),
  id_receita UUID REFERENCES public.d_receitas(id_receita),
  id_categoria_despesa UUID REFERENCES public.d_categorias_despesas(id_categoria_despesa),
  id_investimento UUID REFERENCES public.d_investimentos(id_investimento),
  data_documento DATE,
  id_documento UUID REFERENCES public.d_documentos(id_documento),
  n_documento TEXT,
  id_fornecedor UUID REFERENCES public.d_fornecedores(id_fornecedor),
  id_cliente UUID REFERENCES public.d_clientes(id_cliente),
  descricao TEXT NOT NULL,
  id_tipo_pagamento UUID NOT NULL REFERENCES public.d_tipos_pagamentos(id_tipo_pagamento),
  id_cartao_credito UUID REFERENCES public.d_cartoes_credito(id_cartao_credito),
  id_banco UUID NOT NULL REFERENCES public.d_bancos(id_banco),
  id_banco_destino UUID REFERENCES public.d_bancos(id_banco),
  eh_transferencia BOOLEAN DEFAULT FALSE,
  valor_total NUMERIC(15,2) NOT NULL,
  parcelas TEXT,
  valor_parcela NUMERIC(15,2),
  data_vencimento DATE,
  data_pagamento DATE,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX idx_f_lancamentos_tipo ON public.f_lancamentos(id_tipo_lancamento);
CREATE INDEX idx_f_lancamentos_categoria ON public.f_lancamentos(id_categoria_despesa);
CREATE INDEX idx_f_lancamentos_receita ON public.f_lancamentos(id_receita);
CREATE INDEX idx_f_lancamentos_investimento ON public.f_lancamentos(id_investimento);
CREATE INDEX idx_f_lancamentos_data_documento ON public.f_lancamentos(data_documento);
CREATE INDEX idx_f_lancamentos_data_pagamento ON public.f_lancamentos(data_pagamento);
CREATE INDEX idx_f_lancamentos_data_vencimento ON public.f_lancamentos(data_vencimento);

-- ============================================
-- DADOS PADRÃO
-- ============================================

-- Tipos de Lançamentos
INSERT INTO public.d_tipos_lancamentos (nome, descricao) VALUES
('RECEITA', 'Entrada de dinheiro'),
('DESPESA', 'Saída de dinheiro'),
('INVESTIMENTO', 'Aplicação de capital');

-- Tipos de Pagamentos
INSERT INTO public.d_tipos_pagamentos (nome, descricao) VALUES
('Cartão de Crédito', 'Pagamento via cartão de crédito'),
('Fatura/Prazo', 'Pagamento a prazo'),
('Débito/Crédito em Conta', 'Transferência ou débito em conta');

-- Receitas (principais)
INSERT INTO public.d_receitas (nome, descricao, icone, cor_hex, ordem) VALUES
('Salário Pamela', 'Salário mensal de Pamela', '💰', '#00AA00', 1),
('Salário Leonardo', 'Salário mensal de Leonardo', '💰', '#00BB00', 2),
('Juros de Investimentos', 'Rendimentos de investimentos', '📈', '#0066FF', 3),
('Bônus', 'Bônus e gratificações', '🎁', '#FF9900', 4),
('Freelance', 'Trabalhos freelance', '💻', '#9933FF', 5),
('Rendimentos', 'Rendimentos diversos', '💵', '#00CCCC', 6);

-- Investimentos (principais)
INSERT INTO public.d_investimentos (nome, descricao, icone, cor_hex, ordem) VALUES
('CDB', 'Certificado de Depósito Bancário', '📊', '#FF6B6B', 1),
('Tesouro Direto', 'Títulos do Tesouro Nacional', '🏛️', '#4ECDC4', 2),
('Caixinha do Nubank', 'Caixinha de poupança Nubank', '🏦', '#95E1D3', 3),
('Ações', 'Investimento em ações', '📈', '#FFE66D', 4),
('Criptomoedas', 'Investimento em criptomoedas', '₿', '#FF8B94', 5),
('Fundos', 'Fundos de investimento', '💼', '#FFB7B2', 6),
('Renda Fixa', 'Investimentos em renda fixa', '📋', '#A8E6CF', 7);

-- Categorias de Despesas (principais)
INSERT INTO public.d_categorias_despesas (nome, descricao, icone, cor_hex, ordem) VALUES
('Alimentação e Refeições', 'Despesas com alimentação', '🍔', '#FF6B6B', 1),
('Viagens e Hospedagem', 'Viagens, passagens e hospedagem', '✈️', '#4ECDC4', 2),
('Saúde e Bem-estar', 'Saúde, farmácia, academia', '💊', '#95E1D3', 3),
('Educação', 'Cursos, livros, materiais', '📚', '#FFE66D', 4),
('Transporte', 'Transporte e combustível', '🚗', '#95E1D3', 5),
('Moradia', 'Aluguel, condomínio, utilidades', '🏠', '#C7CEEA', 6),
('Entretenimento', 'Cinema, streaming, eventos', '🎬', '#FF8B94', 7),
('Vestuário', 'Roupas, calçados, acessórios', '👕', '#FFB7B2', 8),
('Higiene e Limpeza', 'Higiene pessoal e limpeza', '🧼', '#A8E6CF', 9),
('Despesas Administrativas', 'Documentos, impostos', '📋', '#FFD3B6', 10),
('Seguros', 'Seguros diversos', '🛡️', '#FFAAA5', 11),
('Empréstimos e Dívidas', 'Juros, parcelas', '💳', '#FCBAD3', 12),
('Doações e Caridade', 'Doações e contribuições', '❤️', '#A8D8EA', 13);

-- Categorias de Despesas (filhas - subcategorias)
-- Alimentação e Refeições
INSERT INTO public.d_categorias_despesas (nome, descricao, icone, cor_hex, ordem, id_pai) VALUES
('Restaurante', 'Refeições em restaurantes', '🍽️', '#FF6B6B', 1, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Alimentação e Refeições' AND id_pai IS NULL LIMIT 1)),
('Supermercado', 'Compras de supermercado', '🛒', '#FF6B6B', 2, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Alimentação e Refeições' AND id_pai IS NULL LIMIT 1)),
('Lanches', 'Lanches e fast food', '🍕', '#FF6B6B', 3, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Alimentação e Refeições' AND id_pai IS NULL LIMIT 1));

-- Viagens e Hospedagem
INSERT INTO public.d_categorias_despesas (nome, descricao, icone, cor_hex, ordem, id_pai) VALUES
('Passagens', 'Passagens aéreas e terrestres', '🎫', '#4ECDC4', 1, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Viagens e Hospedagem' AND id_pai IS NULL LIMIT 1)),
('Hospedagem', 'Hotéis e pousadas', '🏨', '#4ECDC4', 2, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Viagens e Hospedagem' AND id_pai IS NULL LIMIT 1)),
('Aluguel de Carro', 'Aluguel de veículos', '🚙', '#4ECDC4', 3, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Viagens e Hospedagem' AND id_pai IS NULL LIMIT 1));

-- Saúde e Bem-estar
INSERT INTO public.d_categorias_despesas (nome, descricao, icone, cor_hex, ordem, id_pai) VALUES
('Farmácia', 'Medicamentos e produtos farmacêuticos', '💊', '#95E1D3', 1, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Saúde e Bem-estar' AND id_pai IS NULL LIMIT 1)),
('Academia', 'Mensalidade de academia', '🏋️', '#95E1D3', 2, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Saúde e Bem-estar' AND id_pai IS NULL LIMIT 1)),
('Consultas Médicas', 'Consultas e exames', '🏥', '#95E1D3', 3, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Saúde e Bem-estar' AND id_pai IS NULL LIMIT 1));

-- Educação
INSERT INTO public.d_categorias_despesas (nome, descricao, icone, cor_hex, ordem, id_pai) VALUES
('Cursos Online', 'Cursos e treinamentos online', '💻', '#FFE66D', 1, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Educação' AND id_pai IS NULL LIMIT 1)),
('Livros', 'Compra de livros', '📖', '#FFE66D', 2, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Educação' AND id_pai IS NULL LIMIT 1)),
('Materiais Escolares', 'Materiais de estudo', '✏️', '#FFE66D', 3, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Educação' AND id_pai IS NULL LIMIT 1));

-- Transporte
INSERT INTO public.d_categorias_despesas (nome, descricao, icone, cor_hex, ordem, id_pai) VALUES
('Combustível', 'Gasolina, álcool, diesel', '⛽', '#95E1D3', 1, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Transporte' AND id_pai IS NULL LIMIT 1)),
('Manutenção', 'Manutenção de veículos', '🔧', '#95E1D3', 2, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Transporte' AND id_pai IS NULL LIMIT 1)),
('Transporte Público', 'Ônibus, metrô, trem', '🚌', '#95E1D3', 3, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Transporte' AND id_pai IS NULL LIMIT 1));

-- Moradia
INSERT INTO public.d_categorias_despesas (nome, descricao, icone, cor_hex, ordem, id_pai) VALUES
('Aluguel', 'Pagamento de aluguel', '🔑', '#C7CEEA', 1, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Moradia' AND id_pai IS NULL LIMIT 1)),
('Condomínio', 'Taxa de condomínio', '🏢', '#C7CEEA', 2, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Moradia' AND id_pai IS NULL LIMIT 1)),
('Água e Luz', 'Contas de água, luz, gás', '💡', '#C7CEEA', 3, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Moradia' AND id_pai IS NULL LIMIT 1));

-- Entretenimento
INSERT INTO public.d_categorias_despesas (nome, descricao, icone, cor_hex, ordem, id_pai) VALUES
('Streaming', 'Netflix, Spotify, etc', '📺', '#FF8B94', 1, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Entretenimento' AND id_pai IS NULL LIMIT 1)),
('Cinema', 'Ingressos de cinema', '🎥', '#FF8B94', 2, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Entretenimento' AND id_pai IS NULL LIMIT 1)),
('Eventos', 'Shows, festivais, eventos', '🎪', '#FF8B94', 3, (SELECT id_categoria_despesa FROM public.d_categorias_despesas WHERE nome = 'Entretenimento' AND id_pai IS NULL LIMIT 1));

-- Tipos de Documentos (principais)
INSERT INTO public.d_documentos (nome, descricao, icone, ordem) VALUES
('Boleto', 'Boleto bancário', '📄', 1),
('Fatura', 'Fatura de serviço', '📋', 2),
('Nota Fiscal', 'Nota Fiscal (NF)', '🧾', 3),
('Nota Fiscal de Serviço', 'Nota Fiscal de Serviço (NFS-e)', '📑', 4),
('Recibo', 'Recibo de pagamento', '✅', 5),
('Comprovante de Transferência', 'Comprovante de transferência bancária', '💳', 6),
('Cupom Fiscal', 'Cupom fiscal', '🛍️', 7),
('Outros', 'Outros tipos de documentos', '📌', 8);
