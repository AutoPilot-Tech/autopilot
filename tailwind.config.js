const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    
    extend: {
      display: ['group-hover'],
    },
    screens: {
      sm: '440px',
      md: '547px',
      lg: '768px',
      xl: '1024px',
      '2xl': '1680px',
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
