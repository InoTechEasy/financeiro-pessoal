import { supabase, getCurrentUserId } from './supabaseClient';
import { CartaoCredito } from '../types';

export const cartoesService = {
  async listar(): Promise<CartaoCredito[]> {
    // Obter user_id do usuário autenticado para multi-tenancy
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

  async obterPorId(id: string): Promise<CartaoCredito | null> {
    const { data, error } = await supabase
      .from('d_cartoes_credito')
      .select('*')
      .eq('id_cartao_credito', id)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(cartao: Omit<CartaoCredito, 'id_cartao_credito' | 'created_at' | 'updated_at'>): Promise<CartaoCredito> {
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

  async atualizar(id: string, updates: Partial<CartaoCredito>): Promise<CartaoCredito> {
    const { data, error } = await supabase
      .from('d_cartoes_credito')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id_cartao_credito', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('d_cartoes_credito')
      .update({ ativo: false })
      .eq('id_cartao_credito', id);

    if (error) throw error;
  },
};
