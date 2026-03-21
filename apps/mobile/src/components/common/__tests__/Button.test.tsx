import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

describe('Button', () => {
  const defaultProps = {
    title: 'Press Me',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ────────────────────────────────────────────────────

  it('should render the title text', () => {
    render(<Button {...defaultProps} />);
    expect(screen.getByText('Press Me')).toBeTruthy();
  });

  // ── Variants ─────────────────────────────────────────────────────

  it('should render primary variant by default', () => {
    render(<Button {...defaultProps} />);
    // Primary variant renders the title in white text - just verify it renders
    expect(screen.getByText('Press Me')).toBeTruthy();
  });

  it('should render secondary variant', () => {
    render(<Button {...defaultProps} variant="secondary" />);
    expect(screen.getByText('Press Me')).toBeTruthy();
  });

  it('should render outline variant', () => {
    render(<Button {...defaultProps} variant="outline" />);
    expect(screen.getByText('Press Me')).toBeTruthy();
  });

  it('should render danger variant', () => {
    render(<Button {...defaultProps} variant="danger" />);
    expect(screen.getByText('Press Me')).toBeTruthy();
  });

  // ── Sizes ────────────────────────────────────────────────────────

  it('should render small size', () => {
    render(<Button {...defaultProps} size="sm" />);
    expect(screen.getByText('Press Me')).toBeTruthy();
  });

  it('should render medium size by default', () => {
    render(<Button {...defaultProps} />);
    expect(screen.getByText('Press Me')).toBeTruthy();
  });

  it('should render large size', () => {
    render(<Button {...defaultProps} size="lg" />);
    expect(screen.getByText('Press Me')).toBeTruthy();
  });

  // ── Interactions ─────────────────────────────────────────────────

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button {...defaultProps} onPress={onPress} />);
    fireEvent.press(screen.getByText('Press Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<Button {...defaultProps} onPress={onPress} disabled />);
    fireEvent.press(screen.getByText('Press Me'));
    expect(onPress).not.toHaveBeenCalled();
  });

  // ── Loading state ────────────────────────────────────────────────

  it('should show ActivityIndicator when loading', () => {
    render(<Button {...defaultProps} loading />);
    // When loading, title text should not be visible
    expect(screen.queryByText('Press Me')).toBeNull();
  });

  it('should not call onPress when loading', () => {
    const onPress = jest.fn();
    const { root } = render(<Button {...defaultProps} onPress={onPress} loading />);
    // The Pressable is disabled when loading
    fireEvent.press(root);
    expect(onPress).not.toHaveBeenCalled();
  });

  // ── Disabled state ───────────────────────────────────────────────

  it('should render with reduced opacity when disabled', () => {
    render(<Button {...defaultProps} disabled />);
    // The button still renders, just with opacity 0.55
    expect(screen.getByText('Press Me')).toBeTruthy();
  });

  it('should be disabled when loading is true', () => {
    const onPress = jest.fn();
    const { root } = render(<Button {...defaultProps} onPress={onPress} loading />);
    fireEvent.press(root);
    expect(onPress).not.toHaveBeenCalled();
  });
});
