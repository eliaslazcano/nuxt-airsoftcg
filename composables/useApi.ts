export const useApi: typeof useFetch = (request, opts) => {
  const config = useRuntimeConfig()
  const session = useSessionStore()
  return useFetch(request, {
    baseURL: config.public.baseURL,
    onRequest({ request, options }) {
      options.headers = options.headers || {}
      if (session.token) options.headers.authorization = session.token
    },
    onResponseError({ request, response, options }) {
      const x = !!response._data?.mensagem
      if (x) Notify.create({type: 'negative', message: response._data.mensagem})
      if (response?.status === 410) session.logout(!x)
    },
    ignoreResponseError: false,
    ...opts
  })
}