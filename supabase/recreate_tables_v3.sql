-- Script para recriar todas as tabelas com user_id nas dimensões
-- Este script dropa todas as tabelas existentes e recria com a nova estrutura
-- Agora as tabelas de dimensão também têm user_id (permite null para dados do sistema)

-- Dropar todas as tabelas existentes
DROP TABLE IF EXISTS f_lancamentos CASCADE;
DROP TABLE IF EXISTS f_conciliacao_bancaria CASCADE;
DROP TABLE IF EXISTS d_documentos CASCADE;
DROP TABLE IF EXISTS d_cartoes_credito CASCADE;
DROP TABLE IF EXISTS d_clientes CASCADE;
DROP TABLE IF EXISTS d_fornecedores CASCADE;
DROP TABLE IF EXISTS d_bancos CASCADE;
DROP TABLE IF EXISTS d_tipos_pagamentos CASCADE;
DROP TABLE IF EXISTS d_categorias_despesas CASCADE;
DROP TABLE IF EXISTS d_receitas CASCADE;
DROP TABLE IF EXISTS d_investimentos CASCADE;
DROP TABLE IF EXISTS d_tipos_lancamentos CASCADE;

-- Tabela de Tipos de Lançamentos (Dados de dimensão - compartilhados ou por usuário)
CREATE TABLE d_tipos_lancamentos (
  id_tipo_lancamento SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(50) NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, nome)
);

-- Tabela de Tipos de Pagamentos (Dados de dimensão - compartilhados ou por usuário)
CREATE TABLE d_tipos_pagamentos (
  id_tipo_pagamento SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(50) NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, nome)
);

-- Tabela de Categorias de Despesas (Dados de dimensão - compartilhados ou por usuário)
CREATE TABLE d_categorias_despesas (
  id_categoria_despesa SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  id_pai INTEGER REFERENCES d_categorias_despesas(id_categoria_despesa),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Receitas (Dados de dimensão - compartilhados ou por usuário)
CREATE TABLE d_receitas (
  id_receita SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, nome)
);

-- Tabela de Investimentos (Dados de dimensão - compartilhados ou por usuário)
CREATE TABLE d_investimentos (
  id_investimento SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, nome)
);

