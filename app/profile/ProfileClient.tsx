"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthState = "user" | "guest" | null;

export default function ProfileClient() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthState>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    try {
      const a = (localStorage.getItem("tokomi_auth") as AuthState) || null;
      setAuth(a);
      const data = JSON.parse(localStorage.getItem("signupData") || "{}");
      setUsername((data?.prenom || "").toUpperCase());
    } catch {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("tokomi_auth");
    router.push("/home");
  };

  const goLogin = () => router.push("/connexion");
  const goSignup = () => router.push("/signup");

  return (
    <main>
      <header style={{ marginTop: 155, textAlign: "center", padding: "24px 0", fontSize: 40 }}>
        BIENVENUE
      </header>

      <div style={{ textAlign: "center", fontSize: 62, fontWeight: 500, marginBottom: -20 }} />
      <div className="username" style={{ textAlign: "center", fontSize: 20, fontWeight: 500, marginBottom: 150 }}>
        {auth === "user" ? username : ""}
      </div>

      {/* MON COMPTE */}
      <section className="section">
        <h3>MON COMPTE</h3>
        <button className="btn" style={{ marginTop: -8, fontSize: 22 }} onClick={() => router.push("/cart")}>PANIER</button>
        <button className="btn" style={{ marginTop: -18, fontSize: 22 }} onClick={() => router.push("/favorites")}>FAVORIS</button>
        <button className="btn" style={{ marginTop: -20, fontSize: 22 }} onClick={() => router.push("/lists")}>LISTES</button>
        <button className="btn" style={{ marginTop: -18, fontSize: 22 }} onClick={() => router.push("/account/personal-info")}>INFORMATIONS PERSONNELLES</button>
        <button className="btn" style={{ marginTop: -21 }} onClick={() => router.push("/orders")}>HISTORIQUE DES COMMANDES</button>
        <button className="btn" style={{ marginTop: -18, marginBottom: -34 }} onClick={() => router.push("/membership")}>PROGRAMME DE MEMBRE</button>
      </section>

      {/* MES RÉGLAGES */}
      <section className="section">
        <h3>MES RÉGLAGES</h3>
        <button className="btn" style={{ marginTop: -8 }} onClick={() => router.push("/preferencesnav")}>PRÉFÉRENCES DE NAVIGATION</button>
        <button className="btn" style={{ marginTop: -19 }} onClick={() => router.push("/notifications")}>NOTIFICATIONS</button>
        <button className="btn" style={{ marginTop: -20 }} onClick={() => router.push("/language")}>LANGUE</button>
        <button className="btn" style={{ marginTop: -18, marginBottom: -34 }} onClick={() => router.push("/country-region")}>PAYS / RÉGION</button>
      </section>

      {/* ASSISTANCE */}
      <section className="section">
        <h3>ASSISTANCE</h3>
        <button className="btn" style={{ marginTop: -8, marginBottom: -10 }} onClick={() => router.push("/contact")}>CONTACTEZ-NOUS</button>
        <button className="btn" style={{ marginTop: -8 }} onClick={() => router.push("/faq")}>FAQ</button>
        <button className="btn" style={{ marginTop: -18, marginBottom: 32 }} onClick={() => router.push("/privacy-policy")}>POLITIQUE DE CONFIDENTIALITÉ</button>
        <button className="btn" style={{ marginTop: -40, marginBottom: 32 }} onClick={() => router.push("/terms")}>CONDITIONS GÉNÉRALES</button>

        {/* Bouton auth dynamique */}
        {auth === "user" ? (
          <button className="btn" style={{ marginTop: 6, marginBottom: 8, marginLeft: -1 }} onClick={handleLogout}>
            DÉCONNEXION
          </button>
        ) : (
          <>
            <button className="btn" style={{ marginTop: 6, marginBottom: 8, marginLeft: -1 }} onClick={goLogin}>
              SE CONNECTER
            </button>
            <button className="btn btn-signup" style={{ marginTop: 4, marginBottom: 30, marginLeft: -1 }} onClick={goSignup}>
              CRÉER UN COMPTE
            </button>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="sticky-footer">
        <Link href="/home" className="menu-item"><span>ACCUEIL</span></Link>
        <Link href="/explorer" className="menu-item"><span>EXPLORER</span></Link>
        <Link href="/profile" className="menu-item active"><span>PROFIL</span></Link>
      </footer>

    </main>
  );
}
