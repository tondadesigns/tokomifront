"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";

export const metadata = { title: "Tokomi – Explorer" };

// --- Données mock pour les carrousels (remplace par tes vraies données / API)
type Product = { id: string; slug: string; brand: string; name: string; price: string; image: string };

const PRODUCTS: Product[] = [
  { id: "1", slug: "p-1", brand: "Jill Sander",  name: "RICK OWENS",    price: "€50",  image: "/chaussure1.jpg" },
  { id: "2", slug: "p-2", brand: "Jill Sander",  name: "BALENCIAGA",    price: "€100", image: "/chaussure2.jpg" },
  { id: "3", slug: "p-3", brand: "Jill Sander",  name: "FEAR OF GOD",   price: "€150", image: "/chaussure3.jpg" },
  { id: "4", slug: "p-4", brand: "Jill Sander",  name: "KITH",          price: "€200", image: "/chaussure4.jpg" },
  { id: "5", slug: "p-5", brand: "Jill Sander",  name: "LORO PIANA",    price: "€200", image: "/chaussure1.jpg" },
  { id: "6", slug: "p-6", brand: "Jill Sander",  name: "SANDRO",        price: "€200", image: "/chaussure2.jpg" },
  { id: "7", slug: "p-7", brand: "Jill Sander",  name: "MELON JAUNE",   price: "€200", image: "/chaussure3.jpg" },
];

const CATEGORIES = ["FEMME", "HOMME", "ENFANTS"];

function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/product/${p.slug}`} className="product-card" prefetch>
      <img src={p.image} alt={p.name} />
      <div className="product-brand">{p.brand}</div>
      <div className="product-name">{p.name}</div>
      <div className="product-price">{p.price}</div>
    </Link>
  );
}

export default function ExplorerPage() {
  const [activeCat, setActiveCat] = useState(0);
  const [showCancel, setShowCancel] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <main className="page-parcours">
      {/* Header */}
      <header className="top-nav">
        <nav className="category-nav" aria-label="Catégories">
          {CATEGORIES.map((label, i) => (
            <a
              key={label}
              href="#"
              className={`cat-link ${activeCat === i ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveCat(i); }}
            >
              {label}
            </a>
          ))}
        </nav>

        <Link href="/cart" className="cart-button" role="button">PANIER</Link>
      </header>

      {/* Barre de recherche */}
      <section className="search-bar">
        <input
          ref={searchRef}
          type="text"
          placeholder="QUE RECHERCHEZ-VOUS ?"
          onFocus={() => setShowCancel(true)}
        />
      </section>

      {/* Bouton ANNULER */}
      <a
        href="#"
        id="cancel-search"
        className={`cancel-search ${showCancel ? "visible" : "hidden"}`}
        onClick={(e) => {
          e.preventDefault();
          setShowCancel(false);
          if (searchRef.current) {
            searchRef.current.value = "";
            searchRef.current.blur();
          }
        }}
      >
        ANNULER
      </a>

      {/* Ligne catégorie "EN SOLDE" */}
      <section className="category-line">
        <Link href="/resultats" className="category-title">EN SOLDE</Link>
      </section>

      {/* Liste de marques */}
      <section className="category-list">
        {["RICK OWENS","BALENCIAGA","FEAR OF GOD","KITH","LORO PIANA","SANDRO","MELON JAUNE"].map((b)=>(
          <Link key={b} href="/resultats" className="category-item">{b}</Link>
        ))}
      </section>

      {/* Section carrousel – NOUVEAUTÉS */}
      <section className="product-carousel-section">
        <div className="section-header">
          <Link href="/resultats" className="section-title">NOUVEAUTÉS</Link>
        </div>
        <div className="carousel">
          {PRODUCTS.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Footer */}
      <footer className="sticky-footer">
        <Link href="/home" className="menu-item"><span>ACCUEIL</span></Link>
        <Link href="/explorer" className="menu-item active"><span>EXPLORER</span></Link>
        <Link href="/profile" className="menu-item"><span>PROFIL</span></Link>
      </footer>
 
    </main>
  );
}

