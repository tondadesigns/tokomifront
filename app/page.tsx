"use client";
import {useRouter} from "next/navigation";

export default function Home() {

    const router = useRouter();

    function handleAnimationEnd(e: React.AnimationEvent<HTMLDivElement>) {
        if (e.target !== e.currentTarget) return;
        router.push("/user-introduction");
    }

    return (
        <div
            className="w-screen h-screen flex items-center justify-center [animation:backgroundChange_3s_ease-in-out_forwards]"
            onAnimationEnd={handleAnimationEnd}
        >
            <span
                className="text-white text-[4px] font-semibold font-[Space_Grotesk,sans-serif] opacity-80 [animation:zoomIn_3s_ease-in-out_forwards,colorChange_3s_ease-in-out_forwards]">
                T
            </span>
        </div>
    );
}