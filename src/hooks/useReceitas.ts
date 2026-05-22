import { useState, useEffect } from 'react';
import { receitasService } from '../services/receitasService';
import { Receita } from '../types';

export const useReceitas = () => {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarReceitas = async () => {
      try {
        setLoading(true);
        const dados = await receitasService.listar();
        setReceitas(dados);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar receitas');
      } finally {
        setLoading(false);
      }
    };

    carregarReceitas();
  }, []);

  const criar = async (receita: any) => {
    try {
      const nova = await receitasService.criar(receita);
      setReceitas([...receitas, nova]);
      return nova;
    } catch (err) {
      throw err;
    }
  };

  const atualizar = async (id: string, updates: any) => {
    try {
      const atualizada = await receitasService.atualizar(id, updates);
      setReceitas(receitas.map(r => r.id_receita === id ? atualizada : r));
      return atualizada;
    } catch (err) {
      throw err;
    }
  };

  const deletar = async (id: string) => {
    try {
      await receitasService.deletar(id);
      setReceitas(receitas.filter(r => r.id_receita !== id));
    } catch (err) {
      throw err;
    }
  };

  return { receitas, loading, error, criar, atualizar, deletar };
};
