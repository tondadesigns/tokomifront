import React from "react";
import {Button} from "@/libs/buttons/buttons";
import Image from "next/image";

export const Header = () => (
    <header className="top-0 z-50 w-full h-20 flex items-center justify-center sticky bg-white">
        <span className="flex justify-center items-center w-full h-20">
            <Image src="/images/logo.png" alt="Logo Tokomi" width={150} height={10} />
        </span>
        <Button customClass={'absolute w-auto right-5'}>PANIER</Button>
    </header>
)