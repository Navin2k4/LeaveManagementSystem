import flowbitePlugin from 'flowbite/plugin';
import tailwindScrollbar from 'tailwind-scrollbar';
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: theme=>({
        'custom-gradient': 'linear-gradient(109.6deg, rgb(0, 204, 130) 11.2%, rgb(58, 181, 46) 91.7%)',
      }),
      colors: {
        'calm-blue': '#87CEEB',
        'pale-lavender': '#C7B8EA',
        'cream': '#F5F5F5',
        'dusk-blue': '#6A5ACD',
        'sage-green': '#8B9467',
        'earthy-brown': '#964B00',
        'powder-blue': '#B2E6CE',
        'soft-peach': '#FFD7BE',
        'dark-gray': '#333333',
        'linkedin-blue': '#2867B2', // LinkedIn Blue
        'professional-blue': '#2E4053', // Professional Blue
        'business-blue': '#1A1D23', // Business Blue
        'trust-blue': '#4567B7', // Trust Blue
        'corporate-blue': '#2F4F7F', // Corporate Blue
      },
      
    },
  },
  plugins: [
    flowbitePlugin,
    tailwindScrollbar,
  ],
};