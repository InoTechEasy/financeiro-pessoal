import React, { useState, useEffect } from 'react';
import { conciliacaoBancariaService } from '../../services/conciliacaoBancariaService';
import { bancosService } from '../../services/bancosService';
import { tiposLancamentosService } from '../../services/tiposLancamentosService';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ConciliacaoBancaria: React.FC = () => {
  const [conciliacoes, setConciliacoes] = useState<any[]>([]);
  const [bancos, setBancos] = useState<any[]>([]);
  const [tiposLancamentos, setTiposLancamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bancoSelecionado, setBancoSelecionado] = useState<number | null>(null);
  const [dataInicio, setDataInicio] = useState<string>(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [dataFim, setDataFim] = useState<string>(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]);
  const [saldoInicial, setSaldoInicial] = useState<number>(0);
  const [saldoBancarioFinal, setSaldoBancarioFinal] = useState<number>(0);
  const [totais, setTotais] = useState({ receitas: 0, despesas: 0, investimentos: 0 });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const [bcs, tipos] = await Promise.all([
          bancosService.listar(),
          tiposLancamentosService.listar(),
        ]);
        setBancos(bcs);
        setTiposLancamentos(tipos);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  useEffect(() => {
    if (bancoSelecionado) {
      carregarConciliacoes();
      carregarSaldoInicial();
      carregarTotais();
    }
  }, [bancoSelecionado, dataInicio, dataFim]);

  const carregarConciliacoes = async () => {
    try {
      if (!bancoSelecionado) return;
      const dados = await conciliacaoBancariaService.listar({
        id_banco: bancoSelecionado,
      });
      setConciliacoes(dados);
    } catch (error) {
      console.error('Erro ao carregar conciliações:', error);
    }
  };

  const carregarSaldoInicial = async () => {
    try {
      if (!bancoSelecionado) return;
      const saldo = await conciliacaoBancariaService.obterSaldoInicial(bancoSelecionado, dataInicio);
      setSaldoInicial(saldo);
    } catch (error) {
      console.error('Erro ao carregar saldo inicial:', error);
    }
  };

  const carregarTotais = async () => {
    try {
      if (!bancoSelecionado) return;
      const totaisPeriodo = await conciliacaoBancariaService.calcularTotaisPeriodo(
        bancoSelecionado,
        dataInicio,
        dataFim,
        tiposLancamentos
      );
      setTotais(totaisPeriodo);
    } catch (error) {
      console.error('Erro ao carregar totais:', error);
    }
  };

  const calcularSaldoFinal = () => {
    return saldoInicial + totais.receitas - totais.despesas - totais.investimentos;
  };

  const calcularDiferenca = () => {
    return saldoBancarioFinal - calcularSaldoFinal();
  };

  const handleSalvarConciliacao = async () => {
    try {
      const saldoFinalCalculado = calcularSaldoFinal();
      const diferenca = saldoBancarioFinal - saldoFinalCalculado;
      
      const status = Math.abs(diferenca) < 0.01 ? 'CONCILIADO' : 'DIVERGENCIA';

      const conciliacao = {
        id_banco: bancoSelecionado,
        data_inicio: dataInicio,
        data_fim: dataFim,
        saldo_inicial: saldoInicial,
        saldo_final: saldoFinalCalculado,
        saldo_bancario_final: saldoBancarioFinal,
        diferenca_saldo: diferenca,
        status_conciliacao: status,
      };

      await conciliacaoBancariaService.criar(conciliacao);
      alert('Conciliação salva com sucesso!');
      carregarConciliacoes();
    } catch (error) {
      console.error('Erro ao salvar conciliação:', error);
      alert('Erro ao salvar conciliação');
    }
  };

  const handleIniciarConciliacao = async () => {
    try {
      if (!bancoSelecionado) {
        alert('Selecione um banco primeiro');
        return;
      }
      setLoading(true);
      await Promise.all([
        carregarSaldoInicial(),
        carregarTotais(),
      ]);
      alert('Conciliação iniciada! Os dados foram carregados automaticamente.');
    } catch (error) {
      console.error('Erro ao iniciar conciliação:', error);
      alert('Erro ao iniciar conciliação');
    } finally {
      setLoading(false);
    }
  };

  const saldoFinal = calcularSaldoFinal();
  const diferenca = calcularDiferenca();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Conciliação Bancária</h2>
        <button
          onClick={handleIniciarConciliacao}
          disabled={!bancoSelecionado}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition disabled:bg-gray-300"
        >
          Iniciar Conciliação
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Banco</label>
          <select
            value={bancoSelecionado || ''}
            onChange={(e) => setBancoSelecionado(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione...</option>
            {bancos.map((banco) => (
              <option key={banco.id_banco} value={banco.id_banco}>
                {banco.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm font-medium text-gray-600">Saldo Inicial</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(saldoInicial)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm font-medium text-gray-600">Entradas</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(totais.receitas)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm font-medium text-gray-600">Saídas</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(totais.despesas)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm font-medium text-gray-600">Investimentos</p>
          <p className="text-xl font-bold text-blue-600">{formatCurrency(totais.investimentos)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm font-medium text-gray-600">Saldo Final (Calculado)</p>
          <p className={`text-xl font-bold ${saldoFinal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(saldoFinal)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm font-medium text-gray-600">Saldo Bancário Final</p>
          <input
            type="number"
            step="0.01"
            value={saldoBancarioFinal}
            onChange={(e) => setSaldoBancarioFinal(parseFloat(e.target.value) || 0)}
            className="w-full px-2 py-1 border border-gray-300 rounded-md text-lg font-bold"
          />
        </div>
      </div>

      {/* Diferença e Ação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm font-medium text-gray-600">Diferença</p>
          <p className={`text-xl font-bold ${Math.abs(diferenca) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(diferenca)}
          </p>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleSalvarConciliacao}
            disabled={!bancoSelecionado}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-300"
          >
            Salvar Conciliação
          </button>
        </div>
      </div>

      {/* Histórico de Conciliações */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Conciliações</h3>
        
        {conciliacoes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhuma conciliação encontrada</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Inicial
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Final
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Bancário
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diferença
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {conciliacoes.map((conciliacao) => (
                  <tr key={conciliacao.id_conciliacao} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(conciliacao.data_inicio)} a {formatDate(conciliacao.data_fim)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(conciliacao.saldo_inicial)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(conciliacao.saldo_final)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(conciliacao.saldo_bancario_final)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                      Math.abs(conciliacao.diferenca_saldo) < 0.01 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(conciliacao.diferenca_saldo)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        conciliacao.status_conciliacao === 'CONCILIADO' ? 'bg-green-100 text-green-800' :
                        conciliacao.status_conciliacao === 'DIVERGENCIA' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {conciliacao.status_conciliacao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
