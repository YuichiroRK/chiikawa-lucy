import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pastelPink: '#ffd1dc',
        kawaiiPink: '#ffb7c5',
        softWhite: '#fff5f7',
        textCute: '#5c4a4d',
      },
      fontFamily: {
        // Opcional: Si luego quieres agregar una fuente cute como 'Nunito' o 'Quicksand' desde Google Fonts
        sans: ['"Nunito"', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}
export default config
