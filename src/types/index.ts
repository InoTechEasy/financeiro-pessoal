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
  user_id?: string | null;
  nome: TipoLancamento;
  descricao?: string;
}

export interface Receita extends DimensaoBase {
  id_receita: number;
  user_id?: string | null;
  nome: string;
  descricao?: string;
}

export interface Investimento extends DimensaoBase {
  id_investimento: number;
  user_id?: string | null;
  nome: string;
  descricao?: string;
}

export interface CategoriaDespesa extends DimensaoBase {
  id_categoria_despesa: number;
  user_id?: string | null;
  id_pai?: number | null;
  nome: string;
  descricao?: string;
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
  user_id?: string | null;
  nome: string;
  descricao?: string;
}

export interface Banco extends DimensaoBase {
  id_banco: number;
  user_id: string;
  nome: string;
  agencia?: string;
  conta?: string;
  saldo_atual?: number;
}

export interface CartaoCredito extends DimensaoBase {
  id_cartao: number;
  user_id: string;
  nome: string;
  numero?: string;
  validade?: string;
  limite?: number;
  dia_fechamento?: number;
  dia_vencimento?: number;
}

export interface Fornecedor extends DimensaoBase {
  id_fornecedor: number;
  user_id: string;
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
}

export interface Cliente extends DimensaoBase {
  id_cliente: number;
  user_id: string;
  nome: string;
  email?: string;
  telefone?: string;
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
