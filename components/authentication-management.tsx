import React from "react";
import {Button} from "@/libs/buttons/buttons";

export const AuthenticationManagement = () => {
    const actions = [
        "Poursuivre en tant qu’invité",
        "Connexion",
        "Créer un compte",
    ];

    return <div className="text-white flex flex-col w-full justify-center items-center">
        {actions.map((action, index) => (
            <Button key={index} label={action} />
        ))}
        </div>
    }

;