"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type SignupData = {
  prenom?: string;
  nom?: string;
  adresse?: string;
  email?: string;
  telephone?: string;
  password?: string;
};

const LS_SIGNUP = "signupData";

export default function PersonalInfoPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState<string>(""); // valeur réelle (jamais affichée en clair hors édition)
  const [passInput, setPassInput] = useState<string>(""); // champ d’édition (peut rester vide pour ne pas changer)

  // Charger depuis localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_SIGNUP);
      if (raw) {
        const data: SignupData = JSON.parse(raw);
        setPrenom((data.prenom || "").trim());
        setNom((data.nom || "").trim());
        setAdresse((data.adresse || "").trim());
        setEmail((data.email || "").trim());
        setTelephone((data.telephone || "").trim());
        setPassword(data.password || "");
      }
    } catch {
      // ignore
    }
  }, []);

  // Fermer le menu quand on clique hors
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest?.("#menuToggle") && !target.closest?.("#menu")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const fullName = useMemo(() => {
    const f = [prenom, nom].filter(Boolean).join(" ").trim();
    return f || "x x";
  }, [prenom, nom]);

  function toggleMenu(e: React.MouseEvent) {
    e.stopPropagation();
    setMenuOpen((s) => !s);
  }

  function enterEdit() {
    setMenuOpen(false);
    setEditMode(true);
    setPassInput(""); // vide => ne change pas
  }

  function cancelEdit() {
    setMenuOpen(false);
    setEditMode(false);
    setPassInput("");
  }

  function onSave() {
    // découper "Prénom Nom" si l’utilisateur a modifié séparément ? Ici on sauvegarde tel quel depuis state.
    const updated: SignupData = {
      prenom: (prenom || "").trim(),
      nom: (nom || "").trim(),
      adresse: (adresse || "").trim(),
      email: (email || "").trim(),
      telephone: (telephone || "").trim(),
      password: password, // valeur par défaut
    };

    // si l’utilisateur a saisi un nouveau mot de passe dans le champ, on remplace
    if (passInput && passInput !== "****") {
      updated.password = passInput;
      setPassword(passInput);
    }

    localStorage.setItem(LS_SIGNUP, JSON.stringify(updated));
    localStorage.setItem("tokomi_username", updated.prenom || "");

    alert("✅ Informations enregistrées avec succès !");
    setEditMode(false);
  }

  // Permet aussi la saisie d’un seul champ "Prénom Nom" si tu préfères : ici on expose 2 champs (plus robuste).
  return (
    <main>
      <button className="btn-retour" onClick={() => (window.location.href = "/profile")}>
        RETOUR
      </button>

      <header>
        <h1 className="page-title">INFORMATIONS PERSONNELLES</h1>

        <button id="menuToggle" className={`menu-icon ${editMode ? "selection-active" : ""}`} onClick={toggleMenu}>
          PLUS
        </button>

        {menuOpen && (
          <div id="menu" className="context-menu" onClick={(e) => e.stopPropagation()}>
            {!editMode && <div onClick={enterEdit}>MODIFIER</div>}
            {editMode && <div onClick={cancelEdit}>ANNULER</div>}
          </div>
        )}
      </header>

      <section className="section">
        {/* Prénom / Nom */}
        <div className="info-block" data-key="fullname">
          <div className="info-title">Prénom Nom</div>

          {!editMode ? (
            <div className="info-value">{fullName}</div>
          ) : (
            <div className="inline-row">
              <input
                className="edit-input"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="PRÉNOM"
              />
              <input
                className="edit-input"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="NOM"
              />
            </div>
          )}
        </div>

        {/* Adresse */}
        <div className="info-block">
          <div className="info-title">Adresse postale</div>
          {!editMode ? (
            <div className="info-value">{adresse || "x x"}</div>
          ) : (
            <input
              className="edit-input wide"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              placeholder="ADRESSE POSTALE"
            />
          )}
        </div>

        {/* Email */}
        <div className="info-block">
          <div className="info-title">Adresse email</div>
          {!editMode ? (
            <div className="info-value">{email || "x x"}</div>
          ) : (
            <input
              className="edit-input wide"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ADRESSE EMAIL"
            />
          )}
        </div>

        {/* Téléphone */}
        <div className="info-block">
          <div className="info-title">Téléphone</div>
          {!editMode ? (
            <div className="info-value">{telephone || "x x"}</div>
          ) : (
            <input
              className="edit-input"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="TÉLÉPHONE"
            />
          )}
        </div>

        {/* Mot de passe */}
        <div className="info-block">
          <div className="info-title">Mot de passe</div>
          {!editMode ? (
            <div className="info-value masked">****</div>
          ) : (
            <input
              className="edit-input"
              type="password"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              placeholder="NOUVEAU MOT DE PASSE (OPTIONNEL)"
            />
          )}
        </div>
      </section>

      {/* Bouton ENREGISTRER */}
      {editMode && (
        <div id="saveContainer" style={{ display: "block", textAlign: "center", margin: "40px 0" }}>
          <button id="saveBtn" onClick={onSave} className="save-btn">
            ENREGISTRER
          </button>
        </div>
      )}

      {/* FOOTER (facultatif) */}
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

    </main>
  );
}
