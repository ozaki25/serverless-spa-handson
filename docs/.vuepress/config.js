module.exports = {
  title: 'Serverless Handson',
  themeConfig: {
    sidebar: ['/', '/1_xxx', '/2_xxx', '/3_xxx', '/4_xxx', '/5_xxx'],
  },
  plugins: {
    '@vuepress/pwa': {
      serviceWorker: true,
      updatePopup: true,
    },
  },
  head: [['link', { rel: 'manifest', href: '/manifest.json' }]],
};
