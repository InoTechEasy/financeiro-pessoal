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
  const [filtroTipoLancamento, setFiltroTipoLancamento] = useState<string>('');
  const [ordenacao, setOrdenacao] = useState<{ campo: string; direcao: 'asc' | 'desc' }>({ campo: 'data_documento', direcao: 'desc' });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const itensPorPagina = 10;

  const handleOrdenacao = (campo: string) => {
    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
    setPaginaAtual(1);
  };

  const ordenarLancamentos = (lancamentos: any[]) => {
    return [...lancamentos].sort((a, b) => {
      let valorA, valorB;
      
      switch (ordenacao.campo) {
        case 'descricao':
          valorA = a.descricao.toLowerCase();
          valorB = b.descricao.toLowerCase();
          break;
        case 'data_vencimento':
          valorA = a.data_vencimento ? new Date(a.data_vencimento).getTime() : 0;
          valorB = b.data_vencimento ? new Date(b.data_vencimento).getTime() : 0;
          break;
        case 'data_pagamento':
          valorA = a.data_pagamento ? new Date(a.data_pagamento).getTime() : 0;
          valorB = b.data_pagamento ? new Date(b.data_pagamento).getTime() : 0;
          break;
        case 'valor_total':
          valorA = a.valor_total;
          valorB = b.valor_total;
          break;
        case 'status':
          const hoje = new Date();
          const statusA = a.data_pagamento ? 'Pago' : (a.data_vencimento && new Date(a.data_vencimento) < hoje ? 'Em atraso' : 'Em aberto');
          const statusB = b.data_pagamento ? 'Pago' : (b.data_vencimento && new Date(b.data_vencimento) < hoje ? 'Em atraso' : 'Em aberto');
          valorA = statusA;
          valorB = statusB;
          break;
        default:
          valorA = a.data_documento ? new Date(a.data_documento).getTime() : 0;
          valorB = b.data_documento ? new Date(b.data_documento).getTime() : 0;
      }
      
      if (valorA < valorB) return ordenacao.direcao === 'asc' ? -1 : 1;
      if (valorA > valorB) return ordenacao.direcao === 'asc' ? 1 : -1;
      return 0;
    });
  };

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
    
    // Filtro por tipo de lançamento
    if (filtroTipoLancamento && lancamento.id_tipo_lancamento !== filtroTipoLancamento) {
      return false;
    }
    
    return true;
  });

  const lancamentosOrdenados = ordenarLancamentos(lancamentosFiltrados);
  const totalPaginasCalculado = Math.ceil(lancamentosOrdenados.length / itensPorPagina);
  setTotalPaginas(totalPaginasCalculado);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const lancamentosPaginados = lancamentosOrdenados.slice(indiceInicio, indiceFim);

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
          <select
            value={filtroTipoLancamento}
            onChange={(e) => setFiltroTipoLancamento(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Todos os tipos</option>
            {tiposLancamentos.map((tipo) => (
              <option key={tipo.id_tipo_lancamento} value={tipo.id_tipo_lancamento}>
                {tipo.nome}
              </option>
            ))}
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Tipo de Lançamento
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
              onClick={() => handleOrdenacao('descricao')}
            >
              Descrição {ordenacao.campo === 'descricao' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
              onClick={() => handleOrdenacao('data_vencimento')}
            >
              Data Vencimento {ordenacao.campo === 'data_vencimento' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
              onClick={() => handleOrdenacao('data_pagamento')}
            >
              Data Pagamento {ordenacao.campo === 'data_pagamento' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
              onClick={() => handleOrdenacao('status')}
            >
              Status {ordenacao.campo === 'status' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
              onClick={() => handleOrdenacao('valor_total')}
            >
              Valor {ordenacao.campo === 'valor_total' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lancamentosPaginados.map((lancamento) => {
            const status = calcularStatus(lancamento);
            const receitaId = tiposLancamentos.find(t => t.nome === 'RECEITA' || t.nome === 'Receita')?.id_tipo_lancamento;
            const despesaId = tiposLancamentos.find(t => t.nome === 'DESPESA' || t.nome === 'Despesa')?.id_tipo_lancamento;
            const tipoLancamento = tiposLancamentos.find(t => t.id_tipo_lancamento === lancamento.id_tipo_lancamento);
            
            return (
              <tr key={lancamento.id_lancamento} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tipoLancamento?.nome || '-'}
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
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Página {paginaAtual} de {totalPaginas}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPaginaAtual(paginaAtual - 1)}
              disabled={paginaAtual === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                <button
                  key={pagina}
                  onClick={() => setPaginaAtual(pagina)}
                  className={`px-3 py-1 border rounded-md text-sm ${
                    pagina === paginaAtual
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pagina}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPaginaAtual(paginaAtual + 1)}
              disabled={paginaAtual === totalPaginas}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
