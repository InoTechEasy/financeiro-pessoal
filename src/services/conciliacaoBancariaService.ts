import { supabase, getCurrentUserId } from './supabaseClient';

export const conciliacaoBancariaService = {
  // Listar conciliações
  async listar(filtros?: { id_banco?: string; data_inicio?: string; data_fim?: string }): Promise<any[]> {
    // Obter user_id do usuário autenticado para multi-tenancy
    const userId = await getCurrentUserId();
    
    let query = supabase.from('f_conciliacao_bancaria').select('*').eq('user_id', userId);

    if (filtros?.id_banco) {
      query = query.eq('id_banco', filtros.id_banco);
    }
    if (filtros?.data_inicio) {
      query = query.gte('data_inicio', filtros.data_inicio);
    }
    if (filtros?.data_fim) {
      query = query.lte('data_fim', filtros.data_fim);
    }

    const { data, error } = await query.order('data_inicio', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Obter conciliação por ID
  async obterPorId(id: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('f_conciliacao_bancaria')
      .select('*')
      .eq('id_conciliacao', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Criar conciliação
  async criar(conciliacao: any): Promise<any> {
    // Obter user_id do usuário autenticado para multi-tenancy
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('f_conciliacao_bancaria')
      .insert([{ ...conciliacao, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Atualizar conciliação
  async atualizar(id: string, updates: Partial<any>): Promise<any> {
    const { data, error } = await supabase
      .from('f_conciliacao_bancaria')
      .update(updates)
      .eq('id_conciliacao', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Deletar conciliação
  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('f_conciliacao_bancaria')
      .delete()
      .eq('id_conciliacao', id);

    if (error) throw error;
  },

  // Obter saldo inicial do período (saldo bancário final do período anterior)
  async obterSaldoInicial(idBanco: string, dataInicio: string): Promise<number> {
    // Obter user_id do usuário autenticado para multi-tenancy
    const userId = await getCurrentUserId();
    
    // Buscar a última conciliação anterior à data início
    const { data, error } = await supabase
      .from('f_conciliacao_bancaria')
      .select('saldo_bancario_final')
      .eq('user_id', userId)
      .eq('id_banco', idBanco)
      .lt('data_fim', dataInicio)
      .order('data_fim', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      // Se não houver conciliação anterior, usar saldo inicial do banco
      const { data: banco, error: bancoError } = await supabase
        .from('d_bancos')
        .select('saldo_inicial')
        .eq('user_id', userId)
        .eq('id_banco', idBanco)
        .single();

      if (bancoError) throw bancoError;
      return banco?.saldo_inicial || 0;
    }

    return data.saldo_bancario_final || 0;
  },

  // Calcular totais do período (receitas, despesas, investimentos)
  async calcularTotaisPeriodo(idBanco: string, dataInicio: string, dataFim: string, idsTiposLancamentos?: any): Promise<any> {
    // Obter user_id do usuário autenticado para multi-tenancy
    const userId = await getCurrentUserId();
    
    const receitaId = idsTiposLancamentos?.find((t: any) => t.nome === 'RECEITA' || t.nome === 'Receita')?.id_tipo_lancamento;
    const despesaId = idsTiposLancamentos?.find((t: any) => t.nome === 'DESPESA' || t.nome === 'Despesa')?.id_tipo_lancamento;
    const investimentoId = idsTiposLancamentos?.find((t: any) => t.nome === 'INVESTIMENTO' || t.nome === 'Investimento')?.id_tipo_lancamento;

    // Buscar lançamentos do período
    const { data, error } = await supabase
      .from('f_lancamentos')
      .select('id_tipo_lancamento, valor_total')
      .eq('user_id', userId)
      .eq('id_banco', idBanco)
      .gte('data_vencimento', dataInicio)
      .lte('data_vencimento', dataFim);

    if (error) throw error;

    const totais = {
      receitas: 0,
      despesas: 0,
      investimentos: 0,
    };

    data?.forEach((item: any) => {
      if (receitaId && item.id_tipo_lancamento === receitaId) {
        totais.receitas += item.valor_total;
      } else if (despesaId && item.id_tipo_lancamento === despesaId) {
        totais.despesas += item.valor_total;
      } else if (investimentoId && item.id_tipo_lancamento === investimentoId) {
        totais.investimentos += item.valor_total;
      }
    });

    return totais;
  },
};
