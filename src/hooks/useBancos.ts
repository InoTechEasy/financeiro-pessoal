import { useState, useEffect } from 'react';
import { bancosService } from '../services/bancosService';
import { Banco } from '../types';

export const useBancos = () => {
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarBancos = async () => {
      try {
        setLoading(true);
        const dados = await bancosService.listar();
        setBancos(dados);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar bancos');
      } finally {
        setLoading(false);
      }
    };

    carregarBancos();
  }, []);

  const criar = async (banco: any) => {
    try {
      const novo = await bancosService.criar(banco);
      setBancos([...bancos, novo]);
      return novo;
    } catch (err) {
      throw err;
    }
  };

  const atualizar = async (id: string, updates: any) => {
    try {
      const atualizado = await bancosService.atualizar(id, updates);
      setBancos(bancos.map(b => b.id_banco === id ? atualizado : b));
      return atualizado;
    } catch (err) {
      throw err;
    }
  };

  const deletar = async (id: string) => {
    try {
      await bancosService.deletar(id);
      setBancos(bancos.filter(b => b.id_banco !== id));
    } catch (err) {
      throw err;
    }
  };

  return { bancos, loading, error, criar, atualizar, deletar };
};
