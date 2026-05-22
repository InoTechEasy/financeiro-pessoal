-- ============================================
-- MIGRAÇÃO: Atualizar dados existentes com user_id
-- ============================================
-- Esta migração atualiza os dados existentes para atribuir um user_id
-- Execute APÓS migration_add_user_id.sql e ANTES de rls-policies.sql

-- Atualizar d_bancos com user_id do primeiro usuário autenticado
UPDATE public.d_bancos
SET user_id = (
  SELECT id FROM auth.users LIMIT 1
)
WHERE user_id IS NULL;

-- Atualizar d_cartoes_credito com user_id do primeiro usuário autenticado
UPDATE public.d_cartoes_credito
SET user_id = (
  SELECT id FROM auth.users LIMIT 1
)
WHERE user_id IS NULL;

-- Atualizar d_fornecedores com user_id do primeiro usuário autenticado
UPDATE public.d_fornecedores
SET user_id = (
  SELECT id FROM auth.users LIMIT 1
)
WHERE user_id IS NULL;

-- Atualizar d_clientes com user_id do primeiro usuário autenticado
UPDATE public.d_clientes
SET user_id = (
  SELECT id FROM auth.users LIMIT 1
)
WHERE user_id IS NULL;

-- Atualizar f_lancamentos com user_id do primeiro usuário autenticado
UPDATE public.f_lancamentos
SET user_id = (
  SELECT id FROM auth.users LIMIT 1
)
WHERE user_id IS NULL;

-- ============================================
-- NOTA IMPORTANTE
-- ============================================
-- Esta migração atribui todos os dados existentes ao primeiro usuário
-- Se você tiver múltiplos usuários, precisará ajustar a lógica
-- para atribuir os dados corretamente a cada usuário
-- ============================================
