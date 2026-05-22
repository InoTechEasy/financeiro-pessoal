import { useState, useEffect } from 'react';
import { categoriasService } from '../services/categoriasService';
import { CategoriaDespesa } from '../types';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<CategoriaDespesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        setLoading(true);
        const dados = await categoriasService.listar();
        setCategorias(dados);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
      } finally {
        setLoading(false);
      }
    };

    carregarCategorias();
  }, []);

  const criar = async (categoria: any) => {
    try {
      const nova = await categoriasService.criar(categoria);
      setCategorias([...categorias, nova]);
      return nova;
    } catch (err) {
      throw err;
    }
  };

  const atualizar = async (id: string, updates: any) => {
    try {
      const atualizada = await categoriasService.atualizar(id, updates);
      setCategorias(categorias.map(c => c.id_categoria_despesa === id ? atualizada : c));
      return atualizada;
    } catch (err) {
      throw err;
    }
  };

  const deletar = async (id: string) => {
    try {
      await categoriasService.deletar(id);
      setCategorias(categorias.filter(c => c.id_categoria_despesa !== id));
    } catch (err) {
      throw err;
    }
  };

  return { categorias, loading, error, criar, atualizar, deletar };
};
