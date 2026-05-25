import React, { useState, useEffect } from 'react';
import { lancamentosService } from '../../services/lancamentosService';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const BaixarPagamentos: React.FC = () => {
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos'); // todos, pendentes, pagos, atrasados

  const carregarLancamentos = async () => {
    try {
      setLoading(true);
      const dados = await lancamentosService.listar();
      setLancamentos(dados);
    } catch (error) {
      console.error('Erro ao carregar lançamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarLancamentos();
  }, []);

  const handleBaixarPagamento = async (id: number, dataPagamento: string) => {
    try {
      await lancamentosService.atualizar(id, { data_pagamento: dataPagamento });
      await carregarLancamentos();
      alert('Pagamento baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar pagamento:', error);
      alert('Erro ao baixar pagamento');
    }
  };

  const getLancamentosFiltrados = () => {
    const hoje = new Date();
    
    return lancamentos.filter(l => {
      const dataPagamento = l.data_pagamento ? new Date(l.data_pagamento) : null;
      const dataVencimento = l.data_vencimento ? new Date(l.data_vencimento) : null;
      
      switch (filtro) {
        case 'pendentes':
          return !dataPagamento;
        case 'pagos':
          return !!dataPagamento;
        case 'atrasados':
          return !dataPagamento && dataVencimento && dataVencimento < hoje;
        default:
          return true;
      }
    });
  };

  const lancamentosFiltrados = getLancamentosFiltrados();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Baixar Pagamentos</h2>

      {/* Filtros */}
      <div className="flex space-x-4">
        <button
          onClick={() => setFiltro('todos')}
          className={`px-4 py-2 rounded-md ${filtro === 'todos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro('pendentes')}
          className={`px-4 py-2 rounded-md ${filtro === 'pendentes' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setFiltro('pagos')}
          className={`px-4 py-2 rounded-md ${filtro === 'pagos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Pagos
        </button>
        <button
          onClick={() => setFiltro('atrasados')}
          className={`px-4 py-2 rounded-md ${filtro === 'atrasados' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Em Atraso
        </button>
      </div>

      {/* Tabela de Lançamentos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {lancamentosFiltrados.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum lançamento encontrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Vencimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lancamentosFiltrados.map((lancamento) => {
                  const hoje = new Date();
                  const dataVencimento = lancamento.data_vencimento ? new Date(lancamento.data_vencimento) : null;
                  const dataPagamento = lancamento.data_pagamento ? new Date(lancamento.data_pagamento) : null;
                  
                  let status = 'Em aberto';
                  let statusColor = 'text-yellow-600';
                  
                  if (dataPagamento) {
                    status = 'Pago';
                    statusColor = 'text-green-600';
                  } else if (dataVencimento && dataVencimento < hoje) {
                    status = 'Em atraso';
                    statusColor = 'text-red-600';
                  }

                  return (
                    <tr key={lancamento.id_lancamento} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lancamento.descricao}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(lancamento.data_vencimento || '-')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(lancamento.data_pagamento || '-')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={statusColor}>{status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        {formatCurrency(lancamento.valor_total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {!dataPagamento && (
                          <button
                            onClick={() => {
                              const dataHoje = new Date().toISOString().split('T')[0];
                              if (confirm(`Deseja baixar este pagamento em ${formatDate(dataHoje)}?`)) {
                                handleBaixarPagamento(lancamento.id_lancamento, dataHoje);
                              }
                            }}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition text-xs"
                          >
                            Baixar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
