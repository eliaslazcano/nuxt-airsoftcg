<script setup>
const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const session = useSessionStore()

const form = reactive({usuario: '', senha: ''})
const showPassword = ref(false)
const processing = ref(false)

const onSubmit = async () => {
  try {
    processing.value = true
    const {data, error} = await useApi('/auth/login', {method: 'POST', body: form})
    if (error.value) return
    if (data.value.mensagem) $q.notify({type: 'positive', message: data.value.mensagem, icon: 'thumb_up'})
    session.token = data.value.token
    await router.push(route.query.next ? route.query.next : '/')
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <q-page padding>
    <div style="width: 64rem; max-width: 100%" class="q-mx-auto">
      <div class="row q-col-gutter-md reverse">
        <div class="col-12 col-md-6">
          <q-card class="q-mx-auto" style="width: 22rem; max-width: 100%" flat bordered>
            <q-card-section>
              <div class="text-center q-pb-sm">
                <img alt="" src="/img/logo-vetorizado.svg" style="width: 8rem; height: 8rem"/>
                <p class="text-h6 q-my-none">Área de Membros</p>
              </div>
              <q-form @submit.prevent="onSubmit" autocorrect="off" autocapitalize="off" class="q-gutter-y-md">
                <q-input
                  label="E-mail"
                  type="email"
                  autocomplete="username"
                  v-model="form.usuario"
                  :disable="processing"
                  :rules="[v => !!v && !!v.trim() || 'Insira seu e-mail']"
                  lazy-rules
                  outlined
                />
                <q-input
                  label="Senha"
                  :type="showPassword ? 'text' : 'password'"
                  maxlength="16"
                  autocomplete="current-password"
                  v-model="form.senha"
                  :disable="processing"
                  :rules="[v => !!v && !!v.trim() || 'Insira sua senha']"
                  lazy-rules
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
                <q-btn
                  label="Entrar"
                  color="primary"
                  class="full-width"
                  type="submit"
                  unelevated
                  rounded
                  :loading="processing"
                />
                <q-btn
                  label="Esqueci a senha"
                  color="primary"
                  class="full-width"
                  outline
                  rounded
                  :to="{path: '/auth/forgot-password', query: { email: form.usuario }}"
                  :disable="processing"
                />
              </q-form>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <q-card class="q-mx-auto" style="width: 22rem; max-width: 100%" flat bordered>
            <q-card-section class="q-pb-xs">
              <div class="text-h6">Ainda não é membro?</div>
              É grátis, e os benefícios são:
            </q-card-section>
            <q-list dense>
              <q-item clickable v-ripple>
                <q-item-section side>
                  <q-icon name="arrow_right" color="positive"/>
                </q-item-section>
                <q-item-section>
                  Ser alertado por e-mail quando um jogo aberto for divulgado.
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section side>
                  <q-icon name="arrow_right" color="positive"/>
                </q-item-section>
                <q-item-section>
                  Publicar jogos abertos no nosso site.
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section side>
                  <q-icon name="arrow_right" color="positive"/>
                </q-item-section>
                <q-item-section>
                  Publicar jogos privados usando nosso formulário de inscrição facilitado e gerar o link para divulga-lo.
                </q-item-section>
              </q-item>
            </q-list>
            <q-card-actions class="justify-center">
              <q-btn
                label="Registrar-se"
                color="primary"
                unelevated
                rounded
                padding="xs lg"
                to="/auth/registrar"
                :disable="processing"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>
