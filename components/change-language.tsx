import React from "react";
export default function ChangeLanguage() {
  function changeLanguage() {}

  return (
    <div className="language-toggle">
      <select id="languageSelect" onChange={changeLanguage}>
        <option value="fr">FR</option>
        <option value="en">EN</option>
      </select>
    </div>
  );
}
