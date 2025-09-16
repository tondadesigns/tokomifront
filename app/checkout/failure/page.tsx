"use client";

import { useRouter } from "next/navigation";

export const metadata = {
  title: "Échec du paiement – Tokomi",
};

export default function FailurePage() {
  const router = useRouter();

  return (
    <main className="wrap" aria-labelledby="title">
      <h1 id="title">Échec du paiement. Veuillez réessayer.</h1>
      <button onClick={() => router.back()} aria-label="Revenir à l’étape précédente">
        REVENIR
      </button>

    </main>
  );
}
