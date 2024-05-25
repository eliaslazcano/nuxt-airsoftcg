<script setup>
import {validarEmail} from '@eliaslazcano/utils'

const $q = useQuasar()
const router = useRouter()
const session = useSessionStore()

const formValues = reactive({nome: '', apelido: '', email: '', senha: '', senhaDois: ''})
const formShowPassword = ref(false)
const formRepasswdRules = computed(() => [v => !!v || 'Repita a senha', v => v === formValues.senha || 'A senha não está igual'])
const formSubmiting = ref(false)
const formSubmit = async () => {
  try {
    formSubmiting.value = true
    const {data, error} = await useApi('/auth/criar-conta', {method: 'POST', body: formValues})
    if (error.value) return
    session.token = data.value.token
    $q.notify({ type: 'positive', message: data.value.mensagem ? data.value.mensagem : 'Seja bem vindo a comunidade' })
    await router.replace('/')
  } finally {
    formSubmiting.value = false
  }
}
</script>

<template>
  <q-page padding>
    <q-card class="q-mx-auto" style="width: 24rem; max-width: 100%" flat bordered>
      <q-card-section>
        <q-form @submit.prevent="formSubmit" autocorrect="off" autocapitalize="off" class="q-gutter-y-md">
          <p class="text-h5 text-center text-weight-bold">Formulário de registro</p>
          <q-input
            label="Nome e Sobrenome"
            v-model="formValues.nome"
            :disable="formSubmiting"
            :rules="nomeRules"
            autocomplete="name"
            lazy-rules
            outlined
          />
          <q-input
            label="Apelido (Nome de guerra)"
            v-model="formValues.apelido"
            :disable="formSubmiting"
            hint="O apelido é opcional, mostrado no lugar do nome"
            lazy-rules
            outlined
          />
          <q-input
            label="Email"
            v-model="formValues.email"
            :disable="formSubmiting"
            :rules="[v => !!v && !!v.trim() || 'Insira seu email', v => !!v && validarEmail(v) || 'Coloque um email válido']"
            type="email"
            autocomplete="email"
            lazy-rules
            outlined
          />
          <q-input
            label="Senha"
            :type="formShowPassword ? 'text' : 'password'"
            v-model="formValues.senha"
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
            :type="formShowPassword ? 'text' : 'password'"
            v-model="formValues.senhaDois"
            :disable="formSubmiting"
            :rules="formRepasswdRules"
            maxlength="16"
            autocomplete="off"
            outlined
          />
          <q-btn
            label="Confirmar"
            color="primary"
            class="full-width"
            type="submit"
            unelevated
            rounded
            :loading="formSubmiting"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
