import React from "react";
import Image from "next/image";
import {Button} from "@/libs/buttons/buttons";

export const ProductCard = () => {
    return (
        <div
            className="flex flex-col justify-between items-center h-[300px] w-[200px] rounded-lg bg-white border border-slate-200 shadow-sm shadow-slate-950/5 overflow-hidden">
            <span className="relative block h-[50%] w-full rounded-lg">
                <Image
                    src="https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=927&amp;q=80"
                    alt="card-image" fill
                    className="object-cover p-2"/>
            </span>
            <div className="w-full h-[30%] px-2 py-2">
                <div className="mb-2 flex items-center justify-between">
                    <h6 className="font-bold text-sm">Apple AirPods</h6>
                    <h6 className="font-bold text-sm">$95.00</h6>
                </div>
                <p className="text-xs text-slate-600">With plenty of talk and listen time,
                    voice-activated Siri access.</p>
            </div>
            <div className="w-full px-1 py-2 flex justify-center">
                <Button>Add to Cart
                </Button>
            </div>
        </div>
    );
}