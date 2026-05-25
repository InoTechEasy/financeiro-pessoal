import { supabase, getCurrentUserId } from './supabaseClient';
import { Lancamento, CriarLancamentoDTO, FiltrosLancamento } from '../types';

export const lancamentosService = {
  // Listar lançamentos com filtros
  async listar(filtros?: FiltrosLancamento): Promise<Lancamento[]> {
    // Obter user_id do usuário autenticado para multi-tenancy
    const userId = await getCurrentUserId();
    
    let query = supabase.from('f_lancamentos').select('*').eq('user_id', userId);

    if (filtros?.data_inicio) {
      query = query.gte('data_vencimento', filtros.data_inicio);
    }
    if (filtros?.data_fim) {
      query = query.lte('data_vencimento', filtros.data_fim);
    }
    if (filtros?.id_tipo_lancamento) {
      query = query.eq('id_tipo_lancamento', filtros.id_tipo_lancamento);
    }
    if (filtros?.id_categoria_despesa) {
      query = query.eq('id_categoria_despesa', filtros.id_categoria_despesa);
    }
    if (filtros?.id_receita) {
      query = query.eq('id_receita', filtros.id_receita);
    }
    if (filtros?.id_investimento) {
      query = query.eq('id_investimento', filtros.id_investimento);
    }
    if (filtros?.id_tipo_pagamento) {
      query = query.eq('id_tipo_pagamento', filtros.id_tipo_pagamento);
    }
    if (filtros?.id_banco) {
      query = query.eq('id_banco', filtros.id_banco);
    }
    if (filtros?.descricao) {
      query = query.ilike('descricao', `%${filtros.descricao}%`);
    }

    const { data, error } = await query.order('data_vencimento', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Obter lançamento por ID
  async obterPorId(id: number): Promise<Lancamento | null> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('f_lancamentos')
      .select('*')
      .eq('id_lancamento', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Criar lançamento
  async criar(lancamento: CriarLancamentoDTO): Promise<Lancamento> {
    // Obter user_id do usuário autenticado para multi-tenancy
    const userId = await getCurrentUserId();
    
    // Adicionar user_id ao lançamento (RLS garante que cada usuário veja apenas seus dados)
    const lancamentoComUserId = {
      ...lancamento,
      user_id: userId,
    };

    const { data, error } = await supabase
      .from('f_lancamentos')
      .insert([lancamentoComUserId])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Atualizar lançamento
  async atualizar(id: number, updates: Partial<CriarLancamentoDTO>): Promise<Lancamento> {
    const { data, error } = await supabase
      .from('f_lancamentos')
      .update(updates)
      .eq('id_lancamento', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Deletar lançamento
  async deletar(id: number): Promise<void> {
    const { error } = await supabase
      .from('f_lancamentos')
      .delete()
      .eq('id_lancamento', id);

    if (error) throw error;
  },

  // Obter resumo (receitas, despesas, investimentos)
  async obterResumo(dataInicio?: string, dataFim?: string, idsTiposLancamentos?: any, filtroData?: 'vencimento' | 'pagamento') {
    const userId = await getCurrentUserId();
    
    let query = supabase
      .from('f_lancamentos')
      .select('id_tipo_lancamento, valor_total, data_pagamento, data_vencimento')
      .eq('user_id', userId);

    // Filtrar por período
    if (dataInicio) {
      const campoData = filtroData === 'pagamento' ? 'data_pagamento' : 'data_vencimento';
      query = query.gte(campoData, dataInicio);
    }
    if (dataFim) {
      const campoData = filtroData === 'pagamento' ? 'data_pagamento' : 'data_vencimento';
      query = query.lte(campoData, dataFim);
    }

    const { data, error } = await query;

    if (error) throw error;

    const resumo = {
      receitas: 0,
      despesas: 0,
      investimentos: 0,
    };

    // Se não tiver os IDs dos tipos, buscar
    let receitaId: number | undefined, despesaId: number | undefined, investimentoId: number | undefined, transferenciaId: number | undefined;
    if (idsTiposLancamentos) {
      receitaId = idsTiposLancamentos.find((t: any) => t.nome === 'Receita')?.id_tipo_lancamento;
      despesaId = idsTiposLancamentos.find((t: any) => t.nome === 'Despesa')?.id_tipo_lancamento;
      investimentoId = idsTiposLancamentos.find((t: any) => t.nome === 'Investimento')?.id_tipo_lancamento;
      transferenciaId = idsTiposLancamentos.find((t: any) => t.nome === 'Transferência')?.id_tipo_lancamento;
    }

    data?.forEach((item: any) => {
      // Não contar transferências no resumo
      if (transferenciaId && item.id_tipo_lancamento === transferenciaId) {
        return;
      }
      
      // Se filtro for pagamento, só soma se tiver data_pagamento
      if (filtroData === 'pagamento' && !item.data_pagamento) {
        return;
      }
      
      if (receitaId && item.id_tipo_lancamento === receitaId) {
        resumo.receitas += item.valor_total;
      } else if (despesaId && item.id_tipo_lancamento === despesaId) {
        resumo.despesas += item.valor_total;
      } else if (investimentoId && item.id_tipo_lancamento === investimentoId) {
        resumo.investimentos += item.valor_total;
      }
    });

    return resumo;
  },
};
