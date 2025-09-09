"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ConnexionClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const emailTrim = email.trim();
    if (!emailTrim || !password) {
      alert("Veuillez remplir tous les champs.");
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

    const okEmail = String(data.email || "").trim().toLowerCase() === emailTrim.toLowerCase();
    const okPwd   = String(data.password || "") === password;

    if (!okEmail || !okPwd) {
      alert("Identifiants incorrects.");
      return;
    }

    // ✅ Auth OK
    localStorage.setItem("tokomi_auth", "user");
    localStorage.setItem("tokomi_username", String(data.prenom || "").trim());

    router.push("/profile");
  }

  return (
    <main>
      <button className="btn-retour" onClick={() => router.push("/intro-utilisateur")} aria-label="Retour">
        RETOUR
      </button>

      <div className="login-container">
        <h2>Connexion</h2>

        <form onSubmit={handleSubmit} autoComplete="on" noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
            />
          </div>

          <button className="submit-btn" type="submit">Se connecter</button>
        </form>

        <div className="extra-links">
          <a href="/motdepasseoublie">Mot de passe oublié ?</a>
        </div>
      </div>

    </main>
  );
}
