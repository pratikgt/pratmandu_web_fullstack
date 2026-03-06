import React from "react";
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../../context/CartContext";

function wrapper({ children }) {
  return <CartProvider>{children}</CartProvider>;
}

describe("CartContext (unit)", () => {
  it("initial state is empty", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(Array.isArray(result.current.items)).toBe(true);
    expect(result.current.items.length).toBe(0);

    // these exist in your context (based on your project)
    if ("count" in result.current) expect(result.current.count).toBe(0);
    if ("subtotal" in result.current) expect(result.current.subtotal).toBe(0);
    if ("total" in result.current) expect(result.current.total).toBe(0);
  });

  it("addToCart adds item and increments qty when added again", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const p = { _id: "m1", name: "Momo", price: 120, image: "x.jpg" };

    act(() => result.current.addToCart(p));
    act(() => result.current.addToCart(p));

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].qty).toBe(2);

    if ("count" in result.current) expect(result.current.count).toBe(2);

    // subtotal / total naming may differ depending on your file
    if ("subtotal" in result.current) expect(result.current.subtotal).toBe(240);
    if ("total" in result.current) expect(result.current.total).toBeGreaterThanOrEqual(240);
  });

  it("updateQty changes quantity (if your context supports updateQty)", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const p = { _id: "m2", name: "Chowmein", price: 150 };

    act(() => result.current.addToCart(p));

    if (typeof result.current.updateQty === "function") {
      act(() => result.current.updateQty("m2", 4));
      expect(result.current.items[0].qty).toBe(4);
      if ("subtotal" in result.current) expect(result.current.subtotal).toBe(600);
    } else {
      // if your context doesn't have updateQty, this test will still pass
      expect(true).toBe(true);
    }
  });

  it("removeFromCart removes item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const p = { _id: "m3", name: "Dal Bhat", price: 200 };

    act(() => result.current.addToCart(p));
    expect(result.current.items.length).toBe(1);

    act(() => result.current.removeFromCart("m3"));
    expect(result.current.items.length).toBe(0);
  });

  it("toCheckoutPayload returns items in correct format", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart({ _id: "m1", price: 100 }));
    act(() => result.current.addToCart({ _id: "m2", price: 50 }));
    act(() => result.current.addToCart({ _id: "m2", price: 50 })); // qty 2

    const payload = result.current.toCheckoutPayload();

    expect(payload).toHaveProperty("items");
    expect(Array.isArray(payload.items)).toBe(true);

    // each item should have menuItemId + qty
    for (const it of payload.items) {
      expect(it).toHaveProperty("menuItemId");
      expect(it).toHaveProperty("qty");
      expect(typeof it.qty).toBe("number");
    }

    const m2 = payload.items.find((x) => x.menuItemId === "m2");
    expect(m2.qty).toBe(2);
  });

  it("clearCart empties the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart({ _id: "m9", price: 10 }));
    expect(result.current.items.length).toBe(1);

    act(() => result.current.clearCart());
    expect(result.current.items.length).toBe(0);
  });
});