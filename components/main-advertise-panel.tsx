import React from 'react';
import Image from "next/image";

export const MainAdvertisePanel = () =>
    <section className="w-xl">
        <span className="relative block h-[600px]">
            <Image className="shadow-xl cursor-pointer" src="/images/usomagazine.png" alt="Hero Image" fill/>
        </span>
        <h2 className="font-bold text-sm mt-2.5 cursor-pointer">COLLECTION ÉTÉ</h2>
        <p className="text-xs">MAINTENANT DISPONIBLE</p>
    </section>