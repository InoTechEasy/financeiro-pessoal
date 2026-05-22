-- ============================================
-- MIGRAÇÃO: Adicionar suporte a transferências entre contas
-- ============================================
-- Este script adiciona as colunas id_banco_destino e eh_transferencia
-- na tabela f_lancamentos sem perder os dados existentes
-- ============================================

-- Adicionar coluna id_banco_destino
ALTER TABLE public.f_lancamentos 
ADD COLUMN IF NOT EXISTS id_banco_destino UUID REFERENCES public.d_bancos(id_banco);

-- Adicionar coluna eh_transferencia
ALTER TABLE public.f_lancamentos 
ADD COLUMN IF NOT EXISTS eh_transferencia BOOLEAN DEFAULT FALSE;

-- ============================================
-- Instruções:
-- Execute este script no banco de dados para adicionar as colunas
-- Não é necessário executar drop_tables.sql e create_tables.sql
-- ============================================
