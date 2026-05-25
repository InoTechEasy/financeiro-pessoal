import { supabase, getCurrentUserId } from './supabaseClient';

export const tiposPagamentosService = {
  async listar() {
    // Obter user_id do usuário autenticado para multi-tenancy
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_tipos_pagamentos')
      .select('*')
      .eq('user_id', userId)
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: string) {
    const { data, error } = await supabase
      .from('d_tipos_pagamentos')
      .select('*')
      .eq('id_tipo_pagamento', id)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(dados: any) {
    // Obter user_id do usuário autenticado para multi-tenancy
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('d_tipos_pagamentos')
      .insert({ ...dados, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
