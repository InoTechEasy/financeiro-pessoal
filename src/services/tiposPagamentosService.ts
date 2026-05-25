import { supabase } from './supabaseClient';

export const tiposPagamentosService = {
  async listar() {
    const { data, error } = await supabase
      .from('d_tipos_pagamentos')
      .select('*')
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: number) {
    const { data, error } = await supabase
      .from('d_tipos_pagamentos')
      .select('*')
      .eq('id_tipo_pagamento', id)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(dados: any) {
    const { data, error } = await supabase
      .from('d_tipos_pagamentos')
      .insert(dados)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
