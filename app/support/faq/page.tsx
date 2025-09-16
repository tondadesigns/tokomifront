// app/support/faq/page.tsx
"use client";

import { useState } from "react";

export const metadata = {
  title: "FAQ – Tokomi",
};

type QA = { q: string; a: string };

const ITEMS: QA[] = [
  {
    q: "COMMENT PASSER COMMANDE SUR TOKOMI ?",
    a: 'Connectez-vous à votre compte, explorez les articles et cliquez sur "commander".',
  },
  {
    q: "PUIS-JE MODIFIER OU ANNULER MA COMMANDE ?",
    a: "Vous pouvez demander une modification/annulation avant l’expédition depuis votre compte (“Mes commandes”). Après expédition, il faudra procéder via un retour dès réception.",
  },
  {
    q: "LES ARTICLES SONT-ILS AUTHENTIQUES ?",
    a: "Tous les articles sont 100% authentiques, provenant directement des marques ou revendeurs certifiés.",
  },
  {
    q: "COMMENT ÊTRE NOTIFIÉ D'UN RÉASSORT ?",
    a: 'Nous travaillons en flux avec marques et partenaires. Si un produit revient, l’option "Me prévenir" apparaît sur la fiche. Vous recevrez un email dès qu’il est disponible.',
  },
  {
    q: "DANS QUELLES ZONES LIVREZ-VOUS ?",
    a: "Nous livrons d’abord en RDC (Kinshasa & principales villes), puis progressivement dans d’autres pays d’Afrique. Les zones disponibles s’affichent automatiquement au checkout selon votre adresse.",
  },
  {
    q: "QUELS SONT LES DÉLAIS DE LIVRAISON ?",
    a: "Les délais varient entre 3 et 7 jours ouvrés selon la destination.",
  },
  {
    q: "PUIS-JE SUIVRE MA COMMANDE ?",
    a: "Oui, un lien de suivi est disponible dans votre compte après expédition.",
  },
  {
    q: "COMMENT SONT CALCULÉS LES FRAIS DE LIVRAISON ?",
    a: "Les frais dépendent du pays/ville, du poids/volume et de l’option sélectionnée (Standard, Express). Le prix exact s’affiche dynamiquement au moment du checkout avant paiement.",
  },
  {
    q: "JE ME SUIS TROMPÉ D’ADRESSE, QUE FAIRE ?",
    a: "Contactez-nous immédiatement via “Contactez-nous”. Si le colis n’a pas encore été expédié, nous corrigerons l’adresse. Sinon, une redirection peut engendrer des frais supplémentaires du transporteur.",
  },
  {
    q: "MON ARTICLE EST ENDOMMAGÉ, QUE FAIRE ?",
    a: "Contactez-nous sous 48h avec des photos via “Contactez-nous”. Nous organiserons un échange ou un remboursement selon le cas.",
  },
  {
    q: "COMMENT RETOURNER OU ÉCHANGER UN ARTICLE ?",
    a: "Connectez-vous et soumettez une demande de retour dans votre espace client.",
  },
  {
    q: "QUEL EST VOTRE DÉLAI DE RETOUR ET REMBOURSEMENT ?",
    a: "Vous disposez de 14 jours après réception (articles non portés, avec étiquettes). Le remboursement est effectué sur le moyen de paiement d’origine après validation qualité.",
  },
  {
    q: "QUELS MOYENS DE PAIEMENT ACCEPTEZ-VOUS ?",
    a: "Nous acceptons les cartes Visa, Mastercard, PayPal, ainsi que les paiements mobile money (Orange, M-Pesa...).",
  },
  {
    q: "MON PAIEMENT EST-IL SÉCURISÉ ?",
    a: "Oui, transactions chiffrées et vérification 3-D Secure quand requis. Nous n’enregistrons pas les données complètes de vos cartes.",
  },
  {
    q: "COMMENT FONCTIONNE LE PROGRAMME DE FIDÉLITÉ ?",
    a: "Plus vous commandez, plus vous progressez dans les niveaux et débloquez des avantages exclusifs.",
  },
  {
    q: "JE N’AI PAS REÇU L’EMAIL DE CONFIRMATION OU DE SUIVI",
    a: "Vérifiez vos spams et l’adresse de votre compte. Le statut est consultable à tout moment dans “Mes commandes”.",
  },
  {
    q: "COMMENT SUPPRIMER MON COMPTE ET MES DONNÉES ?",
    a: "Depuis “Paramètres & confidentialité”, vous pouvez demander la suppression de compte. Nous traiterons votre demande conformément au RGPD.",
  },
  {
    q: "COMMENT VOUS CONTACTER ?",
    a: "Par formulaire dans “Contactez-nous”, email, ou téléphone. Support en FR/EN. Les horaires sont indiqués sur la page de contact.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <main>
      <a href="profil.html" className="btn-retour">
        RETOUR
      </a>

      <header>Questions fréquentes</header>

      <section className="dropdown-section">
        {ITEMS.map((item, i) => {
          const isOpen = open.has(i);
          return (
            <div
              key={i}
              className={`dropdown ${isOpen ? "open" : ""}`}
              onClick={() => toggle(i)}
              role="button"
              aria-expanded={isOpen}
            >
              <div className="dropdown-header">
                <span className="dropdown-title">{item.q}</span>
                <span className="dropdown-toggle" aria-hidden>
                  +
                </span>
              </div>
              <div className="dropdown-content">
                <p>{item.a}</p>
              </div>
            </div>
          );
        })}
      </section>

    </main>
  );
}
