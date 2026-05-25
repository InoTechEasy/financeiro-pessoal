import { supabase } from './supabaseClient';
import { CategoriaDespesa } from '../types';

export const categoriasService = {
  async listar(): Promise<CategoriaDespesa[]> {
    const { data, error } = await supabase
      .from('d_categorias_despesas')
      .select('*')
      .eq('ativo', true)
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: number): Promise<CategoriaDespesa | null> {
    const { data, error } = await supabase
      .from('d_categorias_despesas')
      .select('*')
      .eq('id_categoria_despesa', id)
      .single();

    if (error) throw error;
    return data;
  },

  async obterSubcategorias(idPai: number): Promise<CategoriaDespesa[]> {
    const { data, error } = await supabase
      .from('d_categorias_despesas')
      .select('*')
      .eq('id_pai', idPai)
      .eq('ativo', true)
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async criar(categoria: Omit<CategoriaDespesa, 'id_categoria_despesa' | 'created_at'>): Promise<CategoriaDespesa> {
    const { data, error } = await supabase
      .from('d_categorias_despesas')
      .insert([categoria])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: number, updates: Partial<CategoriaDespesa>): Promise<CategoriaDespesa> {
    const { data, error } = await supabase
      .from('d_categorias_despesas')
      .update(updates)
      .eq('id_categoria_despesa', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: number): Promise<void> {
    const { error } = await supabase
      .from('d_categorias_despesas')
      .delete()
      .eq('id_categoria_despesa', id);

    if (error) throw error;
  },
};
