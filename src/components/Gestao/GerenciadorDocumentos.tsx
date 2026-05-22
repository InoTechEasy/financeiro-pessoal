import React, { useState, useEffect } from 'react';
import { documentosService } from '../../services/documentosService';
import { FormularioDocumento } from './FormularioDocumento';
import { ModalLancamento } from '../Lancamentos/ModalLancamento';

export const GerenciadorDocumentos: React.FC = () => {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    const carregarDocumentos = async () => {
      try {
        const dados = await documentosService.listar();
        setDocumentos(dados);
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarDocumentos();
  }, []);

  const handleEdit = (documento: any) => {
    setEditData(documento);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      await documentosService.deletar(id);
      setDocumentos(documentos.filter(d => d.id_documento !== id));
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
    setEditData(null);
    const carregarDocumentos = async () => {
      const dados = await documentosService.listar();
      setDocumentos(dados);
    };
    carregarDocumentos();
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Gerenciar Tipos de Documentos</h3>
        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Novo Documento
        </button>
      </div>
      <div className="space-y-2">
        {documentos.map((documento) => (
          <div key={documento.id_documento} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{documento.icone}</span>
              <span>{documento.nome}</span>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(documento)} className="text-blue-600 hover:text-blue-800">Editar</button>
              <button
                onClick={() => handleDelete(documento.id_documento)}
                className="text-red-600 hover:text-red-800"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
      <ModalLancamento isOpen={showModal} onClose={() => setShowModal(false)}>
        <FormularioDocumento onSuccess={handleSuccess} editData={editData} />
      </ModalLancamento>
    </div>
  );
};
