<script setup>
import {msgRecursoRestrito} from '~/utils/index.js'

useSeoMeta({
  title: 'Airsoft CG - Mural de Jogos',
  ogTitle: 'Mural de Jogos',
  ogDescription: 'Cronograma de jogos em campo grande',
})

const {data: pageData} = await useApi('/jogos')
const session = useSessionStore()
const config = useRuntimeConfig()
const router = useRouter()
const moment = useMoment()
const $q = useQuasar()

const momentoAtual = moment()
const dataAtual = momentoAtual.format("YYYY-MM-DD HH:mm:ss")

const getThumb = (icone, imagem) => {
  if (icone) return {src: `${config.public.baseURL}/storage/jogo/${icone}`, color: 'none', icon: false}
  else if (imagem) return {src: `${config.public.baseURL}/storage/equipes/${imagem}`, color: 'none', icon: false}
  return {src: 'flag', color: 'primary', icon: true}
}

const jogos = computed(() => pageData.value.jogos.map(i => {
  i.restam = dataAtual < i.datahora ? moment(i.datahora, "YYYY-MM-DD HH:mm:ss").diff(momentoAtual, 'hours') : null
  i.thumb = getThumb(i.icone, i.imagem)
  return i
}))
const formatarData = datetime => moment(datetime).format('DD/MM/YYYY HH:mm [—] dddd').toUpperCase()

const notificarIpt = ref(false)
const notificarDisable = ref(false)
const notificarSubmit = async () => {
  if (!session.isAuthenticated) {
    return $q.dialog({
      title: 'Você não está logado',
      message: msgRecursoRestrito,
      html: true,
      ok: 'Registrar-se',
      cancel: 'Voltar'
    }).onOk(() => router.push('/auth/registrar'))
      .onDismiss(() => notificarIpt.value = false)
  }

  notificarDisable.value = true
  try {
    const json = {valor: notificarIpt.value}
    const {data, error} = await useApi('/usuario/notificar-jogo', {method: 'POST', body: json})
    if (error.value) return
    if (data.value.mensagem) $q.notify({message: data.value.mensagem, type: 'positive'})
    pageData.value.notificar = data.value.valor
    notificarIpt.value = data.value.valor
  } finally {
    notificarDisable.value = false
  }
}
watch(notificarIpt, v => {
  if (v !== pageData.value.notificar) notificarSubmit()
})
</script>

<template>
  <q-page padding>
    <div class="q-mx-auto q-mb-xl" style="width: 32rem; max-width: 100%">
      <div class="full-width q-mb-md">
        <div class="text-h6 text-center q-mb-xs">Jogos publicados</div>
      </div>

      <q-card bordered flat class="q-mb-md">
        <q-list>
          <q-item tag="label" v-ripple :disable="notificarDisable">
            <q-item-section avatar>
              <q-toggle color="blue" v-model="notificarIpt" :disable="notificarDisable" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Te avisar quando houver novos jogos?</q-item-label>
              <q-item-label caption>{{ notificarIpt ? 'Ativado' : 'Desativado' }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <div class="flex column items-center justify-center q-mb-md">
        <q-banner class="bg-info q-py-none" dense rounded style="min-height: 24px">
          <div>
            <q-icon name="pan_tool_alt" size="1rem"/> Clique no jogo para saber os detalhes
          </div>
        </q-banner>
      </div>

      <q-card flat bordered class="q-mb-md">
        <q-list separator>
          <q-item v-for="i in jogos" :key="i.id" :class="{'disabled':i.ocorreu}" :to="`/jogo/${i.id}`" clickable>
            <q-item-section avatar>
              <q-avatar square class="rounded-borders" :color="i.thumb.color">
                <q-icon :name="i.thumb.src" color="white" v-if="i.thumb.icon" />
                <img :src="i.thumb.src" alt="" v-else>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{i.local}}
                <q-chip v-if="i.status === 0" dense size="sm" label="ANALISAR" color="negative" />
              </q-item-label>
              <q-item-label caption :class="{'text-lined': i.ocorreu}">{{formatarData(i.datahora)}}</q-item-label>
              <q-item-label caption>{{i.titulo ? i.titulo : 'JOGO ABERTO'}}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="warning" color="orange" v-if="i.status === 0" />
              <q-btn icon="touch_app" color="primary" round flat dense v-else />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <div class="text-center">
        <q-btn
          color="green-7"
          text-color="white"
          label="Publicar um jogo"
          icon="add"
          size="sm"
          to="/jogo/form"
        />
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.text-lined {
  text-decoration: line-through;
}
</style>