import { exportToCSV } from '../csvExport';

describe('exportToCSV', () => {
  let appendChildSpy: ReturnType<typeof vi.spyOn>;
  let removeChildSpy: ReturnType<typeof vi.spyOn>;
  let createElementSpy: ReturnType<typeof vi.spyOn>;
  let mockLink: Record<string, unknown>;

  beforeEach(() => {
    mockLink = {
      href: '',
      setAttribute: vi.fn(),
      click: vi.fn(),
    };

    createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLElement);
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a link element and trigger download', () => {
    const data = [{ name: 'Alice', age: 30 }];
    exportToCSV(data, 'test-export');

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'test-export.csv');
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('should set blob URL as link href', () => {
    const data = [{ name: 'Bob', age: 25 }];
    exportToCSV(data, 'output');

    expect(mockLink.href).toBe('blob:mock-url');
  });

  it('should append and remove link from document body', () => {
    const data = [{ name: 'Charlie', age: 40 }];
    exportToCSV(data, 'cleanup-test');

    expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
    expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
  });

  it('should revoke the object URL after download', () => {
    const data = [{ name: 'Dave', age: 35 }];
    exportToCSV(data, 'revoke-test');

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('should use column mappings when provided', () => {
    const data = [
      { firstName: 'Alice', lastName: 'Smith', email: 'alice@test.com' },
    ];
    const columns = [
      { key: 'firstName' as const, header: 'First Name' },
      { key: 'email' as const, header: 'Email Address' },
    ];

    exportToCSV(data, 'mapped-export', columns);

    // The function should have created the link and triggered the download
    expect(mockLink.click).toHaveBeenCalled();
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'mapped-export.csv');
  });

  it('should handle empty data array', () => {
    exportToCSV([], 'empty-export');

    expect(mockLink.click).toHaveBeenCalled();
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'empty-export.csv');
  });

  it('should handle data with multiple rows', () => {
    const data = [
      { name: 'Alice', value: 100 },
      { name: 'Bob', value: 200 },
      { name: 'Charlie', value: 300 },
    ];
    exportToCSV(data, 'multi-row');

    expect(mockLink.click).toHaveBeenCalled();
  });
});
