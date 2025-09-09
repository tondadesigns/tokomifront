"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Audience = "femme" | "homme" | "enfant";
type SortMode = "PRIX CROISSANT" | "PRIX DÉCROISSANT" | null;

type Product = {
  brand: string;
  name: string;
  tags: string[];
  price: number;
  audience: Audience;
};

const ALL_PRODUCTS: Product[] = [
  { brand: "RICK OWENS",   name: "BASKETS GEOBASKET", tags: ["RICK OWENS","CHAUSSURES","NOIR"], price: 400, audience: "homme" },
  { brand: "BALENCIAGA",   name: "TRIPLE S CLEAR SOLE", tags: ["BALENCIAGA","CHAUSSURES","NOIR"], price: 520, audience: "femme" },
  { brand: "FEAR OF GOD",  name: "ESSENTIALS HOODIE", tags: ["FEAR OF GOD","VÊTEMENTS","NOIR"], price: 350, audience: "homme" },
  { brand: "KITH",         name: "CHELSEA BOOTS",     tags: ["KITH","CHAUSSURES","BEIGE"], price: 260, audience: "enfant" },
  // ajoute d’autres items si besoin
];

const SUBCATS: Record<Audience, string[]> = {
  femme:  ["Robes","Talons","Bijoux","Vestes","Bags","Casual","Workwear","Sport","Soirée","Lingerie","Été","Nouveautés","Minimal","Chic"],
  homme:  ["Sneakers","Pantalons","Chemises","Vestes","Accessoires","Business","Casual","Luxe","Créateurs","Streetwear","Sacs","Sport","T-shirts","Caps"],
  enfant: ["Pyjamas","Jeux","Mini looks","T-shirts","Sandales","Vestes","Bibs","Sport","Accessoires","Tenues cérémonie","Doudounes","École","Mini sacs","Basics"],
};

const FILTER_DATA = {
  categories: ["MODE","MANTEAUX & BLOUSONS","COSTUMES","BLAZERS & VESTES","CHEMISES","POLO, T-SHIRTS & DÉBARDEURS","SWEATERS & KNITWEAR","PANTALONS","JEANS","MAILLOTS DE BAIN & PLAGE","CHAUSSURES","SANDALES & MULES","ESCARPINS","BASKETS","BOTTES & BOTTINES","MOCASSINS & DERBIES","ACCESSOIRES","SACS","BIJOUX"],
  marques: ["3.PARADIS","ACNE STUDIOS","ALEXANDER MCQUEEN","BALENCIAGA","BOTTEGA VENETA","BURBERRY","CELINE","FEAR OF GOD","GUCCI","ISABEL MARANT","JACQUEMUS","LEMAIRE","LOEWE","MAISON MARGIELA","NIKE","OFF-WHITE","PRADA","RICK OWENS","SAINT LAURENT","THE ROW","Y/PROJECT","ZEGNA"],
  couleurs: ["BLANC","BLEU","BRUN","GRIS","JAUNE","NOIR","ORANGE","ROSE","ROUGE","VERT"],
  tailles: ["XXS","XS","S","M","L","XL","XXL","32","34","36","38","40","42","44","46","48","50","52","54"],
  nouveautes: ["NOUVEAUX ARRIVAGES","BESTSELLERS","COLLECTIONS CAPSULES","EN AVANT-PREMIÈRE","DERNIÈRES CHANCES"],
  origine: ["EU","US","JP","UK","FR","IT"],
  selections: ["CURATED BY TOKOMI","DESIGNERS ÉMERGENTS","DURABLE","POUR ELLE/POUR LUI"],
};

const LETTERS = ["#",..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];
const RECOMMENDED_KEYS = new Set<string>([
  "BALENCIAGA|TRIPLE S CLEAR SOLE",
  "RICK OWENS|BASKETS GEOBASKET",
]);

function isRecommended(p: Product) {
  return p.tags?.includes("RECOMMANDÉ") || RECOMMENDED_KEYS.has(`${p.brand}|${p.name}`);
}
function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
// Mappe la sous-catégorie affichée vers un tag produit
function mapSubcatToTag(label: string) {
  const l = label.toLowerCase();
  const shoes = ["sneakers","talons","sandales","mules","boots","bottes","bottines","derbies","mocassins","escarpins","chaussures"];
  const cloth = ["robes","pantalons","chemises","vestes","t-shirts","hoodies","sweaters","lingerie","soiree","soirée","workwear","casual","minimal","chic","été","doudounes"];
  if (shoes.some(k => l.includes(k))) return "CHAUSSURES";
  if (cloth.some(k => l.includes(k))) return "VÊTEMENTS";
  return label.toUpperCase();
}

