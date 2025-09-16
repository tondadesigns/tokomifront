"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Field = { type: string; placeholder: string };
type MethodKey =
  | "VISA"
  | "MASTERCARD"
  | "PAYPAL"
  | "AMERICAN EXPRESS"
  | "APPLE PAY"
  | "TAPTAPSEND"
  | "M-PESA"
  | "ILLICOCASH"
  | "ORANGE MONEY"
  | "AIRTEL MONEY"
  | "AFRIMONEY"
  | "MTN MOMO";

const METHODS: { key: MethodKey; label: string; logo: string; logoClass?: string }[] = [
  { key: "VISA", label: "VISA", logo: "/Visa_Brandmark_Blue_RGB_2021.png", logoClass: "visa-logo" },
  { key: "MASTERCARD", label: "MASTERCARD", logo: "/ma_symbol_opt_63_3x.png", logoClass: "mastercard-logo" },
  { key: "PAYPAL", label: "PAYPAL", logo: "/paypal-seeklogo.png", logoClass: "paypal-logo" },
  { key: "AMERICAN EXPRESS", label: "AMERICAN EXPRESS", logo: "/AXP_BlueBoxLogo_Alternate_REGULARscale_RGB_DIGITAL_700x700.png", logoClass: "americanexpress-logo" },
  { key: "APPLE PAY", label: "APPLE PAY", logo: "/Apple_Pay_Mark_RGB_041619.svg", logoClass: "applepay-logo" },
  { key: "TAPTAPSEND", label: "TAPTAPSEND", logo: "/idHwWumpqs_1748820255658.jpeg", logoClass: "taptapsend-logo" },
  { key: "M-PESA", label: "M-PESA", logo: "/m-pesa logo.jpeg", logoClass: "mpesa-logo" },
  { key: "ILLICOCASH", label: "ILLICOCASH", logo: "/illicocash-logo.jpeg", logoClass: "illicocash-logo" },
  { key: "ORANGE MONEY", label: "ORANGE MONEY", logo: "/orange-money-seeklogo.png", logoClass: "orangemoney-logo" },
  { key: "AIRTEL MONEY", label: "AIRTEL MONEY", logo: "/airtel-money-uganda-seeklogo.png", logoClass: "airtelmoney-logo" },
  { key: "AFRIMONEY", label: "AFRIMONEY", logo: "/afrimoneylogo.jpeg", logoClass: "afrimoney-logo" },
  { key: "MTN MOMO", label: "MTN MOMO", logo: "/mtn-momo-mobile-money-uganda-seeklogo.png", logoClass: "mtnmomo-logo" },
];

const FIELDS: Record<MethodKey, Field[]> = {
  VISA: [
    { type: "text", placeholder: "TITULAIRE DE LA CARTE" },
    { type: "text", placeholder: "NUMÉRO DE CARTE" },
    { type: "text", placeholder: "DATE D'EXPIRATION (MM/AA)" },
    { type: "text", placeholder: "CODE CVC" },
  ],
  MASTERCARD: [
    { type: "text", placeholder: "TITULAIRE DE LA CARTE" },
    { type: "text", placeholder: "NUMÉRO DE CARTE" },
    { type: "text", placeholder: "DATE D'EXPIRATION (MM/AA)" },
    { type: "text", placeholder: "CODE CVC" },
  ],
  "AMERICAN EXPRESS": [
    { type: "text", placeholder: "TITULAIRE DE LA CARTE" },
    { type: "text", placeholder: "NUMÉRO DE CARTE" },
    { type: "text", placeholder: "DATE D'EXPIRATION (MM/AA)" },
    { type: "text", placeholder: "CODE CVC" },
  ],
  PAYPAL: [{ type: "email", placeholder: "ADRESSE EMAIL PAYPAL" }],
  "APPLE PAY": [{ type: "text", placeholder: "IDENTIFIANT APPLE" }],
  "M-PESA": [{ type: "tel", placeholder: "NUMÉRO M-PESA" }],
  ILLICOCASH: [{ type: "tel", placeholder: "NUMÉRO ILLICOCASH" }],
  "ORANGE MONEY": [{ type: "tel", placeholder: "NUMÉRO ORANGE MONEY" }],
  "AIRTEL MONEY": [{ type: "tel", placeholder: "NUMÉRO AIRTEL MONEY" }],
  AFRIMONEY: [{ type: "tel", placeholder: "NUMÉRO AFRIMONEY" }],
  "MTN MOMO": [{ type: "tel", placeholder: "NUMÉRO MTN MOMO" }],
  TAPTAPSEND: [
    { type: "tel", placeholder: "NUMÉRO TAPTAPSEND" },
    { type: "text", placeholder: "TITULAIRE DU NUMÉRO" },
  ],
};

export default function PaymentClient() {
  const router = useRouter();
  const [open, setOpen] = useState<MethodKey | null>(null);

  const goBack = () => router.push("/checkout");

  const onToggle = (key: MethodKey) => {
    setOpen((prev) => (prev === key ? null : key));
  };

  const onValidate = (method: MethodKey) => {
    localStorage.setItem("tokomi_payment_method", method);
    router.push("/checkout");
  };

  return (
    <div style={{ padding: 16 }}>
      <div className="payment-header-section">
        <button className="btn-retourpcp" onClick={goBack}>RETOUR</button>
        <h2 className="payment-heading">CHOISIR SA MÉTHODE DE PAIEMENT</h2>
      </div>

      <div className="payment-grid">
        {METHODS.map(({ key, label, logo, logoClass }) => (
          <div className="payment-row" key={key}>
            <div className="payment-option-wrapper">
              <button className="payment-button" onClick={() => onToggle(key)}>
                <div className="payment-logo">
                  <img src={logo} className={logoClass} alt={label} />
                </div>
                {label}
              </button>

              <div className={`payment-dropdown elegant-dropdown ${open === key ? "show" : ""}`}>
                {open === key &&
                  FIELDS[key].map((f, i) => (
                    <input
                      key={i}
                      type={f.type}
                      placeholder={f.placeholder}
                      className="payment-input"
                    />
                  ))}
                {open === key && (
                  <button className="validate-button" onClick={() => onValidate(key)}>
                    VALIDER
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
