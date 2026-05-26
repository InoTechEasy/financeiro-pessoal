import React from 'react';
import { useForm } from 'react-hook-form';
import { receitasService } from '../../services/receitasService';

interface FormularioReceitaProps {
  onSuccess?: () => void;
  editData?: any;
}

export const FormularioReceita: React.FC<FormularioReceitaProps> = ({ onSuccess, editData }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editData || {},
  });

  const onSubmit = async (data: any) => {
    try {
      console.log('Dados do formulário:', data);
      console.log('editData:', editData);
      
      // Verifica se é edição (tem id_receita) ou criação nova
      if (editData?.id_receita) {
        console.log('Atualizando receita:', editData.id_receita, data);
        await receitasService.atualizar(editData.id_receita, data);
        alert('Receita atualizada com sucesso!');
      } else {
        // Garante que ativo seja true ao criar nova receita
        // Remove id_receita, created_at, user_id se estiverem presentes (não devem ser enviados na criação)
        const { id_receita, created_at, user_id, ...dadosParaCriar } = data;
        const dadosComAtivo = {
          ...dadosParaCriar,
          ativo: true,
        };
        console.log('Criando receita (dados limpos):', dadosComAtivo);
        await receitasService.criar(dadosComAtivo);
        alert('Receita criada com sucesso!');
        reset();
      }
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      alert('Erro ao salvar receita: ' + (error as any).message);
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

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {editData?.id_receita ? 'Atualizar' : 'Salvar'}
      </button>
    </form>
  );
};
