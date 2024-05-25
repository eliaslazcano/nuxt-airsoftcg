<script setup>
import {copiarTextoParaAreaTransferencia} from '@eliaslazcano/utils'
import {fabInstagram} from '@quasar/extras/fontawesome-v6'

const $q = useQuasar()
const route = useRoute()
const config = useRuntimeConfig()
const sessionStore = useSessionStore()

const usuarioId = computed(() => Number(route.params.id))
const usuarioEdit = sessionStore.isAuthenticated && sessionStore.payload.usuario === usuarioId.value

const {data: resultado, refresh} = await useApi(`/usuario/perfil?id=${usuarioId.value}`)
const usuarioInfo = computed(() => resultado.value.perfil)
watch(() => route.params.id, () => refresh())

const perfilPodeMelhorar = computed(() => !usuarioInfo.value.foto || !usuarioInfo.value.apelido ||
  !usuarioInfo.value.classe || !usuarioInfo.value.instagram)

const fotoSrc = computed(() => {
  if (!usuarioInfo.value?.foto) return null
  const extra = sessionStore.isAuthenticated ? `&sessao=${sessionStore.payload.sessao}` : '';
  return config.public.baseURL + `/usuario/avatar?id=${usuarioId.value}&thumb=144${extra}`
})

const salvarFoto = async (base64) => {
  const dialog = $q.dialog({ message: 'Gravando..', progress: true, persistent: true, ok: false })
  try {
    const body = {foto: base64}
    const {data} = await useApi('/usuario/avatar', {body, method: 'POST'})
    await refresh()
    if (data.value.token) sessionStore.token = data.value.token
    if (data.value.mensagem) $q.notify({type: 'positive', message: data.value.mensagem})
  } finally {
    dialog.hide()
  }
}

const instagramDialog = ref(false)
const instagramIpt = ref('')
const instagramSalvar = async () => {
  const dialog = $q.dialog({ message: 'Gravando..', progress: true, persistent: true, ok: false })
  try {
    const body = {instagram: instagramIpt.value.trim().toLowerCase()}
    const {data} = await useApi('/usuario/incluir-instagram', {body, method: 'POST'})
    await refresh()
    instagramDialog.value = false
    if (data.value.mensagem) $q.notify({type: 'positive', message: data.value.mensagem})
  } finally {
    dialog.hide()
  }
}
watch(usuarioInfo, v => {
  if (v?.instagram) instagramIpt.value = v.instagram
})

const copiarLink = async () => {
  await copiarTextoParaAreaTransferencia(window.location.href)
  $q.notify({type: 'positive', message: 'Link copiado !'})
}
</script>

