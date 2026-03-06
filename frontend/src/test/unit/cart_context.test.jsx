import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartContext, CartProvider } from '../../context/CartContext';
import { render, screen } from '@testing-library/react';

describe('CartContext', () => {
  it('should render cart context', () => {
    render(
      <CartProvider>
        <div>Test Component</div>
      </CartProvider>
    );
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });
});
