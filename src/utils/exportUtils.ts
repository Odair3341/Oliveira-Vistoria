import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      // Handle strings with commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data: any[], title: string, columns: string[]) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Configurações ABNT (aproximadas para PDF)
  // Margens: Superior/Esquerda 3cm, Inferior/Direita 2cm
  
  const margins = { top: 20, right: 20, bottom: 20, left: 20 };
  
  // Cabeçalho
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('VISTORIA OLIVEIRA', margins.left, 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema Integrado de Gestão de Frotas e Vistorias', margins.left, 20);
  
  // Título do Relatório
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), doc.internal.pageSize.width / 2, 30, { align: 'center' });
  
  // Data de Geração
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const today = new Date().toLocaleDateString('pt-BR');
  const time = new Date().toLocaleTimeString('pt-BR');
  doc.text(`Gerado em: ${today} às ${time}`, margins.left, 35);

  // Preparar dados para a tabela
  const tableBody = data.map(row => columns.map(col => {
    const val = row[col];
    // Formatar valores monetários se necessário
    if (typeof val === 'number' && (
      col.toLowerCase().includes('valor') || 
      col.toLowerCase().includes('total') || 
      col.toLowerCase().includes('custo') ||
      col.toLowerCase().includes('pedagio') ||
      col.toLowerCase().includes('taxa')
    )) {
      return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
    return val;
  }));

  // Gerar Tabela
  autoTable(doc, {
    head: [columns.map(c => c.toUpperCase())],
    body: tableBody,
    startY: 40,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 9, // Fonte menor para caber na página
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185], // Cor azul padrão
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 9
    },
    columnStyles: {
         0: { cellWidth: 'auto' }, // Placa
         1: { cellWidth: 'auto' }, // Modelo
         2: { cellWidth: 'auto' }, // Filial
         3: { cellWidth: 'auto' }, // Data
         4: { cellWidth: 'auto' }, // Rota
         5: { cellWidth: 'auto' }, // KM Desloc
         // Ajustar larguras se necessário
     },
    margin: margins,
    didDrawPage: (data) => {
      // Rodapé com paginação
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.text(
        'Página ' + pageCount,
        doc.internal.pageSize.width - margins.right,
        doc.internal.pageSize.height - 10,
        { align: 'right' }
      );
    }
  });

  // Calcular totais
   let totalFaturado = 0;
   
   // Identificar coluna de placa para contagem de veículos únicos
   const sampleRow = data[0] || {};
   const placaKey = Object.keys(sampleRow).find(k => k.toLowerCase() === 'placa');
   let uniqueVehicles = 0;

   if (placaKey) {
      uniqueVehicles = new Set(data.map(row => row[placaKey]).filter(Boolean)).size;
   }

   data.forEach(row => {
     // Se houver uma coluna de total explícita, usa ela
     const totalKey = columns.find(c => c.toLowerCase() === 'total' || c.toLowerCase() === 'valor_total');
     
     if (totalKey && typeof row[totalKey] === 'number') {
        totalFaturado += row[totalKey];
     } else {
         // Fallback: soma colunas de valor se não houver total explícito (mas evita somar duplicado se total existir)
          columns.forEach(col => {
             const val = row[col];
             if (typeof val === 'number' && (
               col.toLowerCase().includes('valor') || 
               col.toLowerCase().includes('custo') ||
               col.toLowerCase().includes('pedagio') ||
               col.toLowerCase().includes('taxa')
             )) {
                totalFaturado += val;
             }
          });
     }
   });
 
   const finalY = (doc as any).lastAutoTable.finalY + 15;
   
   // Verificar se cabe na página atual
   if (finalY > doc.internal.pageSize.height - 40) {
     doc.addPage();
     (doc as any).lastAutoTable.finalY = 20; // Reset Y for new page
   }
 
   doc.setFont('helvetica', 'bold');
   doc.setFontSize(11);
   doc.text('RESUMO:', margins.left, finalY > doc.internal.pageSize.height - 40 ? 20 : finalY);
   
   const startY = finalY > doc.internal.pageSize.height - 40 ? 27 : finalY + 7;
   
   doc.setFont('helvetica', 'normal');
   doc.text(`Total de Registros: ${data.length}`, margins.left, startY);
   
   if (uniqueVehicles > 0 && uniqueVehicles !== data.length) {
      doc.text(`Veículos Únicos: ${uniqueVehicles}`, margins.left + 50, startY);
   }
   
   if (totalFaturado > 0) {
      doc.text(`Valor Total Faturado: R$ ${totalFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, margins.left, startY + 7);
   }

  doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
};
