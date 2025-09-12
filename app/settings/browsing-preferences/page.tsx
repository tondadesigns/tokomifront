"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type UiChoice = "masculin" | "feminin";
type Stored = "men" | "women";

const GENDER_KEY = "tokomi_explore_gender";
const UI_TO_STORE: Record<UiChoice, Stored> = { masculin: "men", feminin: "women" };
const STORE_TO_UI: Record<Stored, UiChoice> = { men: "masculin", women: "feminin" };

export default function BrowsingPreferencesPage() {
  const [selected, setSelected] = useState<UiChoice | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const pref = localStorage.getItem(GENDER_KEY) as Stored | null;
      if (pref && STORE_TO_UI[pref]) {
        setSelected(STORE_TO_UI[pref]);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleSelect = (choice: UiChoice) => {
    setSelected(choice);
    try {
      localStorage.setItem(GENDER_KEY, UI_TO_STORE[choice]);
    } catch {
      /* ignore */
    }
  };

  return (
    <main>
      <button className="btn-retour">
        <Link href="/profile">RETOUR</Link>
      </button>

      <div className="title">Préférences de navigation</div>

      <div className="container">
        <label className="catalogue-option" htmlFor="masculin">
          <span className="catalogue-label">Catalogue masculin</span>
          <input
            type="radio"
            name="catalogue"
            id="masculin"
            checked={selected === "masculin"}
            onChange={() => handleSelect("masculin")}
          />
          <span
            className="custom-radio"
            role="radio"
            aria-checked={selected === "masculin"}
            aria-label="Catalogue masculin"
            onClick={() => handleSelect("masculin")}
          />
        </label>

        <label className="catalogue-option" htmlFor="feminin">
          <span className="catalogue-label">Catalogue féminin</span>
          <input
            type="radio"
            name="catalogue"
            id="feminin"
            checked={selected === "feminin"}
            onChange={() => handleSelect("feminin")}
          />
          <span
            className="custom-radio"
            role="radio"
            aria-checked={selected === "feminin"}
            aria-label="Catalogue féminin"
            onClick={() => handleSelect("feminin")}
          />
        </label>
      </div>

    </main>
  );
}
