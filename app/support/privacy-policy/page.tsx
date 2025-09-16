// app/support/privacy-policy/page.tsx
export const metadata = {
  title: "Politique de confidentialité – Tokomi",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <a href="profil.html" className="btn-retour">
        RETOUR
      </a>

      <header>Politique de confidentialité de Tokomi</header>

      <section className="content">
        <p>
          Chez Tokomi, nous nous engageons à protéger votre vie privée. Cette
          politique de confidentialité explique comment nous collectons,
          utilisons, partageons et protégeons vos informations personnelles
          lorsque vous utilisez notre site ou notre application.
        </p>

        <h2>1. Collecte des informations</h2>
        <p>
          Nous collectons les informations que vous nous fournissez
          directement, telles que votre nom, adresse e-mail, numéro de
          téléphone, adresse de livraison, ainsi que les données de paiement
          nécessaires à la finalisation des commandes. Nous collectons également
          automatiquement certaines informations techniques comme votre adresse
          IP, votre type de navigateur, ou les pages que vous visitez sur notre
          plateforme.
        </p>

        <h2>2. Utilisation des données</h2>
        <p>
          Les données collectées sont utilisées pour : traiter vos commandes,
          personnaliser votre expérience, assurer le support client, améliorer
          nos services, envoyer des communications marketing avec votre
          consentement, et respecter nos obligations légales.
        </p>

        <h2>3. Partage des informations</h2>
        <p>
          Nous ne vendons ni ne louons vos informations personnelles. Certaines
          données peuvent être partagées avec des prestataires de services
          (logistique, paiement, hébergement) dans le seul but d&apos;exécuter
          notre service. Ces partenaires sont tenus de respecter la
          confidentialité de vos données.
        </p>

        <h2>4. Sécurité</h2>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles
          pour protéger vos données personnelles contre l&apos;accès non
          autorisé, la perte, ou l&apos;altération. L&apos;accès à vos données
          est strictement réservé aux personnes habilitées.
        </p>

        <h2>5. Cookies</h2>
        <p>
          Nous utilisons des cookies pour améliorer votre expérience de
          navigation, analyser le trafic, et proposer des contenus personnalisés.
          Vous pouvez gérer vos préférences en matière de cookies via les
          paramètres de votre navigateur.
        </p>

        <h2>6. Vos droits</h2>
        <p>
          Vous avez le droit d&apos;accéder à vos données, de les corriger, de
          demander leur suppression, ou de vous opposer à leur traitement. Pour
          toute demande, contactez-nous à privacy@tokomi.com.
        </p>

        <h2>7. Conservation des données</h2>
        <p>
          Vos informations sont conservées aussi longtemps que nécessaire pour
          les finalités décrites, sauf si la loi exige une durée différente.
        </p>

        <h2>8. Modifications</h2>
        <p>
          Cette politique peut être mise à jour à tout moment. En cas de
          modification substantielle, vous serez notifié par e-mail ou via notre
          site.
        </p>

        <h2>9. Contact</h2>
        <p>
          Pour toute question concernant cette politique, vous pouvez nous
          écrire à : privacy@tokomi.com.
        </p>
      </section>

    </main>
  );
}
