"use client";
import React, { useState } from "react";
import { useCart } from "@/app/context";

type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: { code: string; label: string; swatch: string }[];
};

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [qty, setQty] = useState(1);

  const canAdd = !!size && !!color;

  const onAdd = () => {
    if (!canAdd) return;
    addItem({
      id: `${product.id}-${size}-${color}`,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      size,
      color,
      qty,
    });
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Images */}
      <div className="w-full max-w-md mx-auto p-4 space-y-2">
        {product.images.map((src, i) => (
          <img key={i} src={src} alt={`${product.name} ${i + 1}`} className="w-full object-cover" />
        ))}
      </div>

      {/* Infos */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        <div className="flex items-baseline justify-between">
          <h1 className="text-xl font-medium">{product.name}</h1>
          <div className="text-xl">€{product.price}</div>
        </div>

        {/* Couleurs */}
        <div className="space-y-2">
          <div className="text-xs tracking-wide">COULEUR</div>
          <div className="flex gap-3">
            {product.colors.map(c => (
              <button
                key={c.code}
                aria-label={c.label}
                onClick={() => setColor(c.code)}
                className={`w-8 h-8 border ${color === c.code ? "ring-2 ring-black" : ""}`}
                style={{ background: c.swatch }}
              />
            ))}
          </div>
        </div>

        {/* Tailles */}
        <div className="space-y-2">
          <div className="text-xs tracking-wide">TAILLE</div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-3 py-2 border text-sm ${size === s ? "bg-black text-white" : ""}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Quantité */}
        <div className="space-y-2">
          <div className="text-xs tracking-wide">QUANTITÉ</div>
          <div className="inline-flex border">
            <button className="px-3 py-2" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <div className="px-4 py-2 select-none">{qty}</div>
            <button className="px-3 py-2" onClick={() => setQty(q => q + 1)}>+</button>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onAdd}
          disabled={!canAdd}
          className={`w-full py-3 text-white ${canAdd ? "bg-black" : "bg-gray-400 cursor-not-allowed"}`}
        >
          AJOUTER AU PANIER
        </button>
      </div>
    </div>
  );
}
