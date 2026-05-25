// Tipos de Lançamentos
export type TipoLancamento = 'Receita' | 'Despesa' | 'Investimento' | 'Transferência';

// Status do Lançamento (determinado pela lógica, não armazenado)
export type StatusLancamento = 'PENDENTE' | 'PAGO' | 'PLANEJADO' | 'CANCELADO';

// Interfaces para Dimensões
export interface DimensaoBase {
  created_at: string;
  ativo: boolean;
}

export interface DimensaoHierarquica extends DimensaoBase {
  id_pai: number | null;
  nome: string;
  descricao?: string;
  icone?: string;
  cor_hex?: string;
}

export interface TipoLancamentoDim extends DimensaoBase {
  id_tipo_lancamento: number;
  nome: TipoLancamento;
  descricao?: string;
}

export interface Receita extends DimensaoHierarquica {
  id_receita: number;
}

export interface Investimento extends DimensaoHierarquica {
  id_investimento: number;
}

export interface CategoriaDespesa extends DimensaoHierarquica {
  id_categoria_despesa: number;
}

export interface Documento {
  id_documento: number;
  user_id: string;
  id_lancamento?: number | null;
  nome_arquivo: string;
  url_arquivo: string;
  tipo_arquivo?: string;
  tamanho_arquivo?: number;
  created_at: string;
}

export interface TipoPagamento extends DimensaoBase {
  id_tipo_pagamento: number;
  nome: string;
  descricao?: string;
}

export interface Banco extends DimensaoBase {
  id_banco: number;
  user_id: string;
  nome: string;
  codigo_banco?: string;
  tipo_conta?: string;
  numero_conta?: string;
  agencia?: string;
  saldo_inicial?: number;
}

export interface CartaoCredito extends DimensaoBase {
  id_cartao: number;
  user_id: string;
  id_banco: number;
  nome: string;
  ultimos_digitos?: string;
  bandeira?: string;
  limite_credito?: number;
  data_vencimento_fatura?: number;
}

export interface Fornecedor extends DimensaoBase {
  id_fornecedor: number;
  user_id: string;
  nome: string;
  tipo?: string;
  cpf_cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
}

export interface Cliente extends DimensaoBase {
  id_cliente: number;
  user_id: string;
  nome: string;
  tipo?: string;
  cpf_cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
}

// Interface para Lançamento (Tabela Fato)
export interface Lancamento {
  id_lancamento: number;
  user_id: string;
  id_tipo_lancamento: number;
  id_receita?: number | null;
  id_categoria_despesa?: number | null;
  id_investimento?: number | null;
  id_banco?: number | null;
  id_cartao?: number | null;
  id_cliente?: number | null;
  id_fornecedor?: number | null;
  id_tipo_pagamento?: number | null;
  descricao: string;
  valor_total: number;
  valor_parcela?: number;
  numero_parcelas?: number;
  parcela_atual?: number;
  data_vencimento?: string | null;
  data_pagamento?: string | null;
  observacoes?: string | null;
  created_at: string;
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
  id_tipo_lancamento: number;
  id_receita?: number;
  id_categoria_despesa?: number;
  id_investimento?: number;
  id_banco?: number;
  id_cartao?: number;
  id_cliente?: number;
  id_fornecedor?: number;
  id_tipo_pagamento?: number;
  descricao: string;
  valor_total: number;
  valor_parcela?: number;
  numero_parcelas?: number;
  parcela_atual?: number;
  data_vencimento?: string;
  data_pagamento?: string;
  observacoes?: string;
}

export interface AtualizarLancamentoDTO extends Partial<CriarLancamentoDTO> {
  id_lancamento: number;
}

// Interface para Filtros
export interface FiltrosLancamento {
  data_inicio?: string;
  data_fim?: string;
  id_tipo_lancamento?: number;
  id_categoria_despesa?: number;
  id_receita?: number;
  id_investimento?: number;
  id_tipo_pagamento?: number;
  id_banco?: number;
  status?: StatusLancamento;
  descricao?: string;
}
