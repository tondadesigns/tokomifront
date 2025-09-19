import React from "react";

interface ButtonProps {
    customClass?: string;
    handleClick?: () => void;
    children?: React.ReactNode;
}

export const Button = ({children, customClass, handleClick}: ButtonProps) => {
    const baseButtonClass =
        "cursor-pointer select-none font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-2 px-4 shadow-sm hover:shadow-md bg-slate-200 border-slate-200 text-slate-800 hover:text-white hover:bg-black";
    return (
        <button className={`${baseButtonClass} ${customClass}`} onClick={handleClick} data-shape="default">
            {children}
        </button>
    );

}