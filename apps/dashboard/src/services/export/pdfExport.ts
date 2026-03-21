import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PdfColumn {
  header: string;
  dataKey: string;
}

export function exportToPDF(
  title: string,
  columns: PdfColumn[],
  data: Record<string, unknown>[],
  filename: string,
): void {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(128);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    startY: 36,
    head: [columns.map((c) => c.header)],
    body: data.map((row) => columns.map((c) => String(row[c.dataKey] ?? ''))),
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  doc.save(`${filename}.pdf`);
}
