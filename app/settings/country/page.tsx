"use client";

import { useEffect, useMemo, useState } from "react";

/** Persist keys */
const COUNTRY_KEY = "tokomi_country";
const COUNTRY_NAME_KEY = "tokomi_country_name";

/** Utility: slug/ID safe for DOM */
const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Utility: accent-insensitive search */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

type Country = {
  id: string; // unique id (slug)
  name: string;
  /** 2-letter code if available (used for persistence); otherwise falls back to id */
  code?: string;
  /** Full flag image URL */
  flag: string;
};

/** Helper to build a country entry.
 * - If `flagCode` looks like a URL (starts with http), it will be used directly.
 * - Otherwise we assume it is the code segment used by flagcdn (e.g., "fr", "xx").
 */
const C = (name: string, codeOrSlug: string | undefined, flagCode: string) => {
  const id = slug(name);
  const flag =
    /^https?:\/\//i.test(flagCode)
      ? flagCode
      : `https://flagcdn.com/w40/${flagCode}.png`;
  return { id, name, code: codeOrSlug, flag } as Country;
};

/** ⚠️ This list mirrors your HTML exactly (including placeholder flag codes like "xx"). */
const COUNTRIES: Country[] = [
  C("Afghanistan", "af", "af"),
  C("Afrique du Sud", undefined, "xx"),
  C("Albanie", undefined, "xx"),
  C("Algérie", undefined, "xx"),
  C("Allemagne", undefined, "xx"),
  C("Andorre", undefined, "xx"),
  C("Angola", "ao", "ao"),
  C("Argentine", "ar", "ar"),
  C("Arménie", undefined, "xx"),
  C("Australie", undefined, "xx"),
  C("Autriche", undefined, "xx"),
  C("Azerbaïdjan", undefined, "xx"),
  C("Belgique", undefined, "xx"),
  C("Botswana", "bw", "bw"),
  C("Brésil", undefined, "xx"),
  C("Burkina Faso", "bf", "bf"),
  C("Burundi", "bi", "bi"),
  C("Bénin", "bj", "bj"),
  C("Cameroun", undefined, "xx"),
  C("Canada", "ca", "ca"),
  C("Chili", undefined, "xx"),
  C("Chine", undefined, "xx"),
  C("Colombie", undefined, "xx"),
  C("Comores", undefined, "xx"),
  C("Congo-Brazzaville", "cg", "cg"),
  C("Congo-Kinshasa", undefined, "xx"),
  C("Croatie", undefined, "xx"),
  C("Danemark", undefined, "xx"),
  C("Djibouti", "dj", "dj"),
  C("Égypte", undefined, "xx"),
  C("Espagne", undefined, "xx"),
  C("États-Unis", undefined, "xx"),
  C("Éthiopie", undefined, "xx"),
  C("Finlande", undefined, "xx"),
  C("France", "fr", "fr"),
  C("Gabon", "ga", "ga"),
  C("Ghana", "gh", "gh"),
  C("Grèce", undefined, "xx"),
  C("Guinée", undefined, "xx"),
  C("Haïti", "ht", "ht"),
  // Note: your HTML used pg.png for "Inde" — preserved as-is
  C("Inde", "in", "pg"),
  C("Indonésie", undefined, "xx"),
  C("Irlande", undefined, "xx"),
  C("Islande", undefined, "xx"),
  C("Italie", undefined, "xx"),
  C("Japon", undefined, "xx"),
  C("Kenya", "ke", "ke"),
  C("Liban", "lb", "lb"),
  C("Luxembourg", "lu", "lu"),
  C("Madagascar", "mg", "mg"),
  C("Malawi", "mw", "mw"),
  C("Mali", "ml", "ml"),
  C("Maroc", undefined, "xx"),
  C("Maurice", undefined, "xx"),
  C("Mexique", undefined, "xx"),
  C("Monaco", "mc", "mc"),
  C("Mozambique", "mz", "mz"),
  C("Namibie", undefined, "xx"),
  // Note: your HTML used ng.png for "Niger" (which is actually NIgeria's ISO); preserved
  C("Niger", "ne", "ng"),
  C("Nigéria", "ng", "ng"),
  C("Norvège", undefined, "xx"),
  C("Nouvelle-Zélande", undefined, "xx"),
  C("Ouganda", undefined, "xx"),
  C("Pakistan", "pk", "pk"),
  C("Pays-Bas", undefined, "xx"),
  C("Philippines", "ph", "ph"),
  C("Pologne", undefined, "xx"),
  C("Portugal", "pt", "pt"),
  C("Pérou", undefined, "xx"),
  C("Qatar", "qa", "qa"),
  C("Roumanie", undefined, "xx"),
  C("Rwanda", "rw", "rw"),
  C("Serbie", undefined, "xx"),
  C("Singapour", undefined, "xx"),
  C("Slovaquie", undefined, "xx"),
  C("Slovénie", undefined, "xx"),
  C("Somalie", undefined, "xx"),
  C("Suisse", undefined, "xx"),
  C("Suède", undefined, "xx"),
  C("Sénégal", "sn", "sn"),
  C("Tanzanie", undefined, "xx"),
  C("Tchad", undefined, "xx"),
  C("Thaïlande", undefined, "xx"),
  C("Togo", "tg", "tg"),
  C("Tunisie", undefined, "xx"),
  C("Turquie", undefined, "xx"),
  C("Ukraine", "ua", "ua"),
  C("Uruguay", "uy", "uy"),
  C("Venezuela", "ve", "ve"),
  C("Vietnam", "vn", "vn"),
  C("Zambie", undefined, "xx"),
  C("Zimbabwe", "zw", "zw"),
];

export default function CountrySettingsPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Hydrate previously saved choice
  useEffect(() => {
    try {
      const savedCode = localStorage.getItem(COUNTRY_KEY);
      const savedName = localStorage.getItem(COUNTRY_NAME_KEY);
      if (!savedCode && !savedName) return;

      // Prefer matching by code, then by name
      const byCode = savedCode
        ? COUNTRIES.find((c) => c.code === savedCode)
        : undefined;
      const byName = !byCode && savedName
        ? COUNTRIES.find((c) => c.name === savedName)
        : undefined;

      const found = byCode || byName;
      if (found) setSelectedId(found.id);
    } catch {
      /* noop */
    }
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return COUNTRIES;
    const q = norm(query);
    return COUNTRIES.filter((c) => norm(c.name).includes(q));
  }, [query]);

  const selectCountry = (c: Country) => {
    setSelectedId(c.id);
    try {
      localStorage.setItem(COUNTRY_KEY, c.code || c.id);
      localStorage.setItem(COUNTRY_NAME_KEY, c.name);
    } catch {
      /* ignore */
    }
  };

  const goBack = () => {
    window.location.href = "profil.html";
  };

  return (
    <main>
      <button className="btn-retour" onClick={goBack}>
        RETOUR
      </button>

      <div className="title">Pays</div>

      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="OÙ RECHERCHEZ-VOUS ?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="container">
        {filtered.map((c) => {
          const inputId = `country-${c.id}`;
          return (
            <label className="country-option" key={c.id} htmlFor={inputId}>
              <div className="left-info">
                <img className="flag" src={c.flag} alt={c.name} />
                <span className="country-label">{c.name}</span>
              </div>
              <input
                type="radio"
                name="country"
                id={inputId}
                checked={selectedId === c.id}
                onChange={() => selectCountry(c)}
              />
              <span
                className="custom-radio"
                onClick={(e) => {
                  e.preventDefault();
                  selectCountry(c);
                }}
              />
            </label>
          );
        })}
      </div>

    </main>
  );
}
