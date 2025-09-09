"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupClient() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      prenom: (form.querySelector<HTMLInputElement>("#first-name")?.value || "").trim(),
      nom: (form.querySelector<HTMLInputElement>("#last-name")?.value || "").trim(),
      adresse: (form.querySelector<HTMLInputElement>("#address1")?.value || "").trim(),
      email: (form.querySelector<HTMLInputElement>("#email")?.value || "").trim(),
      telephone: (form.querySelector<HTMLInputElement>("#phone")?.value || "").trim(),
      password: (form.querySelector<HTMLInputElement>("#password")?.value || "").trim(),
    };

    // validations simples
    if (!data.prenom || !data.nom || !data.adresse || !data.email || !data.telephone || !data.password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    // Sauvegarde locale (flow sans backend)
    localStorage.setItem("signupData", JSON.stringify(data));
    localStorage.setItem("tokomi_auth", "user");
    localStorage.setItem("tokomi_username", data.prenom || "");

    // Modal + redirection
    setShowModal(true);
    setTimeout(() => router.push("/home"), 2500);
  }

  return (
    <main>
      <button className="btn-retour" onClick={() => router.push("/intro-utilisateur")} aria-label="Retour">
        RETOUR
      </button>

      <div className="page-container">
        {/* Formulaire */}
        <div className="form-container">
          <h2>Mon compte</h2>

          <form id="signupForm" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="first-name" style={{ color: "grey" }}>Prénom</label>
              <input id="first-name" name="first-name" placeholder="Prénom" required />
            </div>

            <div className="form-group">
              <label htmlFor="last-name" style={{ color: "grey" }}>Nom</label>
              <input id="last-name" name="last-name" placeholder="Nom" required />
            </div>

            <div className="form-group">
              <label htmlFor="address1" style={{ color: "grey" }}>Adresse postale</label>
              <input id="address1" name="address1" placeholder="Adresse postale" required />
            </div>

            <div className="form-group">
              <label htmlFor="email" style={{ color: "grey" }}>Adresse e-mail</label>
              <input id="email" type="email" name="email" placeholder="Adresse e-mail" required />
            </div>

            <div className="form-group">
              <label htmlFor="phone" style={{ color: "grey" }}>Téléphone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Téléphone"
                pattern="[0-9+\\s]{6,20}"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" style={{ color: "grey" }}>Mot de passe</label>
              <input id="password" name="password" type="password" placeholder="Mot de passe" required />
            </div>

            <button type="submit" className="submit-btn">Valider</button>
          </form>
        </div>

        {/* Boutons sociaux */}
        <div className="social-container">
          <h3>VIA</h3>
          <button className="social-button apple" onClick={() => window.location.href = "https://appleid.apple.com/"}>
            <img src="/apple-logo.png" alt="Apple" /> Apple
          </button>
          <button className="social-button google" onClick={() => window.location.href = "https://accounts.google.com/"}>
            <img src="/google-logo.png" alt="Google" /> Google
          </button>
          <button className="social-button facebook" onClick={() => window.location.href = "https://www.facebook.com/login/"}>
            <img src="/facebook-logo.png" alt="Facebook" /> Facebook
          </button>
        </div>
      </div>

      {/* Modal de confirmation */}
      {showModal && (
        <div className="modal-overlay" role="dialog" aria-live="polite" aria-label="Confirmation">
          <div className="modal-content">
            <p>Merci, vous allez recevoir un message de confirmation à l'adresse email fournie.</p>
          </div>
        </div>
      )}

    </main>
  );
}
