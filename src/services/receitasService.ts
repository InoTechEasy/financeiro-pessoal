import { supabase, getCurrentUserId } from './supabaseClient';
import { Receita } from '../types';

export const receitasService = {
  async listar(): Promise<Receita[]> {
    // Obter user_id do usuário autenticado para multi-tenancy
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_receitas')
      .select('*')
      .eq('user_id', userId)
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: string): Promise<Receita | null> {
    const { data, error } = await supabase
      .from('d_receitas')
      .select('*')
      .eq('id_receita', id)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(receita: Omit<Receita, 'id_receita' | 'created_at'>): Promise<Receita> {
    // Obter user_id do usuário autenticado para multi-tenancy
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_receitas')
      .insert([{ ...receita, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: string, updates: Partial<Receita>): Promise<Receita> {
    const { data, error } = await supabase
      .from('d_receitas')
      .update(updates)
      .eq('id_receita', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('d_receitas')
      .delete()
      .eq('id_receita', id);

    if (error) throw error;
  },
};
