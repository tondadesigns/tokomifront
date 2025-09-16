import AuthGate from "@/components/AuthGate";
import CheckoutClient from "./CheckoutClient";

export const metadata = { title: "Checkout – Tokomi" };

export default function Page() {
  return (
    <AuthGate>
      <CheckoutClient />
    </AuthGate>
  );
}

