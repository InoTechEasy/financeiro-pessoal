import { supabase, getCurrentUserId } from './supabaseClient';
import { CategoriaDespesa } from '../types';

export const categoriasService = {
  async listar(): Promise<CategoriaDespesa[]> {
    // Obter user_id do usuário autenticado para multi-tenancy
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_categorias_despesas')
      .select('*')
      .eq('user_id', userId)
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: string): Promise<CategoriaDespesa | null> {
    const { data, error } = await supabase
      .from('d_categorias_despesas')
      .select('*')
      .eq('id_categoria_despesa', id)
      .single();

    if (error) throw error;
    return data;
  },

  async obterSubcategorias(idPai: string): Promise<CategoriaDespesa[]> {
    const { data, error } = await supabase
      .from('d_categorias_despesas')
      .select('*')
      .eq('id_pai', idPai)
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async criar(categoria: Omit<CategoriaDespesa, 'id_categoria_despesa' | 'created_at'>): Promise<CategoriaDespesa> {
    // Obter user_id do usuário autenticado para multi-tenancy
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_categorias_despesas')
      .insert([{ ...categoria, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: string, updates: Partial<CategoriaDespesa>): Promise<CategoriaDespesa> {
    const { data, error } = await supabase
      .from('d_categorias_despesas')
      .update(updates)
      .eq('id_categoria_despesa', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('d_categorias_despesas')
      .delete()
      .eq('id_categoria_despesa', id);

    if (error) throw error;
  },
};
