<script setup>
definePageMeta({
  //validate: route => !!route.query.token && route.query.token.length === 32,
  middleware: [
    function (to) {
      if (!to.query.token) navigateTo('/login')
    },
  ],
})

const sessionStore = useSessionStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const formValores = reactive({senhaNova: '', senhaDois: ''})
const formShowPassword = ref(false)
const formShowPassword2 = ref(false)
const formPassRepeatRules = computed(() => [v => !!v || 'Repita a senha', v => v === formValores.senhaNova || 'A senha não está igual'])
const formSubmiting = ref(false)
const formSubmit = async () => {
  formSubmiting.value = true
  try {
    const body = {senha: formValores.senhaNova, token: route.query.token}
    const {data, error} = await useApi('/auth/recuperar', {method: 'POST', body})
    if (error.value) return
    if (data.value.token) sessionStore.token = data.value.token
    if (data.value.mensagem) $q.notify({type: 'positive', message: data.value.mensagem})
    return router.push(sessionStore.payload?.usuario ? `/perfil/${sessionStore.payload.usuario}` : '/')
  } finally {
    formSubmiting.value = false
  }
}
</script>

<template>
  <q-page padding>
    <div class="q-mx-auto" style="width: 22rem; max-width: 100%">
      <q-card flat bordered>
        <q-form @submit.prevent="formSubmit">
          <q-card-toolbar title="Trocar senha"/>
          <q-card-section class="q-gutter-y-lg">
            <q-input
              label="Senha"
              :type="formShowPassword ? 'text' : 'password'"
              v-model="formValores.senhaNova"
              :disable="formSubmiting"
              :rules="passwordRules"
              maxlength="16"
              autocomplete="new-password"
              outlined
            >
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  :icon="formShowPassword ? 'visibility' : 'visibility_off'"
                  @click="formShowPassword = !formShowPassword"
                />
              </template>
            </q-input>
            <q-input
              label="Repita a senha"
              :type="formShowPassword2 ? 'text' : 'password'"
              v-model="formValores.senhaDois"
              :disable="formSubmiting"
              :rules="formPassRepeatRules"
              maxlength="16"
              autocomplete="off"
              outlined
            >
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  :icon="formShowPassword2 ? 'visibility' : 'visibility_off'"
                  @click="formShowPassword2 = !formShowPassword2"
                />
              </template>
            </q-input>
            <q-btn
              label="Confirmar"
              color="primary"
              class="full-width"
              type="submit"
              unelevated
              rounded
              :loading="formSubmiting"
            />
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>
