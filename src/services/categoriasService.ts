import { supabase, getCurrentUserId } from './supabaseClient';
import { CategoriaDespesa } from '../types';

export const categoriasService = {
  async listar(): Promise<CategoriaDespesa[]> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_categorias_despesas')
      .select('*')
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .eq('ativo', true)
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: number): Promise<CategoriaDespesa | null> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_categorias_despesas')
      .select('*')
      .eq('id_categoria_despesa', id)
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .single();

    if (error) throw error;
    return data;
  },

  async obterSubcategorias(idPai: number): Promise<CategoriaDespesa[]> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_categorias_despesas')
      .select('*')
      .eq('id_pai', idPai)
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .eq('ativo', true)
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async criar(categoria: Omit<CategoriaDespesa, 'id_categoria_despesa' | 'created_at'>): Promise<CategoriaDespesa> {
    const userId = await getCurrentUserId();
    const categoriaComUserId = { ...categoria, user_id: userId };
    
    const { data, error } = await supabase
      .from('d_categorias_despesas')
      .insert([categoriaComUserId])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: number, updates: Partial<CategoriaDespesa>): Promise<CategoriaDespesa> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_categorias_despesas')
      .update(updates)
      .eq('id_categoria_despesa', id)
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: number): Promise<void> {
    const userId = await getCurrentUserId();
    
    const { error } = await supabase
      .from('d_categorias_despesas')
      .delete()
      .eq('id_categoria_despesa', id)
      .or(`user_id.is.null,user_id.eq.${userId}`);

    if (error) throw error;
  },
};
