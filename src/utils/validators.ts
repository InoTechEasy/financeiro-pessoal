import { z } from 'zod';

export const lancamentoSchema = z.object({
  id_tipo_lancamento: z.number({ required_error: 'Tipo de lançamento é obrigatório' }),
  id_receita: z.number().optional(),
  id_categoria_despesa: z.number().optional(),
  id_investimento: z.number().optional(),
  id_fornecedor: z.number().optional(),
  id_cliente: z.number().optional(),
  descricao: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
  id_tipo_pagamento: z.number({ required_error: 'Tipo de pagamento é obrigatório' }),
  id_cartao: z.number().optional(),
  id_banco: z.number({ required_error: 'Banco é obrigatório' }),
  valor_total: z.number().positive('Valor deve ser positivo'),
  valor_parcela: z.number().optional(),
  numero_parcelas: z.number().optional(),
  parcela_atual: z.number().optional(),
  data_vencimento: z.string().optional(),
  data_pagamento: z.string().optional(),
  observacoes: z.string().optional(),
});

export const receitaSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
  ativo: z.boolean().default(true),
});

export const investimentoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
  ativo: z.boolean().default(true),
});

export const categoriaSchema = z.object({
  id_pai: z.number().nullable().optional(),
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
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
  id_banco: z.number({ required_error: 'Banco é obrigatório' }),
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  numero: z.string().optional(),
  validade: z.string().optional(),
  limite: z.number().positive().optional(),
  dia_vencimento: z.number().int().min(1).max(31).optional(),
  ativo: z.boolean().default(true),
});

export const fornecedorSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  cnpj: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  ativo: z.boolean().default(true),
});
