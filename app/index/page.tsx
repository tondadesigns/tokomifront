"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IntroIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.push("/user-intro");
    }, 4000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="intro-container" id="intro" aria-label="Intro Tokomi">
      <div className="logo-letter">T</div>

    </main>
  );
}
