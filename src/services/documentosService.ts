import { supabase, getCurrentUserId } from './supabaseClient';
import { Documento } from '../types';

export const documentosService = {
  async listar(): Promise<Documento[]> {
    // Obter user_id do usuário autenticado para multi-tenancy
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_documentos')
      .select('*')
      .eq('user_id', userId)
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: string): Promise<Documento | null> {
    const { data, error } = await supabase
      .from('d_documentos')
      .select('*')
      .eq('id_documento', id)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(documento: Omit<Documento, 'id_documento' | 'created_at'>): Promise<Documento> {
    // Obter user_id do usuário autenticado para multi-tenancy
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_documentos')
      .insert([{ ...documento, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: string, updates: Partial<Documento>): Promise<Documento> {
    const { data, error } = await supabase
      .from('d_documentos')
      .update(updates)
      .eq('id_documento', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('d_documentos')
      .delete()
      .eq('id_documento', id);

    if (error) throw error;
  },
};
