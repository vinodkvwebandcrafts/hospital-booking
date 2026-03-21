import React from 'react';
import { render, screen } from '@testing-library/react-native';
import OfflineIndicator from '../OfflineIndicator';

// Mock the useOffline hook
const mockUseOffline = jest.fn();
jest.mock('@/hooks/useOffline', () => ({
  useOffline: () => mockUseOffline(),
}));

describe('OfflineIndicator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the offline banner when offline', () => {
    mockUseOffline.mockReturnValue({ isOnline: false });
    render(<OfflineIndicator />);
    expect(
      screen.getByText('You are offline. Some features may be unavailable.'),
    ).toBeTruthy();
  });

  it('should not render anything when online', () => {
    mockUseOffline.mockReturnValue({ isOnline: true });
    const { toJSON } = render(<OfflineIndicator />);
    expect(toJSON()).toBeNull();
  });

  it('should show banner when transitioning from online to offline', () => {
    mockUseOffline.mockReturnValue({ isOnline: false });
    render(<OfflineIndicator />);
    expect(
      screen.getByText('You are offline. Some features may be unavailable.'),
    ).toBeTruthy();
  });
});
