import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import Card from '../Card';

describe('Card', () => {
  it('should render children', () => {
    render(
      <Card>
        <Text>Card Content</Text>
      </Card>,
    );
    expect(screen.getByText('Card Content')).toBeTruthy();
  });

  it('should render multiple children', () => {
    render(
      <Card>
        <Text>First</Text>
        <Text>Second</Text>
      </Card>,
    );
    expect(screen.getByText('First')).toBeTruthy();
    expect(screen.getByText('Second')).toBeTruthy();
  });

  it('should accept custom style prop', () => {
    const { root } = render(
      <Card style={{ marginTop: 10 }}>
        <Text>Styled Card</Text>
      </Card>,
    );
    // The card renders without errors with a custom style
    expect(screen.getByText('Styled Card')).toBeTruthy();
  });
});
