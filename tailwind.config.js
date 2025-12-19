/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'hazard-orange': '#fbbf24',
                'space-black': '#020617',
                'blueprint-blue': '#1e293b',
            },
            fontFamily: {
                rajdhani: ['Rajdhani', 'sans-serif'],
                mono: ['Share Tech Mono', 'monospace'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
