import React from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/libs/buttons/buttons";
import {type AuthenticationActions, AuthenticationActionTypes} from "@/components/component.model";

const actions: AuthenticationActions[] = [
    {label: "Poursuivre en tant qu’invité", type: AuthenticationActionTypes.GUEST},
    {label: "Connexion", type: AuthenticationActionTypes.LOGIN},
    {label: "Créer un compte", type: AuthenticationActionTypes.REGISTER},
]

export const AuthenticationManagement = () => {
    const router = useRouter();

    const continueAsGuest = () => router.push("/welcome");

    return <div className="text-white flex flex-col w-[50%] justify-center items-center">
        {actions.map((action, index) => (
            <Button key={index} customClass={'w-full m-2'} handleClick={action.type === AuthenticationActionTypes.GUEST ? continueAsGuest : () => {}}>{action.label}</Button>
        ))}
        </div>
    }