import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import nextPlugin from "@next/eslint-plugin-next";
import {defineConfig} from "eslint/config";


export default defineConfig([
    // Règles recommandées JavaScript
    js.configs.recommended,

    // Règles recommandées TypeScript (flat config de typescript-eslint)
    ...tseslint.configs.recommended,

    // Règles recommandées React (flat)
    pluginReact.configs.flat.recommended,

    // Règles Next.js (recommandées + core-web-vitals)
    {
        plugins: {"@next/next": nextPlugin},
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs["core-web-vitals"].rules,
        },
    },

    // Options globales
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        languageOptions: {globals: globals.browser},
    },

    // Ignores
    {ignores: [".next/*"]},
]);

