import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Badge from '../Badge';

describe('Badge', () => {
  it('should render the label text', () => {
    render(<Badge label="Active" />);
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('should render with default variant when none specified', () => {
    render(<Badge label="Default" />);
    expect(screen.getByText('Default')).toBeTruthy();
  });

  it('should render success variant', () => {
    render(<Badge label="Completed" variant="success" />);
    expect(screen.getByText('Completed')).toBeTruthy();
  });

  it('should render warning variant', () => {
    render(<Badge label="Pending" variant="warning" />);
    expect(screen.getByText('Pending')).toBeTruthy();
  });

  it('should render danger variant', () => {
    render(<Badge label="Cancelled" variant="danger" />);
    expect(screen.getByText('Cancelled')).toBeTruthy();
  });

  it('should render info variant', () => {
    render(<Badge label="Scheduled" variant="info" />);
    expect(screen.getByText('Scheduled')).toBeTruthy();
  });

  it('should accept custom style prop', () => {
    render(<Badge label="Styled" style={{ marginLeft: 8 }} />);
    expect(screen.getByText('Styled')).toBeTruthy();
  });
});
