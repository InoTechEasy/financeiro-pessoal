import React, { useState, useEffect } from 'react';
import { tiposPagamentosService } from '../../services/tiposPagamentosService';
import { FormularioTipoPagamento } from './FormularioTipoPagamento';
import { ModalLancamento } from '../Lancamentos/ModalLancamento';

export const GerenciadorTiposPagamentos: React.FC = () => {
  const [tipos, setTipos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    const carregarTipos = async () => {
      try {
        const dados = await tiposPagamentosService.listar();
        setTipos(dados);
      } catch (error) {
        console.error('Erro ao carregar tipos de pagamento:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarTipos();
  }, []);

  const handleEdit = (tipo: any) => {
    setEditData(tipo);
    setShowModal(true);
  };

  const handleSuccess = () => {
    setShowModal(false);
    setEditData(null);
    const carregarTipos = async () => {
      const dados = await tiposPagamentosService.listar();
      setTipos(dados);
    };
    carregarTipos();
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Gerenciar Tipos de Pagamento</h3>
        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Novo Tipo
        </button>
      </div>
      <div className="space-y-2">
        {tipos.map((tipo) => (
          <div key={tipo.id_tipo_pagamento} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium">{tipo.nome}</div>
              <div className="text-sm text-gray-500">{tipo.descricao}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(tipo)} className="text-blue-600 hover:text-blue-800">Editar</button>
            </div>
          </div>
        ))}
      </div>
      <ModalLancamento isOpen={showModal} onClose={() => setShowModal(false)}>
        <FormularioTipoPagamento onSuccess={handleSuccess} editData={editData} />
      </ModalLancamento>
    </div>
  );
};
