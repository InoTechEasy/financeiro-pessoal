import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { lancamentosService } from '../services/lancamentosService';
import { tiposLancamentosService } from '../services/tiposLancamentosService';
import { bancosService } from '../services/bancosService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getCorPorTipo, getIconePorTipo } from '../utils/helpers';

export const Dashboard: React.FC = () => {
  const [resumo, setResumo] = useState({ receitas: 0, despesas: 0, investimentos: 0, saldoInicial: 0 });
  const [ultimosLancamentos, setUltimosLancamentos] = useState<any[]>([]);
  const [tiposLancamentos, setTiposLancamentos] = useState<any[]>([]);
  const [bancos, setBancos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroData, setFiltroData] = useState<'vencimento' | 'pagamento'>('vencimento'); // vencimento = Previsto, pagamento = Realizado
  const [filtroPeriodo, setFiltroPeriodo] = useState<'7' | '15' | '30' | 'personalizado'>('30'); // período em dias ou personalizado
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [filtroBanco, setFiltroBanco] = useState<string>(''); // filtro por banco
  const [filtroStatus, setFiltroStatus] = useState<string>(''); // filtro por status
  const [filtroTexto, setFiltroTexto] = useState<string>(''); // filtro por texto na tabela

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Carregar tipos de lançamentos e bancos
        const [tipos, bcos] = await Promise.all([
          tiposLancamentosService.listar(),
          bancosService.listar(),
        ]);
        setTiposLancamentos(tipos);
        setBancos(bcos);
        
        // Calcular saldo inicial total dos bancos
        const saldoInicialTotal = bcos.reduce((acc: number, banco: any) => acc + (banco.saldo_inicial || 0), 0);

        // Calcular datas com base no período selecionado
        const hoje = new Date();
        let primeiroDia: Date;
        
        if (filtroPeriodo === 'personalizado') {
          primeiroDia = dataInicio ? new Date(dataInicio) : new Date();
        } else {
          const dias = parseInt(filtroPeriodo);
          primeiroDia = new Date();
          primeiroDia.setDate(hoje.getDate() - dias);
        }

        const dataInicioFormatada = primeiroDia.toISOString().split('T')[0];
        const dataFimFormatada = filtroPeriodo === 'personalizado' && dataFim 
          ? new Date(dataFim).toISOString().split('T')[0]
          : hoje.toISOString().split('T')[0];

        const dadosResumo = await lancamentosService.obterResumo(
          dataInicioFormatada,
          dataFimFormatada,
          tipos,
          filtroData
        );
        setResumo({ ...dadosResumo, saldoInicial: saldoInicialTotal });

        // Carregar últimos lançamentos filtrados por data
        const lancamentos = await lancamentosService.listar();
        
        // Encontrar ID do tipo transferência
        const transferenciaId = tipos.find(t => t.nome === 'TRANSFERENCIA' || t.nome === 'Transferência' || t.nome === 'Transferência entre contas')?.id_tipo_lancamento;
        
        // Filtrar lançamentos por período (data_documento) e excluir transferências
        const lancamentosFiltrados = lancamentos.filter((l: any) => {
          const dataDocumento = l.data_documento ? new Date(l.data_documento) : null;
          if (!dataDocumento) return false;
          
          // Excluir transferências (por tipo ou por campo eh_transferencia)
          if (l.id_tipo_lancamento === transferenciaId || l.eh_transferencia) {
            return false;
          }
          
          // Se filtro for pagamento, só mostra se tiver data_pagamento
          if (filtroData === 'pagamento' && !l.data_pagamento) {
            return false;
          }
          
          // Filtro por banco
          if (filtroBanco && l.id_banco !== filtroBanco) {
            return false;
          }
          
          // Filtro por status
          const hoje = new Date();
          const dataVencimento = l.data_vencimento ? new Date(l.data_vencimento) : null;
          const dataPagamento = l.data_pagamento ? new Date(l.data_pagamento) : null;
          
          let status = 'Em aberto';
          if (dataPagamento) {
            status = 'Pago';
          } else if (dataVencimento && dataVencimento < hoje) {
            status = 'Em atraso';
          }
          
          if (filtroStatus && status !== filtroStatus) {
            return false;
          }
          
          // Filtro por texto (descrição)
          if (filtroTexto && !l.descricao.toLowerCase().includes(filtroTexto.toLowerCase())) {
            return false;
          }
          
          const dataFimCalculada = filtroPeriodo === 'personalizado' && dataFim 
            ? new Date(dataFim)
            : hoje;
          
          return dataDocumento >= primeiroDia && dataDocumento <= dataFimCalculada;
        });
        
        setUltimosLancamentos(lancamentosFiltrados.slice(0, 10));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [filtroData, filtroPeriodo, dataInicio, dataFim, filtroBanco, filtroStatus, filtroTexto]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const saldo = resumo.saldoInicial + resumo.receitas - resumo.despesas - resumo.investimentos;

  const handleExportarPDF = () => {
    // Encontrar IDs dos tipos de lançamento
    const receitaId = tiposLancamentos.find(t => t.nome === 'RECEITA' || t.nome === 'Receita')?.id_tipo_lancamento;
    const despesaId = tiposLancamentos.find(t => t.nome === 'DESPESA' || t.nome === 'Despesa')?.id_tipo_lancamento;
    const investimentoId = tiposLancamentos.find(t => t.nome === 'INVESTIMENTO' || t.nome === 'Investimento')?.id_tipo_lancamento;

    // Separar lançamentos por tipo
    const receitas = ultimosLancamentos.filter(l => l.id_tipo_lancamento === receitaId);
    const despesas = ultimosLancamentos.filter(l => l.id_tipo_lancamento === despesaId);
    const investimentos = ultimosLancamentos.filter(l => l.id_tipo_lancamento === investimentoId);

    // Calcular totais por tipo
    const totalReceitas = receitas.reduce((acc, l) => acc + l.valor_total, 0);
    const totalDespesas = despesas.reduce((acc, l) => acc + l.valor_total, 0);
    const totalInvestimentos = investimentos.reduce((acc, l) => acc + l.valor_total, 0);

    // Calcular totais de transferências
    const transferenciaId = tiposLancamentos.find(t => t.nome === 'TRANSFERENCIA' || t.nome === 'Transferência' || t.nome === 'Transferência entre contas')?.id_tipo_lancamento;
    const transferencias = ultimosLancamentos.filter(l => l.id_tipo_lancamento === transferenciaId || l.eh_transferencia);
    const totalTransferencias = transferencias.reduce((acc, l) => acc + l.valor_total, 0);

    // Calcular datas do período
    const hoje = new Date();
    let primeiroDia: Date;
    
    if (filtroPeriodo === 'personalizado') {
      primeiroDia = dataInicio ? new Date(dataInicio) : new Date();
    } else {
      const dias = parseInt(filtroPeriodo);
      primeiroDia = new Date();
      primeiroDia.setDate(hoje.getDate() - dias);
    }

    const dataFimCalculada = filtroPeriodo === 'personalizado' && dataFim 
      ? new Date(dataFim)
      : hoje;

    const saldo = resumo.saldoInicial + resumo.receitas - resumo.despesas - resumo.investimentos;

    // Criar documento PDF
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('Relatório de Lançamentos', 105, 15, { align: 'center' });
    
    // Subtítulo
    doc.setFontSize(12);
    doc.text(`Filtro: ${filtroData === 'vencimento' ? 'Previsto (Data Vencimento)' : 'Realizado (Data Pagamento)'}`, 105, 22, { align: 'center' });
    
    // Período
    doc.setFontSize(10);
    doc.text(`Período: ${formatDate(primeiroDia.toISOString().split('T')[0])} a ${formatDate(dataFimCalculada.toISOString().split('T')[0])}`, 105, 28, { align: 'center' });

    // Resumo geral
    doc.setFontSize(12);
    doc.text('Resumo Geral', 14, 40);
    
    const resumoData = [
      ['Saldo Inicial', formatCurrency(resumo.saldoInicial)],
      ['Total Receitas', formatCurrency(resumo.receitas)],
      ['Total Despesas', formatCurrency(resumo.despesas)],
      ['Total Investimentos', formatCurrency(resumo.investimentos)],
      ['Total Transferências', formatCurrency(totalTransferencias)],
      ['Saldo Final', formatCurrency(saldo)],
    ];

    autoTable(doc, {
      startY: 45,
      head: [['Descrição', 'Valor']],
      body: resumoData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 60, halign: 'right' },
      },
    });

    // Função para adicionar tabela por tipo
    const adicionarTabela = (titulo: string, lancamentos: any[], total: number, cor: [number, number, number], startY: number) => {
      if (lancamentos.length === 0) return startY;

      const tableData = lancamentos.map((l) => [
        l.descricao,
        formatDate(l.data_vencimento || '-'),
        formatDate(l.data_pagamento || '-'),
        formatCurrency(l.valor_total),
      ]);

      autoTable(doc, {
        startY: startY,
        head: [['Descrição', 'Data Vencimento', 'Data Pagamento', 'Valor']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: cor },
        foot: [['Total', '', '', formatCurrency(total)]],
        footStyles: { fillColor: cor, fontStyle: 'bold' },
        columnStyles: {
          3: { halign: 'right' },
        },
      });

      return (doc as any).lastAutoTable.finalY + 15;
    };

    // Adicionar tabelas
    let startY = (doc as any).lastAutoTable.finalY + 15;
    startY = adicionarTabela('Receitas', receitas, totalReceitas, [34, 197, 94], startY);
    startY = adicionarTabela('Despesas', despesas, totalDespesas, [239, 68, 68], startY);
    adicionarTabela('Investimentos', investimentos, totalInvestimentos, [59, 130, 246], startY);

    // Salvar PDF
    doc.save(`relatorio-lancamentos-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <button
          onClick={handleExportarPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Exportar PDF
        </button>
      </div>

      {/* Filtro Previsto/Realizado */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
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

      {/* Filtro de Período */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Período:</span>
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

      {/* Filtros de Banco e Status */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Filtros adicionais:</span>
        <select
          value={filtroBanco}
          onChange={(e) => setFiltroBanco(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">Todos os bancos</option>
          {bancos.map((banco) => (
            <option key={banco.id_banco} value={banco.id_banco}>
              {banco.nome}
            </option>
          ))}
        </select>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">Todos os status</option>
          <option value="Pago">Pago</option>
          <option value="Em aberto">Em aberto</option>
          <option value="Em atraso">Em atraso</option>
        </select>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receitas</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(resumo.receitas)}</p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Despesas</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(resumo.despesas)}</p>
            </div>
            <span className="text-3xl">💸</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Investimentos</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(resumo.investimentos)}</p>
            </div>
            <span className="text-3xl">📈</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo</p>
              <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(saldo)}
              </p>
            </div>
            <span className="text-3xl">💳</span>
          </div>
        </div>
      </div>

      {/* Últimos Lançamentos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Últimos Lançamentos</h3>
          <input
            type="text"
            placeholder="Filtrar por descrição..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64"
          />
        </div>
        
        {ultimosLancamentos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum lançamento encontrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ultimosLancamentos.map((lancamento) => {
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

                  const receitaId = tiposLancamentos.find(t => t.nome === 'RECEITA' || t.nome === 'Receita')?.id_tipo_lancamento;
                  const despesaId = tiposLancamentos.find(t => t.nome === 'DESPESA' || t.nome === 'Despesa')?.id_tipo_lancamento;

                  return (
                    <tr key={lancamento.id_lancamento} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-2xl">{getIconePorTipo(lancamento.id_tipo_lancamento)}</span>
                      </td>
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
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                        lancamento.id_tipo_lancamento === receitaId ? 'text-green-600' : lancamento.id_tipo_lancamento === despesaId ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {formatCurrency(lancamento.valor_total)}
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
