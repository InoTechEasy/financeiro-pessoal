import { supabase, getCurrentUserId } from './supabaseClient';
import { Banco } from '../types';

export const bancosService = {
  async listar(): Promise<Banco[]> {
    const { data, error } = await supabase
      .from('d_bancos')
      .select('*')
      .eq('ativo', true)
      .order('nome', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: string): Promise<Banco | null> {
    const { data, error } = await supabase
      .from('d_bancos')
      .select('*')
      .eq('id_banco', id)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(banco: Omit<Banco, 'id_banco' | 'created_at' | 'updated_at'>): Promise<Banco> {
    // Obter user_id do usuário autenticado para multi-tenancy
    const userId = await getCurrentUserId();
    
    // Adicionar user_id ao banco (RLS garante que cada usuário veja apenas seus dados)
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

  async atualizar(id: string, updates: Partial<Banco>): Promise<Banco> {
    const { data, error } = await supabase
      .from('d_bancos')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id_banco', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('d_bancos')
      .update({ ativo: false })
      .eq('id_banco', id);

    if (error) throw error;
  },
};
