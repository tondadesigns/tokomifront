// app/support/contact-us/page.tsx

export const metadata = {
  title: "Contactez-nous – Tokomi",
};

export default function ContactUsPage() {
  return (
    <main>
      <a href="profil.html" className="btn-retour">RETOUR</a>

      <header>Contactez-nous</header>

      <section className="section">
        <p>
          Nous sommes disponibles pour vous aider
          <br />
          du lundi au vendredi de 9h à 17h GMT.
        </p>

        <a className="btn-contact" href="mailto:support@tokomi.com" role="button" aria-label="Nous contacter par courriel">
          <img src="email-icon.png" alt="Courriel" />
          Courriel
        </a>

        <a className="btn-contact" href="tel:+243000000000" role="button" aria-label="Nous appeler par téléphone">
          <img src="phone-icon.png" alt="Téléphone" />
          Téléphone
        </a>
      </section>

    </main>
  );
}
