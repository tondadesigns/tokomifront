"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;               
  name: string;
  price: number;
  image?: string;
  size?: string;
  color?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: number;
};

const CartCtx = createContext<CartState | null>(null);
export const useCart = () => useContext(CartCtx)!;

const STORAGE_KEY = "tokomi_cart_items";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const i = prev.findIndex(p => p.id === item.id && p.size === item.size && p.color === item.color);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + item.qty };
        return copy;
      }
      return [...prev, item];
    });
  };

  const updateQty = (id: string, qty: number) =>
    setItems(prev => prev.map(p => (p.id === id ? { ...p, qty } : p)));

  const removeItem = (id: string) =>
    setItems(prev => prev.filter(p => p.id !== id));

  const clear = () => setItems([]);

  const total = items.reduce((s, it) => s + it.price * it.qty, 0);

  return (
    <CartCtx.Provider value={{ items, addItem, updateQty, removeItem, clear, total }}>
      {children}
    </CartCtx.Provider>
  );
}
