import { supabase } from './supabaseClient';
import { Receita } from '../types';

export const receitasService = {
  async listar(): Promise<Receita[]> {
    const { data, error } = await supabase
      .from('d_receitas')
      .select('*')
      .eq('ativo', true)
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: number): Promise<Receita | null> {
    const { data, error } = await supabase
      .from('d_receitas')
      .select('*')
      .eq('id_receita', id)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(receita: Omit<Receita, 'id_receita' | 'created_at'>): Promise<Receita> {
    const { data, error } = await supabase
      .from('d_receitas')
      .insert([receita])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: number, updates: Partial<Receita>): Promise<Receita> {
    const { data, error } = await supabase
      .from('d_receitas')
      .update(updates)
      .eq('id_receita', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: number): Promise<void> {
    const { error } = await supabase
      .from('d_receitas')
      .delete()
      .eq('id_receita', id);

    if (error) throw error;
  },
};
