"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Favorite = {
  id?: string;
  slug?: string;
  name?: string;
  brand?: string;
  price?: number;
  size?: string;
  quantity?: number;
  image?: string;
  color?: string;
  href?: string;
};

type TokomiList = {
  id: string;
  title: string;
  items?: Favorite[];
  covers?: string[]; // compat ancien schéma
};

const LS_LISTS = "tokomiLists";
const PLACEHOLDER = "https://via.placeholder.com/600x900?text=%20";

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function ListDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const [lists, setLists] = useState<TokomiList[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // sélection
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // modale de confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");
  const [onConfirm, setOnConfirm] = useState<null | (() => void)>(null);

  // charge les listes + sync inter-onglets
  useEffect(() => {
    setLists(readJSON<TokomiList[]>(LS_LISTS, []));
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_LISTS) setLists(readJSON<TokomiList[]>(LS_LISTS, []));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // retrouve la liste: id (route) > legacy id > legacy titre
  const currentList = useMemo(() => {
    const arr = lists;
    const byId = arr.find((l) => String(l.id) === String(params.id));
    if (byId) return byId;
    const legacyId = localStorage.getItem("tokomiSelectedListId");
    if (legacyId) {
      const byLegacyId = arr.find((l) => String(l.id) === String(legacyId));
      if (byLegacyId) return byLegacyId;
    }
    const legacyTitle = localStorage.getItem("tokomiCurrentList");
    if (legacyTitle) {
      const byTitle = arr.find((l) => l?.title === legacyTitle);
      if (byTitle) return byTitle;
    }
    return undefined;
  }, [lists, params.id]);

  // source d’items: items[] prioritaire, sinon covers[]
  const sourceType: "items" | "covers" | "none" = useMemo(() => {
    if (currentList?.items && currentList.items.length) return "items";
    if (currentList?.covers && currentList.covers.length) return "covers";
    return "none";
  }, [currentList]);

  const displayItems = useMemo(() => {
    if (!currentList) return [];
    if (sourceType === "items") {
      return (currentList.items || []).map((it, idx) => ({
        idx,
        name: it.name || `Article ${idx + 1}`,
        image: it.image || PLACEHOLDER,
        href: it.href || "/product/tokomi",
      }));
    }
    if (sourceType === "covers") {
      return (currentList.covers || []).map((src, idx) => ({
        idx,
        name: `Article ${idx + 1}`,
        image: src || PLACEHOLDER,
        href: "/product/tokomi",
      }));
    }
    return [];
  }, [currentList, sourceType]);

  const count = displayItems.length;

  // helpers
  function saveLists(next: TokomiList[]) {
    setLists(next);
    writeJSON(LS_LISTS, next);
  }

  function toggleMenu() {
    setMenuOpen((s) => !s);
  }

  function enterSelection() {
    setMenuOpen(false);
    setSelectionMode(true);
    setSelected(new Set());
  }

  function exitSelection() {
    setSelectionMode(false);
    setSelected(new Set());
  }

  function toggleOne(i: number) {
    const next = new Set(selected);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setSelected(next);
  }

  function toggleAll() {
    const allSelected = count > 0 && displayItems.every((d) => selected.has(d.idx));
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(displayItems.map((d) => d.idx)));
  }

  function askConfirm(message: string, action: () => void) {
    setConfirmMsg(message);
    setOnConfirm(() => action);
    setConfirmOpen(true);
  }
  function closeConfirm() {
    setConfirmOpen(false);
    setOnConfirm(null);
  }

  function deleteSelected() {
    if (!currentList) return;
    if (selected.size === 0) return;

    askConfirm(
      `Supprimer de ${currentList.title.toUpperCase()} ?`,
      () => {
        const nextLists = lists.map((l) => {
          if (l.id !== currentList.id) return l;
          if (sourceType === "items") {
            const keep = (l.items || []).filter((_, i) => !selected.has(i));
            return { ...l, items: keep };
          }
          if (sourceType === "covers") {
            const keep = (l.covers || []).filter((_, i) => !selected.has(i));
            return { ...l, covers: keep };
          }
          return l;
        });
        saveLists(nextLists);
        closeConfirm();
        exitSelection();
      }
    );
  }

  return (
    <main>
      {/* Header */}
      <div className="header">
        {!selectionMode ? (
          <button className="btn-back" onClick={() => router.push("/lists")}>
            RETOUR
          </button>
        ) : (
          <button className="btn-back" onClick={exitSelection}>
            ANNULER
          </button>
        )}

        <div className="menu-wrapper" style={{ position: "relative" }}>
          {!selectionMode ? (
            <>
              <div id="menuToggle" className="menu-icon" onClick={toggleMenu}>
                PLUS
              </div>
              {menuOpen && (
                <div
                  className="context-menu"
                  onClick={(e) => e.stopPropagation()}
                  style={{ display: "block" }}
                >
                  <div onClick={enterSelection}>SÉLECTIONNER</div>
                </div>
              )}
            </>
          ) : (
            <button
              className="menu-icon"
              id="menuToggle"
              onClick={toggleAll}
              style={{ background: "none", border: "none" }}
            >
              {selected.size === count
                ? `TOUT DÉSÉLECTIONNER (${selected.size})`
                : `TOUT SÉLECTIONNER (${selected.size})`}
            </button>
          )}
        </div>
      </div>

      {/* Titre + compteur */}
      <div className="list-title">
        {currentList ? (currentList.title || "SANS NOM").toUpperCase() : "LISTE INTROUVABLE"}
      </div>
      <div className="list-count">
        {count === 0
          ? "AUCUN ARTICLE POUR L’INSTANT"
          : `${count} ARTICLE${count > 1 ? "S" : ""}`}
      </div>

      {/* Grille produits */}
      <div id="listDetailContainer" className="product-grid">
        {displayItems.map((it) => {
          const isSelected = selected.has(it.idx);
          const selectableClass = selectionMode ? "selectable" : "";
          const selectedClass = isSelected ? "selected" : "";
          return (
            <Link
              key={it.idx}
              href={it.href}
              className={`product-link ${selectableClass} ${selectedClass}`}
              onClick={(e) => {
                if (selectionMode) {
                  e.preventDefault();
                  toggleOne(it.idx);
                }
              }}
            >
              <img className="product-thumb" src={it.image || PLACEHOLDER} alt={it.name} />
            </Link>
          );
        })}
      </div>

      {/* Barre d’actions sélection */}
      {selectionMode && (
        <div
          className="selection-actions"
          id="selectionActions"
          style={{ display: selected.size > 0 ? "flex" : "none" }}
        >
          <button onClick={deleteSelected}>SUPPRIMER</button>
        </div>
      )}

      {/* Footer */}
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

      {/* Modale confirmation */}
      {confirmOpen && (
        <div
          id="confirmModal"
          className="confirm-overlay"
          onClick={closeConfirm}
          role="dialog"
          aria-modal="true"
        >
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <p id="confirmText">{confirmMsg}</p>
            <div className="confirm-actions">
              <button onClick={closeConfirm} className="btn-secondary">
                Annuler
              </button>
              <button
                id="confirmBtn"
                className="btn-primary"
                onClick={() => {
                  onConfirm?.();
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

