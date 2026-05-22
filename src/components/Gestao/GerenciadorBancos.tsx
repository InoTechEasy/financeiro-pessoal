import React, { useState } from 'react';
import { useBancos } from '../../hooks/useBancos';
import { formatCurrency } from '../../utils/formatters';
import { FormularioBanco } from './FormularioBanco';
import { ModalLancamento } from '../Lancamentos/ModalLancamento';

export const GerenciadorBancos: React.FC = () => {
  const { bancos, loading, deletar } = useBancos();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const handleEdit = (banco: any) => {
    setEditData(banco);
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
        <h3 className="text-lg font-semibold">Gerenciar Bancos</h3>
        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Novo Banco
        </button>
      </div>
      <div className="space-y-2">
        {bancos.map((banco) => (
          <div key={banco.id_banco} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium">{banco.nome}</div>
              <div className="text-sm text-gray-500">
                {banco.tipo_conta} - {banco.agencia} - {banco.numero_conta}
              </div>
              <div className="text-sm text-gray-500">Saldo: {formatCurrency(banco.saldo_inicial)}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(banco)} className="text-blue-600 hover:text-blue-800">Editar</button>
              <button
                onClick={() => handleDelete(banco.id_banco)}
                className="text-red-600 hover:text-red-800"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
      <ModalLancamento isOpen={showModal} onClose={() => setShowModal(false)}>
        <FormularioBanco onSuccess={handleSuccess} editData={editData} />
      </ModalLancamento>
    </div>
  );
};
