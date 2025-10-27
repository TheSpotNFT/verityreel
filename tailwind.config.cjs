/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                vr: {
                    bg: "#0a0a0a",
                    card: "#141414",
                    line: "#1f1f1f",
                    text: "#e5e5e5",
                    sub: "#a1a1a1",
                    green: "#1aff93",
                },
            },
        },
    },
    plugins: [],
};
