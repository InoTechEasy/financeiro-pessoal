import { useEffect, useState } from 'react';
import { bancosService } from '../services/bancosService';
import { lancamentosService } from '../services/lancamentosService';
import { tiposLancamentosService } from '../services/tiposLancamentosService';
import { formatCurrency } from '../utils/formatters';

interface BancoComSaldo {
  id_banco: string;
  nome: string;
  saldo_atual: number;
  receitas: number;
  despesas: number;
  transferencias_recebidas: number;
  transferencias_enviadas: number;
}

export const SaldosBancarios = () => {
  const [bancosComSaldo, setBancosComSaldo] = useState<BancoComSaldo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroData, setFiltroData] = useState<'vencimento' | 'pagamento'>('vencimento');

  useEffect(() => {
    carregarSaldos();
  }, [filtroData]);

  const carregarSaldos = async () => {
    try {
      setLoading(true);
      
      // Carregar bancos e lançamentos
      const [bancos, lancamentos, tipos] = await Promise.all([
        bancosService.listar(),
        lancamentosService.listar(),
        tiposLancamentosService.listar(),
      ]);

      // Encontrar IDs dos tipos de lançamento
      const receitaId = tipos.find(t => t.nome === 'Receita')?.id_tipo_lancamento;
      const despesaId = tipos.find(t => t.nome === 'Despesa')?.id_tipo_lancamento;
      const transferenciaId = tipos.find(t => t.nome === 'Transferência')?.id_tipo_lancamento;

      // Calcular saldo de cada banco
      const bancosComSaldoCalculado: BancoComSaldo[] = bancos.map((banco: any) => {
        const lancamentosDoBanco = lancamentos.filter((l: any) => l.id_banco === banco.id_banco);
        const transferenciasComoDestino = lancamentos.filter((l: any) => l.id_banco_destino === banco.id_banco);
        
        let receitas = 0;
        let despesas = 0;
        let transferenciasRecebidas = 0;
        let transferenciasEnviadas = 0;

        lancamentosDoBanco.forEach((lancamento: any) => {
          // Verificar se o lançamento deve ser considerado com base no filtro de data
          const deveConsiderar = filtroData === 'vencimento' 
            ? lancamento.data_vencimento 
            : lancamento.data_pagamento;
          
          if (!deveConsiderar) return;

          if (lancamento.id_tipo_lancamento === receitaId) {
            receitas += lancamento.valor_total;
          } else if (lancamento.id_tipo_lancamento === despesaId) {
            despesas += lancamento.valor_total;
          } else if (lancamento.id_tipo_lancamento === transferenciaId || lancamento.eh_transferencia) {
            // Se é transferência e este banco é a origem, é enviada
            transferenciasEnviadas += lancamento.valor_total;
          }
        });

        // Calcular transferências recebidas (banco como destino)
        transferenciasComoDestino.forEach((lancamento: any) => {
          // Verificar se o lançamento deve ser considerado com base no filtro de data
          const deveConsiderar = filtroData === 'vencimento' 
            ? lancamento.data_vencimento 
            : lancamento.data_pagamento;
          
          if (!deveConsiderar) return;

          if (lancamento.id_tipo_lancamento === transferenciaId || lancamento.eh_transferencia) {
            transferenciasRecebidas += lancamento.valor_total;
          }
        });

        const saldoAtual = (banco.saldo_atual || 0) + receitas - despesas + transferenciasRecebidas - transferenciasEnviadas;

        return {
          id_banco: banco.id_banco,
          nome: banco.nome,
          saldo_atual: saldoAtual,
          receitas,
          despesas,
          transferencias_recebidas: transferenciasRecebidas,
          transferencias_enviadas: transferenciasEnviadas,
        };
      });

      setBancosComSaldo(bancosComSaldoCalculado);
    } catch (error) {
      console.error('Erro ao carregar saldos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Saldos Bancários</h2>
        
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
        {bancosComSaldo.map((banco) => (
          <div
            key={banco.id_banco}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{banco.nome}</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Receitas:</span>
                <span className="font-medium text-green-600">+{formatCurrency(banco.receitas)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Despesas:</span>
                <span className="font-medium text-red-600">-{formatCurrency(banco.despesas)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transferências Recebidas:</span>
                <span className="font-medium text-green-600">+{formatCurrency(banco.transferencias_recebidas)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transferências Enviadas:</span>
                <span className="font-medium text-red-600">-{formatCurrency(banco.transferencias_enviadas)}</span>
              </div>
              
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-semibold">Saldo Atual:</span>
                  <span className={`font-bold text-xl ${banco.saldo_atual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(banco.saldo_atual)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {bancosComSaldo.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum banco cadastrado
        </div>
      )}
    </div>
  );
};
