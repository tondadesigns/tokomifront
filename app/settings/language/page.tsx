"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    tokomiI18n?: {
      getLang: () => "fr" | "en" | string;
      setLang: (id: "fr" | "en" | string, opts?: { redirect?: boolean; redirectTo?: string }) => void;
    };
  }
}

export default function LanguageSettingsPage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");

  // Hydrate current language from tokomiI18n or localStorage (fallback)
  useEffect(() => {
    try {
      const libLang = window.tokomiI18n?.getLang();
      if (libLang === "fr" || libLang === "en") {
        setLang(libLang);
        return;
      }
      const saved = (localStorage.getItem("tokomi_lang") || "fr") as "fr" | "en";
      setLang(saved === "en" ? "en" : "fr");
    } catch {
      /* noop */
    }
  }, []);

  const redirectToProfile = () => {
    // Keep the same behavior as your HTML: go to profil.html
    window.location.href = "profil.html";
  };

  const selectLangue = (id: "fr" | "en") => {
    setLang(id);
    // Prefer official helper if present
    if (window.tokomiI18n?.setLang) {
      window.tokomiI18n.setLang(id, { redirect: true, redirectTo: "profil.html" });
    } else {
      // Fallback: persist + redirect
      try {
        localStorage.setItem("tokomi_lang", id);
      } catch {
        /* ignore */
      }
      redirectToProfile();
    }
  };

  return (
    <main>
      <button className="btn-retour" type="button" onClick={redirectToProfile}>
        RETOUR
      </button>

      <div className="title">Langue</div>

      <div className="container">
        <label className="langue-option" htmlFor="fr">
          <span className="langue-label">Français</span>
          <input
            type="radio"
            name="langue"
            id="fr"
            checked={lang === "fr"}
            onChange={() => selectLangue("fr")}
          />
          <span className="custom-radio" onClick={() => selectLangue("fr")} />
        </label>

        <label className="langue-option" htmlFor="en">
          <span className="langue-label">Anglais</span>
          <input
            type="radio"
            name="langue"
            id="en"
            checked={lang === "en"}
            onChange={() => selectLangue("en")}
          />
          <span className="custom-radio" onClick={() => selectLangue("en")} />
        </label>
      </div>

    </main>
  );
}
