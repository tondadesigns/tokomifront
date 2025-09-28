"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type LevelKey = "bronze" | "argent" | "or" | "platine" | "client-prive";

const REWARDS: Record<LevelKey, string[]> = {
  bronze: ["Ventes de membres privés", "Récompense d'anniversaire"],
  argent: [
    "Déverrouillage à partir de 1200$",
    "Récompense de bienvenue",
    "Ventes de membres privés",
    "Récompense d'anniversaire",
    "Livraison gratuite (2 commandes)",
    "Réductions exclusives",
  ],
  or: [
    "Déverrouillage à partir de 2400$",
    "Récompense de bienvenue",
    "Ventes de membres privés",
    "Récompense d'anniversaire",
    "Livraison gratuite (4 commandes)",
    "Réductions exclusives",
    "Concepteurs exclusifs",
  ],
  platine: [
    "Déverrouillage à partir de 6000$",
    "Récompense de bienvenue",
    "Accès anticipé à la vente",
    "Récompense d'anniversaire",
    "Livraison gratuite (1 an)",
    "Réductions exclusives",
    "Concepteurs exclusifs",
    "Service client prioritaire",
  ],
  "client-prive": [
    "Déverrouillage à partir de 12000$",
    "Récompense de bienvenue",
    "Accès anticipé à la vente",
    "Récompense d'anniversaire",
    "Livraison gratuite (1 an)",
    "Réductions exclusives",
    "Concepteurs exclusifs",
    "Service client prioritaire",
    "Style personnel",
    "Conciergerie de mode",
  ],
};

const SLIDES: { src: string; alt: string; key: LevelKey }[] = [
  { src: "/bronze-badge-rect.svg", alt: "Bronze", key: "bronze" },
  { src: "/argent-badge-rect.svg", alt: "Argent", key: "argent" },
  { src: "/or-badge-rect.svg", alt: "Or", key: "or" },
  { src: "/platine-badge-rect.svg", alt: "Platine", key: "platine" },
  { src: "/client-prive-badge-rect.svg", alt: "Client privé", key: "client-prive" },
];

