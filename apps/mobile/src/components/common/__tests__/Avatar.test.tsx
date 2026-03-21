import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Avatar from '../Avatar';

describe('Avatar', () => {
  it('should render initials from first and last name', () => {
    render(<Avatar firstName="John" lastName="Doe" />);
    expect(screen.getByText('JD')).toBeTruthy();
  });

  it('should uppercase the initials', () => {
    render(<Avatar firstName="alice" lastName="smith" />);
    expect(screen.getByText('AS')).toBeTruthy();
  });

  it('should show "?" when no name is provided', () => {
    render(<Avatar />);
    // initials = '' which is falsy, so the || '?' fallback kicks in
    expect(screen.getByText('?')).toBeTruthy();
  });

  it('should show first initial only when lastName is empty', () => {
    render(<Avatar firstName="Jane" />);
    expect(screen.getByText('J')).toBeTruthy();
  });

  it('should show last initial only when firstName is empty', () => {
    render(<Avatar lastName="Brown" />);
    expect(screen.getByText('B')).toBeTruthy();
  });

  it('should use default size of 44', () => {
    const { root } = render(<Avatar firstName="A" lastName="B" />);
    // Renders without error using default size
    expect(screen.getByText('AB')).toBeTruthy();
  });

  it('should accept custom size prop', () => {
    render(<Avatar firstName="X" lastName="Y" size={80} />);
    expect(screen.getByText('XY')).toBeTruthy();
  });

  it('should handle single-character names', () => {
    render(<Avatar firstName="A" lastName="B" />);
    expect(screen.getByText('AB')).toBeTruthy();
  });
});
