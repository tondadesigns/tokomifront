
import ProductClient from "./product-client";

export const metadata = { title: "Produit – Tokomi" };


type ProductColor = { code: string; label: string; swatch?: string; images?: string[]; thumb?: string };
type ProductReco = { slug: string; brand: string; name: string; price: number; image: string };
export type Product = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  price: number;
  heroImage: string;
  colors: ProductColor[];
  recommendations: ProductReco[];
};

const DB: Record<string, Product> = {
  "baskets-geobasket": {
    id: "geobasket-001",
    slug: "baskets-geobasket",
    brand: "RICK OWENS",
    name: "BASKETS GEOBASKET",
    price: 400,
    heroImage: "/main-image.jpg",
    colors: [
      {
        code: "noir",
        label: "NOIR",
        thumb: "/noir.jpg",
        images: ["/hoodie-noir-1.png", "/hoodie-noir-2.png", "/hoodie-noir-3.png", "/hoodie-noir-4.png"],
      },
      { code: "beige", label: "BEIGE", thumb: "/beige.jpg" },
      { code: "rouge", label: "ROUGE", thumb: "/rouge.jpg" },
      { code: "bleu", label: "BLEU", thumb: "/bleu.jpg" },
      { code: "gris", label: "GRIS", thumb: "/gris.jpg" },
      { code: "vert", label: "VERT", thumb: "/vert.jpg" },
      { code: "blanc", label: "BLANC", thumb: "/blanc.jpg" },
    ],
    recommendations: [
      { slug: "le-chiquito", brand: "JACQUEMUS", name: "LE CHIQUITO", price: 590, image: "/product1.jpg" },
      { slug: "chemise-oversize-ami", brand: "Ami Paris", name: "Chemise Oversize", price: 250, image: "/product2.jpg" },
      { slug: "pantalon-relaxed-lemaire", brand: "Lemaire", name: "Pantalon Relaxed", price: 390, image: "/product3.jpg" },
      { slug: "tabiloafers-margiela", brand: "Margiela", name: "Tabi Loafers", price: 680, image: "/product4.jpg" },
      { slug: "moon-top-marine-serre", brand: "Marine Serre", name: "Moon Top", price: 310, image: "/product5.jpg" },
      { slug: "arrow-bag-offwhite", brand: "Off-White", name: "Sacs Arrow", price: 950, image: "/product6.jpg" },
    ],
  },
};

function getProductBySlug(slug: string): Product {
  const p = DB[slug];
  if (p) return p;

  return {
    id: "unknown",
    slug,
    brand: "TOKOMI",
    name: "PRODUIT",
    price: 0,
    heroImage: "/main-image.jpg",
    colors: [{ code: "noir", label: "NOIR", thumb: "/noir.jpg" }],
    recommendations: [],
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  return <ProductClient product={product} />;
}


