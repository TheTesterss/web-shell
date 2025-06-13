/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    theme: {
        extend: {
            fontFamily: {
                mono: ['"Space Mono"', "monospace"]
            },
            colors: {
                "terminal-black": "#000000",
                "terminal-green": "#00FF00",
                "terminal-gray": "#AAAAAA"
            }
        }
    },
    plugins: []
};
