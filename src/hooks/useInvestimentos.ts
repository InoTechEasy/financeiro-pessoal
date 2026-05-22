import { useState, useEffect } from 'react';
import { investimentosService } from '../services/investimentosService';
import { Investimento } from '../types';

export const useInvestimentos = () => {
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarInvestimentos = async () => {
      try {
        setLoading(true);
        const dados = await investimentosService.listar();
        setInvestimentos(dados);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar investimentos');
      } finally {
        setLoading(false);
      }
    };

    carregarInvestimentos();
  }, []);

  const criar = async (investimento: any) => {
    try {
      const novo = await investimentosService.criar(investimento);
      setInvestimentos([...investimentos, novo]);
      return novo;
    } catch (err) {
      throw err;
    }
  };

  const atualizar = async (id: string, updates: any) => {
    try {
      const atualizado = await investimentosService.atualizar(id, updates);
      setInvestimentos(investimentos.map(i => i.id_investimento === id ? atualizado : i));
      return atualizado;
    } catch (err) {
      throw err;
    }
  };

  const deletar = async (id: string) => {
    try {
      await investimentosService.deletar(id);
      setInvestimentos(investimentos.filter(i => i.id_investimento !== id));
    } catch (err) {
      throw err;
    }
  };

  return { investimentos, loading, error, criar, atualizar, deletar };
};
