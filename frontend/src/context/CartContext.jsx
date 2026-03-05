import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

function getId(p) {
  return p?._id || p?.id;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (product) => {
    const pid = getId(product);
    if (!pid) return;

    setItems((prev) => {
      const found = prev.find((x) => getId(x) === pid);
      if (found) {
        return prev.map((x) =>
          getId(x) === pid ? { ...x, qty: (x.qty || 1) + 1 } : x
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((x) => getId(x) !== id));
  };

  const updateQty = (id, qty) => {
    const q = Number(qty);
    if (!q || q < 1) return;
    setItems((prev) =>
      prev.map((x) => (getId(x) === id ? { ...x, qty: q } : x))
    );
  };

  const clearCart = () => setItems([]);

  const total = useMemo(() => {
    return items.reduce(
      (sum, x) => sum + (Number(x.price) || 0) * (Number(x.qty) || 1),
      0
    );
  }, [items]);

  const count = useMemo(() => {
    return items.reduce((sum, x) => sum + (Number(x.qty) || 1), 0);
  }, [items]);

  const toCheckoutPayload = () => {
    return {
      items: items.map((x) => ({
        menuItemId: x._id || x.id,
        qty: Number(x.qty || 1),
      })),
    };
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    total,
    count,
    toCheckoutPayload,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}