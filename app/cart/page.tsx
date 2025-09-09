"use client";
import React from "react";
import { useCart } from "@/app/context";

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCart();
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-medium mb-4">PANIER</h1>
      <div className="space-y-4">
        {items.map(it => (
          <div key={it.id} className="flex gap-3 border p-3">
            <div className="w-20 h-20 bg-gray-100" style={{ backgroundImage: `url(${it.image || ""})`, backgroundSize: "cover" }} />
            <div className="flex-1">
              <div className="text-sm">{it.name.toUpperCase()}</div>
              <div className="text-xs text-gray-600">TAILLE {it.size ?? ""} – {it.color ?? ""}</div>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => updateQty(it.id, Math.max(1, it.qty - 1))} className="border px-2">−</button>
                <span>{it.qty}</span>
                <button onClick={() => updateQty(it.id, it.qty + 1)} className="border px-2">+</button>
              </div>
              <div className="mt-2">€{(it.price * it.qty).toFixed(2)}</div>
            </div>
            <button onClick={() => removeItem(it.id)} className="text-xs underline">Supprimer</button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right text-lg">Total : €{total.toFixed(2)}</div>
    </div>
  );
}