<template>
  <q-page padding>
    <div style="width: 32rem; max-width: 100%" class="q-mx-auto">
      <q-card flat bordered style="margin-top: 4.5rem">
        <q-card-section style="padding-top: 4.5rem" class="q-px-none q-pb-none">
          <div style="position: absolute; top: -4.5rem; text-align: center; width: 100%">
            <q-avatar color="primary" size="9rem">
              <img :src="fotoSrc" alt="" v-if="fotoSrc">
              <q-icon name="person" color="white" size="6rem" v-else></q-icon>
              <q-btn
                v-if="usuarioEdit"
                @click="$refs.cropperRef.selecionarArquivo()"
                icon="settings"
                color="white"
                text-color="black"
                size="sm"
                style="position: absolute; bottom: -.5rem"
                round
              />
            </q-avatar>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-center" v-if="usuarioInfo.apelido">{{usuarioInfo.apelido}}</div>
          <div class="text-caption text-center" v-if="usuarioInfo.nome && !usuarioInfo.apelido">{{usuarioInfo.nome}}</div>
          <div class="flex flex-center q-mt-sm" v-if="usuarioInfo.instagram">
            <q-btn outline rounded no-caps :color="$q.dark.isActive ? 'white':'primary'" padding="xs md" target="_blank" :href="`https://www.instagram.com/${usuarioInfo.instagram}`">
              <q-avatar class="bg-instagram q-mr-sm" size="1.4rem">
                <q-icon :name="fabInstagram" size="1.1rem" color="white"></q-icon>
              </q-avatar> @{{usuarioInfo.instagram}}
            </q-btn>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered v-if="usuarioInfo.classe" class="q-mt-md">
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon :name="`img:/img/classes/${usuarioInfo.classe.icone}`" size="42px" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>CLASSE FAVORITA</q-item-label>
              <q-item-label>{{usuarioInfo.classe.titulo}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <q-card flat bordered v-if="usuarioInfo.funcao" class="q-mt-md">
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon :name="`img:/img/especialidades/${usuarioInfo.funcao.icone}`" size="42px" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>ESPECIALIDADE DE CAMPO</q-item-label>
              <q-item-label>{{usuarioInfo.funcao.titulo}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <q-banner
        class="q-mt-md bg-info rounded-borders"
        v-if="usuarioEdit && perfilPodeMelhorar"
      >
        <div class="text-weight-bold">Sugestões para deixar seu perfil bacana:</div>
        <ul>
          <li v-if="!usuarioInfo.foto">
            <a role="button" class="cursor-pointer" @click="$refs.cropperRef.selecionarArquivo()">Insira uma foto de perfil. (clique aqui)</a></li>
          <li v-if="!usuarioInfo.apelido">Defina seu "nome de guerra" (um apelido ou abreviação do nome).</li>
          <li v-if="!usuarioInfo.classe">Defina a sua classe de operador favorita.</li>
          <li v-if="!usuarioInfo.funcao">Defina a sua especialidade favorita.</li>
          <li v-if="!usuarioInfo.instagram">
            <a role="button" class="cursor-pointer" @click="instagramDialog = true">Insira o seu instagram. (clique aqui)</a></li>
        </ul>
      </q-banner>

      <q-card flat bordered class="q-mt-md" v-if="usuarioInfo.contribuicoes.jogos">
        <q-list separator dense padding>
          <q-item-label header>Contribuições</q-item-label>
          <q-item>
            <q-item-section avatar>
              <q-avatar color="grey">
                <q-icon name="flag" color="white" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>JOGOS PUBLICADOS</q-item-label>
              <q-item-label overline v-if="usuarioInfo.contribuicoes.jogos === 1">{{usuarioInfo.contribuicoes.jogos}} JOGO</q-item-label>
              <q-item-label overline v-else>{{usuarioInfo.contribuicoes.jogos}} JOGOS</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <q-card-actions class="q-mt-none q-pt-none text-center justify-center q-gutter-y-md">
        <q-btn color="negative" size="sm" icon="lock_reset" label="Trocar senha" to="/auth/trocar-senha" v-if="usuarioEdit" />
<!--        <q-btn color="primary" size="sm" icon="edit" label="Modificar perfil" to="/alterar-perfil" v-if="usuarioEdit" />-->
        <q-btn color="primary" size="sm" icon="link" label="Copiar link" @click="copiarLink" />
      </q-card-actions>
    </div>

    <ImageCropperDialog ref="cropperRef" @cropped="img64 => salvarFoto(img64)" mimeSaida="image/jpeg" />

    <q-dialog v-model="instagramDialog">
      <q-card style="width: 24rem; max-width: 100%">
        <q-form @submit.prevent="instagramSalvar">
          <q-card-section>
            <div class="text-h6 q-mb-md text-center">
              <q-avatar size="2rem" class="bg-instagram">
                <q-img src="/img/instagram.svg" width="1.4rem"></q-img>
              </q-avatar>
              <div>Instagram</div>
            </div>
            <q-input
              label="Seu arroba:"
              prefix="@"
              v-model="instagramIpt"
              :rules="[v => !!v && !!v.trim() || 'Insira seu arroba', v => !!v && !!v.trim() && v.indexOf(' ') === -1 || 'Não pode usar espaços']"
              stack-label
              outlined
            />
          </q-card-section>
          <q-card-actions class="justify-center q-pt-none">
            <q-btn size="sm" color="primary" outline label="Cancelar" v-close-popup/>
            <q-btn size="sm" color="primary" unelevated label="Confirmar" type="submit"/>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>
