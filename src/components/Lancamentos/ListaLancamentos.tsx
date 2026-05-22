import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useLancamentos } from '../../hooks/useLancamentos';
import { tiposLancamentosService } from '../../services/tiposLancamentosService';
import { bancosService } from '../../services/bancosService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getIconePorTipo } from '../../utils/helpers';

export const ListaLancamentos: React.FC = () => {
  const { lancamentos, loading, deletar } = useLancamentos();
  const [tiposLancamentos, setTiposLancamentos] = useState<any[]>([]);
  const [bancos, setBancos] = useState<any[]>([]);
  const [filtroBanco, setFiltroBanco] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [filtroTexto, setFiltroTexto] = useState<string>('');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [tipos, bcos] = await Promise.all([
          tiposLancamentosService.listar(),
          bancosService.listar(),
        ]);
        setTiposLancamentos(tipos);
        setBancos(bcos);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    carregarDados();
  }, []);

  const calcularStatus = (lancamento: any) => {
    const hoje = new Date();
    const dataVencimento = lancamento.data_vencimento ? new Date(lancamento.data_vencimento) : null;
    const dataPagamento = lancamento.data_pagamento ? new Date(lancamento.data_pagamento) : null;
    
    if (dataPagamento) {
      return { texto: 'Pago', cor: 'text-green-600' };
    } else if (dataVencimento && dataVencimento < hoje) {
      return { texto: 'Em atraso', cor: 'text-red-600' };
    } else {
      return { texto: 'Em aberto', cor: 'text-yellow-600' };
    }
  };

  const getNomeTipo = (idTipo: string) => {
    const tipo = tiposLancamentos.find(t => t.id_tipo_lancamento === idTipo);
    return tipo?.nome || '-';
  };

  const lancamentosFiltrados = lancamentos.filter((lancamento) => {
    // Filtro por banco
    if (filtroBanco && lancamento.id_banco !== filtroBanco) {
      return false;
    }
    
    // Filtro por status
    if (filtroStatus) {
      const status = calcularStatus(lancamento);
      if (status.texto !== filtroStatus) {
        return false;
      }
    }
    
    // Filtro por texto (descrição)
    if (filtroTexto && !lancamento.descricao.toLowerCase().includes(filtroTexto.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleExportarPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('Lista de Lançamentos', 105, 15, { align: 'center' });
    
    // Data
    doc.setFontSize(10);
    doc.text(`Data: ${formatDate(new Date().toISOString().split('T')[0])}`, 105, 22, { align: 'center' });

    // Preparar dados da tabela
    const tableData = lancamentos.map((l) => [
      l.descricao,
      getNomeTipo(l.id_tipo_lancamento),
      formatDate(l.data_documento || '-'),
      formatDate(l.data_vencimento || '-'),
      formatDate(l.data_pagamento || '-'),
      formatCurrency(l.valor_total),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['Descrição', 'Tipo', 'Data Documento', 'Data Vencimento', 'Data Pagamento', 'Valor']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      columnStyles: {
        5: { halign: 'right' },
      },
    });

    // Calcular totais por tipo
    const receitaId = tiposLancamentos.find(t => t.nome === 'RECEITA' || t.nome === 'Receita')?.id_tipo_lancamento;
    const despesaId = tiposLancamentos.find(t => t.nome === 'DESPESA' || t.nome === 'Despesa')?.id_tipo_lancamento;
    const investimentoId = tiposLancamentos.find(t => t.nome === 'INVESTIMENTO' || t.nome === 'Investimento')?.id_tipo_lancamento;
    const transferenciaId = tiposLancamentos.find(t => t.nome === 'TRANSFERENCIA' || t.nome === 'Transferência' || t.nome === 'Transferência entre contas')?.id_tipo_lancamento;

    const totalReceitas = lancamentos.filter(l => l.id_tipo_lancamento === receitaId).reduce((acc, l) => acc + l.valor_total, 0);
    const totalDespesas = lancamentos.filter(l => l.id_tipo_lancamento === despesaId).reduce((acc, l) => acc + l.valor_total, 0);
    const totalInvestimentos = lancamentos.filter(l => l.id_tipo_lancamento === investimentoId).reduce((acc, l) => acc + l.valor_total, 0);
    const totalTransferencias = lancamentos.filter(l => l.id_tipo_lancamento === transferenciaId || l.eh_transferencia).reduce((acc, l) => acc + l.valor_total, 0);
    
    // Adicionar tabela de totais por tipo
    const totaisData = [
      ['Total Receitas', formatCurrency(totalReceitas)],
      ['Total Despesas', formatCurrency(totalDespesas)],
      ['Total Investimentos', formatCurrency(totalInvestimentos)],
      ['Total Transferências', formatCurrency(totalTransferencias)],
    ];

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Descrição', 'Valor']],
      body: totaisData,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
      columnStyles: {
        1: { halign: 'right' },
      },
    });

    // Salvar PDF
    doc.save(`lista-lancamentos-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
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
          <input
            type="text"
            placeholder="Filtrar por descrição..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64"
          />
        </div>
        <button
          onClick={handleExportarPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Exportar PDF
        </button>
      </div>
      <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Vencimento</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Pagamento</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lancamentosFiltrados.map((lancamento) => {
            const status = calcularStatus(lancamento);
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
                  <span className={status.cor}>{status.texto}</span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                  lancamento.id_tipo_lancamento === receitaId ? 'text-green-600' : 
                  lancamento.id_tipo_lancamento === despesaId ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {formatCurrency(lancamento.valor_total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => deletar(lancamento.id_lancamento)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
};
