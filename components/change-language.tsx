import React from "react";

export const ChangeLanguage = () => {
  function changeLanguage() {}

  return (
      <div className="absolute top-20 right-[60px] z-[1000]">
          <select
              onChange={changeLanguage}
              className="bg-white text-black text-[22px] uppercase p-2 border-gray-300 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-black hover:border hover:text-white hover:border-white"
          >
              <option value="fr">fr</option>
              <option value="en">en</option>
          </select>
      </div>

  );
}