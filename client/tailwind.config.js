/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            screens: {
                "3xs": "240px",
                "2xs": "360px",
                xs: "480px",
            },
            colors: {
                primary: {
                    light: "#fafaff",
                    dark: "#0c0c0c",
                },
                border: {
                    dark: "#292929",
                },
            },
            fontFamily: {
                sans: ["Roboto", "ui-sans-serif", "system-ui"],
            },
        },
    },
    plugins: [],
};
