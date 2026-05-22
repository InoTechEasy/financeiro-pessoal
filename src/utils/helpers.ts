export const calcularStatusLancamento = (dataVencimento?: string, dataPagamento?: string): 'PENDENTE' | 'PAGO' | 'PLANEJADO' | 'CANCELADO' => {
  if (dataPagamento) return 'PAGO';
  if (!dataVencimento) return 'PLANEJADO';
  
  const hoje = new Date();
  const vencimento = new Date(dataVencimento);
  
  if (vencimento < hoje) return 'PENDENTE';
  return 'PLANEJADO';
};

export const getCorPorTipo = (tipo: string): string => {
  const cores: Record<string, string> = {
    RECEITA: '#22c55e',
    DESPESA: '#ef4444',
    INVESTIMENTO: '#3b82f6',
  };
  return cores[tipo] || '#6b7280';
};

export const getIconePorTipo = (tipo: string): string => {
  const icones: Record<string, string> = {
    RECEITA: '💰',
    DESPESA: '💸',
    INVESTIMENTO: '📈',
  };
  return icones[tipo] || '📌';
};

export const agruparPorCategoria = (lancamentos: any[], campo: string) => {
  return lancamentos.reduce((acc, lancamento) => {
    const chave = lancamento[campo] || 'Outros';
    if (!acc[chave]) {
      acc[chave] = [];
    }
    acc[chave].push(lancamento);
    return acc;
  }, {} as Record<string, any[]>);
};

export const calcularTotal = (lancamentos: any[]): number => {
  return lancamentos.reduce((total, lancamento) => total + (lancamento.valor_total || 0), 0);
};

export const gerarId = (): string => {
  return crypto.randomUUID();
};