-- Tabela de Bancos (Dados transacionais - por usuário)
CREATE TABLE d_bancos (
  id_banco SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  agencia VARCHAR(20),
  conta VARCHAR(20),
  saldo_atual DECIMAL(15, 2) DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Cartões de Crédito (Dados transacionais - por usuário)
CREATE TABLE d_cartoes_credito (
  id_cartao SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  numero VARCHAR(20),
  validade VARCHAR(10),
  limite DECIMAL(15, 2) DEFAULT 0,
  dia_fechamento INTEGER,
  dia_vencimento INTEGER,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Clientes (Dados transacionais - por usuário)
CREATE TABLE d_clientes (
  id_cliente SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  telefone VARCHAR(20),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Fornecedores (Dados transacionais - por usuário)
CREATE TABLE d_fornecedores (
  id_fornecedor SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  cnpj VARCHAR(20),
  email VARCHAR(100),
  telefone VARCHAR(20),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Lançamentos (Dados transacionais - por usuário)
CREATE TABLE f_lancamentos (
  id_lancamento SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  id_tipo_lancamento INTEGER NOT NULL REFERENCES d_tipos_lancamentos(id_tipo_lancamento),
  id_categoria_despesa INTEGER REFERENCES d_categorias_despesas(id_categoria_despesa),
  id_receita INTEGER REFERENCES d_receitas(id_receita),
  id_investimento INTEGER REFERENCES d_investimentos(id_investimento),
  id_banco INTEGER REFERENCES d_bancos(id_banco),
  id_cartao INTEGER REFERENCES d_cartoes_credito(id_cartao),
  id_cliente INTEGER REFERENCES d_clientes(id_cliente),
  id_fornecedor INTEGER REFERENCES d_fornecedores(id_fornecedor),
  id_tipo_pagamento INTEGER REFERENCES d_tipos_pagamentos(id_tipo_pagamento),
  descricao TEXT NOT NULL,
  valor_total DECIMAL(15, 2) NOT NULL,
  valor_parcela DECIMAL(15, 2),
  numero_parcelas INTEGER,
  parcela_atual INTEGER,
  data_vencimento DATE,
  data_pagamento DATE,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Conciliação Bancária (Dados transacionais - por usuário)
CREATE TABLE f_conciliacao_bancaria (
  id_conciliacao SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  id_banco INTEGER NOT NULL REFERENCES d_bancos(id_banco),
  data_conciliacao DATE NOT NULL,
  saldo_anterior DECIMAL(15, 2),
  saldo_atual DECIMAL(15, 2),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Documentos (Dados transacionais - por usuário)
CREATE TABLE d_documentos (
  id_documento SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  id_lancamento INTEGER REFERENCES f_lancamentos(id_lancamento),
  nome_arquivo VARCHAR(255) NOT NULL,
  url_arquivo TEXT NOT NULL,
  tipo_arquivo VARCHAR(50),
  tamanho_arquivo BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE d_tipos_lancamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_tipos_pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_categorias_despesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_investimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_bancos ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_cartoes_credito ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE f_lancamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE f_conciliacao_bancaria ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_documentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tabelas de dimensão (leitura: dados do sistema + dados do usuário)
CREATE POLICY "Public read access for dimension tables (system data)" ON d_tipos_lancamentos
  FOR SELECT USING (user_id IS NULL);

CREATE POLICY "Users can read own dimension data" ON d_tipos_lancamentos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dimension data" ON d_tipos_lancamentos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dimension data" ON d_tipos_lancamentos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dimension data" ON d_tipos_lancamentos
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public read access for dimension tables (system data)" ON d_tipos_pagamentos
  FOR SELECT USING (user_id IS NULL);

CREATE POLICY "Users can read own dimension data" ON d_tipos_pagamentos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dimension data" ON d_tipos_pagamentos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dimension data" ON d_tipos_pagamentos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dimension data" ON d_tipos_pagamentos
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public read access for dimension tables (system data)" ON d_categorias_despesas
  FOR SELECT USING (user_id IS NULL);

CREATE POLICY "Users can read own dimension data" ON d_categorias_despesas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dimension data" ON d_categorias_despesas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dimension data" ON d_categorias_despesas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dimension data" ON d_categorias_despesas
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public read access for dimension tables (system data)" ON d_receitas
  FOR SELECT USING (user_id IS NULL);

CREATE POLICY "Users can read own dimension data" ON d_receitas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dimension data" ON d_receitas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dimension data" ON d_receitas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dimension data" ON d_receitas
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public read access for dimension tables (system data)" ON d_investimentos
  FOR SELECT USING (user_id IS NULL);

CREATE POLICY "Users can read own dimension data" ON d_investimentos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dimension data" ON d_investimentos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dimension data" ON d_investimentos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dimension data" ON d_investimentos
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para tabelas transacionais (acesso por usuário)
CREATE POLICY "Users can read own data" ON d_bancos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON d_bancos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON d_bancos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data" ON d_bancos
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own data" ON d_cartoes_credito
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON d_cartoes_credito
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON d_cartoes_credito
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data" ON d_cartoes_credito
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own data" ON d_clientes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON d_clientes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON d_clientes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data" ON d_clientes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own data" ON d_fornecedores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON d_fornecedores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON d_fornecedores
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data" ON d_fornecedores
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own data" ON f_lancamentos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON f_lancamentos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON f_lancamentos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data" ON f_lancamentos
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own data" ON f_conciliacao_bancaria
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON f_conciliacao_bancaria
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON f_conciliacao_bancaria
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data" ON f_conciliacao_bancaria
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own data" ON d_documentos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON d_documentos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON d_documentos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data" ON d_documentos
  FOR DELETE USING (auth.uid() = user_id);

-- Criar índices para melhorar performance
CREATE INDEX idx_lancamentos_user_id ON f_lancamentos(user_id);
CREATE INDEX idx_lancamentos_tipo ON f_lancamentos(id_tipo_lancamento);
CREATE INDEX idx_lancamentos_data_vencimento ON f_lancamentos(data_vencimento);
CREATE INDEX idx_bancos_user_id ON d_bancos(user_id);
CREATE INDEX idx_cartoes_user_id ON d_cartoes_credito(user_id);
CREATE INDEX idx_clientes_user_id ON d_clientes(user_id);
CREATE INDEX idx_fornecedores_user_id ON d_fornecedores(user_id);
CREATE INDEX idx_conciliacao_user_id ON f_conciliacao_bancaria(user_id);
CREATE INDEX idx_documentos_user_id ON d_documentos(user_id);
CREATE INDEX idx_tipos_lancamentos_user_id ON d_tipos_lancamentos(user_id);
CREATE INDEX idx_tipos_pagamentos_user_id ON d_tipos_pagamentos(user_id);
CREATE INDEX idx_categorias_user_id ON d_categorias_despesas(user_id);
CREATE INDEX idx_receitas_user_id ON d_receitas(user_id);
CREATE INDEX idx_investimentos_user_id ON d_investimentos(user_id);
