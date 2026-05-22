import React, { useState, useEffect } from 'react';
import { fornecedoresService } from '../../services/fornecedoresService';
import { FormularioFornecedor } from './FormularioFornecedor';
import { ModalLancamento } from '../Lancamentos/ModalLancamento';

export const GerenciadorFornecedores: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    const carregarFornecedores = async () => {
      try {
        const dados = await fornecedoresService.listar();
        setFornecedores(dados);
      } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarFornecedores();
  }, []);

  const handleEdit = (fornecedor: any) => {
    setEditData(fornecedor);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      await fornecedoresService.deletar(id);
      setFornecedores(fornecedores.filter(f => f.id_fornecedor !== id));
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
    setEditData(null);
    const carregarFornecedores = async () => {
      const dados = await fornecedoresService.listar();
      setFornecedores(dados);
    };
    carregarFornecedores();
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Gerenciar Fornecedores</h3>
        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Novo Fornecedor
        </button>
      </div>
      <div className="space-y-2">
        {fornecedores.map((fornecedor) => (
          <div key={fornecedor.id_fornecedor} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium">{fornecedor.nome}</div>
              <div className="text-sm text-gray-500">{fornecedor.tipo}</div>
              <div className="text-sm text-gray-500">{fornecedor.email}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(fornecedor)} className="text-blue-600 hover:text-blue-800">Editar</button>
              <button
                onClick={() => handleDelete(fornecedor.id_fornecedor)}
                className="text-red-600 hover:text-red-800"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
      <ModalLancamento isOpen={showModal} onClose={() => setShowModal(false)}>
        <FormularioFornecedor onSuccess={handleSuccess} editData={editData} />
      </ModalLancamento>
    </div>
  );
};
