import React from "react";
import {Header} from "@/components/header";
import {MainAdvertisePanel} from "@/components/main-advertise-panel";
import {ProductsCarousel} from "@/components/products-carousel";

const products = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export default function Welcome() {
    return (
        <div className="w-full">
            <   Header/>
            <main className="flex flex-col items-center gap-2">
                <MainAdvertisePanel />
                <div className="w-full flex items-center justify-center">
                    <ProductsCarousel products={products} />
                </div>
            </main>
        </div>
    )
}