"use client";

import { useEffect, useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

type PrefKeys = "suivi" | "promos" | "alertes";
type Prefs = Record<PrefKeys, boolean>;

const STORAGE_KEY = "tokomi_notification_prefs";
const DEFAULT_PREFS: Prefs = { suivi: false, promos: false, alertes: false };

export default function NotificationsSettingsPage() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Prefs>;
        setPrefs({ ...DEFAULT_PREFS, ...parsed });
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setAndStore = (next: Prefs) => {
    setPrefs(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const toggle = (key: PrefKeys) => {
    setAndStore({ ...prefs, [key]: !prefs[key] });
  };

  const handleKeyToggle = (key: PrefKeys) => (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle(key);
    }
  };

  return (
    <main>
      <button className="btn-retour" onClick={() => router.back()}>
        RETOUR
      </button>

      <div className="title">Notifications</div>

      <div className="container">
        <label className="notification-option" htmlFor="suivi">
          <span className="notification-label">Suivi des commandes</span>
          <input
            type="checkbox"
            id="suivi"
            checked={prefs.suivi}
            onChange={() => toggle("suivi")}
          />
          <span
            className="custom-radio-check"
            role="checkbox"
            aria-checked={prefs.suivi}
            aria-label="Suivi des commandes"
            tabIndex={0}
            onClick={() => toggle("suivi")}
            onKeyDown={handleKeyToggle("suivi")}
          />
        </label>

        <label className="notification-option" htmlFor="promos">
          <span className="notification-label">Promotions et nouveautés</span>
          <input
            type="checkbox"
            id="promos"
            checked={prefs.promos}
            onChange={() => toggle("promos")}
          />
          <span
            className="custom-radio-check"
            role="checkbox"
            aria-checked={prefs.promos}
            aria-label="Promotions et nouveautés"
            tabIndex={0}
            onClick={() => toggle("promos")}
            onKeyDown={handleKeyToggle("promos")}
          />
        </label>

        <label className="notification-option" htmlFor="alertes">
          <span className="notification-label">Alertes de réapprovisionnement</span>
          <input
            type="checkbox"
            id="alertes"
            checked={prefs.alertes}
            onChange={() => toggle("alertes")}
          />
          <span
            className="custom-radio-check"
            role="checkbox"
            aria-checked={prefs.alertes}
            aria-label="Alertes de réapprovisionnement"
            tabIndex={0}
            onClick={() => toggle("alertes")}
            onKeyDown={handleKeyToggle("alertes")}
          />
        </label>
      </div>

    </main>
  );
}
