import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                confirm: "var(--confirm)",
                error: "var(--error)",
                warning: "var(--warning)",
                slate: {
                    100: "var(--slate-100)",
                    400: "var(--slate-400)",
                    500: "var(--slate-500)",
                    800: "var(--slate-800)",
                    900: "var(--slate-900)",
                },
                neutral: {
                    900: "var(--neutral-900)",
                },
                yellow: {
                    400: "var(--yellow-400)",
                },
                red: {
                    500: "var(--red-500)",
                },
                green: {
                    900: "var(--green-900)",
                    500: "var(--green-500)",
                },
            },
        },
    },
    darkMode: "class",
    plugins: [],
};
export default config;
