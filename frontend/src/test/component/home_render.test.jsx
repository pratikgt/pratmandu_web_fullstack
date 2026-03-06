import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../../pages/Home';
import { CartProvider } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

describe('Home Page Render', () => {
  it('should render home page', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Home />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
