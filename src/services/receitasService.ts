import { supabase, getCurrentUserId } from './supabaseClient';
import { Receita } from '../types';

export const receitasService = {
  async listar(): Promise<Receita[]> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_receitas')
      .select('*')
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .eq('ativo', true)
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: number): Promise<Receita | null> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_receitas')
      .select('*')
      .eq('id_receita', id)
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(receita: Omit<Receita, 'id_receita' | 'created_at'>): Promise<Receita> {
    const userId = await getCurrentUserId();
    const receitaComUserId = { ...receita, user_id: userId };
    
    const { data, error } = await supabase
      .from('d_receitas')
      .insert([receitaComUserId])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: number, updates: Partial<Receita>): Promise<Receita> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_receitas')
      .update(updates)
      .eq('id_receita', id)
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: number): Promise<void> {
    const userId = await getCurrentUserId();
    
    const { error } = await supabase
      .from('d_receitas')
      .delete()
      .eq('id_receita', id)
      .or(`user_id.is.null,user_id.eq.${userId}`);

    if (error) throw error;
  },
};
