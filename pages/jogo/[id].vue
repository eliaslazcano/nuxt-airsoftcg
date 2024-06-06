<script setup>
import {copiarTextoParaAreaTransferencia} from '@eliaslazcano/utils'

definePageMeta({
  validate: route => typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
})

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const moment = useMoment()
const config = useRuntimeConfig()
const sessionStore = useSessionStore()

const jogoId = Number(route.params.id)
const {data: pageData} = await useApi(`/jogos?id=${jogoId}`)

const permitidoEditar = computed(() => sessionStore.isAuthenticated && sessionStore.payload.usuario === pageData.value?.jogo.autor.id)
const eventoNome = computed(() => pageData.value?.jogo.titulo ? pageData.value.jogo.titulo : null)
const eventoIcone = computed(() => pageData.value?.jogo.icone ? `${config.public.baseURL}/storage/jogo/${pageData.value.jogo.icone}` : null)
const eventoData = computed(() => !pageData.value?.jogo.datahora ? null : moment(pageData.value.jogo.datahora).format('DD/MM/YYYY [—] dddd').toUpperCase())
const eventoHora = computed(() => !pageData.value?.jogo.datahora ? null : moment(pageData.value.jogo.datahora).format('HH:mm'))
const eventoNoturno = computed(() => {
  const horas = pageData.value?.jogo?.datahora ? moment(pageData.value.jogo.datahora).hours() : null
  return horas === null ? false : horas >= 18 || horas < 6
})
const eventoLocalNome = computed(() => pageData.value?.jogo.local.nome ? pageData.value.jogo.local.nome : null)
const eventoLocalLink = computed(() => pageData.value?.jogo.local.link ? pageData.value.jogo.local.link : null)
const organizadorEquipe = computed(() => {
  if (pageData.value?.jogo.organizador.equipe && pageData.value?.jogo.organizador.tipo === 2) {
    const x = pageData.value.equipes.find(i => i.id === pageData.value.jogo.organizador.equipe)
    return x ? x : null
  }
  return null
})
const organizadorNome = computed(() => {
  if (organizadorEquipe.value) return organizadorEquipe.value.nome
  if (pageData.value?.jogo.organizador.nome) return pageData.value.jogo.organizador.nome
  return ''
})
const organizadorImagem = computed(() => {
  if (organizadorEquipe.value?.imagem) return `${config.public.baseURL}/storage/equipes/${organizadorEquipe.value.imagem}`
  return null
})

useSeoMeta({
  title: 'Airsoft CG - ' + (eventoNome.value ? eventoNome.value : 'Detalhes do jogo'),
  ogTitle: eventoNome.value ? eventoNome.value : `JOGO ABERTO - ${moment(pageData.value.jogo.datahora).format('DD/MM')}`,
  ogDescription: moment(pageData.value.jogo.datahora).format(eventoNome.value ? 'DD/MM HH[h]mm [-] ' : 'HH[h]mm [-] ') +
    (eventoLocalNome.value ? `CAMPO ${eventoLocalNome.value}` : moment(pageData.value.jogo.datahora).format('dddd').toUpperCase()),
  ogImage: eventoIcone.value ? eventoIcone.value : (organizadorImagem.value ? organizadorImagem.value : null),
})

const copiarTexto = async () => {
  let texto = ''
  if (eventoData.value) texto += 'Jogo ' + eventoData.value + '.\n'
  if (eventoHora.value) texto += 'Hora do Briefing: ' + eventoHora.value + '.\n'
  if (eventoLocalNome.value) texto += `Campo: ${eventoLocalNome.value}.\n`
  texto += 'Link: ' + window.location.href + '\n'
  //if (eventoLocalLink.value) texto += `Mapa: ${eventoLocalLink.value}`
  if (!texto) return
  await copiarTextoParaAreaTransferencia(texto.trim())
  $q.notify({type: 'positive', message: 'Texto copiado !'})
}
const copiarLink = async () => {
  await copiarTextoParaAreaTransferencia(window.location.href)
  $q.notify({type: 'positive', message: 'Link copiado !'})
}

