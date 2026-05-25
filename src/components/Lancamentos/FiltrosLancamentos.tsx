import React, { useState } from 'react';

export const FiltrosLancamentos: React.FC = () => {
  const [filtroPeriodo, setFiltroPeriodo] = useState<'7' | '15' | '30' | 'personalizado'>('30');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Filtros</h3>
      
      {/* Filtro de Período */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Período:</label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="7"
              checked={filtroPeriodo === '7'}
              onChange={(e) => setFiltroPeriodo(e.target.value as '7' | '15' | '30' | 'personalizado')}
              className="mr-2"
            />
            <span className="text-sm">Últimos 7 dias</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="15"
              checked={filtroPeriodo === '15'}
              onChange={(e) => setFiltroPeriodo(e.target.value as '7' | '15' | '30' | 'personalizado')}
              className="mr-2"
            />
            <span className="text-sm">Últimos 15 dias</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="30"
              checked={filtroPeriodo === '30'}
              onChange={(e) => setFiltroPeriodo(e.target.value as '7' | '15' | '30' | 'personalizado')}
              className="mr-2"
            />
            <span className="text-sm">Últimos 30 dias</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="personalizado"
              checked={filtroPeriodo === 'personalizado'}
              onChange={(e) => setFiltroPeriodo(e.target.value as '7' | '15' | '30' | 'personalizado')}
              className="mr-2"
            />
            <span className="text-sm">Personalizado</span>
          </label>
          {filtroPeriodo === 'personalizado' && (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <span className="text-sm">até</span>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">Todos</option>
            <option value="Receita">Receita</option>
            <option value="Despesa">Despesa</option>
            <option value="Investimento">Investimento</option>
            <option value="Transferência">Transferência</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input type="text" placeholder="Descrição..." className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
      </div>
    </div>
  );
};
