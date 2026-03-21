import { exportToPDF, type PdfColumn } from '../pdfExport';

// Mock jsPDF
const mockSave = vi.fn();
const mockText = vi.fn();
const mockSetFontSize = vi.fn();
const mockSetTextColor = vi.fn();

vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    save: mockSave,
    text: mockText,
    setFontSize: mockSetFontSize,
    setTextColor: mockSetTextColor,
  })),
}));

// Mock autoTable
const mockAutoTable = vi.fn();
vi.mock('jspdf-autotable', () => ({
  default: mockAutoTable,
}));

describe('exportToPDF', () => {
  const columns: PdfColumn[] = [
    { header: 'Name', dataKey: 'name' },
    { header: 'Email', dataKey: 'email' },
  ];

  const data = [
    { name: 'Alice', email: 'alice@test.com' },
    { name: 'Bob', email: 'bob@test.com' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a PDF document and save it with the correct filename', () => {
    exportToPDF('Test Report', columns, data, 'test-report');
    expect(mockSave).toHaveBeenCalledWith('test-report.pdf');
  });

  it('should set the title with font size 18', () => {
    exportToPDF('My Title', columns, data, 'output');
    expect(mockSetFontSize).toHaveBeenCalledWith(18);
    expect(mockText).toHaveBeenCalledWith('My Title', 14, 22);
  });

  it('should set generated date text with font size 10', () => {
    exportToPDF('Report', columns, data, 'output');
    expect(mockSetFontSize).toHaveBeenCalledWith(10);
    expect(mockSetTextColor).toHaveBeenCalledWith(128);
    // The date text call
    expect(mockText).toHaveBeenCalledWith(
      expect.stringContaining('Generated on'),
      14,
      30,
    );
  });

  it('should call autoTable with column headers and data rows', () => {
    exportToPDF('Report', columns, data, 'output');

    expect(mockAutoTable).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        startY: 36,
        head: [['Name', 'Email']],
        body: [
          ['Alice', 'alice@test.com'],
          ['Bob', 'bob@test.com'],
        ],
        theme: 'striped',
      }),
    );
  });

  it('should use striped heading styles with dark background', () => {
    exportToPDF('Report', columns, data, 'output');

    expect(mockAutoTable).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        headStyles: {
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
      }),
    );
  });

  it('should handle empty data array', () => {
    exportToPDF('Empty Report', columns, [], 'empty');

    expect(mockAutoTable).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        body: [],
      }),
    );
    expect(mockSave).toHaveBeenCalledWith('empty.pdf');
  });

  it('should convert undefined values to empty strings in table body', () => {
    const dataWithUndefined = [
      { name: 'Alice', email: undefined },
    ];

    exportToPDF('Report', columns, dataWithUndefined as unknown as Record<string, unknown>[], 'output');

    expect(mockAutoTable).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        body: [['Alice', '']],
      }),
    );
  });
});
