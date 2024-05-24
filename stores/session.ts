export const useSessionStore = defineStore('session', {
  state: () => ({
    token: '' as string | null,
  }),
  getters: {
    isAuthenticated: state => !!state.token,
    payload: state => {
      if (!state.token) return null
      const partes = state.token.split('.')
      if (partes.length !== 3) return null
      try {
        return JSON.parse(window.atob(partes[1]))
      } catch (e) {
        return null
      }
    },
  },
  actions: {
    logout() {
      if (this.token) {
        this.token = null
        Notify.create({type: 'negative', message: 'Você foi desconectado'})
      }
      const router = useRouter()
      return router.push('/login')
    },
  },
  persist: true,
})