import { supabase } from './supabaseClient';

export const tiposLancamentosService = {
  async listar() {
    const { data, error } = await supabase
      .from('d_tipos_lancamentos')
      .select('*')
      .eq('ativo', true)
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async obterPorId(id: number) {
    const { data, error } = await supabase
      .from('d_tipos_lancamentos')
      .select('*')
      .eq('id_tipo_lancamento', id)
      .single();

    if (error) throw error;
    return data;
  },

  async criar(dados: any) {
    const { data, error } = await supabase
      .from('d_tipos_lancamentos')
      .insert(dados)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
