import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { Button } from '../button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
