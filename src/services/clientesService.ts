import { supabase, getCurrentUserId } from './supabaseClient';

export const clientesService = {
  async listar() {
    // Obter user_id do usuário autenticado para multi-tenancy
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_clientes')
      .select('*')
      .eq('user_id', userId)
      .eq('ativo', true)
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: string) {
    const { data, error } = await supabase
      .from('d_clientes')
      .select('*')
      .eq('id_cliente', id)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(dados: any) {
    const userId = await getCurrentUserId();
    const dadosComUserId = { ...dados, user_id: userId };
    
    const { data, error } = await supabase
      .from('d_clientes')
      .insert(dadosComUserId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: string, dados: any) {
    const { data, error } = await supabase
      .from('d_clientes')
      .update(dados)
      .eq('id_cliente', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletar(id: string) {
    const { error } = await supabase
      .from('d_clientes')
      .delete()
      .eq('id_cliente', id);

    if (error) throw error;
  },
};
