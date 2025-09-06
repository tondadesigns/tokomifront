import React from "react";
import {ChangeLanguage} from "@/components/change-language";
import {AuthenticationManagement} from "@/components/authentication-management";

export default function UserIntroduction() {
    return (
        <div className="relative w-screen h-screen flex justify-center bg-black text-white">
            <ChangeLanguage/>
            <AuthenticationManagement/>
        </div>

    );
}
