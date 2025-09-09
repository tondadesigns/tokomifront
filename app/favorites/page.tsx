"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Favorite = {
  id?: string;
  slug?: string;
  name: string;
  brand?: string;
  price: number;
  size?: string;
  quantity?: number;
  image?: string;
  color?: string;
  timestamp?: number;
};

type TokomiList = {
  id: string;
  title: string;
  items: Favorite[];
};

const LS_FAV = "tokomi_favorites";
const LS_CART = "tokomi_cart_items";
const LS_LISTS = "tokomiLists";

function keyForItem(it: Favorite) {
  return `${it.id || it.slug || it.name || ""}|${it.size || ""}`;
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export default function FavoritesPage() {
  const router = useRouter();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [cart, setCart] = useState<Favorite[]>([]);
  const [lists, setLists] = useState<TokomiList[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // Modales
  const [listModalOpen, setListModalOpen] = useState(false);
  const [createListOpen, setCreateListOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Pour l’ajout direct d’un item unique à une liste
  const [pendingSingleKey, setPendingSingleKey] = useState<string | null>(null);

  // ---- Chargement initial
  useEffect(() => {
    // seed de listes si aucune
    const currentLists = readJSON<TokomiList[]>(LS_LISTS, []);
    if (!currentLists || currentLists.length === 0) {
      const seed = [
        { id: "1", title: "Préférés", items: [] },
        { id: "2", title: "Cadeaux", items: [] },
      ] as TokomiList[];
      writeJSON(LS_LISTS, seed);
      setLists(seed);
    } else {
      setLists(currentLists);
    }

    setFavorites(readJSON<Favorite[]>(LS_FAV, []));
    setCart(readJSON<Favorite[]>(LS_CART, []));
  }, []);

  // ---- Sync inter-onglets
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (!e.key) return;
      if (e.key === LS_FAV) setFavorites(readJSON<Favorite[]>(LS_FAV, []));
      if (e.key === LS_CART) setCart(readJSON<Favorite[]>(LS_CART, []));
      if (e.key === LS_LISTS) setLists(readJSON<TokomiList[]>(LS_LISTS, []));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const cartCount = cart.length;
  const favoritesCount = favorites.length;
  const listsCount = lists.length;

  // ---- Actions élémentaires LS + state
  function saveFavorites(next: Favorite[]) {
    setFavorites(next);
    writeJSON(LS_FAV, next);
  }
  function saveCart(next: Favorite[]) {
    setCart(next);
    writeJSON(LS_CART, next);
  }
  function saveLists(next: TokomiList[]) {
    setLists(next);
    writeJSON(LS_LISTS, next);
  }

  // ---- Cart <-> Fav
  function moveFavoriteToCartByIndex(index: number) {
    const fav = favorites[index];
    if (!fav) return;

    const k = keyForItem(fav);
    const nextCart = [...cart];
    const existing = nextCart.find((c) => keyForItem(c) === k);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      nextCart.push({ ...fav, quantity: fav.quantity || 1 });
    }

    const nextFavs = favorites.slice();
    nextFavs.splice(index, 1);

    saveCart(nextCart);
    saveFavorites(nextFavs);
    // Nettoie la sélection si besoin
    if (selectionMode) {
      const nextSel = new Set(selectedKeys);
      nextSel.delete(k);
      setSelectedKeys(nextSel);
    }
  }

  function removeFavoriteByIndex(index: number) {
    const fav = favorites[index];
    if (!fav) return;
    const k = keyForItem(fav);
    const next = favorites.slice();
    next.splice(index, 1);
    saveFavorites(next);
    if (selectionMode) {
      const nextSel = new Set(selectedKeys);
      nextSel.delete(k);
      setSelectedKeys(nextSel);
    }
  }

  // ---- Sélection
  const allKeys = useMemo(() => favorites.map(keyForItem), [favorites]);

  function toggleSelectionMode() {
    if (selectionMode) {
      setSelectionMode(false);
      setSelectedKeys(new Set());
    } else {
      setSelectionMode(true);
      setSelectedKeys(new Set());
    }
  }

  function toggleKey(k: string) {
    const next = new Set(selectedKeys);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    setSelectedKeys(next);
  }

  function selectAllOrNone() {
    const allSelected =
      allKeys.length > 0 && allKeys.every((k) => selectedKeys.has(k));
    setSelectedKeys(allSelected ? new Set() : new Set(allKeys));
  }

  // ---- Suppression groupée
  function confirmDeleteSelected() {
    setConfirmOpen(true);
  }
  function doDeleteSelected() {
    const next = favorites.filter((f) => !selectedKeys.has(keyForItem(f)));
    saveFavorites(next);
    setSelectedKeys(new Set());
    setSelectionMode(false);
    setConfirmOpen(false);
  }

  // ---- Listes
  function openAddToListForIndex(index: number) {
    const k = keyForItem(favorites[index]);
    setPendingSingleKey(k);
    setListModalOpen(true);
  }

  function addKeysToList(listId: string, keys: string[]) {
    const L = lists.slice();
    const target = L.find((l) => String(l.id) === String(listId));
    if (!target) return;

    target.items = Array.isArray(target.items) ? target.items : [];

    const toAdd = favorites.filter((f) => keys.includes(keyForItem(f)));
    toAdd.forEach((p) => {
      const pKey = keyForItem(p);
      const exists = target.items.some((it) => keyForItem(it) === pKey);
      if (!exists) target.items.push({ ...p, quantity: p.quantity || 1 });
    });

    saveLists(L);
  }

  function addSelectedToList(listId: string) {
    if (pendingSingleKey) {
      addKeysToList(listId, [pendingSingleKey]);
      setPendingSingleKey(null);
      setListModalOpen(false);
      alert("Ajouté à la liste.");
      return;
    }
    if (selectedKeys.size === 0) return;
    addKeysToList(listId, Array.from(selectedKeys));
    setListModalOpen(false);
    alert("Ajouté à la liste.");
  }

  function createList(title: string) {
    const t = title.trim();
    if (!t) return;
    const next: TokomiList[] = [
      ...lists,
      { id: Date.now().toString(), title: t, items: [] },
    ];
    saveLists(next);
    setCreateListOpen(false);
  }

  // ---- Rendu
  return (
    <main>
      {/* Header */}
      <div className="header">
        <button className="btn-retour" onClick={() => router.push("/profile")}>
          RETOUR
        </button>

  
          ) : (
            <button className="btn-back" id="menuToggle" onClick={toggleSelectionMode}>
              SÉLECTIONNER
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <Link href="/cart" className="tab-link">
          PANIER <strong id="cart-count">{cartCount}</strong>
        </Link>
        <span className="active">
          FAVORIS <strong id="favorites-count">{favoritesCount}</strong>
        </span>
        <Link href="/lists" className="tab-link">
          LISTES <strong id="lists-count">{listsCount}</strong>
        </Link>
      </div>

      {/* Contenu */}
      <div id="favorites-items">
        {favorites.length === 0 ? (
          <p className="empty-message">Aucun favori pour l’instant.</p>
        ) : (
          favorites.map((item, index) => {
            const k = keyForItem(item);
            const checked = selectedKeys.has(k);
            return (
              <div
                key={k}
                className="fav-row product"
                data-index={index}
                data-key={k}
              >
                <div
                  className="fav-image"
                  style={{
                    backgroundImage: `url('${item.image || ""}')`,
                  }}
                  onClick={() => {
                    if (!selectionMode) return;
                    toggleKey(k);
                  }}
                />
                <div className="fav-info">
                  <div className="brand">
                    {(item.brand || item.name || "").toUpperCase()}
                  </div>
                  <div className="product-name">
                    {(item.name || "").toUpperCase()}
                  </div>
                  <div className="price">€{item.price}</div>

                  <div className="shopping-bin">
                    <button
                      className="shopping-btn"
                      onClick={() => moveFavoriteToCartByIndex(index)}
                    >
                      AJOUTER AU PANIER
                    </button>
                    <button
                      className="shopping-btn"
                      onClick={() => openAddToListForIndex(index)}
                    >
                      AJOUTER À LA LISTE
                    </button>
                    <button
                      className="shopping-btn"
                      onClick={() => removeFavoriteByIndex(index)}
                    >
                      SUPPRIMER
                    </button>
                  </div>

                  {selectionMode && (
                    <label className="selection-radio" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleKey(k)}
                      />
                      <span className="custom-check" />
                    </label>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Actions de sélection */}
      {selectionMode && (
        <div
          className="selection-actions"
          id="selectionActions"
          style={{ display: selectedKeys.size > 0 ? "flex" : "none" }}
        >
          <button
            id="btnAddToList"
            onClick={() => setListModalOpen(true)}
            disabled={selectedKeys.size === 0}
          >
            AJOUTER À LA LISTE
          </button>
          <button
            id="btnDelete"
            onClick={confirmDeleteSelected}
            disabled={selectedKeys.size === 0}
          >
            SUPPRIMER
          </button>
        </div>
      )}

      {/* Footer nav */}
      <footer className="sticky-footer">
        <Link href="/home" className="menu-item active">
          <span>ACCUEIL</span>
        </Link>
        <Link href="/explorer" className="menu-item">
          <span>EXPLORER</span>
        </Link>
        <Link href="/profile" className="menu-item">
          <span>PROFIL</span>
        </Link>
      </footer>

      {/* MODALE : Confirmation suppression */}
      {confirmOpen && (
        <div className="modal-backdrop" onClick={() => setConfirmOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <p className="confirm-text">
              {`Supprimer ${selectedKeys.size} article${
                selectedKeys.size > 1 ? "s" : ""
              } ?`}
            </p>
            <div className="confirm-actions">
              <button className="btn-cancel-ghost" onClick={() => setConfirmOpen(false)}>
                Annuler
              </button>
              <button className="btn-delete-solid" onClick={doDeleteSelected}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE : Ajouter à (listes) */}
      {listModalOpen && (
        <div className="liste-dropdown show" aria-hidden="false" onClick={() => { setListModalOpen(false); setPendingSingleKey(null); }}>
          <div
            className="liste-dropdown-content"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="liste-header">
              <h4>AJOUTER À</h4>
              <button
                className="liste-close"
                onClick={() => {
                  setListModalOpen(false);
                  setPendingSingleKey(null);
                }}
                aria-label="Fermer"
              >
                FERMER
              </button>
            </div>

            <div id="listeItems" className="liste-items">
              {lists.length === 0 ? (
                <div style={{ padding: 12, fontSize: 13 }}>
                  Aucune liste trouvée.&nbsp;
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setListModalOpen(false);
                      setCreateListOpen(true);
                    }}
                    style={{ textDecoration: "underline", color: "#111" }}
                  >
                    Créer une liste
                  </a>
                </div>
              ) : (
                lists.map((list) => (
                  <div
                    key={list.id}
                    className="list-card-item"
                    onClick={() => addSelectedToList(list.id)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div>{(list.title || "Sans nom").toUpperCase()}</div>
                      <div className="list-meta">
                        {(list.items?.length || 0)} élément(s)
                      </div>
                    </div>
                    <div />
                  </div>
                ))
              )}
            </div>

            <div className="liste-footer">
              <Link href="/lists" className="liste-manage">
                Gérer les listes
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MODALE : Créer une liste */}
      {createListOpen && (
        <div className="modal show" aria-hidden="false" onClick={() => setCreateListOpen(false)}>
          <div
            className="create-list-form-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setCreateListOpen(false)}
              style={{
                position: "absolute",
                top: 9,
                right: 8,
                background: "none",
                border: "none",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 12,
                fontWeight: 300,
                cursor: "pointer",
                color: "black",
              }}
            >
              FERMER
            </button>

            <div className="create-list-form" id="createListForm">
              <input
                type="text"
                id="listName"
                placeholder="NOM DE LA LISTE"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const el = e.currentTarget as HTMLInputElement;
                    createList(el.value);
                  }
                }}
              />
              <button
                onClick={() => {
                  const el = document.getElementById(
                    "listName"
                  ) as HTMLInputElement | null;
                  createList(el?.value || "");
                }}
              >
                CRÉER
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

