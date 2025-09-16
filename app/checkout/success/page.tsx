"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export const metadata = {
  title: "Confirmation de commande – Tokomi",
};

type OrderProduct = {
  brand?: string;
  name?: string;
  price?: number;
  quantity?: number;
  image?: string;
};
type PendingOrder = {
  id?: string;
  number?: string;
  date?: string;
  status?: string;
  totals?: { subtotal: number; shipping: number; total: number };
  address?: string;
  shipping?: { option?: string; date?: string; price?: number };
  payment?: string;
  products?: OrderProduct[];
};

export default function SuccessPage() {
  const router = useRouter();

  const [orderNumber, setOrderNumber] = useState<string>("#000000");
  const [estimatedText, setEstimatedText] = useState<string>("À CONFIRMER");
  const [addressHtml, setAddressHtml] = useState<string>("Adresse non disponible");
  const [subtotal, setSubtotal] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  // ------- helpers -------
  const money = (n: number) => `€${(Number.isFinite(n) ? n : 0).toFixed(2)}`;
  const parsePrice = (s?: string | null) => {
    if (!s) return 0;
    const m = String(s).match(/([0-9]+[.,]?[0-9]*)/);
    return m ? parseFloat(m[1].replace(",", ".")) : 0;
    };
  const addDays = (date: Date, n: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  };
  const fmt = (d: Date) => {
    const jours = ["DIMANCHE","LUNDI","MARDI","MERCREDI","JEUDI","VENDREDI","SAMEDI"];
    const mois  = ["JANVIER","FÉVRIER","MARS","AVRIL","MAI","JUIN","JUILLET","AOÛT","SEPTEMBRE","OCTOBRE","NOVEMBRE","DÉCEMBRE"];
    return `${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]}`;
  };

  // Commit la commande en attente -> historique
  useEffect(() => {
    try {
      const ORDERS_KEY = "tokomi_orders";
      const PENDING_KEY = "tokomi_pending_order";
      const CART_KEY = "tokomi_cart_items";

      const raw = localStorage.getItem(PENDING_KEY);
      if (!raw) return;
      const pending: PendingOrder = JSON.parse(raw);
      pending.status = "Confirmée";

      const orders: PendingOrder[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
      const pid = pending.number || pending.id || "";
      if (!orders.some((o) => (o.number || o.id) === pid)) {
        orders.unshift(pending);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      }

      localStorage.removeItem(PENDING_KEY);
      localStorage.removeItem(CART_KEY);
    } catch {
      // on ignore un éventuel JSON invalide
    }
  }, []);

  // Charge les données d’affichage (numéro, adresse, totaux, ETA)
  useEffect(() => {
    // N° commande
    const on = localStorage.getItem("tokomi_order_number") || "#000000";
    setOrderNumber(on.toUpperCase());

    // Adresse (summary > address > fallback)
    const rawAddr =
      localStorage.getItem("tokomi_summary_address") ||
      localStorage.getItem("tokomi_address") ||
      "";
    setAddressHtml(rawAddr ? rawAddr.replace(/\n/g, "<br>") : "Adresse non disponible");

    // Totaux
    const subtotalLS = localStorage.getItem("tokomi_subtotal");
    const shippingLS = localStorage.getItem("tokomi_shipping_price");

    let sub = parseFloat(String(subtotalLS));
    if (Number.isNaN(sub)) {
      const items = JSON.parse(localStorage.getItem("tokomi_cart_items") || "[]") as Array<{
        price?: string | number;
        quantity?: number;
      }>;
      sub = items.reduce((sum, it) => {
        const q = it?.quantity ?? 1;
        const p = parseFloat(String(it?.price ?? 0)) || 0;
        return sum + q * p;
      }, 0);
    }
    let ship = parseFloat(String(shippingLS));
    if (Number.isNaN(ship)) {
      // fallback via option sélectionnée
      const selected = localStorage.getItem("selectedShipping");
      const opt = localStorage.getItem("tokomi_shipping_option");
      ship = parsePrice(selected) || parsePrice(opt);
    }
    let tot = parseFloat(String(localStorage.getItem("tokomi_total")));
    if (Number.isNaN(tot)) tot = sub + (ship || 0);

    setSubtotal(sub);
    setShipping(ship || 0);
    setTotal(tot);

    // Date estimée
    const iso = localStorage.getItem("tokomi_checkout_date_iso");
    const base = iso ? new Date(iso) : new Date();

    const rawOpt =
      localStorage.getItem("selectedShipping") ||
      localStorage.getItem("tokomi_shipping_option") ||
      "";
    const opt = rawOpt.toLowerCase();

    let minDays = 0,
      maxDays = 0;
    if (opt.includes("standard")) {
      minDays = 7;
      maxDays = 10;
    } else if (opt.includes("express")) {
      minDays = 3;
      maxDays = 5;
    } else if (opt.includes("1 jour") || opt.includes("en 1 jour")) {
      minDays = 1;
      maxDays = 1;
    } else {
      setEstimatedText("À CONFIRMER");
      return;
    }

    const dMin = addDays(base, minDays);
    const dMax = addDays(base, maxDays);
    setEstimatedText(minDays === maxDays ? fmt(dMin) : `ENTRE ${fmt(dMin)} ET ${fmt(dMax)}`);
  }, []);

  const subtotalText = useMemo(() => money(subtotal), [subtotal]);
  const shippingText = useMemo(() => money(shipping), [shipping]);
  const totalText = useMemo(() => money(total), [total]);

  return (
    <main className="page">
      <header className="logoHeader" aria-label="Tokomi">
        <img src="/logo.png" alt="Tokomi Logo" className="logo" />
      </header>

      <h1>MERCI POUR VOTRE COMMANDE !</h1>

      {/* COMMANDE */}
      <section className="section">
        <div className="label">COMMANDE</div>
        <div className="value">{orderNumber}</div>
        <div className="value" style={{ marginBottom: 10 }}>
          Vous recevrez un numéro de suivi dès que votre commande aura été expédiée.
        </div>
      </section>

      {/* ARRIVÉE ESTIMÉE */}
      <section className="section">
        <div className="label">ARRIVÉE ESTIMÉE</div>
        <p id="estimated-date" className="value">
          {estimatedText}
        </p>
      </section>

      {/* LIVRAISON */}
      <section className="section">
        <div className="label">LIVRAISON</div>
        <div
          className="value"
          id="confirmation-address"
          dangerouslySetInnerHTML={{ __html: addressHtml }}
        />
      </section>

      {/* RÉSUMÉ */}
      <section className="section">
        <div className="label">RÉSUMÉ</div>
        <div className="summary">
          <span>Sous-total</span>
          <span id="subtotal">{subtotalText}</span>
        </div>
        <div className="summary">
          <span>Expédition</span>
          <span id="shipping-fee">{shippingText}</span>
        </div>
        <div className="summary total">
          <span>TOTAL</span>
          <span id="total">{totalText}</span>
        </div>
      </section>

      {/* Bouton retour */}
      <div className="backWrap">
        <button
          onClick={() => router.push("/")}
          aria-label="Retour à l’accueil"
          className="homeBtn"
        >
          RETOUR À L&apos;ACCUEIL
        </button>
      </div>

    </main>
  );
}
