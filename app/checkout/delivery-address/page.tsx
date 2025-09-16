import AuthGate from "@/components/AuthGate";
import DeliveryAddressClient from "./DeliveryAddressClient";

export const metadata = { title: "Adresse Livraison – Tokomi" };

export default function Page() {
  return (
    <AuthGate>
      <DeliveryAddressClient />
    </AuthGate>
  );
}
