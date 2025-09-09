"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "./page";

const FALLBACK_IMAGES = ["/hoodie-avant.png", "/hoodiefavant.png", "/hoodieprofil.png", "/hoodiearriere.png"]; // ⚠️ vérifie "hoodiefavant.png"

export default function ProductClient({ product }: { product: Product }) {
  const router = useRouter();

 
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [sizeModal, setSizeModal] = useState(false);
  const [cartToast, setCartToast] = useState<string | null>(null);
  const [favToast, setFavToast] = useState<string | null>(null);

  const mainColRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const first = product.colors?.[0]?.code ?? null;
    if (first) selectColor(first);
  }, [product.slug]);

  function selectColor(code: string) {
    setSelectedColor(code);
    const c = product.colors.find((x) => x.code === code);
    const imgs = (c?.images && c.images.length ? c.images : FALLBACK_IMAGES).map(norm);
    setImages(imgs);
  }

  function norm(p: string) {
    return p.startsWith("/") ? p : `/${p}`;
  }

  function scrollToIndex(idx: number) {
    const host = mainColRef.current;
    const el = host?.querySelectorAll<HTMLImageElement>(".carousel-image")?.[idx];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openSizeModal(e?: React.MouseEvent) {
    e?.stopPropagation();
    setSizeModal(true);
  }
  function closeSizeModal(e?: React.MouseEvent) {
    if (e && (e.target as HTMLElement)?.closest(".size-modal-content")) return;
    setSizeModal(false);
  }

  function addToCart(size: string) {
    try {
      const key = "tokomi_cart_items";
      const cart: any[] = JSON.parse(localStorage.getItem(key) || "[]");
      const item = {
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        size,
        quantity: 1,
        image: images[0] || product.heroImage,
        color: (selectedColor || "").toLowerCase(),
        timestamp: Date.now(),
      };
      const exist = cart.find(
        (p) => p.slug === item.slug && p.size === item.size && p.color === item.color
      );
      if (exist) exist.quantity += 1;
      else cart.push(item);
      localStorage.setItem(key, JSON.stringify(cart));

      
      const count = cart.reduce((s, it) => s + (it.quantity || 1), 0);
      localStorage.setItem("tokomi_cart_count", String(count));

      setCartToast(`Ajouté au panier : Taille ${size}`);
      setTimeout(() => setCartToast(null), 2000);
    } catch {
      // ignore errors
    } finally {
      setSizeModal(false);
    }
  }

  function addToFavorites() {
    try {
      const key = "tokomi_favorites";
      const favorites: any[] = JSON.parse(localStorage.getItem(key) || "[]");
      const fav = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: String(product.price),
        size: "", 
        image: images[0] || product.heroImage,
        color: (selectedColor || "").toLowerCase(),
      };
      const k = `${fav.slug}|${fav.size}|${fav.color}`;
      const exists = favorites.some((f) => `${f.slug}|${f.size}|${f.color}` === k);
      if (!exists) {
        favorites.push(fav);
        localStorage.setItem(key, JSON.stringify(favorites));
      }
      setFavToast("Ajouté aux favoris");
      setTimeout(() => setFavToast(null), 2000);
    } catch {}
  }

  const colorThumbs = useMemo(() => product.colors ?? [], [product.colors]);

  return (
    <main>
      {/* HERO (bandeau + top bar) */}
      <div
        className="product-hero"
        style={{ backgroundImage: `url('${norm(product.heroImage)}')` }}
      >
        <div className="top-bar">
          <button className="btn-retour" onClick={() => router.back()}>RETOUR</button>
          <Link href="/cart" className="btn-panier">PANIER</Link>
        </div>
      </div>

      {/* Carrousel vertical */}
      <div className="main-product-carousel" ref={mainColRef}>
        {images.map((src, i) => (
          <img key={i} id={`img${i + 1}`} src={norm(src)} className="carousel-image" alt={`Vue ${i + 1}`} />
        ))}
      </div>

      {/* Dots de scroll */}
      <div className="scroll-indicator-bar">
        {images.map((_, i) => (
          <div key={i} className="scroll-dot" onClick={() => scrollToIndex(i)} />
        ))}
      </div>

      {/* Vignettes couleurs */}
      <div className="thumbnail-carousel">
        {colorThumbs.map((c) => (
          <button
            key={c.code}
            className="thumbnail"
            onClick={(e) => { e.stopPropagation(); selectColor(c.code); }}
            aria-label={c.label}
          >
            <div
              className="thumb-image"
              style={{ backgroundImage: `url('${norm(c.thumb || "/noir.jpg")}')` }}
            />
            <span className={`selected-color-label ${selectedColor === c.code ? "active" : ""}`}>
              {selectedColor === c.code ? c.label : ""}
            </span>
          </button>
        ))}
      </div>

      {/* Détails produit */}
      <div className="product-details">
        <div className="brand">{product.brand}</div>
        <div className="product-name">{product.name}</div>
        <div className="price">€{product.price}</div>
      </div>

      {/* Actions */}
      <div className="action-buttons">
        <button className="btn-cart" onClick={openSizeModal}>AJOUTER AU PANIER</button>
        <button className="btn-fav" onClick={addToFavorites}>AJOUTER AUX FAVORIS</button>
      </div>

      {/* Accordéons */}
      <div className="dropdown-section">
        <Accordion title="COMPOSITION & CARACTÉRISTIQUES ENVIRONNEMENTALES">
          <p>Ce produit est composé de matériaux durables :</p>
          <ul className="composition-list">
            <li>coton (70%)</li>
            <li>laine (14%)</li>
          </ul>
        </Accordion>
        <Accordion title="LIVRAISONS, ÉCHANGES ET RETOURS">
          <p>Livraison en 3 à 5 jours ouvrés. Échanges gratuits sous 14 jours…</p>
        </Accordion>
        <Accordion title="DISPONIBILITÉS">
          <p>Ce produit est disponible en ligne et dans nos boutiques partenaires…</p>
        </Accordion>
      </div>

      {/* Recos */}
      <div className="carousel-block first-carousel">
        <h3 className="section-title">VOUS POURRIEZ ÉGALEMENT AIMER</h3>
        <div className="product-carousel">
          {product.recommendations.map((r) => (
            <div key={r.slug} className="product-card">
              <Link href={`/product/${r.slug}`}>
                <img src={norm(r.image)} alt={r.name} className="product-image" />
              </Link>
              <button className="size-toggle" onClick={openSizeModal}>+</button>
              <div className="product-info">
                <div className="brand-name">{r.brand}</div>
                <div className="product-name">{r.name}</div>
                <div className="product-price">€{r.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deuxième carrousel démo */}
      <div className="carousel-block second-carousel">
        <h3 className="section-title">NOS SÉLECTIONS EN EXCLUSIVITÉ</h3>
        <div className="product-carousel">
          {product.recommendations.slice(0, 6).map((r, i) => (
            <div key={`${r.slug}-${i}`} className="product-card">
              <Link href={`/product/${r.slug}`}>
                <img src={norm(r.image)} alt={r.name} className="product-image" />
              </Link>
              <button className="size-toggle" onClick={openSizeModal}>+</button>
              <div className="product-info">
                <div className="brand-name">{r.brand}</div>
                <div className="product-name">{r.name}</div>
                <div className="product-price">€{r.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modale tailles */}
      {sizeModal && (
        <div className="size-modal active" onClick={closeSizeModal}>
          <div className="size-modal-content">
            <div className="size-options">
              {["37","38","39","40","41","42","43","44"].map((s) => (
                <div key={s} className="size-item" onClick={() => addToCart(s)}>{s}</div>
              ))}
            </div>
            <div className="size-guide">TROUVEZ VOTRE TAILLE</div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className={`confirmation-message ${cartToast ? "show" : ""}`}>{cartToast || ""}</div>
      <div className={`confirmation-message ${favToast ? "show" : ""}`}>{favToast || ""}</div>

      {/* Footer */}
      <footer className="sticky-footer">
        <Link href="/home" className="menu-item">ACCUEIL</Link>
        <Link href="/explorer" className="menu-item">EXPLORER</Link>
        <Link href="/profile" className="menu-item">PROFIL</Link>
      </footer>

    </main>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`dropdown ${open ? "open" : ""}`} onClick={() => setOpen((v) => !v)}>
      <div className="dropdown-header">
        <span className="dropdown-title">{title}</span>
        <span className="dropdown-toggle">{open ? "−" : "+"}</span>
      </div>
      <div className="dropdown-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function norm(p: string) {
  return p.startsWith("/") ? p : `/${p}`;
}
