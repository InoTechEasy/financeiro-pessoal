import React from 'react';
import { useForm } from 'react-hook-form';
import { cartoesService } from '../../services/cartoesService';

interface FormularioCartaoProps {
  onSuccess?: () => void;
  editData?: any;
}

export const FormularioCartao: React.FC<FormularioCartaoProps> = ({ onSuccess, editData }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editData || {},
  });

  const onSubmit = async (data: any) => {
    try {
      if (editData) {
        await cartoesService.atualizar(editData.id_cartao, data);
        alert('Cartão atualizado com sucesso!');
      } else {
        // Garante que ativo seja true ao criar novo cartão
        const dadosParaCriar = {
          ...data,
          ativo: true,
        };
        await cartoesService.criar(dadosParaCriar);
        alert('Cartão criado com sucesso!');
        reset();
      }
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
      alert('Erro ao salvar cartão');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input
          {...register('nome', { required: 'Nome é obrigatório' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Nome do cartão"
        />
        {errors.nome && <span className="text-red-500 text-sm">{String(errors.nome.message)}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
          <input
            {...register('numero')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="**** **** **** 1234"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
          <input
            {...register('validade')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="MM/AA"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Limite</label>
          <input
            type="number"
            step="0.01"
            {...register('limite', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dia Fechamento</label>
          <input
            type="number"
            {...register('dia_fechamento', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="10"
            min={1}
            max={31}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dia Vencimento</label>
        <input
          type="number"
          {...register('dia_vencimento', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="10"
          min={1}
          max={31}
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
