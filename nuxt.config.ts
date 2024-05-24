// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["nuxt-quasar-ui","@pinia/nuxt","@pinia-plugin-persistedstate/nuxt"],
  runtimeConfig: {
    public: {
      headerTitle: "Airsoft CG",
      footerTitle: "Comunidade Airsoft CG",
      baseURL: process.env.BASE_URL || 'https://airsoftcg.com.br/api',
    }
  },
  app: {
    pageTransition: {
      appear: true,
      mode: "out-in",
      enterActiveClass: "animated fadeIn",
      leaveActiveClass: "animated fadeOut",
    },
  },
  quasar: {
    lang: "pt-BR",
    config: {
      brand: {
        "negative": "#dc3545",
      },
      dark: true,
      notify: {timeout: 3000},
    },
    plugins: ["Dialog","Notify"],
    extras: {
      animations: ["fadeIn","fadeOut","fadeInUp","fadeOutDown"],
    },
  },
  pinia: {
    storesDirs: ['./stores/**']
  },
})