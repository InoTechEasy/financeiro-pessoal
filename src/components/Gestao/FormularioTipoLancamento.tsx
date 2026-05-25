import React from 'react';
import { useForm } from 'react-hook-form';
import { tiposLancamentosService } from '../../services/tiposLancamentosService';

interface FormularioTipoLancamentoProps {
  onSuccess?: () => void;
  editData?: any;
}

export const FormularioTipoLancamento: React.FC<FormularioTipoLancamentoProps> = ({ onSuccess, editData }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editData || {},
  });

  const onSubmit = async (data: any) => {
    try {
      if (editData) {
        alert('Atualização não implementada para tipos de lançamento');
      } else {
        await tiposLancamentosService.criar(data);
        alert('Tipo de lançamento criado com sucesso!');
        reset();
      }
      onSuccess?.();
    } catch (error) {
      alert('Erro ao salvar tipo de lançamento');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input
          {...register('nome', { required: 'Nome é obrigatório' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Nome do tipo de lançamento"
        />
        {errors.nome && <span className="text-red-500 text-sm">{String(errors.nome.message)}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          {...register('descricao')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
          placeholder="Descrição do tipo de lançamento"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {editData ? 'Atualizar' : 'Salvar'}
      </button>
    </form>
  );
};
