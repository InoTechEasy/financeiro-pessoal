-- ============================================
-- CONFIGURAÇÃO DE RLS (ROW LEVEL SECURITY)
-- ============================================

-- Dropar políticas existentes
DROP POLICY IF EXISTS "Usuários autenticados podem ver lançamentos" ON public.f_lancamentos;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir lançamentos" ON public.f_lancamentos;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar lançamentos" ON public.f_lancamentos;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar lançamentos" ON public.f_lancamentos;

DROP POLICY IF EXISTS "Usuários autenticados podem ver receitas" ON public.d_receitas;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir receitas" ON public.d_receitas;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar receitas" ON public.d_receitas;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar receitas" ON public.d_receitas;

DROP POLICY IF EXISTS "Usuários autenticados podem ver investimentos" ON public.d_investimentos;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir investimentos" ON public.d_investimentos;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar investimentos" ON public.d_investimentos;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar investimentos" ON public.d_investimentos;

DROP POLICY IF EXISTS "Usuários autenticados podem ver categorias" ON public.d_categorias_despesas;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir categorias" ON public.d_categorias_despesas;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar categorias" ON public.d_categorias_despesas;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar categorias" ON public.d_categorias_despesas;

DROP POLICY IF EXISTS "Usuários autenticados podem ver documentos" ON public.d_documentos;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir documentos" ON public.d_documentos;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar documentos" ON public.d_documentos;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar documentos" ON public.d_documentos;

DROP POLICY IF EXISTS "Usuários autenticados podem ver bancos" ON public.d_bancos;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir bancos" ON public.d_bancos;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar bancos" ON public.d_bancos;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar bancos" ON public.d_bancos;

DROP POLICY IF EXISTS "Usuários autenticados podem ver cartões" ON public.d_cartoes_credito;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir cartões" ON public.d_cartoes_credito;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar cartões" ON public.d_cartoes_credito;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar cartões" ON public.d_cartoes_credito;

DROP POLICY IF EXISTS "Usuários autenticados podem ver fornecedores" ON public.d_fornecedores;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir fornecedores" ON public.d_fornecedores;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar fornecedores" ON public.d_fornecedores;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar fornecedores" ON public.d_fornecedores;

DROP POLICY IF EXISTS "Usuários autenticados podem ver tipos de lançamento" ON public.d_tipos_lancamentos;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir tipos de lançamento" ON public.d_tipos_lancamentos;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar tipos de lançamento" ON public.d_tipos_lancamentos;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar tipos de lançamento" ON public.d_tipos_lancamentos;

DROP POLICY IF EXISTS "Usuários autenticados podem ver tipos de pagamento" ON public.d_tipos_pagamentos;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir tipos de pagamento" ON public.d_tipos_pagamentos;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar tipos de pagamento" ON public.d_tipos_pagamentos;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar tipos de pagamento" ON public.d_tipos_pagamentos;

DROP POLICY IF EXISTS "Usuários autenticados podem ver clientes" ON public.d_clientes;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir clientes" ON public.d_clientes;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar clientes" ON public.d_clientes;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar clientes" ON public.d_clientes;

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.f_lancamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.d_receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.d_investimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.d_categorias_despesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.d_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.d_bancos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.d_cartoes_credito ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.d_fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.d_tipos_lancamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.d_tipos_pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.d_clientes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para f_lancamentos
-- Para MVP, vamos permitir que usuários autenticados vejam e editem todos os lançamentos
-- Em produção, adicionar coluna user_id para multi-tenancy
CREATE POLICY "Usuários autenticados podem ver lançamentos"
  ON public.f_lancamentos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem inserir lançamentos"
  ON public.f_lancamentos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar lançamentos"
  ON public.f_lancamentos FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar lançamentos"
  ON public.f_lancamentos FOR DELETE
  USING (auth.role() = 'authenticated');

-- Políticas RLS para tabelas de dimensão (dados compartilhados)
-- Para MVP, vamos permitir que todos os usuários autenticados vejam e editem
CREATE POLICY "Usuários autenticados podem ver receitas"
  ON public.d_receitas FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem inserir receitas"
  ON public.d_receitas FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar receitas"
  ON public.d_receitas FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar receitas"
  ON public.d_receitas FOR DELETE
  USING (auth.role() = 'authenticated');

-- Repetir para outras tabelas de dimensão
CREATE POLICY "Usuários autenticados podem ver investimentos"
  ON public.d_investimentos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem inserir investimentos"
  ON public.d_investimentos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar investimentos"
  ON public.d_investimentos FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar investimentos"
  ON public.d_investimentos FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver categorias"
  ON public.d_categorias_despesas FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem inserir categorias"
  ON public.d_categorias_despesas FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar categorias"
  ON public.d_categorias_despesas FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar categorias"
  ON public.d_categorias_despesas FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver documentos"
  ON public.d_documentos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem inserir documentos"
  ON public.d_documentos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar documentos"
  ON public.d_documentos FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar documentos"
  ON public.d_documentos FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver bancos"
  ON public.d_bancos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem inserir bancos"
  ON public.d_bancos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar bancos"
  ON public.d_bancos FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar bancos"
  ON public.d_bancos FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver cartões"
  ON public.d_cartoes_credito FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem inserir cartões"
  ON public.d_cartoes_credito FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar cartões"
  ON public.d_cartoes_credito FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar cartões"
  ON public.d_cartoes_credito FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver fornecedores"
  ON public.d_fornecedores FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem inserir fornecedores"
  ON public.d_fornecedores FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar fornecedores"
  ON public.d_fornecedores FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar fornecedores"
  ON public.d_fornecedores FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver tipos de lançamento"
  ON public.d_tipos_lancamentos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem inserir tipos de lançamento"
  ON public.d_tipos_lancamentos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar tipos de lançamento"
  ON public.d_tipos_lancamentos FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar tipos de lançamento"
  ON public.d_tipos_lancamentos FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver tipos de pagamento"
  ON public.d_tipos_pagamentos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem inserir tipos de pagamento"
  ON public.d_tipos_pagamentos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar tipos de pagamento"
  ON public.d_tipos_pagamentos FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar tipos de pagamento"
  ON public.d_tipos_pagamentos FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver clientes"
  ON public.d_clientes FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem inserir clientes"
  ON public.d_clientes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar clientes"
  ON public.d_clientes FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar clientes"
  ON public.d_clientes FOR DELETE
  USING (auth.role() = 'authenticated');
