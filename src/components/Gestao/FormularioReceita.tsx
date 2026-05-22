import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { receitasService } from '../../services/receitasService';

interface FormularioReceitaProps {
  onSuccess?: () => void;
  editData?: any;
}

export const FormularioReceita: React.FC<FormularioReceitaProps> = ({ onSuccess, editData }) => {
  const [receitas, setReceitas] = useState<any[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editData || {},
  });

  useEffect(() => {
    const carregarReceitas = async () => {
      try {
        const data = await receitasService.listar();
        setReceitas(data);
      } catch (error) {
        console.error('Erro ao carregar receitas:', error);
      }
    };
    carregarReceitas();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      // Verifica se é edição (tem id_receita) ou criação nova
      if (editData?.id_receita) {
        await receitasService.atualizar(editData.id_receita, data);
        alert('Receita atualizada com sucesso!');
      } else {
        await receitasService.criar(data);
        alert('Receita criada com sucesso!');
        reset();
      }
      onSuccess?.();
    } catch (error) {
      alert('Erro ao salvar receita');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input
          {...register('nome', { required: 'Nome é obrigatório' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Nome da receita"
        />
        {errors.nome && <span className="text-red-500 text-sm">{String(errors.nome.message)}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          {...register('descricao')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
          placeholder="Descrição da receita"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ícone</label>
          <input
            {...register('icone')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="💰"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cor (Hex)</label>
          <input
            {...register('cor_hex')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="#00AA00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
          <input
            type="number"
            {...register('ordem', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="1"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {editData?.id_receita ? 'Atualizar' : 'Salvar'}
      </button>
    </form>
  );
};
