import React, { useState } from 'react';
import { useInvestimentos } from '../../hooks/useInvestimentos';
import { FormularioInvestimento } from './FormularioInvestimento';
import { ModalLancamento } from '../Lancamentos/ModalLancamento';

export const GerenciadorInvestimentos: React.FC = () => {
  const { investimentos, loading, deletar } = useInvestimentos();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const handleEdit = (investimento: any) => {
    setEditData(investimento);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      await deletar(id);
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
    setEditData(null);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Gerenciar Investimentos</h3>
        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Novo Investimento
        </button>
      </div>
      <div className="space-y-2">
        {investimentos.map((investimento) => (
          <div key={investimento.id_investimento} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{investimento.icone}</span>
              <span>{investimento.nome}</span>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(investimento)} className="text-blue-600 hover:text-blue-800">Editar</button>
              <button
                onClick={() => handleDelete(investimento.id_investimento)}
                className="text-red-600 hover:text-red-800"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
      <ModalLancamento isOpen={showModal} onClose={() => setShowModal(false)}>
        <FormularioInvestimento onSuccess={handleSuccess} editData={editData} />
      </ModalLancamento>
    </div>
  );
};
