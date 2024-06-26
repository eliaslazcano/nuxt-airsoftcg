<script setup>
definePageMeta({
  middleware: ["auth"],
  validate: route => !route.params.id || typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
})

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const moment = useMoment()
const config = useRuntimeConfig()
const sessionStore = useSessionStore()

const jogoId = route.params.id ? Number(route.params.id) : null
const exibirIntroducao = ref(!jogoId)

const formOrganizadorTipoOpt = [
  {value: 2, label: 'O jogo é organizado por um time.'},
  {value: 1, label: 'O jogo é organizado por uma pessoa.'},
  {value: 0, label: 'Não sei.'},
]
const formOrganizadorTipoVlr = ref(null)
const formOrganizadorEquipeOpt = ref([])
const formOrganizadorEquipeVlr = ref(null)
const formOrganizadorNomeRules = [v => !!v || 'Informe o organizador do jogo']
const formOrganizadorNomeVlr = ref('')

const formCampoNomeVlr = ref('')
const formCampoLinkVlr = ref('')

const formEventoTituloVlr = ref('')
const formEventoDataVlr = ref('')
const formEventoHoraRules = [
  v => !!v || 'Coloque a hora do Briefing!',
  v => /^([0-1]?\d|2[0-3]):[0-5]\d$/.test(v) || 'Coloque um horário válido'
]
const formEventoHoraVlr = ref('')

const formEventoDescricao = ref('')
const formEventoIconeAtual = ref(null) //String URL, mostra a imagem autualmente cadastrada no servidor.
const formEventoIconeNovo = ref(null) //Base64, ao subimitar o form, essa imagem é enviada.
const formEventoIconeEncodar = canvas => {
  const dialog = $q.dialog({ message: 'Montando', progress: true, persistent: true, ok: false })
  try {
    formEventoIconeNovo.value = canvas.toDataURL('image/webp', 1)
  } catch (e) {
    $q.notify({type: 'negative', message: 'Seu dispositivo não tem compatibilidade com o conversor de imagem.'})
  } finally {
    setTimeout(() => dialog.hide(), 1000)
  }
}

const equipeDesconhecida = {id: 0, nome: 'NENHUM DA LISTA'}
const fetchData = async () => {
  if (jogoId) {
    const {data} = await useApi(`/jogos?id=${jogoId}`)
    if (data.value.jogo.autor.id !== sessionStore.payload.usuario) {
      throw createError({statusCode: 403, statusMessage: 'Forbidden'})
    }

    formOrganizadorTipoVlr.value = data.value.jogo.organizador.tipo ? data.value.jogo.organizador.tipo : null
    formOrganizadorEquipeOpt.value = [equipeDesconhecida, ...data.value.equipes]
    formOrganizadorEquipeVlr.value = data.value.jogo.organizador.equipe ? formOrganizadorEquipeOpt.value.find(i => i.id === data.value.jogo.organizador.equipe) : null
    formOrganizadorNomeVlr.value = data.value.jogo.organizador.nome ? data.value.jogo.organizador.nome : ''
    if (formOrganizadorTipoVlr.value === 2 && !formOrganizadorEquipeVlr.value) formOrganizadorEquipeVlr.value = equipeDesconhecida

    formEventoTituloVlr.value = data.value.jogo.titulo ? data.value.jogo.titulo : ''
    formEventoDataVlr.value = data.value.jogo.datahora ? moment(data.value.jogo.datahora).format('DD/MM/YYYY') : ''
    formEventoHoraVlr.value = data.value.jogo.datahora ? moment(data.value.jogo.datahora).format('HH:mm') : ''

    formCampoNomeVlr.value = data.value.jogo.local.nome ? data.value.jogo.local.nome : ''
    formCampoLinkVlr.value = data.value.jogo.local.link ? data.value.jogo.local.link : ''
    formEventoDescricao.value = data.value.jogo.texto ? data.value.jogo.texto : ''
    formEventoIconeAtual.value = data.value.jogo.icone ? data.value.jogo.icone : null
  } else {
    const {data} = await useApi(`/equipes`, {method: 'POST'})
    formOrganizadorEquipeOpt.value = [equipeDesconhecida, ...data.value.lista]
    if (data.value.moderador) exibirIntroducao.value = false
  }
}
await fetchData()

