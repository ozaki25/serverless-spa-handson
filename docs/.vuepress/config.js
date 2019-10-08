module.exports = {
  title: 'Serverless Handson',
  themeConfig: {
    sidebar: ['/', '/1_setup', '/2_lambda', '/3_xxx', '/4_xxx', '/5_xxx'],
  },
  plugins: {
    '@vuepress/pwa': {
      serviceWorker: true,
      updatePopup: true,
    },
  },
  head: [['link', { rel: 'manifest', href: '/manifest.json' }]],
};
