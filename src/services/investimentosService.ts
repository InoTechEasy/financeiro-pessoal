import { supabase } from './supabaseClient';
import { Investimento } from '../types';

export const investimentosService = {
  async listar(): Promise<Investimento[]> {
    const { data, error } = await supabase
      .from('d_investimentos')
      .select('*')
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: string): Promise<Investimento | null> {
    const { data, error } = await supabase
      .from('d_investimentos')
      .select('*')
      .eq('id_investimento', id)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(investimento: Omit<Investimento, 'id_investimento' | 'created_at'>): Promise<Investimento> {
    const { data, error } = await supabase
      .from('d_investimentos')
      .insert([investimento])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: string, updates: Partial<Investimento>): Promise<Investimento> {
    const { data, error } = await supabase
      .from('d_investimentos')
      .update(updates)
      .eq('id_investimento', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('d_investimentos')
      .delete()
      .eq('id_investimento', id);

    if (error) throw error;
  },
};
