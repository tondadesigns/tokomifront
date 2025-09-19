import React, { useRef, useState } from "react";
import { ProductCard } from "@/components/product-card";

interface ProductsCarouselProps {
    products: number[];
    children?: React.ReactNode;
}

export const ProductsCarousel = ({ products }: ProductsCarouselProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollStartLeft, setScrollStartLeft] = useState(0);

    const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if (e.button !== 0) return; // uniquement clic gauche
        const el = containerRef.current;
        if (!el) return;
        setIsDragging(true);
        setStartX(e.pageX - el.getBoundingClientRect().left);
        setScrollStartLeft(el.scrollLeft);
    };

    const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if (!isDragging) return;
        const el = containerRef.current;
        if (!el) return;
        e.preventDefault(); // évite la sélection de texte pendant le drag
        const x = e.pageX - el.getBoundingClientRect().left;
        const walk = x - startX;
        el.scrollLeft = scrollStartLeft - walk;
    };

    const endDrag = () => setIsDragging(false);

    return (
        <div
            ref={containerRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            className={`w-[80%] select-none overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [scrollbar-color:transparent] ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
        >
            {/* Piste interne en ligne pour forcer la largeur au contenu */}
            <div className="inline-flex gap-2">
                {products.map((_, index) => (
                    <ProductCard key={index} />
                ))}
            </div>
        </div>
    );
};
