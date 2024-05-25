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
        return JSON.parse(decodeBase64(partes[1]))
      } catch (e) {
        return null
      }
    },
  },
  actions: {
    logout(exibirMensagem = true) {
      if (this.token) {
        this.token = null
        if (exibirMensagem) Notify.create({type: 'negative', message: 'Você foi desconectado'})
      }
      const router = useRouter()
      return router.push('/login')
    },
  },
  persist: true,
})