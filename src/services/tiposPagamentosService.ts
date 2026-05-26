import { supabase, getCurrentUserId } from './supabaseClient';
import { TipoPagamento } from '../types';

export const tiposPagamentosService = {
  async listar(): Promise<TipoPagamento[]> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_tipos_pagamentos')
      .select('*')
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .eq('ativo', true)
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: number): Promise<TipoPagamento | null> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_tipos_pagamentos')
      .select('*')
      .eq('id_tipo_pagamento', id)
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(dados: Omit<TipoPagamento, 'id_tipo_pagamento' | 'created_at'>): Promise<TipoPagamento> {
    const userId = await getCurrentUserId();
    const dadosComUserId = { ...dados, user_id: userId };
    
    const { data, error } = await supabase
      .from('d_tipos_pagamentos')
      .insert([dadosComUserId])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: number, updates: Partial<TipoPagamento>): Promise<TipoPagamento> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_tipos_pagamentos')
      .update(updates)
      .eq('id_tipo_pagamento', id)
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: number): Promise<void> {
    const userId = await getCurrentUserId();
    
    const { error } = await supabase
      .from('d_tipos_pagamentos')
      .delete()
      .eq('id_tipo_pagamento', id)
      .or(`user_id.is.null,user_id.eq.${userId}`);

    if (error) throw error;
  },
};
