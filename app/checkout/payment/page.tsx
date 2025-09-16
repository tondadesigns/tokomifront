import AuthGate from "@/components/AuthGate";
import PaymentClient from "./PaymentClient";

export const metadata = { title: "Choisir Paiement – Tokomi" };

export default function Page() {
  return (
    <AuthGate>
      <PaymentClient />
    </AuthGate>
  );
}
