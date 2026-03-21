import Papa from 'papaparse';

export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; header: string }[],
): void {
  let csvData: Record<string, unknown>[];

  if (columns) {
    csvData = data.map((row) => {
      const mapped: Record<string, unknown> = {};
      columns.forEach((col) => {
        mapped[col.header] = row[col.key];
      });
      return mapped;
    });
  } else {
    csvData = data;
  }

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
