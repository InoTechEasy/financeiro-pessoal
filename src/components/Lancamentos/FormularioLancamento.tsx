import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { lancamentoSchema } from '../../utils/validators';
import { lancamentosService } from '../../services/lancamentosService';
import { tiposLancamentosService } from '../../services/tiposLancamentosService';
import { receitasService } from '../../services/receitasService';
import { categoriasService } from '../../services/categoriasService';
import { investimentosService } from '../../services/investimentosService';
import { tiposPagamentosService } from '../../services/tiposPagamentosService';
import { bancosService } from '../../services/bancosService';
import { cartoesService } from '../../services/cartoesService';
import { fornecedoresService } from '../../services/fornecedoresService';
import { clientesService } from '../../services/clientesService';

interface FormularioLancamentoProps {
  onSuccess?: () => void;
}

export const FormularioLancamento: React.FC<FormularioLancamentoProps> = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(lancamentoSchema),
  });

  const [tiposLancamentos, setTiposLancamentos] = useState<any[]>([]);
  const [receitas, setReceitas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [investimentos, setInvestimentos] = useState<any[]>([]);
  const [tiposPagamentos, setTiposPagamentos] = useState<any[]>([]);
  const [bancos, setBancos] = useState<any[]>([]);
  const [cartoes, setCartoes] = useState<any[]>([]);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para parcelas manuais
  const [modoParcelas, setModoParcelas] = useState<'automatico' | 'manual' | 'nenhum'>('nenhum');
  const [numParcelas, setNumParcelas] = useState(0);
  const [parcelasManuais, setParcelasManuais] = useState<Array<{ valor: number; data_vencimento: string }>>([]);

  const tipoLancamentoId = watch('id_tipo_lancamento');

  const tipoPagamentoId = watch('id_tipo_pagamento');
  const tipoPagamento = tiposPagamentos.find(t => t.id_tipo_pagamento === tipoPagamentoId)?.nome;

  // Encontrar IDs dos tipos de lançamento por nome (para compatibilidade)
  const receitaTipoId = tiposLancamentos.find(t => t.nome === 'Receita')?.id_tipo_lancamento;
  const despesaTipoId = tiposLancamentos.find(t => t.nome === 'Despesa')?.id_tipo_lancamento;
  const investimentoTipoId = tiposLancamentos.find(t => t.nome === 'Investimento')?.id_tipo_lancamento;

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [tipos, recs, cats, invs, tps, bcos, crts, forns, clis] = await Promise.all([
          tiposLancamentosService.listar(),
          receitasService.listar(),
          categoriasService.listar(),
          investimentosService.listar(),
          tiposPagamentosService.listar(),
          bancosService.listar(),
          cartoesService.listar(),
          fornecedoresService.listar(),
          clientesService.listar(),
        ]);
        setTiposLancamentos(tipos);
        setReceitas(recs);
        setCategorias(cats);
        setInvestimentos(invs);
        setTiposPagamentos(tps);
        setBancos(bcos);
        setCartoes(crts);
        setFornecedores(forns);
        setClientes(clis);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      // Verificar o modo de parcelas
      if (modoParcelas === 'automatico' && numParcelas > 1) {
        // Criar múltiplos lançamentos para cada parcela (divisão automática)
        const valorPorParcela = data.valor_total / numParcelas;
        const dataVencimentoBase = data.data_vencimento ? new Date(data.data_vencimento) : new Date();
        
        for (let i = 0; i < numParcelas; i++) {
          // Calcular data de vencimento para esta parcela (mensal)
          const dataVencimentoParcela = new Date(dataVencimentoBase);
          dataVencimentoParcela.setMonth(dataVencimentoParcela.getMonth() + i);
          
          // Converter campos vazios em null
          const dadosParaEnviar = {
            ...data,
            data_pagamento: null, // Parcelas não têm pagamento inicial
            data_vencimento: dataVencimentoParcela.toISOString().split('T')[0],
            id_receita: data.id_receita || null,
            id_categoria_despesa: data.id_categoria_despesa || null,
            id_investimento: data.id_investimento || null,
            id_fornecedor: data.id_fornecedor || null,
            id_cliente: data.id_cliente || null,
            id_cartao: data.id_cartao || null,
            valor_parcela: valorPorParcela,
            numero_parcelas: numParcelas,
            parcela_atual: i + 1,
            observacoes: data.observacoes || null,
          };

          await lancamentosService.criar(dadosParaEnviar);
        }
        
        alert(`${numParcelas} parcelas criadas com sucesso!`);
      } else if (modoParcelas === 'manual' && parcelasManuais.length > 0) {
        // Criar múltiplos lançamentos para cada parcela (valores manuais)
        for (let i = 0; i < parcelasManuais.length; i++) {
          const parcela = parcelasManuais[i];
          
          // Converter campos vazios em null
          const dadosParaEnviar = {
            ...data,
            data_pagamento: null, // Parcelas não têm pagamento inicial
            data_vencimento: parcela.data_vencimento || null,
            id_receita: data.id_receita || null,
            id_categoria_despesa: data.id_categoria_despesa || null,
            id_investimento: data.id_investimento || null,
            id_fornecedor: data.id_fornecedor || null,
            id_cliente: data.id_cliente || null,
            id_cartao: data.id_cartao || null,
            valor_parcela: parcela.valor,
            numero_parcelas: parcelasManuais.length,
            parcela_atual: i + 1,
            observacoes: data.observacoes || null,
          };

          await lancamentosService.criar(dadosParaEnviar);
        }
        
        alert(`${parcelasManuais.length} parcelas criadas com sucesso!`);
      } else {
        // Criar lançamento único
        const dadosParaEnviar = {
          ...data,
          data_pagamento: data.data_pagamento || null,
          data_vencimento: data.data_vencimento || null,
          id_receita: data.id_receita || null,
          id_categoria_despesa: data.id_categoria_despesa || null,
          id_investimento: data.id_investimento || null,
          id_fornecedor: data.id_fornecedor || null,
          id_cliente: data.id_cliente || null,
          id_cartao: data.id_cartao || null,
          valor_parcela: data.valor_parcela || null,
          numero_parcelas: data.numero_parcelas || null,
          parcela_atual: data.parcela_atual || null,
          observacoes: data.observacoes || null,
        };

        await lancamentosService.criar(dadosParaEnviar);
        alert('Lançamento criado com sucesso!');
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao criar lançamento:', error);
      alert('Erro ao criar lançamento');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Lançamento *</label>
          <select
            {...register('id_tipo_lancamento')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione...</option>
            {tiposLancamentos.map((tipo) => (
              <option key={tipo.id_tipo_lancamento} value={tipo.id_tipo_lancamento}>
                {tipo.nome}
              </option>
            ))}
          </select>
          {errors.id_tipo_lancamento && <span className="text-red-500 text-sm">{errors.id_tipo_lancamento.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor *</label>
          <input
            type="number"
            step="0.01"
            {...register('valor_total', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="0.00"
          />
          {errors.valor_total && <span className="text-red-500 text-sm">{errors.valor_total.message}</span>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
        <input
          {...register('descricao')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Descrição do lançamento"
        />
        {errors.descricao && <span className="text-red-500 text-sm">{errors.descricao.message}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
          <input
            type="date"
            {...register('data_vencimento')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Pagamento</label>
          <input
            type="date"
            {...register('data_pagamento')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pagamento *</label>
          <select
            {...register('id_tipo_pagamento')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione...</option>
            {tiposPagamentos.map((tipo) => (
              <option key={tipo.id_tipo_pagamento} value={tipo.id_tipo_pagamento}>
                {tipo.nome}
              </option>
            ))}
          </select>
          {errors.id_tipo_pagamento && <span className="text-red-500 text-sm">{errors.id_tipo_pagamento.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Banco *</label>
          <select
            {...register('id_banco')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione...</option>
            {bancos.map((banco) => (
              <option key={banco.id_banco} value={banco.id_banco}>
                {banco.nome}
              </option>
            ))}
          </select>
          {errors.id_banco && <span className="text-red-500 text-sm">{errors.id_banco.message}</span>}
        </div>
      </div>

      {tipoLancamentoId === receitaTipoId && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Receita *</label>
            <select
              {...register('id_receita')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione...</option>
              {receitas.map((receita) => (
                <option key={receita.id_receita} value={receita.id_receita}>
                  {receita.nome}
                </option>
              ))}
            </select>
            {errors.id_receita && <span className="text-red-500 text-sm">{errors.id_receita.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <select
              {...register('id_cliente')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione...</option>
              {clientes.map((cliente) => (
                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {tipoLancamentoId === despesaTipoId && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria de Despesa *</label>
            <select
              {...register('id_categoria_despesa')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione...</option>
              {categorias.filter(c => !c.id_pai).map((categoria) => (
                <optgroup key={categoria.id_categoria_despesa} label={categoria.nome}>
                  <option value={categoria.id_categoria_despesa}>{categoria.nome}</option>
                  {categorias.filter(sub => sub.id_pai === categoria.id_categoria_despesa).map((subcategoria) => (
                    <option key={subcategoria.id_categoria_despesa} value={subcategoria.id_categoria_despesa}>
                      {categoria.nome} - {subcategoria.nome}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {errors.id_categoria_despesa && <span className="text-red-500 text-sm">{errors.id_categoria_despesa.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
            <select
              {...register('id_fornecedor')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione...</option>
              {fornecedores.map((fornecedor) => (
                <option key={fornecedor.id_fornecedor} value={fornecedor.id_fornecedor}>
                  {fornecedor.nome}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {tipoLancamentoId === investimentoTipoId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Investimento *</label>
          <select
            {...register('id_investimento')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione...</option>
            {investimentos.map((investimento) => (
              <option key={investimento.id_investimento} value={investimento.id_investimento}>
                {investimento.nome}
              </option>
            ))}
          </select>
          {errors.id_investimento && <span className="text-red-500 text-sm">{errors.id_investimento.message}</span>}
        </div>
      )}

      {tipoPagamento === 'Cartão de Crédito' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cartão de Crédito *</label>
          <select
            {...register('id_cartao')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione...</option>
            {cartoes.map((cartao) => (
              <option key={cartao.id_cartao} value={cartao.id_cartao}>
                {cartao.nome}
              </option>
            ))}
          </select>
          {errors.id_cartao && <span className="text-red-500 text-sm">{errors.id_cartao.message}</span>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Parcelas</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="modoParcelas"
                value="nenhum"
                checked={modoParcelas === 'nenhum'}
                onChange={(e) => setModoParcelas(e.target.value as 'automatico' | 'manual' | 'nenhum')}
                className="mr-2"
              />
              <span className="text-sm">Lançamento único</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="modoParcelas"
                value="automatico"
                checked={modoParcelas === 'automatico'}
                onChange={(e) => setModoParcelas(e.target.value as 'automatico' | 'manual' | 'nenhum')}
                className="mr-2"
              />
              <span className="text-sm">Dividir automaticamente</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="modoParcelas"
                value="manual"
                checked={modoParcelas === 'manual'}
                onChange={(e) => setModoParcelas(e.target.value as 'automatico' | 'manual' | 'nenhum')}
                className="mr-2"
              />
              <span className="text-sm">Definir valores manualmente</span>
            </label>
          </div>

          {modoParcelas === 'automatico' && (
            <div className="mt-2">
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Número de parcelas"
                min="2"
                onChange={(e) => setNumParcelas(parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">O valor será dividido igualmente entre as parcelas</p>
            </div>
          )}

          {modoParcelas === 'manual' && (
            <div className="mt-2">
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                placeholder="Número de parcelas"
                min="2"
                value={numParcelas || ''}
                onChange={(e) => {
                  const n = parseInt(e.target.value) || 0;
                  setNumParcelas(n);
                  // Inicializar array de parcelas
                  setParcelasManuais(
                    Array.from({ length: n }, () => ({ valor: 0, data_vencimento: '' }))
                  );
                }}
              />
              {numParcelas > 0 && (
                <div className="space-y-2 mt-2">
                  {Array.from({ length: numParcelas }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium w-16">Parcela {index + 1}:</span>
                      <input
                        type="number"
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Valor"
                        value={parcelasManuais[index]?.valor || ''}
                        onChange={(e) => {
                          const novasParcelas = [...parcelasManuais];
                          novasParcelas[index] = {
                            ...novasParcelas[index],
                            valor: parseFloat(e.target.value) || 0
                          };
                          setParcelasManuais(novasParcelas);
                        }}
                      />
                      <input
                        type="date"
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        value={parcelasManuais[index]?.data_vencimento || ''}
                        onChange={(e) => {
                          const novasParcelas = [...parcelasManuais];
                          novasParcelas[index] = {
                            ...novasParcelas[index],
                            data_vencimento: e.target.value
                          };
                          setParcelasManuais(novasParcelas);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
        <textarea
          {...register('observacoes')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
          placeholder="Observações adicionais"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Salvar Lançamento
      </button>
    </form>
  );
};
