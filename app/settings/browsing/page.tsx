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

      {/* Styles */}
      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          background-color: #fff;
          font-family: "Space Grotesk", sans-serif;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
      `}</style>

      <style jsx>{`
        .btn-retour {
          position: absolute;
          left: 10px;
          top: 54px;
          background: none;
          border: none;
          color: black;
          font-size: 11px;
          font-weight: 300;
          cursor: pointer;
          font-family: "Space Grotesk", sans-serif;
          padding: 0;
        }

        .title {
          text-align: center;
          margin-top: 120px;
          font-family: "Space Grotesk", sans-serif;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .container {
          margin-top: -38px;
          padding: 120px 24px 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .catalogue-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
        }

        .catalogue-label {
          font-size: 11px;
          font-weight: 300;
          color: #333;
          text-transform: uppercase;
        }

        .custom-radio {
          width: 12px;
          height: 12px;
          border: 1px solid #333;
          border-radius: 50%;
          position: relative;
          cursor: pointer;
          display: inline-block;
        }

        .custom-radio::after {
          content: "";
          width: 6px;
          height: 6px;
          background-color: #000;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.2s ease;
        }

        /* Hide native radios (we still keep them for accessibility & keyboard nav) */
        input[type="radio"] {
          display: none;
        }

        /* When radio is checked, fill the custom dot */
        #masculin:checked + .custom-radio::after,
        #feminin:checked + .custom-radio::after {
          transform: translate(-50%, -50%) scale(1);
        }
      `}</style>
    </main>
  );
}
