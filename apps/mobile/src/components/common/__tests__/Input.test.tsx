import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Input from '../Input';

describe('Input', () => {
  it('should render with a label', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('should not render label when not provided', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.queryByText('Email')).toBeNull();
  });

  it('should render with a placeholder', () => {
    render(<Input placeholder="Enter email" />);
    expect(screen.getByPlaceholderText('Enter email')).toBeTruthy();
  });

  it('should display error message when error prop is set', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeTruthy();
  });

  it('should not display error message when error is not set', () => {
    render(<Input label="Name" />);
    expect(screen.queryByText('This field is required')).toBeNull();
  });

  it('should call onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    render(<Input placeholder="Type" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByPlaceholderText('Type'), 'hello');
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  it('should display the current value', () => {
    render(<Input value="test@email.com" placeholder="Email" />);
    expect(screen.getByDisplayValue('test@email.com')).toBeTruthy();
  });

  it('should call onFocus and onBlur callbacks', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    render(<Input placeholder="Focus test" onFocus={onFocus} onBlur={onBlur} />);
    const input = screen.getByPlaceholderText('Focus test');

    fireEvent(input, 'focus');
    expect(onFocus).toHaveBeenCalledTimes(1);

    fireEvent(input, 'blur');
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('should render both label and error together', () => {
    render(<Input label="Password" error="Too short" />);
    expect(screen.getByText('Password')).toBeTruthy();
    expect(screen.getByText('Too short')).toBeTruthy();
  });
});
