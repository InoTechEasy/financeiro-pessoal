import React, { useState } from 'react';
import { Dashboard } from '../components/Dashboard';
import { ListaLancamentos } from '../components/Lancamentos/ListaLancamentos';
import { FiltrosLancamentos } from '../components/Lancamentos/FiltrosLancamentos';
import { FormularioLancamento } from '../components/Lancamentos/FormularioLancamento';
import { BaixarPagamentos } from '../components/Lancamentos/BaixarPagamentos';
import { ConciliacaoBancaria } from '../components/Lancamentos/ConciliacaoBancaria';
import { SaldosBancarios } from '../components/SaldosBancarios';
import { CartoesCredito } from '../components/CartoesCredito';
import { Investimentos } from '../components/Investimentos';

export const Financeiro: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLancamentoCriado = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('lancamentos');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('lancamentos')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'lancamentos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lançamentos
          </button>
          <button
            onClick={() => setActiveTab('novo-lancamento')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'novo-lancamento'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Novo Lançamento
          </button>
          <button
            onClick={() => setActiveTab('baixar-pagamentos')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'baixar-pagamentos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Baixar Pagamentos
          </button>
          <button
            onClick={() => setActiveTab('conciliacao-bancaria')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'conciliacao-bancaria'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Conciliação Bancária
          </button>
          <button
            onClick={() => setActiveTab('saldos-bancarios')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'saldos-bancarios'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Saldos Bancários
          </button>
          <button
            onClick={() => setActiveTab('cartoes-credito')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'cartoes-credito'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Cartões de Crédito
          </button>
          <button
            onClick={() => setActiveTab('investimentos')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'investimentos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Investimentos
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'lancamentos' && (
        <div>
          <FiltrosLancamentos />
          <ListaLancamentos key={refreshKey} />
        </div>
      )}
      {activeTab === 'novo-lancamento' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Novo Lançamento</h2>
          <FormularioLancamento onSuccess={handleLancamentoCriado} />
        </div>
      )}
      {activeTab === 'baixar-pagamentos' && <BaixarPagamentos />}
      {activeTab === 'conciliacao-bancaria' && <ConciliacaoBancaria />}
      {activeTab === 'saldos-bancarios' && <SaldosBancarios />}
      {activeTab === 'cartoes-credito' && <CartoesCredito />}
      {activeTab === 'investimentos' && <Investimentos />}
    </div>
  );
};
