import React, { useState, useEffect } from 'react';
import { cartoesService } from '../../services/cartoesService';
import { formatCurrency } from '../../utils/formatters';
import { FormularioCartao } from './FormularioCartao';
import { ModalLancamento } from '../Lancamentos/ModalLancamento';

export const GerenciadorCartoes: React.FC = () => {
  const [cartoes, setCartoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    const carregarCartoes = async () => {
      try {
        const dados = await cartoesService.listar();
        setCartoes(dados);
      } catch (error) {
        console.error('Erro ao carregar cartões:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarCartoes();
  }, []);

  const handleEdit = (cartao: any) => {
    setEditData(cartao);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      await cartoesService.deletar(id);
      setCartoes(cartoes.filter(c => c.id_cartao_credito !== id));
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
    setEditData(null);
    const carregarCartoes = async () => {
      const dados = await cartoesService.listar();
      setCartoes(dados);
    };
    carregarCartoes();
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Gerenciar Cartões de Crédito</h3>
        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Novo Cartão
        </button>
      </div>
      <div className="space-y-2">
        {cartoes.map((cartao) => (
          <div key={cartao.id_cartao_credito} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium">{cartao.nome}</div>
              <div className="text-sm text-gray-500">
                **** {cartao.ultimos_digitos} - {cartao.bandeira}
              </div>
              <div className="text-sm text-gray-500">Limite: {formatCurrency(cartao.limite_credito || 0)}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(cartao)} className="text-blue-600 hover:text-blue-800">Editar</button>
              <button
                onClick={() => handleDelete(cartao.id_cartao_credito)}
                className="text-red-600 hover:text-red-800"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
      <ModalLancamento isOpen={showModal} onClose={() => setShowModal(false)}>
        <FormularioCartao onSuccess={handleSuccess} editData={editData} />
      </ModalLancamento>
    </div>
  );
};
