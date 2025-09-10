"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

const LS_CART = "tokomi_cart_items";
const LS_FAV = "tokomi_favorites";
const LS_LISTS = "tokomiLists";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export default function ListsPage() {
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const [lists, setLists] = useState<TokomiList[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // Modales
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // Sélection
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ------- Init / Seed / Sync -------
  useEffect(() => {
    const initial = readJSON<TokomiList[]>(LS_LISTS, []);
    if (initial.length === 0) {
      const seed: TokomiList[] = [
        { id: "1", title: "Préférés", items: [] },
        { id: "2", title: "Cadeaux", items: [] },
      ];
      writeJSON(LS_LISTS, seed);
      setLists(seed);
    } else {
      setLists(initial);
    }
    setCartCount(readJSON<Favorite[]>(LS_CART, []).length);
    setFavCount(readJSON<Favorite[]>(LS_FAV, []).length);
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key === LS_CART) setCartCount(readJSON<Favorite[]>(LS_CART, []).length);
      if (e.key === LS_FAV) setFavCount(readJSON<Favorite[]>(LS_FAV, []).length);
      if (e.key === LS_LISTS) setLists(readJSON<TokomiList[]>(LS_LISTS, []));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const listsCount = lists.length;

  // ------- Helpers -------
  function saveLists(next: TokomiList[]) {
    setLists(next);
    writeJSON(LS_LISTS, next);
  }

  function toggleMenu(e?: React.MouseEvent) {
    e?.stopPropagation();
    setMenuOpen((s) => !s);
  }

  function openCreate() {
    setMenuOpen(false);
    setNewTitle("");
    setCreateOpen(true);
  }
  function closeCreate() {
    setCreateOpen(false);
  }
  function createList() {
    const title = newTitle.trim();
    if (!title) return;
    if (lists.length >= 5) {
      alert("Vous ne pouvez pas créer plus de 5 listes.");
      setCreateOpen(false);
      return;
    }
    const next: TokomiList[] = [
      ...lists,
      { id: Date.now().toString(), title, items: [] },
    ];
    saveLists(next);
    setCreateOpen(false);
    alert(`Liste « ${title} » créée.`);
  }

  // ------- Sélection -------
  const allIds = useMemo(() => lists.map((l) => l.id), [lists]);
  const selectedCount = selectedIds.size;

  function enterSelection() {
    setMenuOpen(false);
    setSelectionMode(true);
    setSelectedIds(new Set());
  }
  function exitSelection() {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }
  function toggleId(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }
  function toggleAll() {
    const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
    setSelectedIds(allSelected ? new Set() : new Set(allIds));
  }

  function renameSelected() {
    if (selectedIds.size === 0) {
      alert("Sélectionne une liste à renommer.");
      return;
    }
    if (selectedIds.size > 1) {
      alert("Renomme une seule liste à la fois.");
      return;
    }
    const id = Array.from(selectedIds)[0];
    const current = lists.find((l) => l.id === id);
    const oldTitle = current?.title || "";
    const nt = window.prompt("Nouveau nom de la liste :", oldTitle);
    if (!nt) return;
    const next = lists.map((l) => (l.id === id ? { ...l, title: nt.trim() } : l));
    saveLists(next);
    exitSelection();
  }

  function deleteSelected() {
    if (selectedIds.size === 0) return;
    if (!window.confirm("Supprimer les listes sélectionnées ?")) return;
    const next = lists.filter((l) => !selectedIds.has(l.id));
    saveLists(next);
    exitSelection();
  }

  // ------- Rendu d’une carte liste -------
  function renderCovers(list: TokomiList) {
    const imgs = (list.items || [])
      .map((i) => i.image)
      .filter(Boolean)
      .slice(0, 4) as string[];

    const cells = Array.from({ length: 4 }).map((_, i) => imgs[i] || "");
    return (
      <div className="list-covers-grid">
        {cells.map((src, i) =>
          src ? (
            <img key={i} src={src} alt="" />
          ) : (
            <div key={i} className="cover-fallback" />
          )
        )}
      </div>
    );
  }

  return (
    <main onClick={() => setMenuOpen(false)}>
      {/* Header */}
      <div className="header">
        {!selectionMode ? (
          <button className="btn-retour" onClick={() => router.push("/profile")}>
            RETOUR
          </button>
        ) : (
          <button className="btn-retour" onClick={exitSelection}>
            ANNULER
          </button>
        )}

        <div className="menu-wrapper" style={{ position: "relative" }}>
          {!selectionMode ? (
            <>
              <span id="menuToggle" className="menu-icon" onClick={toggleMenu}>
                PLUS
              </span>
              {menuOpen && (
                <div className="context-menu" onClick={(e) => e.stopPropagation()}>
                  <div onClick={openCreate}>CRÉER UNE NOUVELLE LISTE</div>
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
              {selectedCount === allIds.length && allIds.length > 0
                ? `TOUT DÉSÉLECTIONNER (${selectedCount})`
                : `TOUT SÉLECTIONNER (${selectedCount})`}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <Link href="/cart" className="tab-link">
          PANIER <strong id="cart-count">{cartCount}</strong>
        </Link>
        <Link href="/favorites" className="tab-link">
          FAVORIS <strong id="favorites-count">{favCount}</strong>
        </Link>
        <span className="active">
          LISTES <strong id="lists-count">{listsCount}</strong>
        </span>
      </div>

      {/* Grille de listes */}
      <div id="listContainer" className="list-container">
        {lists.length === 0 ? (
          <p className="empty-message">Aucune liste pour l’instant.</p>
        ) : (
          lists.map((l) => {
            const count = Array.isArray(l.items) ? l.items.length : 0;
            const selected = selectedIds.has(l.id);

            const CardInner = (
              <>
                {renderCovers(l)}

                {selectionMode && (
                  <div className="list-select-box">
                    <label className="custom-check-wrapper" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="list-checkbox"
                        checked={selected}
                        onChange={() => toggleId(l.id)}
                      />
                      <span className="custom-check" />
                    </label>
                  </div>
                )}
              </>
            );

            return (
              <div className="list-wrapper" key={l.id} data-id={l.id}>
                <Link
                  href={`/lists/${encodeURIComponent(l.id)}`}
                  className={`list-card${selectionMode ? " selectable" : ""}`}
                  onClick={(e) => {
                    if (selectionMode) {
                      e.preventDefault();
                      toggleId(l.id);
                    }
                  }}
                >
                  {CardInner}
                </Link>

                <div className="list-info">
                  <div className="list-card-title">{(l.title || "Sans nom").toUpperCase()}</div>
                  <div className="list-card-count">
                    {count} article{count > 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Barre d’actions en mode sélection */}
      {selectionMode && (
        <div className="selection-actions" id="selectionActions" style={{ display: selectedCount > 0 ? "flex" : "none" }}>
          <button onClick={renameSelected}>RENOMMER</button>
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

      {/* MODALE CRÉATION */}
      {createOpen && (
        <div
          className="modal show"
          onClick={closeCreate}
          role="dialog"
          aria-modal="true"
          aria-labelledby="createListTitle"
        >
          <div
            className="create-list-form-wrapper"
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative" }}
          >
            <button
              onClick={closeCreate}
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
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") createList();
                }}
              />
              <button onClick={createList}>CRÉER</button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'Space Grotesk', sans-serif;
          background-color: #fff;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .header {
          display: flex;
          position: relative;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
        }
        .btn-retour {
          margin-bottom: -62px;
          margin-top: 36px;
          margin-left: -6px;
          font-size: 12px;
          font-weight: 300;
          color: black;
          background: none;
          border: none;
          cursor: pointer;
        }

        .tabs {
          display: flex;
          justify-content: flex-start;
          gap: 41px;
          font-size: 12px;
          margin-top: 58px;
          margin-bottom: 26px;
          padding-left: 16px;
        }
        .tabs .active { font-weight: 600; }
        .tab-link {
          text-decoration: none;
          color: black;
          font-weight: 300;
        }
        .tab-link:hover { opacity: .6; }

        .list-container {
          margin-top: 22px;
          padding: 0 16px 80px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 34px;
        }
        .list-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 180px;
        }
        .list-card {
          position: relative;
          border: 1px solid black;
          background-color: white;
          width: 100%;
          height: 260px;
          display: block;
          text-decoration: none;
        }
        .list-card.selectable { cursor: pointer; }

        .list-covers-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 2px;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .list-covers-grid img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .cover-fallback {
          width: 100%;
          height: 100%;
          background: #eee;
        }

        .list-select-box {
          position: absolute;
          bottom: 8px;
          right: 8px;
          z-index: 10;
        }
        .custom-check-wrapper { cursor: pointer; display: inline-block; }
        .custom-check-wrapper input[type="checkbox"] { display: none; }
        .custom-check {
          display: inline-block;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: white;
          box-shadow: inset 0 0 0 2px #c4c4c4;
          transition: background 0.2s ease;
        }
        .custom-check-wrapper input[type="checkbox"]:checked + .custom-check {
          background: radial-gradient(circle at center, white 30%, #007AFF 31%, #007AFF 100%);
          box-shadow: 0 0 3px rgba(0, 122, 255, 0.4);
        }

        .list-info { margin-top: 6px; padding-left: 4px; }
        .list-card-title { font-size: 12px; font-weight: 500; text-transform: uppercase; }
        .list-card-count { font-size: 11px; font-weight: 300; color: #777; }

        .empty-message {
          text-align: center;
          font-size: 12px;
          font-weight: 300;
          color: #999;
          margin-top: 32px;
        }

        .menu-icon {
          margin-top: 49px;
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          padding: 6px 12px;
          border-radius: 0;
          font-size: 12px;
          font-weight: 300;
          cursor: pointer;
          background: none;
          border: none;
        }

        .context-menu {
          position: absolute;
          top: 70px;
          right: 20px;
          background: white;
          border: 1px solid #ddd;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          font-size: 10px;
          z-index: 10;
        }
        .context-menu > div {
          padding: 6px 12px;
          font-size: 12px;
          cursor: pointer;
          font-weight: 300;
        }
        .context-menu > div:hover { background: #f7f7f7; }

        .selection-actions {
          position: fixed;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          z-index: 1000;
          font-weight: 300;
          gap: 8px;
        }
        .selection-actions button {
          background-color: black;
          border: 1px solid #ccc;
          padding: 12px 20px;
          min-width: 200px;
          font-size: 12px;
          font-weight: 300;
          color: white;
          border-radius: 0;
          cursor: pointer;
          height: 40px;
        }

        .modal {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background-color: rgba(0,0,0,0.6);
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal.show { display: flex !important; }
        .create-list-form-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          background: white;
          padding: 24px;
          width: 80%;
          max-width: 320px;
          border-radius: 0;
          align-items: center;
          justify-content: center;
        }
        .create-list-form { display: flex; flex-direction: column; padding: 32px 16px; margin-bottom: 32px; }
        .create-list-form input {
          width: 100%;
          padding: 10px;
          margin-bottom: 12px;
          font-size: 12px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 300;
          border: none;
          border-bottom: 1px solid #eee;
          outline: none;
          background: transparent;
          text-transform: uppercase;
        }
        .create-list-form button {
          padding: 10px 20px;
          font-size: 12px;
          font-weight: 300;
          background-color: black;
          color: white;
          border: none;
          border-radius: 0;
          cursor: pointer;
          font-family: 'Space Grotesk', sans-serif;
        }

        .sticky-footer {
          position: fixed;
          bottom: 0;
          width: 100%;
          background-color: white;
          display: flex;
          justify-content: space-around;
          padding: 10px 0;
          border-top: 1px solid #ccc;
          z-index: 1000;
        }
        .menu-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 10px;
          color: #666;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .menu-item:hover, .menu-item.active { color: #000; font-weight: 600; }
      `}</style>
    </main>
  );
}
