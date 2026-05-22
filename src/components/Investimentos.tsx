import { useEffect, useState } from 'react';
import { investimentosService } from '../services/investimentosService';
import { lancamentosService } from '../services/lancamentosService';
import { tiposLancamentosService } from '../services/tiposLancamentosService';
import { formatCurrency, formatDate } from '../utils/formatters';

interface InvestimentoComSaldo {
  id_investimento: string;
  nome: string;
  tipo: string;
  saldo_inicial: number;
  saldo_atual: number;
  aportes: number;
  resgates: number;
  rendimento: number;
  movimentos: any[];
}

export const Investimentos = () => {
  const [investimentosComSaldo, setInvestimentosComSaldo] = useState<InvestimentoComSaldo[]>([]);
  const [loading, setLoading] = useState(true);
  const [investimentoSelecionado, setInvestimentoSelecionado] = useState<string | null>(null);

  useEffect(() => {
    carregarInvestimentos();
  }, []);

  const carregarInvestimentos = async () => {
    try {
      setLoading(true);
      
      // Carregar investimentos, lançamentos e tipos de lançamento
      const [investimentos, lancamentos, tipos] = await Promise.all([
        investimentosService.listar(),
        lancamentosService.listar(),
        tiposLancamentosService.listar(),
      ]);

      // Encontrar ID do tipo de lançamento INVESTIMENTO
      const investimentoId = tipos.find(t => t.nome === 'INVESTIMENTO' || t.nome === 'Investimento')?.id_tipo_lancamento;

      // Calcular saldo de cada investimento
      const investimentosComSaldoCalculado: InvestimentoComSaldo[] = investimentos.map((investimento: any) => {
        const movimentosDoInvestimento = lancamentos.filter((l: any) => 
          l.id_investimento === investimento.id_investimento &&
          l.id_tipo_lancamento === investimentoId
        );
        
        // Ordenar movimentos por data para encontrar o mais antigo
        const movimentosOrdenados = movimentosDoInvestimento.sort((a: any, b: any) => {
          const dataA = new Date(a.data_vencimento || a.data_pagamento || a.data_documento);
          const dataB = new Date(b.data_vencimento || b.data_pagamento || b.data_documento);
          return dataA.getTime() - dataB.getTime();
        });
        
        // Saldo inicial é o valor do lançamento mais antigo
        const saldoInicial = movimentosOrdenados.length > 0 ? movimentosOrdenados[0].valor_total : 0;
        
        let aportes = 0;
        let resgates = 0;
        let rendimento = 0;

        movimentosDoInvestimento.forEach((movimento: any) => {
          if (movimento.valor_total > 0) {
            aportes += movimento.valor_total;
          } else {
            resgates += Math.abs(movimento.valor_total);
          }
        });

        // Saldo atual = aportes - resgates (saldo inicial já está incluído nos aportes)
        const saldoAtual = aportes - resgates + rendimento;

        return {
          id_investimento: investimento.id_investimento,
          nome: investimento.nome,
          tipo: investimento.tipo || investimento.descricao || '-',
          saldo_inicial: saldoInicial,
          saldo_atual: saldoAtual,
          aportes,
          resgates,
          rendimento,
          movimentos: movimentosOrdenados,
        };
      });

      setInvestimentosComSaldo(investimentosComSaldoCalculado);
    } catch (error) {
      console.error('Erro ao carregar investimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Investimentos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investimentosComSaldo.map((investimento) => (
          <div
            key={investimento.id_investimento}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition"
            onClick={() => setInvestimentoSelecionado(investimento.id_investimento)}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{investimento.nome}</h3>
            <p className="text-sm text-gray-600 mb-4">{investimento.tipo}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Saldo Inicial:</span>
                <span className="font-medium text-sm">{formatCurrency(investimento.saldo_inicial)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Aportes:</span>
                <span className="font-medium text-sm text-green-600">+{formatCurrency(investimento.aportes)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Resgates:</span>
                <span className="font-medium text-sm text-red-600">-{formatCurrency(investimento.resgates)}</span>
              </div>
              
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-semibold text-sm">Saldo Atual:</span>
                  <span className={`font-bold text-lg ${investimento.saldo_atual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(investimento.saldo_atual)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {investimentoSelecionado && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Movimentos do Investimento</h3>
            <button
              onClick={() => setInvestimentoSelecionado(null)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Fechar
            </button>
          </div>
          
          {(() => {
            const investimento = investimentosComSaldo.find(i => i.id_investimento === investimentoSelecionado);
            if (!investimento) return null;
            
            return (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold">{investimento.nome}</h4>
                  <p className="text-gray-600">Saldo Atual: {formatCurrency(investimento.saldo_atual)}</p>
                </div>
                
                {investimento.movimentos.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {investimento.movimentos.map((movimento) => (
                          <tr key={movimento.id_lancamento}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {movimento.descricao}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(movimento.data_vencimento || movimento.data_pagamento || '-')}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                              movimento.valor_total > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatCurrency(movimento.valor_total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={2} className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                            Total:
                          </td>
                          <td className="px-6 py-3 text-right text-sm font-bold text-green-600">
                            {formatCurrency(investimento.aportes - investimento.resgates)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhum movimento neste investimento</p>
                )}
              </div>
            );
          })()}
        </div>
      )}
      
      {investimentosComSaldo.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum investimento cadastrado
        </div>
      )}
    </div>
  );
};
