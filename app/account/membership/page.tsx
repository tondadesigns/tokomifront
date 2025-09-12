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
  { src: "/bronze.jpg", alt: "Bronze", key: "bronze" },
  { src: "/argent.jpg", alt: "Argent", key: "argent" },
  { src: "/or.jpg", alt: "Or", key: "or" },
  { src: "/platine.jpg", alt: "Platine", key: "platine" },
  { src: "/client-prive.jpg", alt: "Client privé", key: "client-prive" },
];

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

  // Measure slide width (image + horizontal margins)
  const measure = () => {
    const el = imgRefs.current[0];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const styles = window.getComputedStyle(el);
    const ml = parseFloat(styles.marginLeft) || 0;
    const mr = parseFloat(styles.marginRight) || 0;
    setSlideWidth(rect.width + ml + mr);
  };

  // Apply transform whenever index/slideWidth changes
  const applyTransform = (i: number) => {
    const track = trackRef.current;
    if (!track || !slideWidth) return;
    track.style.transform = `translateX(-${i * slideWidth}px)`;
  };

  // Carousel start/stop
  const startCarousel = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % SLIDES.length;
        return next;
      });
    }, 3000);
  };

  const stopCarousel = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Effects
  useEffect(() => {
    measure();
    const onResize = () => {
      measure();
      // keep current position aligned after resize
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
