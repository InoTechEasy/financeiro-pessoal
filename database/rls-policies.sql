-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Este arquivo configura as políticas de Row Level Security (RLS) do Supabase
-- para garantir que cada usuário veja apenas seus próprios dados (multi-tenancy)

-- ============================================
-- HABILITAR RLS EM TODAS AS TABELAS COM user_id
-- ============================================

ALTER TABLE public.d_bancos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.d_cartoes_credito ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.d_fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.d_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.f_lancamentos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS PARA d_bancos
-- ============================================

-- SELECT: Usuário vê apenas seus próprios bancos
CREATE POLICY "Usuários podem ver seus próprios bancos"
  ON public.d_bancos FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Usuário insere apenas com seu próprio user_id
CREATE POLICY "Usuários podem inserir seus próprios bancos"
  ON public.d_bancos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Usuário atualiza apenas seus próprios bancos
CREATE POLICY "Usuários podem atualizar seus próprios bancos"
  ON public.d_bancos FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: Usuário deleta apenas seus próprios bancos
CREATE POLICY "Usuários podem deletar seus próprios bancos"
  ON public.d_bancos FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS PARA d_cartoes_credito
-- ============================================

-- SELECT: Usuário vê apenas seus próprios cartões
CREATE POLICY "Usuários podem ver seus próprios cartões"
  ON public.d_cartoes_credito FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Usuário insere apenas com seu próprio user_id
CREATE POLICY "Usuários podem inserir seus próprios cartões"
  ON public.d_cartoes_credito FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Usuário atualiza apenas seus próprios cartões
CREATE POLICY "Usuários podem atualizar seus próprios cartões"
  ON public.d_cartoes_credito FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: Usuário deleta apenas seus próprios cartões
CREATE POLICY "Usuários podem deletar seus próprios cartões"
  ON public.d_cartoes_credito FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS PARA d_fornecedores
-- ============================================

-- SELECT: Usuário vê apenas seus próprios fornecedores
CREATE POLICY "Usuários podem ver seus próprios fornecedores"
  ON public.d_fornecedores FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Usuário insere apenas com seu próprio user_id
CREATE POLICY "Usuários podem inserir seus próprios fornecedores"
  ON public.d_fornecedores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Usuário atualiza apenas seus próprios fornecedores
CREATE POLICY "Usuários podem atualizar seus próprios fornecedores"
  ON public.d_fornecedores FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: Usuário deleta apenas seus próprios fornecedores
CREATE POLICY "Usuários podem deletar seus próprios fornecedores"
  ON public.d_fornecedores FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS PARA d_clientes
-- ============================================

-- SELECT: Usuário vê apenas seus próprios clientes
CREATE POLICY "Usuários podem ver seus próprios clientes"
  ON public.d_clientes FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Usuário insere apenas com seu próprio user_id
CREATE POLICY "Usuários podem inserir seus próprios clientes"
  ON public.d_clientes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Usuário atualiza apenas seus próprios clientes
CREATE POLICY "Usuários podem atualizar seus próprios clientes"
  ON public.d_clientes FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: Usuário deleta apenas seus próprios clientes
CREATE POLICY "Usuários podem deletar seus próprios clientes"
  ON public.d_clientes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS PARA f_lancamentos
-- ============================================

-- SELECT: Usuário vê apenas seus próprios lançamentos
CREATE POLICY "Usuários podem ver seus próprios lançamentos"
  ON public.f_lancamentos FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Usuário insere apenas com seu próprio user_id
CREATE POLICY "Usuários podem inserir seus próprios lançamentos"
  ON public.f_lancamentos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Usuário atualiza apenas seus próprios lançamentos
CREATE POLICY "Usuários podem atualizar seus próprios lançamentos"
  ON public.f_lancamentos FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: Usuário deleta apenas seus próprios lançamentos
CREATE POLICY "Usuários podem deletar seus próprios lançamentos"
  ON public.f_lancamentos FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- NOTA: Tabelas de dimensão compartilhadas NÃO têm RLS
-- Estas tabelas são compartilhadas entre todos os usuários:
-- - d_tipos_lancamentos
-- - d_receitas
-- - d_investimentos
-- - d_categorias_despesas
-- - d_documentos
-- - d_tipos_pagamentos
-- ============================================

-- Para tabelas compartilhadas, mantém as políticas existentes que permitem
-- acesso a todos os usuários autenticados (já configuradas no rls.sql)