// ---------- Helpers localStorage ----------
function safeJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function parseMoney(val: unknown): number {
  if (typeof val === "number") return Number.isFinite(val) ? val : 0;
  if (val == null) return 0;
  let s = String(val).trim();
  s = s.replace(/[€$£¥]|[A-Z]{2,}/gi, "").replace(/\s/g, "");
  if (s.includes(",") && s.includes(".")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (s.includes(",") && !s.includes(".")) {
    s = s.replace(",", ".");
  } else {
    s = s.replace(/,/g, "");
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function computeTier(total: number): string {
  if (total >= 12000) return "CLIENT PRIVÉ";
  if (total >= 6000) return "PLATINE";
  if (total >= 2400) return "OR";
  if (total >= 1200) return "ARGENT";
  return "BRONZE";
}

function getUserNameFromStorage(): string {
  if (typeof window === "undefined") return "Invité";
  // 1) objet central
  const userObj = safeJSON<any>(localStorage.getItem("tokomiUser"));
  if (userObj) {
    if (userObj.firstName) return String(userObj.firstName);
    if (userObj.name || userObj.username || userObj.fullName) {
      return String(userObj.name || userObj.username || userObj.fullName);
    }
  }
  // 2) données du signup
  const sd = safeJSON<any>(localStorage.getItem("signupData"));
  if (sd && (sd.prenom || sd.firstName)) {
    return String(sd.prenom || sd.firstName).trim();
  }
  // 3) clés simples
  const candidates = [
    "tokomi_user_name",
    "tokomiUserName",
    "tokomi_username",
    "user_first_name",
    "firstName",
    "given_name",
    "user_name",
    "username",
    "fullName",
    "name",
  ];
  for (const key of candidates) {
    const v = localStorage.getItem(key);
    if (v && v.trim()) return v.trim();
  }
  return "Invité";
}

function normalizeOrdersFromLSValue(v: unknown): any[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "object" && v) {
    const obj = v as any;
    if (Array.isArray(obj.orders)) return obj.orders;
    if (Array.isArray(obj.history)) return obj.history;
    return Object.values(obj);
  }
  return [];
}

function collectOrdersFromHistoryKeys(): any[] {
  if (typeof window === "undefined") return [];
  const KEYS = [
    "tokomi_historique_2",
    "historique2",
    "tokomiHistorique2",
    "tokomi_orders",
    "tokomiOrderHistory",
    "tokomi_history_orders",
    "orderHistory",
    "orders",
    "tokomi_past_orders",
    "tokomiPurchases",
    "purchases",
  ];
  const seen = new Set<string>();
  const out: any[] = [];
  for (const k of KEYS) {
    const parsed = safeJSON<any>(localStorage.getItem(k));
    if (!parsed) continue;
    const arr = normalizeOrdersFromLSValue(parsed);
    for (const o of arr) {
      if (!o) continue;
      const id = String(
        o.id || o.orderId || o.ref || o.reference || o.number || o.code || ""
      );
      const sig =
        id ||
        JSON.stringify([
          o.total ?? o.amount ?? o.price,
          o.date ?? o.createdAt ?? "",
        ]).slice(0, 120);
      if (seen.has(sig)) continue;
      seen.add(sig);
      out.push(o);
    }
  }
  return out;
}

function sumOrders(orders: any[]): number {
  let sum = 0;
  for (const o of orders) {
    const st = String(o?.status || "").toLowerCase();
    if (/annul|cancel|rembours|refund/.test(st)) continue;

    // priorité au total si présent
    let tot =
      o?.total ??
      o?.grandTotal ??
      o?.totalAmount ??
      o?.amount ??
      o?.price ??
      null;

    // sinon somme des lignes (products/items)
    if (tot == null) {
      const lines = Array.isArray(o?.items) ? o.items : o?.products;
      if (Array.isArray(lines)) {
        let t = 0;
        for (const it of lines) {
          const qty = Number(it?.qty ?? it?.quantity ?? 1);
          const p = parseMoney(it?.total ?? it?.price ?? it?.amount);
          t += qty * p;
        }
        tot = t;
      }
    }
    sum += parseMoney(tot);
  }
  return sum;
}

function getTotalSpendFromStorage(): number {
  if (typeof window === "undefined") return 0;

  // 1) depuis l'historique (préféré)
  const orders = collectOrdersFromHistoryKeys();
  const histTotal = sumOrders(orders);
  if (histTotal > 0) return histTotal;

  // 2) fallbacks cumul direct
  const loyaltyObj = safeJSON<any>(localStorage.getItem("tokomiLoyalty"));
  if (loyaltyObj && typeof loyaltyObj.loyaltyTotal !== "undefined") {
    return Number(loyaltyObj.loyaltyTotal) || 0;
  }
  const candidates = [
    "tokomi_total_spend",
    "tokomiTotalSpend",
    "tokomi_loyalty_total",
    "loyaltyTotal",
    "totalSpend",
    "tokomi_points",
  ];
  for (const key of candidates) {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const n = parseMoney(raw);
      if (!Number.isNaN(n)) return n;
    }
  }
  return 0;
}

// ---------- Page ----------
export default function MembershipPage() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRefs = useRef<HTMLImageElement[]>([]);
  const intervalRef = useRef<number | null>(null);

  const [index, setIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTop, setModalTop] = useState<number>(0);
  const [modalTitle, setModalTitle] = useState("");
  const [modalItems, setModalItems] = useState<string[]>([]);

  // --- Nouveaux états pour l'entête membre ---
  const [userName, setUserName] = useState<string>("Invité");
  const [totalSpend, setTotalSpend] = useState<number>(0);
  const [tier, setTier] = useState<string>("BRONZE");

  // formatteur FR
  const fmt = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

  // Mesure carrousel
  const measure = () => {
    const el = imgRefs.current[0];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const styles = window.getComputedStyle(el);
    const ml = parseFloat(styles.marginLeft) || 0;
    const mr = parseFloat(styles.marginRight) || 0;
    setSlideWidth(rect.width + ml + mr);
  };

  const applyTransform = (i: number) => {
    const track = trackRef.current;
    if (!track || !slideWidth) return;
    track.style.transform = `translateX(-${i * slideWidth}px)`;
  };

  const startCarousel = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 3000);
  };

  const stopCarousel = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Effets init
  useEffect(() => {
    // hydrate entête membre depuis localStorage
    const name = getUserNameFromStorage();
    const total = getTotalSpendFromStorage();
    setUserName(name);
    setTotalSpend(total);
    setTier(computeTier(total));

    // carrousel
    measure();
    const onResize = () => {
      measure();
      requestAnimationFrame(() => applyTransform(index));
    };
    window.addEventListener("resize", onResize);
    startCarousel();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      stopCarousel();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyTransform(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, slideWidth]);

  // Modal
  const openModal = (imgEl: HTMLImageElement, level: LevelKey, title: string) => {
    const rect = imgEl.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    setModalTop(rect.bottom + scrollY);
    setModalTitle(title.toUpperCase());
    setModalItems(REWARDS[level] || []);
    setModalOpen(true);
    stopCarousel();
    if (containerRef.current) containerRef.current.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    if (containerRef.current) containerRef.current.style.overflow = "auto";
    startCarousel();
  };

  return (
    <main>
      <header className="hdr">
        <Link href="/profile" className="btn-retour">
          RETOUR
        </Link>

        {/* Bloc entête membre (identique à ta version HTML) */}
        <div className="user-membership">
          <div className="user-line">
            <span id="user-name">{userName}</span> – Membre{" "}
            <span id="user-tier">{tier}</span>
          </div>
          <div className="user-points">
            Points cumulés: <span id="user-points">{fmt.format(totalSpend)}</span>
          </div>
        </div>

        <h1 className="page-title">Adhésion</h1>
      </header>

      {/* Image d’en-tête */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://via.placeholder.com/800x240"
        alt="Adhésion"
        className="membership-image"
      />

      {/* Intro */}
      <section className="section">
        <h2>Débloquer les récompenses réservées aux membres</h2>
      </section>

      <section className="section">
        <h4>Comment ça marche ?</h4>
        <p>
          Dès la création de votre compte, vous devenez membre.
          <br />
          Votre niveau est déterminé par le montant total de vos achats. L’année de
          fidélité se renouvelle tous les 12 mois, mais vous pouvez à tout moment
          débloquer de nouveaux avantages et en profiter pleinement.
          <br />
          Pour des accès à des ventes privées, remises exclusives, livraisons
          offertes et accompagnements personnalisés par un(e) styliste dédié(e) :
          entrez dans l&apos;univers dès aujourd’hui.
        </p>
      </section>

      {/* Vos récompenses */}
      <section className="section rewards-section">
        <h3>Vos récompenses</h3>

        <div className="rewards-carousel" id="carousel" ref={containerRef}>
          <div className="carousel-track" id="carousel-track" ref={trackRef}>
            {SLIDES.map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s.key}
                ref={(el) => {
                  if (el) imgRefs.current[i] = el;
                }}
                src={s.src}
                alt={s.alt}
                className="reward-image"
                onClick={(e) => openModal(e.currentTarget, s.key, s.alt)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal récompenses */}
      <div
        id="reward-modal"
        className={`reward-modal ${modalOpen ? "show" : ""}`}
        style={{ top: modalTop }}
      >
        <div className="reward-modal-content">
          <button className="close-button" onClick={closeModal} aria-label="Fermer">
            -
          </button>
          <h2 id="modal-title">{modalTitle}</h2>
          <ul id="reward-list">
            {modalItems.map((it, idx) => (
              <li key={idx}>{it}</li>
            ))}
          </ul>
        </div>
      </div>

    </main>
  );
}
