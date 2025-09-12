"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderProduct = {
  image?: string;
  brand?: string;
  name?: string;
  price?: number | string;
};

type Order = {
  id?: string | number;
  number?: string | number;
  date?: string; // ISO
  status?: string;
  products?: OrderProduct[];
};

const LS_ORDERS_KEY = "tokomi_orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_ORDERS_KEY);
      const parsed = raw ? (JSON.parse(raw) as Order[]) : [];
      setOrders(Array.isArray(parsed) ? parsed : []);
    } catch {
      setOrders([]);
    }
  }, []);

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main>
      <header className="header">
        <Link href="/profile" className="btn-retour">
          RETOUR
        </Link>
        <h1 className="page-title">Historique des commandes</h1>
      </header>

      <div className="order-list">
        {orders.length === 0 ? (
          <div className="no-orders">Aucune commande pour le moment.</div>
        ) : (
          orders.map((order, idx) => (
            <section className="order-card" key={`${order.id ?? order.number ?? idx}`}>
              <div className="order-header">
                <div>Commande #{order.number ?? order.id ?? "—"}</div>
                <div>{formatDate(order.date)}</div>
              </div>

              <div className="order-status">Statut : {order.status ?? "—"}</div>

              <div className="order-products">
                {(order.products ?? []).map((p, i) => (
                  <div className="product-thumb" key={i}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image || "https://via.placeholder.com/150x200"}
                      alt={(p.name || "Produit").toString()}
                    />
                    <div className="product-info">
                      <div className="brand">{(p.brand || "").toString().toUpperCase()}</div>
                      <div className="name">{(p.name || "").toString().toUpperCase()}</div>
                      <div className="price">€{Number(p.price || 0).toFixed(0)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

    </main>
  );
}