const apagarJogo = () => {
  $q.dialog({
    title: 'Apagar jogo?',
    message: 'Esta ação é irreversível, tem certeza?',
    cancel: 'Cancelar',
    ok: 'Confirmar'
  }).onOk(async () => {
    const dialog = $q.dialog({ progress: true, persistent: true, ok: false })
    try {
      const {data, error} = await useApi(`/jogos?id=${jogoId}`, {method: 'DELETE'})
      if (error.value) return
      if (data.value.mensagem) $q.notify({type: 'positive', message: data.value.mensagem})
      router.push('/jogos')
    } finally {
      dialog.hide()
    }
  })
}

const autorFoto = computed(() => {
  if (!pageData.value?.jogo.autor.foto) return null
  return `${config.public.baseURL}/usuario/avatar?id=${pageData.value.jogo.autor.id}&thumb=40`
})

const aprovarJogo = async () => {
  $q.dialog({
    title: 'Publicar o jogo?',
    message: 'O sistema vai avisar todos os membros por email, tem certeza?',
    cancel: 'Cancelar',
    ok: 'Confirmar'
  }).onOk(async () => {
    const dialog = $q.dialog({ progress: true, persistent: true, ok: false })
    try {
      const body = {id: jogoId}
      const {data, error} = await useApi('/gestao/aprovar-jogo', {body, method: 'POST'})
      if (error.value) return
      if (data.value.mensagem) $q.notify({type: 'positive', message: data.value.mensagem})
      router.push('/jogos')
    } finally {
      dialog.hide()
    }
  })
}

const reprovarJogo = async () => {
  $q.dialog({
    title: 'Reprovar publicação?',
    message: 'O sistema vai remover o jogo, tem certeza?',
    cancel: 'Cancelar',
    ok: 'Confirmar'
  }).onOk(async () => {
    const dialog = $q.dialog({ progress: true, persistent: true, ok: false })
    try {
      const {data, error} = await useApi(`/gestao/aprovar-jogo?id=${jogoId}`, {method: 'DELETE'})
      if (error.value) return
      if (data.value.mensagem) $q.notify({type: 'positive', message: data.value.mensagem})
      router.push('/jogos')
    } finally {
      dialog.hide()
    }
  })
}
</script>

