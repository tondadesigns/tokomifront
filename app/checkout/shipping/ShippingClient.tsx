"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Option = { id: string; label: string; price: number };

const OPTIONS: Option[] = [
  { id: "standard", label: "STANDARD 7-10 JOURS", price: 9.9 },
  { id: "express", label: "EXPRESS 3-5 JOURS", price: 14.9 },
  { id: "oneday", label: "EN 1 JOUR", price: 24.9 },
];

export default function ShippingClient() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("");

  // Pré-sélection si l’utilisateur a déjà choisi
  useEffect(() => {
    const prev = localStorage.getItem("tokomi_shipping_option");
    if (prev) {
      // prev est du type "EXPRESS 3-5 JOURS - €14.90"
      // On tente de retrouver l’ID correspondant par le label
      const found = OPTIONS.find(
        (o) => prev.toUpperCase().startsWith(o.label.toUpperCase())
      );
      if (found) setSelected(found.id);
    }
  }, []);

  const goBack = () => router.push("/checkout");

  const onChange = (id: string) => {
    setSelected(id);
    const opt = OPTIONS.find((o) => o.id === id);
    if (!opt) return;
    const value = `${opt.label} - €${opt.price.toFixed(2)}`;
    localStorage.setItem("selectedShipping", value); // (compat)
    localStorage.setItem("tokomi_shipping_option", value);
    localStorage.setItem("tokomi_shipping_price", String(opt.price));
    // Optionnel : si tu veux afficher une "date" au checkout
    // localStorage.setItem("tokomi_shipping_date", opt.label);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      alert("Veuillez choisir une option d’expédition.");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div id="shipping-page">
      <div className="header">
        <button className="btn-retourccp" onClick={goBack}>
          RETOUR
        </button>
      </div>

      <h2 style={{ fontWeight: 500, fontSize: 26, marginTop: 28, marginLeft: 22 }}>
        CHOISIR UNE OPTION D’EXPÉDITION
      </h2>

      <form
        id="shipping-form"
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 28, marginBottom: 42 }}
      >
        {OPTIONS.map((o) => (
          <label key={o.id} className="shipping-option">
            <input
              type="radio"
              name="shipping"
              value={`${o.label} - €${o.price.toFixed(2)}`}
              checked={selected === o.id}
              onChange={() => onChange(o.id)}
            />
            <span style={{ flex: 1, marginLeft: 12 }}>{o.label}</span>
            <span style={{ fontSize: 28, fontWeight: 300 }}>€{o.price.toFixed(2)}</span>
          </label>
        ))}

        <button type="submit">VALIDER</button>
      </form>
    </div>
  );
}
