import React, { useState } from 'react';
import { useCategorias } from '../../hooks/useCategorias';
import { FormularioCategoria } from './FormularioCategoria';
import { ModalLancamento } from '../Lancamentos/ModalLancamento';

export const GerenciadorCategoriasDespesas: React.FC = () => {
  const { categorias, loading, deletar } = useCategorias();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const handleEdit = (categoria: any) => {
    setEditData(categoria);
    setShowModal(true);
  };

  const handleAddSubcategoria = (categoria: any) => {
    setEditData({ id_pai: categoria.id_categoria_despesa });
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

  const categoriasPai = categorias.filter(c => !c.id_pai);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Gerenciar Categorias de Despesas</h3>
        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Nova Categoria
        </button>
      </div>
      <div className="space-y-4">
        {categoriasPai.map((categoria) => (
          <div key={categoria.id_categoria_despesa} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{categoria.icone}</span>
                <span className="font-medium">{categoria.nome}</span>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(categoria)} className="text-blue-600 hover:text-blue-800">Editar</button>
                <button
                  onClick={() => handleAddSubcategoria(categoria)}
                  className="text-green-600 hover:text-green-800"
                >
                  + Subcategoria
                </button>
                <button
                  onClick={() => handleDelete(categoria.id_categoria_despesa)}
                  className="text-red-600 hover:text-red-800"
                >
                  Excluir
                </button>
              </div>
            </div>
            <div className="ml-8 space-y-1">
              {categorias.filter(c => c.id_pai === categoria.id_categoria_despesa).map((subcategoria) => (
                <div key={subcategoria.id_categoria_despesa} className="flex justify-between items-center py-1 px-2 hover:bg-gray-100 rounded">
                  <span className="text-sm">{subcategoria.nome}</span>
                  <div className="space-x-2">
                    <button onClick={() => handleEdit(subcategoria)} className="text-blue-600 hover:text-blue-800 text-sm">Editar</button>
                    <button
                      onClick={() => handleDelete(subcategoria.id_categoria_despesa)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ModalLancamento isOpen={showModal} onClose={() => setShowModal(false)}>
        <FormularioCategoria onSuccess={handleSuccess} editData={editData} />
      </ModalLancamento>
    </div>
  );
};
