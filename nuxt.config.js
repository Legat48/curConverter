
export default {
  head: {
    titleTemplate: '%s - test',
    title: 'cur-converter',
    htmlAttrs: {
      lang: 'ru'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      }
    }
  },
  router: {
    base: '/cur-converter/'
  },
  css: [
    '~/assets/styles/main.scss'
  ],
  styleResources: {
    scss: ['~/assets/styles/scss/*.scss']
  },

  plugins: [
  ],

  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],

  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    '@nuxt/image'
  ],

  axios: {
    baseURL: '/'
  },

  vuetify: {
    customVariables: ['~/assets/styles/scss/variables.scss'],
    theme: {
      dark: false,
      themes: {
      }
    }
  },

  build: {
  }
}