<template>
  <q-page padding>
    <div class="q-mx-auto q-gutter-y-md q-pb-xl" style="width: 40rem; max-width: 100%">
      <q-banner class="text-justify bg-info" rounded dense v-if="pageData.jogo.status === 0">
        Este jogo ainda não foi publicado, pois está aguardando análise de um moderador.
        Por enquanto, apenas os moderadores conseguem visualizar esta página.
      </q-banner>

      <q-card flat bordered>
        <q-card-toolbar :title="eventoNome ? eventoNome : 'Detalhes do jogo'">
          <div v-if="permitidoEditar && !$q.screen.lt.sm">
            <q-btn
              label="Editar"
              class="q-mr-sm"
              color="green-6"
              text-color="white"
              icon="edit"
              size="sm"
              :to="`/jogo/form/${jogoId}`"
              rounded
            />
            <q-btn
              color="negative"
              icon="delete"
              size="sm"
              @click="apagarJogo"
              round
            >
              <q-tooltip>Apagar</q-tooltip>
            </q-btn>
          </div>
        </q-card-toolbar>
        <q-card-section v-if="permitidoEditar && $q.screen.lt.sm" class="text-center">
          <q-btn
            label="Editar"
            class="q-mr-sm"
            color="green-6"
            text-color="white"
            icon="edit"
            size="sm"
            :to="`/jogo/form/${jogoId}`"
            rounded
          />
          <q-btn
            label="Apagar"
            color="negative"
            icon="delete"
            size="sm"
            @click="apagarJogo"
            rounded
          />
        </q-card-section>
        <q-list separator>
          <q-item v-if="eventoData">
            <q-item-section avatar>
              <q-avatar>
                <q-icon name="event" size="1.4em" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption lines="1">DATA DO EVENTO</q-item-label>
              <q-item-label>{{eventoData}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="eventoHora">
            <q-item-section avatar>
              <q-avatar>
                <q-icon name="access_time" size="1.4em" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption lines="1">HORA DO BRIEFING</q-item-label>
              <q-item-label>{{eventoHora}}</q-item-label>
            </q-item-section>
            <q-item-section side v-if="eventoNoturno">
              <q-badge color="deep-purple" rounded><q-icon name="nights_stay" class="q-mr-xs" />NOTURNO</q-badge>
            </q-item-section>
          </q-item>
          <q-item v-if="eventoLocalNome" :href="eventoLocalLink" target="_blank">
            <q-item-section avatar>
              <q-avatar>
                <img v-if="organizadorImagem && eventoIcone" :src="eventoIcone" alt="">
                <q-icon v-else name="place" size="1.4em" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption lines="1">LOCAL</q-item-label>
              <q-item-label>{{eventoLocalNome}}</q-item-label>
            </q-item-section>
            <q-item-section side v-if="eventoLocalLink">
              <q-btn color="blue" icon="pan_tool_alt" size="xs" padding="xs sm" label="Clique" outline dense rounded v-if="$q.screen.lt.sm" />
              <q-btn color="blue" icon="share_location" size="sm" label="Abrir localização" outline dense v-else />
            </q-item-section>
          </q-item>
          <q-item v-if="organizadorNome">
            <q-item-section avatar>
              <q-avatar square class="rounded-borders">
                <img v-if="organizadorImagem || eventoIcone" :src="organizadorImagem || eventoIcone" alt="">
                <q-icon v-else name="local_police" size="1.4em" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption lines="1">ORGANIZAÇÃO</q-item-label>
              <q-item-label>{{organizadorNome}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <q-card flat bordered v-if="pageData.jogo.texto">
        <q-card-section class="jogo-descricao">
          <div v-html="pageData.jogo.texto" style="white-space: pre-wrap; overflow-wrap: break-word; word-wrap: break-word"></div>
        </q-card-section>
      </q-card>

      <q-card flat bordered v-if="pageData.jogo.autor?.id">
        <q-item :to="`/perfil/${pageData.jogo.autor.id}`" clickable>
          <q-item-section avatar>
            <q-avatar color="primary">
              <img :src="autorFoto" alt="" v-if="autorFoto">
              <q-icon name="person" color="white" size="1.5em" v-else></q-icon>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label caption lines="1">Publicado por</q-item-label>
            <q-item-label>{{pageData.jogo.autor.nome}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card>

      <q-banner class="bg-negative" rounded dense>
        <div class="flex no-wrap">
          <div class="q-mr-sm"><q-icon name="warning" size="1.6rem"/></div>
          <div class="flex items-center">
            <div>Aviso: O uso de coturno e óculos de proteção é obrigatório,
              inclusive para os espectadores.</div>
          </div>
        </div>
      </q-banner>

      <q-card-actions class="justify-center q-py-none" v-if="pageData.jogo.status !== 0">
        <q-btn color="primary" size="sm" icon="link" label="Copiar o link" @click="copiarLink" />
        <q-btn color="primary" size="sm" icon="content_copy" label="Copiar informações" @click="copiarTexto" />
      </q-card-actions>
      <q-card-actions class="justify-center q-py-none" v-else-if="pageData.moderador">
        <q-btn color="negative" size="sm" icon="thumb_down" label="Recusar postagem" @click="reprovarJogo" />
        <q-btn color="positive" size="sm" icon="thumb_up" label="Aprovar postagem" @click="aprovarJogo" />
      </q-card-actions>
    </div>
  </q-page>
</template>
