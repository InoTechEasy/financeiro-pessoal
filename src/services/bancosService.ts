import { supabase, getCurrentUserId } from './supabaseClient';
import { Banco } from '../types';

export const bancosService = {
  async listar(): Promise<Banco[]> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_bancos')
      .select('*')
      .eq('user_id', userId)
      .eq('ativo', true)
      .order('nome', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: number): Promise<Banco | null> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_bancos')
      .select('*')
      .eq('id_banco', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(banco: Omit<Banco, 'id_banco' | 'created_at'>): Promise<Banco> {
    const userId = await getCurrentUserId();
    
    const bancoComUserId = {
      ...banco,
      user_id: userId,
    };

    const { data, error } = await supabase
      .from('d_bancos')
      .insert([bancoComUserId])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: number, updates: Partial<Banco>): Promise<Banco> {
    const { data, error } = await supabase
      .from('d_bancos')
      .update(updates)
      .eq('id_banco', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: number): Promise<void> {
    const { error } = await supabase
      .from('d_bancos')
      .delete()
      .eq('id_banco', id);

    if (error) throw error;
  },
};
