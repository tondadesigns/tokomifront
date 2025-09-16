"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      const success = Math.random() > 0.3; // ~70% succès
      router.push(success ? "/checkout/success" : "/checkout/failure");
      // Ajuste les routes ci-dessus si tes pages s'appellent autrement.
    }, 3000);

    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="loading-container" aria-label="Chargement de Tokomi">
      <div className="logo-letter">T</div>

    </div>
  );
}
