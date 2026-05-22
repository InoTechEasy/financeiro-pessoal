import { z } from 'zod';

export const lancamentoSchema = z.object({
  id_tipo_lancamento: z.string().uuid('Tipo de lançamento inválido'),
  id_receita: z.string().optional(),
  id_categoria_despesa: z.string().optional(),
  id_investimento: z.string().optional(),
  data_documento: z.string().optional(),
  id_documento: z.string().optional(),
  n_documento: z.string().optional(),
  id_fornecedor: z.string().optional(),
  id_cliente: z.string().optional(),
  descricao: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
  id_tipo_pagamento: z.string().uuid('Tipo de pagamento inválido'),
  id_cartao_credito: z.string().optional(),
  id_banco: z.string().uuid('Banco inválido'),
  id_banco_destino: z.string().optional(),
  eh_transferencia: z.boolean().optional(),
  valor_total: z.number().positive('Valor deve ser positivo'),
  parcelas: z.string().optional(),
  valor_parcela: z.number().optional(),
  data_vencimento: z.string().optional(),
  data_pagamento: z.string().optional(),
  observacoes: z.string().optional(),
});

export const receitaSchema = z.object({
  id_pai: z.string().uuid().nullable().optional(),
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
  icone: z.string().optional(),
  cor_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional(),
  ordem: z.number().int().optional(),
  ativo: z.boolean().default(true),
});

export const investimentoSchema = z.object({
  id_pai: z.string().uuid().nullable().optional(),
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
  icone: z.string().optional(),
  cor_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional(),
  ordem: z.number().int().optional(),
  ativo: z.boolean().default(true),
});

export const categoriaSchema = z.object({
  id_pai: z.string().uuid().nullable().optional(),
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
  icone: z.string().optional(),
  cor_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional(),
  ordem: z.number().int().optional(),
  ativo: z.boolean().default(true),
});

export const bancoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  codigo_banco: z.string().optional(),
  tipo_conta: z.string().optional(),
  numero_conta: z.string().optional(),
  agencia: z.string().optional(),
  saldo_inicial: z.number().default(0),
  ativo: z.boolean().default(true),
});

export const cartaoSchema = z.object({
  id_banco: z.string().uuid('Banco inválido'),
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  ultimos_digitos: z.string().length(4, 'Últimos 4 dígitos inválidos').optional(),
  bandeira: z.string().optional(),
  limite_credito: z.number().positive().optional(),
  data_vencimento_fatura: z.number().int().min(1).max(31).optional(),
  ativo: z.boolean().default(true),
});

export const fornecedorSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  tipo: z.string().optional(),
  cpf_cnpj: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  ativo: z.boolean().default(true),
});
