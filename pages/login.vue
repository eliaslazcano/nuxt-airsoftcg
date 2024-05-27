<script setup>
const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const session = useSessionStore()

const formLoginValues = reactive({usuario: '', senha: ''})
const formLoginShowPasswd = ref(false)
const formLoginSubmiting = ref(false)
const formLoginSubmit = async () => {
  try {
    formLoginSubmiting.value = true
    const {data, error} = await useApi('/auth/login', {method: 'POST', body: formLoginValues})
    if (error.value) return
    if (data.value.mensagem) $q.notify({type: 'positive', message: data.value.mensagem, icon: 'thumb_up'})
    session.token = data.value.token
    await router.push(route.query.next ? route.query.next : '/')
  } finally {
    formLoginSubmiting.value = false
  }
}

const forgotDialog = ref(false)
const forgotIptEmail = ref('')
const forgotSubmiting = ref(false)
const forgotSubmit = async () => {
  try {
    forgotSubmiting.value = true
    const body = {email: forgotIptEmail.value.trim().toLowerCase(), url: window.location.href}
    const {data, error} = await useApi('/auth/forgot', {method: 'POST', body})
    forgotDialog.value = false
    if (error.value) return
    if (data.value.mensagem) $q.notify({type: 'positive', message: data.value.mensagem, icon: 'thumb_up'})
  } finally {
    forgotSubmiting.value = false
  }
}
watch(forgotDialog, v => {
  if (v && formLoginValues.usuario) forgotIptEmail.value = formLoginValues.usuario
})
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
              <q-form @submit.prevent="formLoginSubmit" autocorrect="off" autocapitalize="off" class="q-gutter-y-md">
                <q-input
                  label="E-mail"
                  type="email"
                  autocomplete="username"
                  v-model="formLoginValues.usuario"
                  :disable="formLoginSubmiting"
                  :rules="[v => !!v && !!v.trim() || 'Insira seu e-mail']"
                  lazy-rules
                  outlined
                />
                <q-input
                  label="Senha"
                  :type="formLoginShowPasswd ? 'text' : 'password'"
                  maxlength="16"
                  autocomplete="current-password"
                  v-model="formLoginValues.senha"
                  :disable="formLoginSubmiting"
                  :rules="[v => !!v && !!v.trim() || 'Insira sua senha']"
                  lazy-rules
                  outlined
                >
                  <template v-slot:append>
                    <q-btn
                      flat
                      round
                      :icon="formLoginShowPasswd ? 'visibility' : 'visibility_off'"
                      @click="formLoginShowPasswd = !formLoginShowPasswd"
                    />
                  </template>
                </q-input>
                <q-btn
                  label="Entrar"
                  color="primary"
                  class="full-width"
                  type="submit"
                  :loading="formLoginSubmiting"
                  unelevated
                  rounded
                />
                <q-btn
                  label="Esqueci a senha"
                  color="primary"
                  class="full-width"
                  :disable="formLoginSubmiting"
                  @click="forgotDialog = true"
                  outline
                  rounded
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
                :disable="formLoginSubmiting"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>

    <q-dialog v-model="forgotDialog" :persistent="forgotSubmiting">
      <q-card style="width: 24rem; max-width: 100%">
        <q-form @submit.prevent="forgotSubmit">
          <q-card-section>
            <div class="text-h6 q-mb-md text-center">
              <q-avatar size="2.6rem" class="bg-primary">
                <q-icon name="key" size="2rem" color="white" />
              </q-avatar>
              <div>Esqueceu a senha</div>
            </div>
            <q-banner class="bg-info q-mb-md" dense rounded>
              Enviaremos uma mensagem para o seu e-mail com um link para troca de senha.
              Para prosseguir confirme seu endereço de e-mail no campo abaixo.
            </q-banner>
            <q-input
              label="Confirme seu e-mail:"
              type="email"
              autocomplete="username"
              v-model="forgotIptEmail"
              :rules="[v => !!v && !!v.trim() || 'Insira seu e-mail']"
              :disable="forgotSubmiting"
              stack-label
              outlined
            />
          </q-card-section>
          <q-card-actions class="justify-center q-pt-none">
            <q-btn size="sm" color="primary" outline label="Cancelar" v-close-popup :disable="forgotSubmiting"/>
            <q-btn size="sm" color="primary" unelevated label="Confirmar" type="submit" :loading="forgotSubmiting"/>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>
