import React from 'react';
import { useForm } from 'react-hook-form';
import { fornecedoresService } from '../../services/fornecedoresService';

interface FormularioFornecedorProps {
  onSuccess?: () => void;
  editData?: any;
}

export const FormularioFornecedor: React.FC<FormularioFornecedorProps> = ({ onSuccess, editData }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editData || {},
  });

  const onSubmit = async (data: any) => {
    try {
      if (editData) {
        await fornecedoresService.atualizar(editData.id_fornecedor, data);
        alert('Fornecedor atualizado com sucesso!');
      } else {
        // Garante que ativo seja true ao criar novo fornecedor
        const dadosParaCriar = {
          ...data,
          ativo: true,
        };
        await fornecedoresService.criar(dadosParaCriar);
        alert('Fornecedor criado com sucesso!');
        reset();
      }
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      alert('Erro ao salvar fornecedor');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input
          {...register('nome', { required: 'Nome é obrigatório' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Nome do fornecedor"
        />
        {errors.nome && <span className="text-red-500 text-sm">{String(errors.nome.message)}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
        <input
          {...register('cnpj')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="00.000.000/0000-00"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="email@exemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input
            {...register('telefone')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="(11) 99999-9999"
          />
        </div>
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
