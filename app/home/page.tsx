import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Tokomi – Accueil" };

type Product = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  price: string;        
  image: string;        
};

const SHOES_NEW: Product[] = [
  { id: "p1", slug: "chaussure-1", brand: "MAISON MARGIELA", name: "Chemise Oversize", price: "450€", image: "/chaussure1.jpg" },
  { id: "p2", slug: "chaussure-2", brand: "Jacquemus",       name: "Chemise Oversize", price: "390€", image: "/chaussure2.jpg" },
  { id: "p3", slug: "chaussure-3", brand: "Balenciaga",      name: "Chemise Oversize", price: "780€", image: "/chaussure3.jpg" },
  { id: "p4", slug: "chaussure-4", brand: "Jacquemus",       name: "Chemise Oversize", price: "390€", image: "/chaussure4.jpg" },
  { id: "p5", slug: "chaussure-5", brand: "Balenciaga",      name: "Chemise Oversize", price: "780€", image: "/chaussure3.jpg" },
  { id: "p6", slug: "chaussure-6", brand: "Balenciaga",      name: "Chemise Oversize", price: "780€", image: "/chaussure3.jpg" },
];



function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/product/${p.slug}`} className="product-card">
      {/* On peut garder <img> si tu préfères exactement le rendu natif */}
      <img src={p.image} alt={p.name} />
      <div className="brand">{p.brand}</div>
      <div className="product-name">{p.name}</div>
      <div className="price">{p.price}</div>
    </Link>
  );
}

function Slider({ title, products, titleClass }: { title: string; products: Product[]; titleClass?: string }) {
  return (
    <>
      <div className="product-slider">
        <Link href="/resultats" className={`category-title ${titleClass ?? ""}`}>{title}</Link>
        <span className="arrow" />
      </div>
      <div className="product-slider" style={{ marginTop: -44, marginBottom: -40 }}>
        {products.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* HEADER */}
      <header className="sticky-header">
        <div className="logo">
          <Image src="/logo.png" width={120} height={40} alt="Logo Tokomi" />
        </div>
        <Link href="/cart" className="cart-button" role="button">PANIER</Link>
      </header>

      {/* HERO */}
      <section className="hero">
        <Link href="/resultats">
          <img src="/usomagazine.png" alt="Hero Image" />
        </Link>
        <Link href="/resultats">
          <h2 className="hero-title">COLLECTION ÉTÉ</h2>
        </Link>
        <p className="hero-text">MAINTENANT DISPONIBLE</p>
      </section>

      {/* SECTIONS */}
      <section className="category-section" id="category-list">
        {/* 1) CHAUSSURES D'ÉTÉ: NOUVEL ARRIVAGE */}
        <div className="category-line">
          <Link href="/resultats" className="category-title">CHAUSSURES D'ÉTÉ: NOUVEL ARRIVAGE</Link>
          <span className="arrow" />
        </div>
        <div className="product-slider" style={{ marginTop: -20, marginBottom: -40 }}>
          {SHOES_NEW.map(p => <ProductCard key={p.id} p={p} />)}
        </div>

        {/* 2) SOLDES RECOMMANDÉS */}
        <Slider title="SOLDES RECOMMANDÉS" products={SHOES_NEW} titleClass="ml-2" />

        {/* 3) #707 CHAUSSURES D'ÉTÉ */}
        <Slider title="#707 CHAUSSURES D'ÉTÉ" products={SHOES_NEW} />

        {/* 4) #047 EXCLUSIVITÉS TOKOMI */}
        <Slider title="#047 EXCLUSIVITÉS TOKOMI" products={SHOES_NEW} />

        {/* 5) #740 LUXE ACCESSIBLE */}
        <Slider title="#740 LUXE ACCESSIBLE" products={SHOES_NEW} />

  
      </section>

      {/* FOOTER */}
      <footer className="sticky-footer">
        <Link href="/home" className="menu-item active"><span>ACCUEIL</span></Link>
        <Link href="/explorer" className="menu-item"><span>EXPLORER</span></Link>
        <Link href="/profile" className="menu-item"><span>PROFIL</span></Link>
      </footer>

      
      <style jsx global>{`
        
      `}</style>
    </main>
  );
}
