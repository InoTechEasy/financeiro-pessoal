import { supabase, getCurrentUserId } from './supabaseClient';
import { Fornecedor } from '../types';

export const fornecedoresService = {
  async listar(): Promise<Fornecedor[]> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_fornecedores')
      .select('*')
      .eq('user_id', userId)
      .eq('ativo', true)
      .order('nome', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: number): Promise<Fornecedor | null> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_fornecedores')
      .select('*')
      .eq('id_fornecedor', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(fornecedor: Omit<Fornecedor, 'id_fornecedor' | 'created_at'>): Promise<Fornecedor> {
    const userId = await getCurrentUserId();
    const fornecedorComUserId = { ...fornecedor, user_id: userId };
    
    const { data, error } = await supabase
      .from('d_fornecedores')
      .insert([fornecedorComUserId])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: number, updates: Partial<Fornecedor>): Promise<Fornecedor> {
    const { data, error } = await supabase
      .from('d_fornecedores')
      .update(updates)
      .eq('id_fornecedor', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: number): Promise<void> {
    const { error } = await supabase
      .from('d_fornecedores')
      .delete()
      .eq('id_fornecedor', id);

    if (error) throw error;
  },
};
