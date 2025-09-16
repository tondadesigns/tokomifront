"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const COUNTRIES = [
  "Afghanistan","Afrique du Sud","Albanie","Algérie","Allemagne","Andorre","Angola","Argentine",
  "Arménie","Australie","Autriche","Azerbaïdjan","Belgique","Bénin","Botswana","Brésil","Burkina Faso",
  "Burundi","Cameroun","Canada","Chili","Chine","Colombie","Comores","Congo","Croatie","Danemark",
  "Djibouti","Égypte","Espagne","États-Unis","Éthiopie","Finlande","France","Gabon","Ghana","Grèce",
  "Guinée","Haïti","Inde","Indonésie","Irlande","Islande","Italie","Japon","Kenya","Liban",
  "Luxembourg","Madagascar","Malawi","Mali","Maroc","Maurice","Mexique","Monaco","Mozambique",
  "Namibie","Niger","Nigéria","Norvège","Nouvelle-Zélande","Ouganda","Pakistan","Pays-Bas","Pérou",
  "Philippines","Pologne","Portugal","Qatar","République Démocratique du Congo","Roumanie","Rwanda",
  "Sénégal","Serbie","Singapour","Slovaquie","Slovénie","Somalie","Suède","Suisse","Tanzanie",
  "Tchad","Thaïlande","Togo","Tunisie","Turquie","Ukraine","Uruguay","Venezuela","Vietnam","Zambie","Zimbabwe",
];

const DIAL_CODES: Record<string, string> = {
  Afghanistan:"+93","Afrique du Sud":"+27",Albanie:"+355",Algérie:"+213",Allemagne:"+49",Andorre:"+376",
  Angola:"+244",Argentine:"+54",Arménie:"+374",Australie:"+61",Autriche:"+43",Azerbaïdjan:"+994",Belgique:"+32",
  Bénin:"+229",Botswana:"+267",Brésil:"+55","Burkina Faso":"+226",Burundi:"+257",Cameroun:"+237",Canada:"+1",
  Chili:"+56",Chine:"+86",Colombie:"+57",Comores:"+269",Congo:"+242",Croatie:"+385",Danemark:"+45",Djibouti:"+253",
  Égypte:"+20",Espagne:"+34","États-Unis":"+1",Éthiopie:"+251",Finlande:"+358",France:"+33",Gabon:"+241",Ghana:"+233",
  Grèce:"+30",Guinée:"+224",Haïti:"+509",Inde:"+91",Indonésie:"+62",Irlande:"+353",Islande:"+354",Italie:"+39",Japon:"+81",
  Kenya:"+254",Liban:"+961",Luxembourg:"+352",Madagascar:"+261",Malawi:"+265",Mali:"+223",Maroc:"+212",Maurice:"+230",
  Mexique:"+52",Monaco:"+377",Mozambique:"+258",Namibie:"+264",Niger:"+227","Nigéria":"+234",Norvège:"+47",
  "Nouvelle-Zélande":"+64",Ouganda:"+256",Pakistan:"+92","Pays-Bas":"+31",Pérou:"+51",Philippines:"+63",Pologne:"+48",
  Portugal:"+351",Qatar:"+974","République Démocratique du Congo":"+243",Roumanie:"+40",Rwanda:"+250",Sénégal:"+221",
  Serbie:"+381",Singapour:"+65",Slovaquie:"+421",Slovénie:"+386",Somalie:"+252",Suède:"+46",Suisse:"+41",Tanzanie:"+255",
  Tchad:"+235","Thaïlande":"+66",Togo:"+228",Tunisie:"+216",Turquie:"+90",Ukraine:"+380",Uruguay:"+598",Venezuela:"+58",
  Vietnam:"+84",Zambie:"+260",Zimbabwe:"+263",
};

export default function DeliveryAddressClient() {
  const router = useRouter();

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [cp, setCp] = useState("");
  const [pays, setPays] = useState("");
  const [tel, setTel] = useState("");

  const [query, setQuery] = useState("");
  const [openList, setOpenList] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);

  // Suggestions pays
  const suggestions = useMemo(() => {
    const q = (query || pays).trim().toLowerCase();
    if (!q) return [];
    return COUNTRIES.filter((c) => c.toLowerCase().includes(q)).slice(0, 12);
  }, [query, pays]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpenList(false);
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  function onPickCountry(country: string) {
    setPays(country);
    setQuery("");
    setOpenList(false);
    const dial = DIAL_CODES[country];
    if (dial && phoneRef.current) {
      phoneRef.current.value = `${dial} `;
      setTel(`${dial} `);
      phoneRef.current.focus();
      const len = phoneRef.current.value.length;
      phoneRef.current.setSelectionRange(len, len);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prenom || !nom || !adresse || !ville || !cp || !pays || !tel) return;

    const ligne1 = `${prenom} ${nom}`.trim();
    const ligne2 = adresse.trim();
    const ligne3 = `${cp}, ${ville}, ${pays}`.trim();
    const ligne4 = tel.trim();
    const fullAddress = `${ligne1}\n${ligne2}\n${ligne3}\n${ligne4}`;

    localStorage.setItem("tokomi_address", fullAddress);
    router.push("/checkout");
  }

  function goBack() {
    router.push("/checkout");
  }

  return (
    <div id="address-page">
      <div className="header">
        <button className="btn-retouracp" onClick={goBack}>RETOUR</button>
        <h2 className="title">VOTRE ADRESSE DE LIVRAISON</h2>

        <form id="address-form" onSubmit={handleSubmit}>
          <input className="address-input" placeholder="PRÉNOM" value={prenom} onChange={(e) => setPrenom(e.target.value.toUpperCase())} required />
          <input className="address-input" placeholder="NOM DE FAMILLE" value={nom} onChange={(e) => setNom(e.target.value.toUpperCase())} required />
          <input className="address-input" placeholder="ADRESSE" value={adresse} onChange={(e) => setAdresse(e.target.value.toUpperCase())} required />
          <input className="address-input" placeholder="VILLE" value={ville} onChange={(e) => setVille(e.target.value.toUpperCase())} required />
          <input className="address-input" placeholder="CODE POSTAL" value={cp} onChange={(e) => setCp(e.target.value.toUpperCase())} required />

          <div className="autocomplete-wrapper" ref={wrapperRef}>
            <input
              id="countryInput"
              className="address-input"
              placeholder="PAYS"
              value={pays}
              onChange={(e) => { setPays(e.target.value.toUpperCase()); setQuery(e.target.value); setOpenList(true); }}
              onFocus={() => setOpenList(true)}
              autoComplete="off"
              required
            />
            <ul id="countryList" className={`autocomplete-list ${openList && suggestions.length ? "show" : ""}`}>
              {suggestions.map((c) => (
                <li key={c} onClick={() => onPickCountry(c)}>{c}</li>
              ))}
            </ul>
          </div>

          <input
            ref={phoneRef}
            className="address-input"
            placeholder="NUMÉRO DE TÉLÉPHONE"
            value={tel}
            onChange={(e) => setTel(e.target.value.toUpperCase())}
            required
          />

          <button type="submit" className="submit-address-btn">ENREGISTRER</button>
        </form>
      </div>
    </div>
  );
}
