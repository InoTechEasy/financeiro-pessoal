import { useEffect, useState } from 'react';
import { cartoesService } from '../services/cartoesService';
import { lancamentosService } from '../services/lancamentosService';
import { bancosService } from '../services/bancosService';
import { tiposLancamentosService } from '../services/tiposLancamentosService';
import { formatCurrency, formatDate } from '../utils/formatters';

interface CartaoComFatura {
  id_cartao: string;
  nome: string;
  numero: string;
  limite: number;
  dia_vencimento: number;
  faturasPorMes: { [key: string]: { valor: number; lancamentos: any[] } };
}

export const CartoesCredito = () => {
  const [cartoesComFatura, setCartoesComFatura] = useState<CartaoComFatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroData, setFiltroData] = useState<'vencimento' | 'pagamento'>('vencimento');
  const [editandoCartao, setEditandoCartao] = useState<any>(null);
  const [formData, setFormData] = useState({ nome: '', limite: 0, dia_vencimento: 0 });
  const [faturaSelecionada, setFaturaSelecionada] = useState<{ cartaoId: string; mes: string } | null>(null);

  useEffect(() => {
    carregarCartoes();
  }, [filtroData]);

  const carregarCartoes = async () => {
    try {
      setLoading(true);
      
      // Carregar cartões, lançamentos, bancos e tipos de lançamento
      const [cartoes, lancamentos, bancos, tipos] = await Promise.all([
        cartoesService.listar(),
        lancamentosService.listar(),
        bancosService.listar(),
        tiposLancamentosService.listar(),
      ]);

      // Encontrar IDs dos tipos de lançamento
      const despesaId = tipos.find(t => t.nome === 'Despesa')?.id_tipo_lancamento;

      // Calcular fatura de cada cartão
      const cartoesComFaturaCalculado: CartaoComFatura[] = cartoes.map((cartao: any) => {
        // Filtrar lançamentos deste cartão (apenas despesas não pagas)
        const lancamentosDoCartao = lancamentos.filter((l: any) => 
          l.id_cartao === cartao.id_cartao &&
          l.id_tipo_lancamento === despesaId &&
          !l.data_pagamento // Apenas não pagas
        );

        // Aplicar filtro de data se necessário
        const lancamentosFiltrados = lancamentosDoCartao.filter((l: any) => {
          if (filtroData === 'vencimento') {
            return l.data_vencimento;
          } else {
            return l.data_pagamento;
          }
        });

        // Agrupar lançamentos por mês/ano baseado no dia de vencimento da fatura do cartão
        const faturasPorMes: { [key: string]: { valor: number; lancamentos: any[] } } = {};
        
        lancamentosFiltrados.forEach((lancamento: any) => {
          const dataLancamento = filtroData === 'vencimento' 
            ? new Date(lancamento.data_vencimento)
            : new Date(lancamento.data_pagamento);
          
          // Determinar o mês da fatura baseado no dia de vencimento do cartão
          // Se a data do lançamento for antes do dia de vencimento, pertence ao mês atual
          // Se for depois, pertence ao mês seguinte
          let dataFatura = new Date(dataLancamento);
          
          if (dataLancamento.getDate() > cartao.dia_vencimento) {
            // Lançamento após o dia de vencimento, vai para o mês seguinte
            dataFatura.setMonth(dataFatura.getMonth() + 1);
          }
          
          // Ajustar para o dia de vencimento
          dataFatura.setDate(cartao.dia_vencimento);
          
          const chaveMes = `${dataFatura.getFullYear()}-${String(dataFatura.getMonth() + 1).padStart(2, '0')}`;
          
          if (!faturasPorMes[chaveMes]) {
            faturasPorMes[chaveMes] = {
              valor: 0,
              lancamentos: []
            };
          }
          
          faturasPorMes[chaveMes].valor += lancamento.valor_total;
          faturasPorMes[chaveMes].lancamentos.push(lancamento);
        });

        return {
          id_cartao: cartao.id_cartao,
          nome: cartao.nome,
          numero: cartao.numero || '',
          limite: cartao.limite || 0,
          dia_vencimento: cartao.dia_vencimento || 0,
          faturasPorMes,
        };
      });

      setCartoesComFatura(cartoesComFaturaCalculado);
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarCartao = (cartao: CartaoComFatura) => {
    setEditandoCartao(cartao);
    setFormData({
      nome: cartao.nome,
      limite: cartao.limite,
      dia_vencimento: cartao.dia_vencimento,
    });
  };

  const handleSalvarEdicao = async () => {
    try {
      if (!editandoCartao) return;

      await cartoesService.atualizar(editandoCartao.id_cartao, formData);
      setEditandoCartao(null);
      carregarCartoes();
      alert('Cartão atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar cartão:', error);
      alert('Erro ao atualizar cartão');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Cartões de Crédito</h2>
        
        <div className="flex items-center space-x-4">
          <label className="block text-sm font-medium text-gray-700">Filtro:</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="vencimento"
                checked={filtroData === 'vencimento'}
                onChange={(e) => setFiltroData(e.target.value as 'vencimento' | 'pagamento')}
                className="mr-2"
              />
              <span className="text-sm">Previsto (Data Vencimento)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="pagamento"
                checked={filtroData === 'pagamento'}
                onChange={(e) => setFiltroData(e.target.value as 'vencimento' | 'pagamento')}
                className="mr-2"
              />
              <span className="text-sm">Realizado (Data Pagamento)</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cartoesComFatura.map((cartao) => (
          <div
            key={cartao.id_cartao}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{cartao.nome}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditarCartao(cartao);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Editar
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">**** {cartao.numero?.slice(-4) || ''}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Vencimento:</span>
                <span className="font-medium text-sm">Dia {cartao.dia_vencimento}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Limite:</span>
                <span className="font-medium text-sm">{formatCurrency(cartao.limite)}</span>
              </div>
              
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-semibold text-sm">Total Faturas:</span>
                  <span className={`font-bold text-lg ${Object.values(cartao.faturasPorMes).reduce((acc, f) => acc + f.valor, 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(Object.values(cartao.faturasPorMes).reduce((acc, f) => acc + f.valor, 0))}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600 text-xs">Disponível:</span>
                  <span className="font-medium text-xs text-green-600">
                    {formatCurrency(cartao.limite - Object.values(cartao.faturasPorMes).reduce((acc, f) => acc + f.valor, 0))}
                  </span>
                </div>
                
                {/* Botões de faturas por mês */}
                {Object.keys(cartao.faturasPorMes).length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-gray-600 font-medium">Faturas por mês:</p>
                    {Object.entries(cartao.faturasPorMes)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .map(([mes, fatura]) => {
                        const [ano, mesNum] = mes.split('-');
                        const nomeMes = new Date(parseInt(ano), parseInt(mesNum) - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                        return (
                          <button
                            key={mes}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFaturaSelecionada({ cartaoId: cartao.id_cartao, mes });
                            }}
                            className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded text-sm flex justify-between items-center transition"
                          >
                            <span className="capitalize">{nomeMes}</span>
                            <span className="font-semibold text-red-600">{formatCurrency(fatura.valor)}</span>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {faturaSelecionada && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Detalhes da Fatura</h3>
            <button
              onClick={() => setFaturaSelecionada(null)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Fechar
            </button>
          </div>
          
          {(() => {
            const cartao = cartoesComFatura.find(c => c.id_cartao === faturaSelecionada.cartaoId);
            if (!cartao || !cartao.faturasPorMes[faturaSelecionada.mes]) return null;
            
            const fatura = cartao.faturasPorMes[faturaSelecionada.mes];
            const [ano, mesNum] = faturaSelecionada.mes.split('-');
            const nomeMes = new Date(parseInt(ano), parseInt(mesNum) - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
            
            return (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold">{cartao.nome} - **** {cartao.numero?.slice(-4) || ''}</h4>
                  <p className="text-gray-600">Fatura de {nomeMes}: {formatCurrency(fatura.valor)}</p>
                </div>
                
                {fatura.lancamentos.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Vencimento</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {fatura.lancamentos.map((lancamento: any) => (
                          <tr key={lancamento.id_lancamento}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {lancamento.descricao}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(lancamento.data_vencimento || '-')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                              {formatCurrency(lancamento.valor_total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={2} className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                            Total:
                          </td>
                          <td className="px-6 py-3 text-right text-sm font-bold text-red-600">
                            {formatCurrency(fatura.valor)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhum lançamento nesta fatura</p>
                )}
              </div>
            );
          })()}
        </div>
      )}
      
      {cartoesComFatura.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum cartão de crédito cadastrado
        </div>
      )}

      {editandoCartao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Editar Cartão de Crédito</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Limite de Crédito</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.limite}
                  onChange={(e) => setFormData({ ...formData, limite: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dia de Vencimento</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.dia_vencimento}
                  onChange={(e) => setFormData({ ...formData, dia_vencimento: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditandoCartao(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarEdicao}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
