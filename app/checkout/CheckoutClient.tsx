"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  brand?: string;
  marque?: string;
  name?: string;
  titre?: string;
  price?: number | string;
  quantity?: number;
  image?: string;
  img?: string;
};

const KEYS = {
  ORDERS: "tokomi_orders",
  PENDING: "tokomi_pending_order",
  CART: "tokomi_cart_items",
};

export default function CheckoutClient() {
  const router = useRouter();

  // UI state
  const [address, setAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [shippingOption, setShippingOption] = useState<string>("");
  const [shippingDate, setShippingDate] = useState<string>("");
  const [shippingPrice, setShippingPrice] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const [carousel, setCarousel] = useState<string[]>([]);
  const [dateLabel, setDateLabel] = useState<string>("");

  const euro = (n: number) => `€${(n || 0).toFixed(2)}`;

  // Routes used in original HTML; adjust if your slugs differ
  const goBack = () => router.push("/panier-favoris");
  const openAddressPage = () => router.push("/addresselivraison");
  const goToPaymentPage = () => router.push("/payment");
  const openShippingPage = () => router.push("/expedition");

  // Generate order number (same scheme as HTML)
  const generateOrderNumber = () => {
    const now = new Date();
    const y = now.getFullYear().toString().slice(-2);
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const h = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `TK${y}${m}${d}${h}${min}${s}${random}`;
  };

  // Build pending order from localStorage (same fields as HTML)
  const prepareOrderFromCart = (orderNumber: string) => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem(KEYS.CART) || "[]");

    const subtotalLS = parseFloat(localStorage.getItem("tokomi_subtotal") || "NaN");
    const shippingLS = parseFloat(localStorage.getItem("tokomi_shipping_price") || "NaN");

    const computedSubtotal = !Number.isNaN(subtotalLS)
      ? subtotalLS
      : cart.reduce((sum, it) => sum + (Number(it.price) || 0) * (it.quantity || 1), 0);

    const ship = Number.isNaN(shippingLS) ? 0 : shippingLS;
    const totalAll = computedSubtotal + ship;

    const addr = localStorage.getItem("tokomi_address") || "";
    const shipOpt = localStorage.getItem("tokomi_shipping_option") || "";
    const shipDate = localStorage.getItem("tokomi_shipping_date") || "";
    const pay = localStorage.getItem("tokomi_payment_method") || "";

    return {
      id: orderNumber,
      number: orderNumber,
      date: new Date().toISOString(),
      status: "En cours",
      totals: { subtotal: computedSubtotal, shipping: ship, total: totalAll },
      address: addr,
      shipping: { option: shipOpt, date: shipDate, price: ship },
      payment: pay,
      products: cart.map((it) => ({
        brand: it.brand || it.marque || "",
        name: it.name || it.titre || "",
        price: Number(it.price || 0),
        quantity: it.quantity || 1,
        image: it.image || it.img || "",
      })),
    };
  };

  const finalizeOrder = () => {
    const orderNumber = generateOrderNumber();
    localStorage.setItem("tokomi_order_number", orderNumber);

    const pending = prepareOrderFromCart(orderNumber);
    localStorage.setItem(KEYS.PENDING, JSON.stringify(pending));

    router.push("/loading");
  };

  // Initial + reactive render from LS (parity with your script)
  const renderFromLS = useMemo(
    () => () => {
      // Address
      const addr = localStorage.getItem("tokomi_address") || "";
      setAddress(addr);

      // Payment
      const pay = localStorage.getItem("tokomi_payment_method") || "";
      setPaymentMethod(pay);

      // Shipping
      const shipOpt = localStorage.getItem("tokomi_shipping_option") || "";
      const shipDate = localStorage.getItem("tokomi_shipping_date") || "";
      const shipPriceLS = parseFloat(localStorage.getItem("tokomi_shipping_price") || "NaN");
      setShippingOption(shipOpt);
      setShippingDate(shipDate);
      setShippingPrice(Number.isNaN(shipPriceLS) ? 0 : shipPriceLS);

      // Counts
      const countLS = parseInt(localStorage.getItem("tokomi_cart_count") || "NaN");
      if (!Number.isNaN(countLS)) {
        setCartCount(countLS);
      } else {
        const items: CartItem[] = JSON.parse(localStorage.getItem(KEYS.CART) || "[]");
        const computed = items.reduce((n, it) => n + (it.quantity || 1), 0);
        setCartCount(computed);
      }

      // Totals
      const subtotalLS = parseFloat(localStorage.getItem("tokomi_subtotal") || "NaN");
      const items: CartItem[] = JSON.parse(localStorage.getItem(KEYS.CART) || "[]");
      const computedSubtotal = !Number.isNaN(subtotalLS)
        ? subtotalLS
        : items.reduce((sum, it) => sum + (Number(it.price) || 0) * (it.quantity || 1), 0);

      setSubtotal(computedSubtotal);
      const s = parseFloat(localStorage.getItem("tokomi_shipping_price") || "NaN");
      const ship = Number.isNaN(s) ? 0 : s;
      setTotal(computedSubtotal + ship);

      // Carousel
      const imgs: string[] = JSON.parse(localStorage.getItem("tokomi_cart_products") || "[]");
      setCarousel(Array.isArray(imgs) ? imgs : []);

      // Date label
      const jours = ["DIMANCHE", "LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"];
      const mois = [
        "JANVIER",
        "FÉVRIER",
        "MARS",
        "AVRIL",
        "MAI",
        "JUIN",
        "JUILLET",
        "AOÛT",
        "SEPTEMBRE",
        "OCTOBRE",
        "NOVEMBRE",
        "DÉCEMBRE",
      ];
      const d = new Date();
      setDateLabel(`${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]}`);
      localStorage.setItem("tokomi_checkout_date_iso", d.toISOString().slice(0, 10));
    },
    []
  );

  useEffect(() => {
    renderFromLS();

    const onStorage = () => renderFromLS();
    const onVisibility = () => {
      if (!document.hidden) renderFromLS();
    };

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [renderFromLS]);

  return (
    <div id="checkout-page">
      <div className="header">
        <button className="btn-retourccp" onClick={goBack}>
          RETOUR
        </button>
      </div>

      <p id="checkout-date">{dateLabel}</p>
      <p id="checkout-article-count">ARTICLES DANS LE PANIER : {cartCount}</p>

      <div className="carousel" id="checkout-carousel">
        {carousel.length === 0 ? (
          <>
            <div />
            <div />
            <div />
          </>
        ) : (
          carousel.map((src, i) => (
            <div
              key={i}
              style={{
                backgroundImage: `url('${src}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: 120,
                height: 180,
              }}
            />
          ))
        )}
      </div>

      {/* Address */}
      <div className="address-header" onClick={openAddressPage}>
        <span className="address-title">LIVRAISON</span>
        <span className="address-arrow">›</span>
      </div>

      {address && (
        <div
          id="address-summary"
          style={{
            display: "block",
            marginTop: -37,
            padding: 16,
            fontSize: 12,
            fontWeight: 400,
            textTransform: "uppercase",
          }}
        >
          <h3 style={{ fontSize: 12, fontWeight: 300, marginBottom: 2 }} />
          <p id="displayed-address" className="displayed-address">
            {address}
          </p>
        </div>
      )}

      {/* Payment */}
      <div id="payment-header" className="payment-header" onClick={goToPaymentPage}>
        <span className="payment-title">PAIEMENT</span>
        <span className="payment-arrow">›</span>
      </div>

      {!!paymentMethod && (
        <>
          <div
            id="payment-summary"
            style={{
              display: "block",
              marginTop: -38,
              marginLeft: 16,
              padding: 16,
              fontSize: 12,
              fontWeight: 400,
              textTransform: "capitalize",
            }}
          />
          <p id="selected-payment" style={{ fontSize: 12, fontWeight: 400, marginTop: -32, marginLeft: 16 }}>
            {paymentMethod.toUpperCase()}
          </p>
        </>
      )}

      {/* Shipping */}
      <div className="shipping-header" onClick={openShippingPage}>
        <span>EXPÉDITION</span>
        <span>›</span>
      </div>

      {(shippingOption || shippingDate) && (
        <div id="shipping-summary" style={{ display: "block", marginTop: -16, marginLeft: 16, fontWeight: 500 }}>
          <p id="selected-shipping" style={{ fontSize: 12, fontWeight: 400, marginBottom: 160 }}>
            {shippingDate ? `${shippingDate} – ${euro(shippingPrice)}` : shippingOption.toUpperCase()}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="cart-footer" id="checkout-footer">
        <div className="cart-footer-left">
          <button className="continue-button" onClick={finalizeOrder}>
            COMMANDER
          </button>
        </div>
        <div className="cart-footer-right" style={{ textAlign: "right", marginRight: 32 }}>
          <div className="cart-total" id="checkout-total" data-original-total={String(total)}>
            {euro(total)}
          </div>
          <div className="cart-note">* Taxes comprises</div>
        </div>
      </div>

    </div>
  );
}
