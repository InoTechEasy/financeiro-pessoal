import React, { useState, useEffect } from 'react';
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
        await fornecedoresService.criar(data);
        alert('Fornecedor criado com sucesso!');
        reset();
      }
      onSuccess?.();
    } catch (error) {
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
        {errors.nome && <span className="text-red-500 text-sm">{errors.nome.message}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <input
            {...register('tipo')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Pessoa Física/Jurídica"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ</label>
          <input
            {...register('cpf_cnpj')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="000.000.000-00"
          />
        </div>
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
        <textarea
          {...register('endereco')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
          placeholder="Endereço completo"
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
