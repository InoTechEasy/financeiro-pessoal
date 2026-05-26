import { supabase, getCurrentUserId } from './supabaseClient';
import { TipoLancamentoDim } from '../types';

export const tiposLancamentosService = {
  async listar(): Promise<TipoLancamentoDim[]> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_tipos_lancamentos')
      .select('*')
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .eq('ativo', true)
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: number): Promise<TipoLancamentoDim | null> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_tipos_lancamentos')
      .select('*')
      .eq('id_tipo_lancamento', id)
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(dados: Omit<TipoLancamentoDim, 'id_tipo_lancamento' | 'created_at'>): Promise<TipoLancamentoDim> {
    const userId = await getCurrentUserId();
    const dadosComUserId = { ...dados, user_id: userId };
    
    const { data, error } = await supabase
      .from('d_tipos_lancamentos')
      .insert([dadosComUserId])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: number, updates: Partial<TipoLancamentoDim>): Promise<TipoLancamentoDim> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_tipos_lancamentos')
      .update(updates)
      .eq('id_tipo_lancamento', id)
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: number): Promise<void> {
    const userId = await getCurrentUserId();
    
    const { error } = await supabase
      .from('d_tipos_lancamentos')
      .delete()
      .eq('id_tipo_lancamento', id)
      .or(`user_id.is.null,user_id.eq.${userId}`);

    if (error) throw error;
  },
};
