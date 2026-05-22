// Tipos de Lançamentos
export type TipoLancamento = 'RECEITA' | 'DESPESA' | 'INVESTIMENTO';

// Status do Lançamento (determinado pela lógica, não armazenado)
export type StatusLancamento = 'PENDENTE' | 'PAGO' | 'PLANEJADO' | 'CANCELADO';

// Interfaces para Dimensões
export interface DimensaoBase {
  created_at: string;
  ativo: boolean;
}

export interface DimensaoHierarquica extends DimensaoBase {
  id_pai: string | null;
  nome: string;
  descricao?: string;
  icone?: string;
  cor_hex?: string;
  ordem?: number;
}

export interface TipoLancamentoDim extends DimensaoBase {
  id_tipo_lancamento: string;
  nome: TipoLancamento;
  descricao?: string;
}

export interface Receita extends DimensaoHierarquica {
  id_receita: string;
}

export interface Investimento extends DimensaoHierarquica {
  id_investimento: string;
}

export interface CategoriaDespesa extends DimensaoHierarquica {
  id_categoria_despesa: string;
}

export interface Documento extends DimensaoHierarquica {
  id_documento: string;
}

export interface TipoPagamento extends DimensaoBase {
  id_tipo_pagamento: string;
  nome: string;
  descricao?: string;
}

export interface Banco extends DimensaoBase {
  id_banco: string;
  nome: string;
  codigo_banco?: string;
  tipo_conta?: string;
  numero_conta?: string;
  agencia?: string;
  saldo_inicial: number;
  updated_at: string;
}

export interface CartaoCredito extends DimensaoBase {
  id_cartao_credito: string;
  id_banco: string;
  nome: string;
  ultimos_digitos?: string;
  bandeira?: string;
  limite_credito?: number;
  data_vencimento_fatura?: number;
  updated_at: string;
}

export interface Fornecedor extends DimensaoBase {
  id_fornecedor: string;
  nome: string;
  tipo?: string;
  cpf_cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  updated_at: string;
}

export interface Cliente extends DimensaoBase {
  id_cliente: string;
  nome: string;
  tipo?: string;
  cpf_cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  updated_at: string;
}

// Interface para Lançamento (Tabela Fato)
export interface Lancamento {
  id_lancamento: string;
  id_tipo_lancamento: string;
  id_receita?: string | null;
  id_categoria_despesa?: string | null;
  id_investimento?: string | null;
  data_documento?: string | null;
  id_documento?: string | null;
  n_documento?: string | null;
  id_fornecedor?: string | null;
  id_cliente?: string | null;
  descricao: string;
  id_tipo_pagamento: string;
  id_cartao_credito?: string | null;
  id_banco: string;
  valor_total: number;
  parcelas?: string | null;
  valor_parcela?: number | null;
  data_vencimento?: string | null;
  data_pagamento?: string | null;
  observacoes?: string | null;
  created_at: string;
  updated_at: string;
}

// Interface para Lançamento com dados relacionados (para exibição)
export interface LancamentoComDetalhes extends Lancamento {
  tipo_lancamento?: TipoLancamentoDim;
  receita?: Receita;
  categoria_despesa?: CategoriaDespesa;
  investimento?: Investimento;
  documento?: Documento;
  tipo_pagamento?: TipoPagamento;
  cartao_credito?: CartaoCredito;
  banco?: Banco;
  fornecedor?: Fornecedor;
  cliente?: Cliente;
  status?: StatusLancamento;
}

// DTOs para Formulários
export interface CriarLancamentoDTO {
  id_tipo_lancamento: string;
  id_receita?: string;
  id_categoria_despesa?: string;
  id_investimento?: string;
  data_documento?: string;
  id_documento?: string;
  n_documento?: string;
  id_fornecedor?: string;
  id_cliente?: string;
  descricao: string;
  id_tipo_pagamento: string;
  id_cartao_credito?: string;
  id_banco: string;
  valor_total: number;
  parcelas?: string;
  valor_parcela?: number;
  data_vencimento?: string;
  data_pagamento?: string;
  observacoes?: string;
}

export interface AtualizarLancamentoDTO extends Partial<CriarLancamentoDTO> {
  id_lancamento: string;
}

// Interface para Filtros
export interface FiltrosLancamento {
  data_inicio?: string;
  data_fim?: string;
  id_tipo_lancamento?: string;
  id_categoria_despesa?: string;
  id_receita?: string;
  id_investimento?: string;
  id_tipo_pagamento?: string;
  id_banco?: string;
  status?: StatusLancamento;
  descricao?: string;
}
