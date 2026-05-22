-- ============================================
-- MIGRAÇÃO: Adicionar tabela d_clientes e coluna id_cliente
-- ============================================

-- Criar tabela d_clientes
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

-- Adicionar coluna id_cliente na tabela f_lancamentos
ALTER TABLE public.f_lancamentos ADD COLUMN id_cliente UUID REFERENCES public.d_clientes(id_cliente);
