import { supabase, getCurrentUserId } from './supabaseClient';
import { CartaoCredito } from '../types';

export const cartoesService = {
  async listar(): Promise<CartaoCredito[]> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_cartoes_credito')
      .select('*')
      .eq('user_id', userId)
      .eq('ativo', true)
      .order('nome', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: number): Promise<CartaoCredito | null> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_cartoes_credito')
      .select('*')
      .eq('id_cartao', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(cartao: Omit<CartaoCredito, 'id_cartao' | 'created_at'>): Promise<CartaoCredito> {
    const userId = await getCurrentUserId();
    const cartaoComUserId = { ...cartao, user_id: userId };
    
    const { data, error } = await supabase
      .from('d_cartoes_credito')
      .insert([cartaoComUserId])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: number, updates: Partial<CartaoCredito>): Promise<CartaoCredito> {
    const { data, error } = await supabase
      .from('d_cartoes_credito')
      .update(updates)
      .eq('id_cartao', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: number): Promise<void> {
    const { error } = await supabase
      .from('d_cartoes_credito')
      .delete()
      .eq('id_cartao', id);

    if (error) throw error;
  },
};
