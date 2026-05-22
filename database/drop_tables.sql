-- ============================================
-- DROP TABLES
-- ============================================

-- Drop tabelas fato primeiro (devido a dependências)
DROP TABLE IF EXISTS public.f_conciliacao_bancaria CASCADE;
DROP TABLE IF EXISTS public.f_lancamentos CASCADE;

-- Drop tabelas dimensão
DROP TABLE IF EXISTS public.d_cartoes_credito CASCADE;
DROP TABLE IF EXISTS public.d_bancos CASCADE;
DROP TABLE IF EXISTS public.d_clientes CASCADE;
DROP TABLE IF EXISTS public.d_fornecedores CASCADE;
DROP TABLE IF EXISTS public.d_tipos_pagamentos CASCADE;
DROP TABLE IF EXISTS public.d_documentos CASCADE;
DROP TABLE IF EXISTS public.d_categorias_despesas CASCADE;
DROP TABLE IF EXISTS public.d_investimentos CASCADE;
DROP TABLE IF EXISTS public.d_receitas CASCADE;
DROP TABLE IF EXISTS public.d_tipos_lancamentos CASCADE;
