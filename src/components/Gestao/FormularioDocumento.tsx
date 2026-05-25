import React from 'react';
import { useForm } from 'react-hook-form';
import { documentosService } from '../../services/documentosService';

interface FormularioDocumentoProps {
  onSuccess?: () => void;
  editData?: any;
}

export const FormularioDocumento: React.FC<FormularioDocumentoProps> = ({ onSuccess, editData }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editData || {},
  });

  const onSubmit = async (data: any) => {
    try {
      if (editData) {
        await documentosService.atualizar(editData.id_documento, data);
        alert('Documento atualizado com sucesso!');
      } else {
        await documentosService.criar(data);
        alert('Documento criado com sucesso!');
        reset();
      }
      onSuccess?.();
    } catch (error) {
      alert('Erro ao salvar documento');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input
          {...register('nome', { required: 'Nome é obrigatório' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Nome do documento"
        />
        {errors.nome && <span className="text-red-500 text-sm">{String(errors.nome.message)}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          {...register('descricao')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
          placeholder="Descrição do documento"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ícone</label>
        <input
          {...register('icone')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="📄"
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
