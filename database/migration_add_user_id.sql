-- ============================================
-- MIGRAÇÃO: Adicionar user_id para Multi-Tenancy
-- ============================================
-- Este arquivo adiciona a coluna user_id nas tabelas que armazenam dados do usuário
-- para implementar Row Level Security (RLS) e transformar o app em SaaS multi-tenant

-- Adicionar user_id na tabela d_bancos
ALTER TABLE public.d_bancos 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_d_bancos_user_id ON public.d_bancos(user_id);

-- Adicionar user_id na tabela d_cartoes_credito
ALTER TABLE public.d_cartoes_credito 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_d_cartoes_credito_user_id ON public.d_cartoes_credito(user_id);

-- Adicionar user_id na tabela d_fornecedores
ALTER TABLE public.d_fornecedores 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_d_fornecedores_user_id ON public.d_fornecedores(user_id);

-- Adicionar user_id na tabela d_clientes
ALTER TABLE public.d_clientes 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_d_clientes_user_id ON public.d_clientes(user_id);

-- Adicionar user_id na tabela f_lancamentos
ALTER TABLE public.f_lancamentos 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_f_lancamentos_user_id ON public.f_lancamentos(user_id);

-- ============================================
-- NOTA: As tabelas de dimensão compartilhadas NÃO precisam de user_id:
-- - d_tipos_lancamentos (tipos de lançamento são compartilhados)
-- - d_receitas (receitas padrão são compartilhadas)
-- - d_investimentos (tipos de investimento são compartilhados)
-- - d_categorias_despesas (categorias são compartilhadas)
-- - d_documentos (tipos de documento são compartilhados)
-- - d_tipos_pagamentos (tipos de pagamento são compartilhados)
-- ============================================
