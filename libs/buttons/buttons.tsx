import React from "react";

interface ButtonProps {
    label: string;
    customClass?: string;
}

export const Button = ({label, customClass}: ButtonProps) => {
    const baseButtonClass =
        "bg-white text-black text-[22px] uppercase p-5 border border-transparent cursor-pointer my-2 w-3/5 transition-colors duration-300 ease-in-out hover:bg-black hover:border hover:text-white hover:border-white";

    return (
        <button className={customClass ?? baseButtonClass}>
            {label}
        </button>
    );

}