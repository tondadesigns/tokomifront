"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  function handleCheckEmail(e: React.FormEvent) {
    e.preventDefault();
    const emailTrim = email.trim().toLowerCase();
    if (!emailTrim) {
      alert("Veuillez entrer votre email.");
      return;
    }

    const raw = localStorage.getItem("signupData");
    if (!raw) {
      alert("Aucun compte enregistré. Créez un compte d’abord.");
      router.push("/signup");
      return;
    }

    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      alert("Données de compte invalides. Veuillez recréer votre compte.");
      localStorage.removeItem("signupData");
      router.push("/signup");
      return;
    }

    const okEmail = String(data.email || "").trim().toLowerCase() === emailTrim;
    if (!okEmail) {
      alert("Cet email n’est pas reconnu.");
      return;
    }

    
    setStep("reset");
  }

  function handleReset(e: React.FormEvent) {
    e.preventDefault();

    if (!newPwd || !confirmPwd) {
      alert("Veuillez saisir et confirmer votre nouveau mot de passe.");
      return;
    }
    if (newPwd !== confirmPwd) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    const raw = localStorage.getItem("signupData");
    if (!raw) {
      alert("Aucun compte enregistré. Créez un compte d’abord.");
      router.push("/signup");
      return;
    }

    let data: any = {};
    try {
      data = JSON.parse(raw);
    } catch {
      alert("Données de compte invalides. Veuillez recréer votre compte.");
      localStorage.removeItem("signupData");
      router.push("/signup");
      return;
    }

    data.password = newPwd;
    localStorage.setItem("signupData", JSON.stringify(data));

    alert("Votre mot de passe a été réinitialisé.");
    router.push("/connexion");
  }

  return (
    <main>
      <button className="btn-retour" onClick={() => router.push("/connexion")} aria-label="Retour">
        RETOUR
      </button>

      <div className="forgot-container">
        <h2>Mot de passe oublié</h2>

        {step === "request" ? (
          <form onSubmit={handleCheckEmail} noValidate>
            <p className="hint">
              Entrez l’email de votre compte. Si nous le reconnaissons, vous pourrez définir un nouveau mot de passe.
            </p>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                autoFocus
              />
            </div>

            <button className="submit-btn" type="submit">Continuer</button>
          </form>
        ) : (
          <form onSubmit={handleReset} noValidate>
            <p className="hint">
              Définissez votre nouveau mot de passe pour <strong>{email}</strong>.
            </p>

            <div className="form-group">
              <label htmlFor="newPwd">Nouveau mot de passe</label>
              <input
                id="newPwd"
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder=""
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPwd">Confirmer le mot de passe</label>
              <input
                id="confirmPwd"
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder=""
              />
            </div>

            <button className="submit-btn" type="submit">Réinitialiser</button>
          </form>
        )}
      </div>

    </main>
  );
}
