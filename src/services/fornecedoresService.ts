import { supabase } from './supabaseClient';
import { Fornecedor } from '../types';

export const fornecedoresService = {
  async listar(): Promise<Fornecedor[]> {
    const { data, error } = await supabase
      .from('d_fornecedores')
      .select('*')
      .eq('ativo', true)
      .order('nome', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: string): Promise<Fornecedor | null> {
    const { data, error } = await supabase
      .from('d_fornecedores')
      .select('*')
      .eq('id_fornecedor', id)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(fornecedor: Omit<Fornecedor, 'id_fornecedor' | 'created_at' | 'updated_at'>): Promise<Fornecedor> {
    const { data, error } = await supabase
      .from('d_fornecedores')
      .insert([fornecedor])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: string, updates: Partial<Fornecedor>): Promise<Fornecedor> {
    const { data, error } = await supabase
      .from('d_fornecedores')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id_fornecedor', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('d_fornecedores')
      .update({ ativo: false })
      .eq('id_fornecedor', id);

    if (error) throw error;
  },
};
