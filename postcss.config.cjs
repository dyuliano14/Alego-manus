// postcss.config.js
module.exports = {
  plugins: {
    // Use @tailwindcss/postcss como sugerido pelo Netlify
    // Isso é uma solução temporária para o erro específico do Netlify
    // e pode ser revertido se o problema for corrigido em versões futuras ou no Netlify
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};