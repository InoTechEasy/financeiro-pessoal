import React from 'react';
import { useForm } from 'react-hook-form';
import { investimentosService } from '../../services/investimentosService';

interface FormularioInvestimentoProps {
  onSuccess?: () => void;
  editData?: any;
}

export const FormularioInvestimento: React.FC<FormularioInvestimentoProps> = ({ onSuccess, editData }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editData || {},
  });

  const onSubmit = async (data: any) => {
    try {
      // Verifica se é edição (tem id_investimento) ou criação nova
      if (editData?.id_investimento) {
        await investimentosService.atualizar(editData.id_investimento, data);
        alert('Investimento atualizado com sucesso!');
      } else {
        await investimentosService.criar(data);
        alert('Investimento criado com sucesso!');
        reset();
      }
      onSuccess?.();
    } catch (error) {
      alert('Erro ao salvar investimento');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input
          {...register('nome', { required: 'Nome é obrigatório' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Nome do investimento"
        />
        {errors.nome && <span className="text-red-500 text-sm">{String(errors.nome.message)}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          {...register('descricao')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
          placeholder="Descrição do investimento"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ícone</label>
          <input
            {...register('icone')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="📊"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cor (Hex)</label>
          <input
            {...register('cor_hex')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="#FF6B6B"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {editData?.id_investimento ? 'Atualizar' : 'Salvar'}
      </button>
    </form>
  );
};
