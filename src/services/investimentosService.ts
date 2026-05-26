import { supabase, getCurrentUserId } from './supabaseClient';
import { Investimento } from '../types';

export const investimentosService = {
  async listar(): Promise<Investimento[]> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_investimentos')
      .select('*')
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .eq('ativo', true)
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: number): Promise<Investimento | null> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_investimentos')
      .select('*')
      .eq('id_investimento', id)
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(investimento: Omit<Investimento, 'id_investimento' | 'created_at'>): Promise<Investimento> {
    const userId = await getCurrentUserId();
    const investimentoComUserId = { ...investimento, user_id: userId };
    
    const { data, error } = await supabase
      .from('d_investimentos')
      .insert([investimentoComUserId])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: number, updates: Partial<Investimento>): Promise<Investimento> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_investimentos')
      .update(updates)
      .eq('id_investimento', id)
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: number): Promise<void> {
    const userId = await getCurrentUserId();
    
    const { error } = await supabase
      .from('d_investimentos')
      .delete()
      .eq('id_investimento', id)
      .or(`user_id.is.null,user_id.eq.${userId}`);

    if (error) throw error;
  },
};
