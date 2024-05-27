<script setup>
definePageMeta({
  middleware: ["auth"]
})

const sessionStore = useSessionStore()
const router = useRouter()
const $q = useQuasar()

const formValores = reactive({senhaAtual: '', senhaNova: '', senhaDois: ''})
const showPassword = ref(false)
const showPassword2 = ref(false)
const showPassword3 = ref(false)
const passwordRepeatRules = computed(() => [v => !!v || 'Repita a senha', v => v === formValores.senhaNova || 'A senha não está igual'])
const processing = ref(false)

const submitFn = async () => {
  processing.value = true
  try {
    const body = {senhaAtual: formValores.senhaAtual, senhaNova: formValores.senhaNova}
    const {data, error} = await useApi('/auth/trocar-senha', {method: 'POST', body})
    if (error.value) return
    if (data.value.token) sessionStore.token = data.value.token
    if (data.value.mensagem) $q.notify({type: 'positive', message: data.value.mensagem})
    router.back()
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <q-page padding>
    <div class="q-mx-auto" style="width: 22rem; max-width: 100%">
      <q-card flat bordered>
        <q-form @submit.prevent="submitFn">
          <q-card-toolbar title="Trocar senha"/>
          <q-card-section class="q-gutter-y-lg">
            <q-input
              label="Senha atual"
              :type="showPassword ? 'text' : 'password'"
              maxlength="16"
              autocomplete="current-password"
              v-model="formValores.senhaAtual"
              :disable="processing"
              :rules="[v => !!v && !!v.trim() || 'Insira sua senha']"
              outlined
            >
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  :icon="showPassword ? 'visibility' : 'visibility_off'"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
            <q-input
              label="Senha"
              :type="showPassword2 ? 'text' : 'password'"
              v-model="formValores.senhaNova"
              :disable="processing"
              :rules="passwordRules"
              maxlength="16"
              autocomplete="new-password"
              outlined
            >
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  :icon="showPassword2 ? 'visibility' : 'visibility_off'"
                  @click="showPassword2 = !showPassword2"
                />
              </template>
            </q-input>
            <q-input
              label="Repita a senha"
              :type="showPassword3 ? 'text' : 'password'"
              v-model="formValores.senhaDois"
              :disable="processing"
              :rules="passwordRepeatRules"
              maxlength="16"
              autocomplete="off"
              outlined
            >
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  :icon="showPassword3 ? 'visibility' : 'visibility_off'"
                  @click="showPassword3 = !showPassword3"
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
              :loading="processing"
            />
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>
