import AuthGate from "@/components/AuthGate";
import ShippingClient from "./ShippingClient";

export const metadata = { title: "Expédition – Tokomi" };

export default function Page() {
  return (
    <AuthGate>
      <ShippingClient />
    </AuthGate>
  );
}

