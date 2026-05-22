import { useState, useEffect } from 'react';
import { lancamentosService } from '../services/lancamentosService';
import { Lancamento, FiltrosLancamento } from '../types';

export const useLancamentos = (filtros?: FiltrosLancamento) => {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarLancamentos = async () => {
    try {
      setLoading(true);
      const dados = await lancamentosService.listar(filtros);
      setLancamentos(dados);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar lançamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarLancamentos();
  }, [filtros]);

  const criar = async (lancamento: any) => {
    try {
      const novo = await lancamentosService.criar(lancamento);
      setLancamentos([novo, ...lancamentos]);
      return novo;
    } catch (err) {
      throw err;
    }
  };

  const atualizar = async (id: string, updates: any) => {
    try {
      const atualizado = await lancamentosService.atualizar(id, updates);
      setLancamentos(lancamentos.map(l => l.id_lancamento === id ? atualizado : l));
      return atualizado;
    } catch (err) {
      throw err;
    }
  };

  const deletar = async (id: string) => {
    try {
      await lancamentosService.deletar(id);
      setLancamentos(lancamentos.filter(l => l.id_lancamento !== id));
    } catch (err) {
      throw err;
    }
  };

  const refresh = async () => {
    await carregarLancamentos();
  };

  return { lancamentos, loading, error, criar, atualizar, deletar, refresh };
};
