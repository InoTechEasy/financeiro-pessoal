import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { cartoesService } from '../../services/cartoesService';
import { bancosService } from '../../services/bancosService';

interface FormularioCartaoProps {
  onSuccess?: () => void;
  editData?: any;
}

export const FormularioCartao: React.FC<FormularioCartaoProps> = ({ onSuccess, editData }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editData || {},
  });

  const [bancos, setBancos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarBancos = async () => {
      try {
        const dados = await bancosService.listar();
        setBancos(dados);
      } catch (error) {
        console.error('Erro ao carregar bancos:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarBancos();
  }, []);

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

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Banco *</label>
        <select
          {...register('id_banco', { required: 'Banco é obrigatório' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Selecione...</option>
          {bancos.map((banco) => (
            <option key={banco.id_banco} value={banco.id_banco}>
              {banco.nome}
            </option>
          ))}
        </select>
        {errors.id_banco && <span className="text-red-500 text-sm">{String(errors.id_banco.message)}</span>}
      </div>

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Dia de Vencimento</label>
          <input
            type="number"
            {...register('dia_vencimento', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="10"
            min={1}
            max={31}
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
