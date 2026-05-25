import React, { useState } from 'react';
import { GerenciadorTiposLancamentos } from '../components/Gestao/GerenciadorTiposLancamentos';
import { GerenciadorTiposPagamentos } from '../components/Gestao/GerenciadorTiposPagamentos';
import { GerenciadorClientes } from '../components/Gestao/GerenciadorClientes';
import { GerenciadorReceitas } from '../components/Gestao/GerenciadorReceitas';
import { GerenciadorInvestimentos } from '../components/Gestao/GerenciadorInvestimentos';
import { GerenciadorCategoriasDespesas } from '../components/Gestao/GerenciadorCategoriasDespesas';
import { GerenciadorBancos } from '../components/Gestao/GerenciadorBancos';
import { GerenciadorCartoes } from '../components/Gestao/GerenciadorCartoes';
import { GerenciadorFornecedores } from '../components/Gestao/GerenciadorFornecedores';

export const Gestao: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tipos-lancamentos');

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('tipos-lancamentos')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'tipos-lancamentos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tipos Lançamento
          </button>
          <button
            onClick={() => setActiveTab('tipos-pagamentos')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'tipos-pagamentos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tipos Pagamento
          </button>
          <button
            onClick={() => setActiveTab('clientes')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'clientes'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Clientes
          </button>
          <button
            onClick={() => setActiveTab('receitas')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'receitas'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Receitas
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
          <button
            onClick={() => setActiveTab('categorias')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'categorias'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Categorias
          </button>
          <button
            onClick={() => setActiveTab('bancos')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'bancos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Bancos
          </button>
          <button
            onClick={() => setActiveTab('cartoes')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'cartoes'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Cartões
          </button>
          <button
            onClick={() => setActiveTab('fornecedores')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'fornecedores'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Fornecedores
          </button>
        </div>
      </div>

      {activeTab === 'tipos-lancamentos' && <GerenciadorTiposLancamentos />}
      {activeTab === 'tipos-pagamentos' && <GerenciadorTiposPagamentos />}
      {activeTab === 'clientes' && <GerenciadorClientes />}
      {activeTab === 'receitas' && <GerenciadorReceitas />}
      {activeTab === 'investimentos' && <GerenciadorInvestimentos />}
      {activeTab === 'categorias' && <GerenciadorCategoriasDespesas />}
      {activeTab === 'bancos' && <GerenciadorBancos />}
      {activeTab === 'cartoes' && <GerenciadorCartoes />}
      {activeTab === 'fornecedores' && <GerenciadorFornecedores />}
    </div>
  );
};
