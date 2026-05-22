import React, { useState } from 'react';
import { useReceitas } from '../../hooks/useReceitas';
import { FormularioReceita } from './FormularioReceita';
import { ModalLancamento } from '../Lancamentos/ModalLancamento';

export const GerenciadorReceitas: React.FC = () => {
  const { receitas, loading, deletar } = useReceitas();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (receita: any) => {
    setEditData(receita);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      await deletar(id);
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
    setEditData(null);
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Gerenciar Receitas</h3>
        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Nova Receita
        </button>
      </div>
      <div className="space-y-2">
        {receitas.map((receita) => (
          <div key={receita.id_receita} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{receita.icone}</span>
              <span>{receita.nome}</span>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(receita)} className="text-blue-600 hover:text-blue-800">Editar</button>
              <button
                onClick={() => handleDelete(receita.id_receita)}
                className="text-red-600 hover:text-red-800"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
      <ModalLancamento isOpen={showModal} onClose={() => setShowModal(false)}>
        <FormularioReceita onSuccess={handleSuccess} editData={editData} />
      </ModalLancamento>
    </div>
  );
};
