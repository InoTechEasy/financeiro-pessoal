import { supabase, getCurrentUserId } from './supabaseClient';
import { Documento } from '../types';

export const documentosService = {
  async listar(): Promise<Documento[]> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_documentos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: number): Promise<Documento | null> {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_documentos')
      .select('*')
      .eq('id_documento', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(documento: Omit<Documento, 'id_documento' | 'created_at'>): Promise<Documento> {
    const { data, error } = await supabase
      .from('d_documentos')
      .insert([documento])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: number, updates: Partial<Documento>): Promise<Documento> {
    const { data, error } = await supabase
      .from('d_documentos')
      .update(updates)
      .eq('id_documento', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: number): Promise<void> {
    const { error } = await supabase
      .from('d_documentos')
      .delete()
      .eq('id_documento', id);

    if (error) throw error;
  },
};
