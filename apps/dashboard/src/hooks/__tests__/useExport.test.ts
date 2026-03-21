import { renderHook } from '@testing-library/react';
import { useExport } from '../useExport';

// Mock the export services
const mockExportToCSV = vi.fn();
const mockExportToPDF = vi.fn();

vi.mock('@/services/export/csvExport', () => ({
  exportToCSV: (...args: unknown[]) => mockExportToCSV(...args),
}));

vi.mock('@/services/export/pdfExport', () => ({
  exportToPDF: (...args: unknown[]) => mockExportToPDF(...args),
}));

describe('useExport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return downloadCSV and downloadPDF functions', () => {
    const { result } = renderHook(() => useExport());

    expect(typeof result.current.downloadCSV).toBe('function');
    expect(typeof result.current.downloadPDF).toBe('function');
  });

  describe('downloadCSV', () => {
    it('should call exportToCSV with data and filename', () => {
      const { result } = renderHook(() => useExport());
      const data = [{ name: 'Alice', age: 30 }];

      result.current.downloadCSV(data, 'test-export');

      expect(mockExportToCSV).toHaveBeenCalledWith(data, 'test-export', undefined);
    });

    it('should pass column mappings to exportToCSV', () => {
      const { result } = renderHook(() => useExport());
      const data = [{ firstName: 'Alice', lastName: 'Smith' }];
      const columns = [
        { key: 'firstName' as const, header: 'First Name' },
        { key: 'lastName' as const, header: 'Last Name' },
      ];

      result.current.downloadCSV(data, 'mapped', columns);

      expect(mockExportToCSV).toHaveBeenCalledWith(data, 'mapped', columns);
    });
  });

  describe('downloadPDF', () => {
    it('should call exportToPDF with title, columns, data, and filename', () => {
      const { result } = renderHook(() => useExport());
      const columns = [
        { header: 'Name', dataKey: 'name' },
        { header: 'Email', dataKey: 'email' },
      ];
      const data = [{ name: 'Alice', email: 'alice@test.com' }];

      result.current.downloadPDF('Report', columns, data, 'report');

      expect(mockExportToPDF).toHaveBeenCalledWith('Report', columns, data, 'report');
    });
  });

  describe('memoization', () => {
    it('should return stable function references across re-renders', () => {
      const { result, rerender } = renderHook(() => useExport());
      const firstCSV = result.current.downloadCSV;
      const firstPDF = result.current.downloadPDF;

      rerender();

      expect(result.current.downloadCSV).toBe(firstCSV);
      expect(result.current.downloadPDF).toBe(firstPDF);
    });
  });
});