const formInvalid = () => $q.notify({type: 'negative', message: 'Falta uma das informações obrigatórias!'})
const formSubmit = async () => {
  if (formOrganizadorTipoVlr.value === null) return $q.notify({type: 'negative', message: 'O item 1 não foi respondido!'})
  const dialog = $q.dialog({ progress: true, persistent: true, ok: false })
  try {
    const body = {
      id: jogoId,
      datahora: moment(`${formEventoDataVlr.value} ${formEventoHoraVlr.value}:00`, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      titulo: formEventoTituloVlr.value ? formEventoTituloVlr.value.trim().toUpperCase() : formEventoTituloVlr.value,
      organizadorTipo: formOrganizadorTipoVlr.value,
      organizadorNome: formOrganizadorNomeVlr.value ? formOrganizadorNomeVlr.value.trim().toUpperCase() : null,
      organizadorEquipe: formOrganizadorEquipeVlr.value ? formOrganizadorEquipeVlr.value.id : null,
      localNome: formCampoNomeVlr.value ? formCampoNomeVlr.value.trim().toUpperCase() : null,
      localLink: formCampoLinkVlr.value ? formCampoLinkVlr.value.trim() : null,
      texto: formEventoDescricao.value ? formEventoDescricao.value.trim() : null,
      icone: formEventoIconeNovo.value ? formEventoIconeNovo.value : null,
    }
    const method = jogoId ? 'PUT' : 'POST'
    const {data, error} = await useApi('/jogos', {method, body})
    if (error.value) return
    if (data.value.mensagem) $q.notify({type: 'positive', message: data.value.mensagem})
    if (data.value.id) return router.push(`/jogo/${data.value.id}`)
  } finally {
    dialog.hide()
  }
}

const editorConfig = [
  ['left', 'center', 'right', 'justify'],
  ['bold','italic','underline','link'],
  [
    'unordered',
    'outdent',
    'indent',
    {
      label: 'Tamanho',
      icon: $q.iconSet.editor.fontSize,
      fixedLabel: true,
      fixedIcon: true,
      list: 'no-icons',
      options: [
        'size-1',
        'size-2',
        'size-3',
        'size-4',
        'size-5',
        'size-6',
      ]
    },
  ]
]
</script>

<template>
  <q-page padding>
    <div class="q-mx-auto q-pb-xl" style="width: 56em; max-width: 100%">
      <q-card bordered flat v-if="exibirIntroducao">
        <q-card-toolbar title="Como vai funcionar"/>
        <q-card-section>
          <p>Um questionário será apresentado a seguir. É obrigatório fornecer a data, hora e local do Briefing do jogo.
            As demais informações são opcionais.</p>
          <p><span class="text-negative">Para evitar fraudes</span>, o seu jogo só será publicado após a aprovação de um <strong>moderador</strong>. Se nenhum moderador analisar sua publicação em <strong>até 6 horas</strong>, ela será aprovada automaticamente.</p>
          <q-banner class="bg-info" rounded dense>
            <q-icon name="info" class="q-mr-xs" /> Você se torna um moderador após publicar 3 jogos e ter 1 mês de cadastro como membro.
          </q-banner>
          <p class="q-mt-md q-mb-none">Vamos para as informações do jogo!</p>
        </q-card-section>
        <q-card-actions>
          <q-btn
            color="primary"
            padding="xs md"
            label="CANCELAR"
            outline
            @click="router.push('/jogos'); $q.notify({type: 'negative', message: 'Publicação cancelada.'})"
          />
          <q-space></q-space>
          <q-btn color="primary" padding="xs md" label="PROSSEGUIR" @click="exibirIntroducao = false" />
        </q-card-actions>
      </q-card>
      <q-form @submit.prevent="formSubmit" @validation-error="formInvalid" greedy v-else>
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <p
              class="q-mb-none text-center font-jost"
              style="font-size: 1.2rem"
            >{{jogoId ? 'EDITAR JOGO' : 'PUBLICAR JOGO'}}</p>
          </div>
          <div class="col-12">
            <q-card flat bordered>
              <q-card-section>
                <p class="text-weight-bold">1.Quem está organizando o jogo?</p>
                <p class="text-caption">Se você não souber, ou não quiser revelar, selecione "não sei".</p>
                <q-option-group
                  v-model="formOrganizadorTipoVlr"
                  :options="formOrganizadorTipoOpt"
                  class="q-mb-md"
                />
                <div v-if="formOrganizadorTipoVlr === 1">
                  <q-separator class="q-mb-md"></q-separator>
                  <p>Informe abaixo o nome da pessoa que está organizando o jogo:</p>
                  <q-input
                    label="Nome do organizador:"
                    v-model="formOrganizadorNomeVlr"
                    :rules="formOrganizadorNomeRules"
                    placeholder="Digite aqui"
                    stack-label
                    outlined
                  />
                </div>
                <div v-else-if="formOrganizadorTipoVlr === 2">
                  <q-separator class="q-mb-md"></q-separator>
                  <p>Informe abaixo qual time está organizando o jogo:</p>
                  <q-select
                    label="Time:"
                    v-model="formOrganizadorEquipeVlr"
                    :options="formOrganizadorEquipeOpt"
                    :rules="formOrganizadorNomeRules"
                    option-label="nome"
                    option-value="id"
                    placeholder="Digite aqui"
                    stack-label
                    outlined
                  >
                    <template v-slot:prepend v-if="formOrganizadorEquipeVlr">
                      <q-icon name="do_not_disturb" v-if="!formOrganizadorEquipeVlr.imagem" />
                      <q-icon :name="`img:${config.public.baseURL}/storage/equipes/${formOrganizadorEquipeVlr.imagem}`" v-else />
                    </template>
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section avatar>
                          <q-icon :name="`img:${config.public.baseURL}/storage/equipes/${scope.opt.imagem}`" v-if="scope.opt.imagem" />
                          <q-icon name="do_not_disturb" v-else />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ scope.opt.nome }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                  <q-input
                    v-if="formOrganizadorEquipeVlr?.id === 0"
                    label="Qual o nome do time?"
                    v-model="formOrganizadorNomeVlr"
                    :rules="formOrganizadorNomeRules"
                    placeholder="Digite aqui"
                    stack-label
                    outlined
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12">
            <q-card flat bordered>
              <q-card-section>
                <p class="text-weight-bold">2.Local do evento</p>
                <q-input
                  label="Nome do campo:"
                  v-model="formCampoNomeVlr"
                  class="q-mb-lg"
                  placeholder="Opcional"
                  stack-label
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="location_city" />
                  </template>
                </q-input>
                <q-input
                  label="Link do local no Google Maps:"
                  v-model="formCampoLinkVlr"
                  placeholder="Opcional"
                  stack-label
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="link" />
                  </template>
                </q-input>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12">
            <q-card flat bordered>
              <q-card-section>
                <p class="text-weight-bold">3.Informações básicas</p>
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <q-input
                      label="Nome do evento:"
                      v-model="formEventoTituloVlr"
                      class="q-mb-md"
                      placeholder="Opcional"
                      stack-label
                      outlined
                    >
                      <template v-slot:prepend>
                        <q-icon name="campaign" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12">
                    <q-date-picker
                      label="Data do evento"
                      v-model="formEventoDataVlr"
                      :rules="[v => !!v || 'Coloque a data do evento!']"
                      stack-label
                      outlined
                    />
                  </div>
                  <div class="col-12">
                    <q-input
                      label="Hora do Briefing"
                      v-model="formEventoHoraVlr"
                      :rules="formEventoHoraRules"
                      mask="time"
                      placeholder="__:__"
                      type="tel"
                      stack-label
                      outlined
                    >
                      <template v-slot:prepend>
                        <q-icon name="access_time" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12">
            <q-card flat bordered>
              <q-card-section>
                <p class="text-weight-bold q-mb-none">4.Descrição e regras do evento</p>
                <p class="text-caption">Opcional, você pode deixar vazio.</p>
                <q-editor
                  v-model="formEventoDescricao"
                  min-height="14rem"
                  :toolbar="editorConfig"
                />
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12">
            <q-card flat bordered>
              <q-card-section>
                <p class="text-weight-bold q-mb-none">5.Mídia de divulgação</p>
                <p class="text-caption">Opcional, você pode deixar sem, mas é especialmente útil quando você compartilha o link do evento.</p>
                <q-list padding>
                  <q-item @click="$refs.cropperRefIcone.selecionarArquivo()" clickable>
                    <q-item-section avatar>
                      <q-avatar :color="formEventoIconeNovo || formEventoIconeAtual ? null : 'grey'" rounded>
                        <img
                          v-if="formEventoIconeNovo"
                          :src="formEventoIconeNovo"
                          alt=""
                        />
                        <img
                          v-else-if="formEventoIconeAtual"
                          :src="`${config.public.baseURL}/storage/jogo/${formEventoIconeAtual}`"
                          alt=""
                        />
                        <q-icon name="hide_image" color="white" v-else />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Imagem de ícone para whatsapp</q-item-label>
                      <q-item-label caption v-if="formEventoIconeAtual">Clique para trocar o ícone</q-item-label>
                      <q-item-label caption v-else>Clique para inserir um ícone</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12">
            <q-card-actions class="justify-center q-pt-none">
              <q-btn color="primary" padding="xs lg" label="Cancelar" outline @click="router.back()" />
              <q-btn color="primary" padding="xs lg" label="Salvar" type="submit" />
            </q-card-actions>
          </div>
        </div>
      </q-form>
    </div>

    <ImageCropperDialog
      ref="cropperRefIcone"
      :tamanho-saida="[300,300]"
      @cropped="canvas => formEventoIconeEncodar(canvas)"
    />
  </q-page>
</template>
