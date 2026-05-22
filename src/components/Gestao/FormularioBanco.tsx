import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { bancosService } from '../../services/bancosService';

interface FormularioBancoProps {
  onSuccess?: () => void;
  editData?: any;
}

export const FormularioBanco: React.FC<FormularioBancoProps> = ({ onSuccess, editData }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editData || {},
  });

  const onSubmit = async (data: any) => {
    try {
      if (editData) {
        await bancosService.atualizar(editData.id_banco, data);
        alert('Banco atualizado com sucesso!');
      } else {
        await bancosService.criar(data);
        alert('Banco criado com sucesso!');
        reset();
      }
      onSuccess?.();
    } catch (error) {
      alert('Erro ao salvar banco');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input
          {...register('nome', { required: 'Nome é obrigatório' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Nome do banco"
        />
        {errors.nome && <span className="text-red-500 text-sm">{errors.nome.message}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Código do Banco</label>
          <input
            {...register('codigo_banco')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Conta</label>
          <input
            {...register('tipo_conta')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Corrente"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número da Conta</label>
          <input
            {...register('numero_conta')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="12345-6"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agência</label>
          <input
            {...register('agencia')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="1234"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Saldo Inicial</label>
        <input
          type="number"
          step="0.01"
          {...register('saldo_inicial', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="0.00"
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
