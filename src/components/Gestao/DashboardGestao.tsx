import React, { useState, useEffect } from 'react';
import { lancamentosService } from '../../services/lancamentosService';
import { formatCurrency } from '../../utils/formatters';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const DashboardGestao: React.FC = () => {
  const [resumo, setResumo] = useState<any>({ receitas: 0, despesas: 0, investimentos: 0 });
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resumoData, lancamentosData] = await Promise.all([
          lancamentosService.obterResumo(dataInicio, dataFim),
          lancamentosService.listar({ data_inicio: dataInicio, data_fim: dataFim }),
        ]);
        setResumo(resumoData);
        setLancamentos(lancamentosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, [dataInicio, dataFim]);

  const gerarPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Relatório Financeiro', 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Período: ${dataInicio || 'Início'} a ${dataFim || 'Atual'}`, 14, 30);
    
    doc.setFontSize(14);
    doc.text('Resumo', 14, 45);
    
    doc.setFontSize(12);
    doc.text(`Receitas: ${formatCurrency(resumo.receitas)}`, 14, 55);
    doc.text(`Despesas: ${formatCurrency(resumo.despesas)}`, 14, 65);
    doc.text(`Investimentos: ${formatCurrency(resumo.investimentos)}`, 14, 75);
    doc.text(`Saldo: ${formatCurrency(resumo.receitas - resumo.despesas)}`, 14, 85);
    
    doc.setFontSize(14);
    doc.text('Lançamentos', 14, 100);
    
    const tableData: any[][] = lancamentos.map((l: any) => [
      l.descricao,
      l.id_tipo_lancamento,
      formatCurrency(l.valor_total),
      l.data_documento || '-',
      l.data_pagamento || '-',
    ]);
    
    autoTable(doc, {
      head: [['Descrição', 'Tipo', 'Valor', 'Data Documento', 'Data Pagamento']],
      body: tableData,
      startY: 110,
    } as any);
    
    doc.save('relatorio-financeiro.pdf');
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  const saldo = resumo.receitas - resumo.despesas;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Dashboard Financeiro</h3>
      
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3">Filtrar por período</h4>
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Data Início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Data Fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={gerarPDF}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              📄 Gerar PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-sm text-green-600 font-medium">Receitas</div>
          <div className="text-2xl font-bold text-green-700">{formatCurrency(resumo.receitas)}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-sm text-red-600 font-medium">Despesas</div>
          <div className="text-2xl font-bold text-red-700">{formatCurrency(resumo.despesas)}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Investimentos</div>
          <div className="text-2xl font-bold text-blue-700">{formatCurrency(resumo.investimentos)}</div>
        </div>
        <div className={`p-4 rounded-lg border ${saldo >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className={`text-sm font-medium ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>Saldo</div>
          <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {formatCurrency(saldo)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="font-medium mb-3">Últimos Lançamentos</h4>
        <div className="space-y-2">
          {lancamentos.slice(0, 10).map((lancamento) => (
            <div key={lancamento.id_lancamento} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <div className="font-medium">{lancamento.descricao}</div>
                <div className="text-sm text-gray-500">{lancamento.data_documento || 'Sem data'}</div>
              </div>
              <div className={`font-medium ${lancamento.id_tipo_lancamento === 'RECEITA' ? 'text-green-600' : lancamento.id_tipo_lancamento === 'DESPESA' ? 'text-red-600' : 'text-blue-600'}`}>
                {lancamento.id_tipo_lancamento === 'RECEITA' ? '+' : lancamento.id_tipo_lancamento === 'DESPESA' ? '-' : ''}{formatCurrency(lancamento.valor_total)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
