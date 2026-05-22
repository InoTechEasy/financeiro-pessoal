import React, { useState, useEffect } from 'react';
import { clientesService } from '../../services/clientesService';
import { FormularioCliente } from './FormularioCliente';
import { ModalLancamento } from '../Lancamentos/ModalLancamento';

export const GerenciadorClientes: React.FC = () => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    const carregarClientes = async () => {
      try {
        const dados = await clientesService.listar();
        setClientes(dados);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarClientes();
  }, []);

  const handleEdit = (cliente: any) => {
    setEditData(cliente);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      await clientesService.deletar(id);
      setClientes(clientes.filter(c => c.id_cliente !== id));
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
    setEditData(null);
    const carregarClientes = async () => {
      const dados = await clientesService.listar();
      setClientes(dados);
    };
    carregarClientes();
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Gerenciar Clientes</h3>
        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Novo Cliente
        </button>
      </div>
      <div className="space-y-2">
        {clientes.map((cliente) => (
          <div key={cliente.id_cliente} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium">{cliente.nome}</div>
              <div className="text-sm text-gray-500">{cliente.tipo}</div>
              <div className="text-sm text-gray-500">{cliente.email}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(cliente)} className="text-blue-600 hover:text-blue-800">Editar</button>
              <button
                onClick={() => handleDelete(cliente.id_cliente)}
                className="text-red-600 hover:text-red-800"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
      <ModalLancamento isOpen={showModal} onClose={() => setShowModal(false)}>
        <FormularioCliente onSuccess={handleSuccess} editData={editData} />
      </ModalLancamento>
    </div>
  );
};
