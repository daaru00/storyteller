import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  routeRules: {
    '/profile': { ssr: false },
  },
  runtimeConfig: {
    aws: {
      region: '',
      profile: ''
    },
    dynamodb: {
      tableName: '',
    },
    s3: {
      bucketName: ''
    }
  },
  devtools: { enabled: false },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    [
      '@sidebase/nuxt-auth', {
        provider: {
          type: 'authjs',
          defaultProvider: 'custom'
        },
        globalAppMiddleware: {
          isEnabled: false
        }
      }
    ],
    [
      '@nuxtjs/i18n', {
        defaultLocale: 'it',
        langDir: '../locales',
        strategy: 'no_prefix',
        locales: [{
          name: 'Italiano',
          code: 'it',
          file: 'it.json'
        },{
          name: 'English',
          code: 'en',
          file: 'en.json'
        }],
      }
    ],
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
