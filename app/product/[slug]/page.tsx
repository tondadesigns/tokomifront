import React from "react";
import ProductDetail from "@/components/product-detail";

export default function ProductPage({ params }: { params: { slug: string } }) {

  const product = {
    id: params.slug,
    name: "HOODIE TOKOMI",
    price: 149,
    images: [
      "/images/hoodie-avant.png",
      "/images/hoodie-profil.png",
      "/images/hoodie-arriere.png",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { code: "black", label: "Noir", swatch: "#000000" },
      { code: "white", label: "Blanc", swatch: "#ffffff" },
    ],
  };

  return <ProductDetail product={product} />;
}

