import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { categoriasService } from '../../services/categoriasService';

interface FormularioCategoriaProps {
  onSuccess?: () => void;
  editData?: any;
}

export const FormularioCategoria: React.FC<FormularioCategoriaProps> = ({ onSuccess, editData }) => {
  const [categorias, setCategorias] = useState<any[]>([]);

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    defaultValues: editData || {},
  });

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const data = await categoriasService.listar();
        setCategorias(data);

        // Se tem id_pai (subcategoria), preencher select
        if (editData?.id_pai) {
          setValue('id_pai', editData.id_pai);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };
    carregarCategorias();
  }, [editData, setValue]);

  const onSubmit = async (data: any) => {
    try {
      // Verifica se é edição (tem id_categoria_despesa) ou criação nova
      if (editData?.id_categoria_despesa) {
        await categoriasService.atualizar(editData.id_categoria_despesa, data);
        alert('Categoria atualizada com sucesso!');
      } else {
        // Se id_pai for NaN (devido a string vazia com valueAsNumber), define como null
        if (isNaN(data.id_pai)) {
          data.id_pai = null;
        }
        // Garante que ativo seja true ao criar nova categoria
        const dadosParaCriar = {
          ...data,
          ativo: true,
        };
        await categoriasService.criar(dadosParaCriar);
        alert('Categoria criada com sucesso!');
        reset();
      }
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input
          {...register('nome', { required: 'Nome é obrigatório' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Nome da categoria"
        />
        {errors.nome && <span className="text-red-500 text-sm">{String(errors.nome.message)}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria Pai</label>
        <select
          {...register('id_pai', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Nenhuma (Categoria Principal)</option>
          {categorias.filter(c => !c.id_pai).map((categoria) => (
            <option key={categoria.id_categoria_despesa} value={categoria.id_categoria_despesa}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          {...register('descricao')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
          placeholder="Descrição da categoria"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {editData?.id_categoria_despesa ? 'Atualizar' : 'Salvar'}
      </button>
    </form>
  );
};
