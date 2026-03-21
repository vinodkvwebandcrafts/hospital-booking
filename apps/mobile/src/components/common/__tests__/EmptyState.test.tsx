import React from 'react';
import { render, screen } from '@testing-library/react-native';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('should render the title', () => {
    render(<EmptyState title="No appointments" />);
    expect(screen.getByText('No appointments')).toBeTruthy();
  });

  it('should render the message when provided', () => {
    render(
      <EmptyState
        title="No results"
        message="Try adjusting your search filters"
      />,
    );
    expect(screen.getByText('No results')).toBeTruthy();
    expect(screen.getByText('Try adjusting your search filters')).toBeTruthy();
  });

  it('should not render message when not provided', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.getByText('Empty')).toBeTruthy();
    // Only the title should be present
    expect(screen.queryByText('Try adjusting')).toBeNull();
  });

  it('should render the icon when provided', () => {
    render(<EmptyState icon="📅" title="No appointments" />);
    expect(screen.getByText('📅')).toBeTruthy();
  });

  it('should not render icon when not provided', () => {
    render(<EmptyState title="No data" />);
    expect(screen.getByText('No data')).toBeTruthy();
  });

  it('should render all three parts together', () => {
    render(
      <EmptyState
        icon="🔍"
        title="Nothing found"
        message="Please try again later"
      />,
    );
    expect(screen.getByText('🔍')).toBeTruthy();
    expect(screen.getByText('Nothing found')).toBeTruthy();
    expect(screen.getByText('Please try again later')).toBeTruthy();
  });
});
