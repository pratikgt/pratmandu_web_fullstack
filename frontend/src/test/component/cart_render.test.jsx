import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Cart from '../../pages/Cart';
import { CartProvider } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

describe('Cart Page Render', () => {
  it('should render cart page', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Cart />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
