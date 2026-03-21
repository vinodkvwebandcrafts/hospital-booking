import { useCallback } from 'react';
import { exportToCSV } from '@/services/export/csvExport';
import { exportToPDF, type PdfColumn } from '@/services/export/pdfExport';

export function useExport() {
  const downloadCSV = useCallback(
    <T extends Record<string, unknown>>(
      data: T[],
      filename: string,
      columns?: { key: keyof T; header: string }[],
    ) => {
      exportToCSV(data, filename, columns);
    },
    [],
  );

  const downloadPDF = useCallback(
    (
      title: string,
      columns: PdfColumn[],
      data: Record<string, unknown>[],
      filename: string,
    ) => {
      exportToPDF(title, columns, data, filename);
    },
    [],
  );

  return { downloadCSV, downloadPDF };
}
