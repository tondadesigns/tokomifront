"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Lang = "fr" | "en";

const I18N: Record<Lang, { btnGuest: string; btnLogin: string; btnSignup: string; title: string; htmlLang: string }> = {
  fr: {
    btnGuest: "Poursuivre en tant qu’invité",
    btnLogin: "Connexion",
    btnSignup: "Créer un compte",
    title: "Bienvenue – Tokomi",
    htmlLang: "fr",
  },
  en: {
    btnGuest: "Continue as guest",
    btnLogin: "Sign in",
    btnSignup: "Create an account",
    title: "Welcome – Tokomi",
    htmlLang: "en",
  },
};

export default function IntroClient() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("fr");

  // Charger la langue sauvegardée au démarrage
  useEffect(() => {
    const saved = (localStorage.getItem("selectedLang") as Lang) || "fr";
    setLang(saved);
  }, []);

  // Appliquer titre + <html lang>
  useEffect(() => {
    const dict = I18N[lang];
    document.title = dict.title;
    document.documentElement.setAttribute("lang", dict.htmlLang || lang);
  }, [lang]);

  function changeLanguage(next: Lang) {
    setLang(next);
    localStorage.setItem("selectedLang", next);
  }

  function continueAsGuest() {
    localStorage.setItem("tokomi_auth", "guest");
    localStorage.removeItem("tokomi_username");
    router.push("/home");
  }
  function redirectToLogin() {
    router.push("/connexion");
  }
  function redirectToSignUp() {
    router.push("/signup");
  }

  const dict = I18N[lang];

  return (
    <main>
      {/* Sélecteur de langue */}
      <div className="language-toggle">
        <select
          value={lang}
          onChange={(e) => changeLanguage((e.target.value as Lang) || "fr")}
          aria-label={lang === "fr" ? "Sélecteur de langue" : "Language selector"}
        >
          <option value="fr">FR</option>
          <option value="en">EN</option>
        </select>
      </div>

      {/* Arrière-plan */}
      <div className="background" />
      <div className="overlay" />

      {/* Contenu */}
      <div className="content">
        <button onClick={continueAsGuest}>{dict.btnGuest}</button>
        <button onClick={redirectToLogin}>{dict.btnLogin}</button>
        <button onClick={redirectToSignUp}>{dict.btnSignup}</button>
      </div>

    </main>
  );
}