export default function ResultsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL → état initial
  const initialAudience = (searchParams.get("audience") as Audience) || "femme";
  const initialTags = searchParams.getAll("filtre").map(f => f.toUpperCase());

  const [audience, setAudience] = useState<Audience>(initialAudience);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(initialTags));
  const [currentSubcatTag, setCurrentSubcatTag] = useState<string | null>(null);

  const [isFilterOpen, setFilterOpen] = useState(false);
  const [activeFilterKey, setActiveFilterKey] = useState<keyof typeof FILTER_DATA>("categories");
  const [marqueLetter, setMarqueLetter] = useState<string | null>(null);

  const [isSortOpen, setSortOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>(null);
  const [recommendedOnly, setRecommendedOnly] = useState<boolean>(false);

  // Rafraîchi l’état depuis l’URL quand elle change (navigations internes)
  useEffect(() => {
    const a = (searchParams.get("audience") as Audience) || "femme";
    setAudience(a);
    setSelectedTags(new Set(searchParams.getAll("filtre").map(f => f.toUpperCase())));
  }, [searchParams]);

  // Produits filtrés
  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS.filter(p => p.audience === audience);

    // tags (depuis URL + UI)
    const tags = Array.from(selectedTags);
    if (tags.length) {
      list = list.filter(p => tags.every(f => p.tags.includes(f)));
    }

    if (currentSubcatTag) {
      list = list.filter(p => p.tags.includes(currentSubcatTag!));
    }

    if (recommendedOnly) {
      list = list.filter(isRecommended);
    }

    if (sortMode === "PRIX CROISSANT") list = [...list].sort((a,b) => a.price - b.price);
    if (sortMode === "PRIX DÉCROISSANT") list = [...list].sort((a,b) => b.price - a.price);

    return list;
  }, [audience, selectedTags, currentSubcatTag, sortMode, recommendedOnly]);

  // UI helpers
  function pushUrl(nextAudience = audience, nextTags = selectedTags) {
    const params = new URLSearchParams();
    params.set("audience", nextAudience);
    Array.from(nextTags).forEach(t => params.append("filtre", t));
    router.push(`/resultats?${params.toString()}`);
  }

  function toggleTag(name: string) {
    const next = new Set(selectedTags);
    if (next.has(name)) next.delete(name);
    else {
      if (next.size >= 10) { alert("Vous ne pouvez sélectionner que 10 filtres maximum."); return; }
      next.add(name);
    }
    setSelectedTags(next);
  }

  function applyFilters() {
    pushUrl(audience, selectedTags);
    setFilterOpen(false);
  }

  function clearAll() {
    setSelectedTags(new Set());
  }

  function selectSort(option: "RECOMMANDÉ" | "PRIX CROISSANT" | "PRIX DÉCROISSANT") {
    if (option === "RECOMMANDÉ") { setRecommendedOnly(true); setSortMode(null); }
    if (option === "PRIX CROISSANT") { setRecommendedOnly(false); setSortMode("PRIX CROISSANT"); }
    if (option === "PRIX DÉCROISSANT") { setRecommendedOnly(false); setSortMode("PRIX DÉCROISSANT"); }
    setSortOpen(false);
  }

  // Marques filtrées par lettre
  const marquesList = useMemo(() => {
    let list = [...FILTER_DATA.marques].sort((a,b)=>a.localeCompare(b));
    if (marqueLetter) {
      if (marqueLetter === "#") {
        list = list.filter(name => /^[0-9]/.test(name.trim()));
      } else {
        list = list.filter(name => name.trim().charAt(0).toUpperCase() === marqueLetter);
      }
    }
    return list;
  }, [marqueLetter]);

  return (
    <main>
      {/* Top bar */}
      <header className="top-bar">
        <button className="btn-retour" onClick={() => router.back()}>RETOUR</button>
        <button className="btn-panier" onClick={() => router.push("/panier-favoris")}>PANIER</button>
      </header>

      {/* Switch catégories principales */}
      <nav className="category-switch">
        {(["femme","homme","enfant"] as Audience[]).map(cat => (
          <button
            key={cat}
            className={`category-button ${audience===cat ? "active" : ""}`}
            onClick={() => {
              setAudience(cat);
              setCurrentSubcatTag(null);
              pushUrl(cat, selectedTags);
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* Sous-catégories */}
      <div className={`subcategory-carousel ${SUBCATS[audience]?.length ? "" : "hidden"}`}>
        {SUBCATS[audience].map(label => {
          const tag = mapSubcatToTag(label);
          const active = currentSubcatTag === tag;
          return (
            <button
              key={label}
              className={`subcategory ${active ? "active" : ""}`}
              onClick={() => setCurrentSubcatTag(active ? null : tag)}
            >
              {label.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Grille produits */}
      <section className="product-gallery">
        {filtered.map((p) => {
          const slug = slugify(`${p.brand}-${p.name}`);
          return (
            <article
              key={`${p.brand}-${p.name}`}
              className="product-card"
              onClick={() => router.push(`/product/${slug}`)}
            >
              <div className="img-placeholder">
                <div className="color-tag">+ 3 COULEURS</div>
              </div>
              <div className="brand">{p.brand}</div>
              <div className="product-name">{p.name}</div>
              <div className="price">€{p.price}</div>
            </article>
          );
        })}
        {filtered.length === 0 && (
          <p style={{ padding: "16px", fontSize: 12 }}>Aucun résultat pour ces filtres.</p>
        )}
      </section>

      {/* Sticky footer nav */}
      <footer className="sticky-footer">
        <a href="/home" className="menu-item"><span>ACCUEIL</span></a>
        <a href="/explorer" className="menu-item active"><span>EXPLORER</span></a>
        <a href="/profile" className="menu-item"><span>PROFIL</span></a>
      </footer>

      {/* Sticky actions */}
      <div className="sticky-options">
        <button className="option-button" onClick={() => setSortOpen(true)}>TRIER PAR</button>
        <button className="option-button" onClick={() => setFilterOpen(true)}>FILTRES</button>
      </div>

      {/* Overlay tri */}
      {isSortOpen && <div className="sort-overlay" onClick={() => setSortOpen(false)} />}

      {/* Modal tri */}
      <div className={`sort-modal ${isSortOpen ? "active" : ""}`} id="sortModal" role="dialog" aria-label="Trier par">
        <div className="sort-options">
          <div className="sort-item" onClick={() => selectSort("RECOMMANDÉ")}>RECOMMANDÉ</div>
          <div className="sort-item" onClick={() => selectSort("PRIX CROISSANT")}>PRIX CROISSANT</div>
          <div className="sort-item" onClick={() => selectSort("PRIX DÉCROISSANT")}>PRIX DÉCROISSANT</div>
          <div className="sort-title">TRIER PAR</div>
        </div>
      </div>

      {/* Panneau filtres plein écran */}
      {isFilterOpen && (
        <div className="filter-fullscreen active" role="dialog" aria-label="Filtres">
          <div className="filter-topbar">
            <button className="btn-retour" onClick={() => setFilterOpen(false)}>RETOUR</button>
            <div id="filter-tags" className="filter-tags">
              {Array.from(selectedTags).map(tag => (
                <span key={tag} className="filter-tag" onClick={() => toggleTag(tag)}>
                  {tag} ×
                </span>
              ))}
            </div>
            <button className="btn-effacer" onClick={clearAll}>EFFACER</button>
          </div>

          <div className="filter-body">
            {/* Colonne gauche */}
            <div className="filter-left">
              {(
                [
                  ["CATÉGORIES","categories"],
                  ["MARQUES","marques"],
                  ["COULEURS","couleurs"],
                  ["TAILLES","tailles"],
                  ["NOUVEAUTÉS","nouveautes"],
                  ["ORIGINE","origine"],
                  ["SÉLECTIONS","selections"],
                ] as [string, keyof typeof FILTER_DATA][]
              ).map(([label,key]) => (
                <div
                  key={key}
                  className={`filter-link ${activeFilterKey===key ? "active":""}`}
                  onClick={() => { setActiveFilterKey(key); setMarqueLetter(null); }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Centre */}
            <div id="filter-center" className="filter-center">
              {activeFilterKey === "marques" && (
                <p style={{fontSize:12, color:"#666", margin:"0 0 8px 0"}}>Choisissez une lettre</p>
              )}
              {(
                (activeFilterKey === "marques" ? marquesList : FILTER_DATA[activeFilterKey]) as string[]
              ).map(name => (
                <div key={name} className="filter-option" onClick={() => toggleTag(name)}>
                  {name}
                </div>
              ))}
            </div>

            {/* Droite (index lettres pour marques) */}
            <div className={`filter-right ${activeFilterKey==="marques" ? "" : "hidden"}`}>
              {LETTERS.map(L => (
                <div
                  key={L}
                  className={`letter ${marqueLetter===L ? "active" : ""}`}
                  onClick={() => setMarqueLetter(L)}
                >
                  {L}
                </div>
              ))}
            </div>
          </div>

          <div className="filter-footer">
            <button className="apply-button" onClick={applyFilters}>VOIR LES RÉSULTATS</button>
          </div>
        </div>
      )}

    </main>
  );
}
