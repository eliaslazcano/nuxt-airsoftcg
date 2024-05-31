<script setup>
import {validarEmail, ordenarArrayDeObjetos} from '@eliaslazcano/utils'
import {fabInstagram} from '@quasar/extras/fontawesome-v6'

definePageMeta({
  middleware: ["auth"]
})

const $q = useQuasar()
const router = useRouter()
const config = useRuntimeConfig()
const sessionStore = useSessionStore()

const usuarioId = sessionStore.payload.usuario
const {data} = await useApi(`/usuario/perfil?id=${usuarioId}&classes=1`)

const formValores = reactive({
  nome: data.value.perfil.nome,
  apelido: data.value.perfil.apelido,
  email: data.value.perfil.email,
  instagram: data.value.perfil.instagram,
  classe: data.value.perfil.classe?.id ? data.value.perfil.classe.id : null,
  funcao: data.value.perfil.funcao?.id ? data.value.perfil.funcao.id : null,
  equipe: data.value.perfil.equipe?.id ? data.value.perfil.equipe.id : null,
})
const formDisable = ref(false)
const formClassesOpcoes = [{id: null, titulo: 'NENHUMA'}, ...ordenarArrayDeObjetos(data.value.classes, 'titulo')]
const formFuncoesOpcoes = [{id: null, titulo: 'NENHUMA'}, ...ordenarArrayDeObjetos(data.value.funcoes, 'titulo')]
const formEquipesOpcoes = [{id: null, nome: 'NENHUMA'}, ...ordenarArrayDeObjetos(data.value.equipes, 'nome')]
const formSubmit = async () => {
  formDisable.value = true
  try {
    const {data} = await useApi('/usuario/perfil', {body: formValores, method: 'POST'})
    if (data.value.token) sessionStore.token = data.value.token
    if (data.value.mensagem) $q.notify({message: data.value.mensagem, type: 'positive'})
    await router.push(`/perfil/${sessionStore.payload.usuario}`)
  } finally {
    formDisable.value = false
  }
}

const getIconeClasse = id => formClassesOpcoes.find(i => i.id === id)?.icone
const getIconeFuncao = id => formFuncoesOpcoes.find(i => i.id === id)?.icone
const getIconeEquipe = id => formEquipesOpcoes.find(i => i.id === id)?.icone
</script>

<template>
  <q-page padding>
    <div class="q-mx-auto" style="width: 23rem; max-width: 100%">
      <q-form @submit.prevent="formSubmit">
        <q-card flat bordered>
          <q-card-section class="q-gutter-y-md">
            <p class="text-h5 text-center text-weight-bold">Modificar Perfil</p>
            <q-input
              label="Nome e Sobrenome"
              v-model="formValores.nome"
              :disable="formDisable"
              :rules="nomeRules"
              outlined
              dense
            />
            <q-input
              label="Apelido (Nome de guerra)"
              v-model="formValores.apelido"
              :disable="formDisable"
              hint="O apelido é opcional, mostrado no lugar do nome."
              outlined
              dense
            />
            <q-input
              label="Email"
              v-model="formValores.email"
              :disable="formDisable"
              :rules="[v => !!v && !!v.trim() || 'Insira seu email', v => !!v && validarEmail(v) || 'Coloque um email válido']"
              hint="O email serve pra login e notificações."
              type="email"
              outlined
              dense
            >
              <template #prepend>
                <q-icon name="email" color="blue-5" />
              </template>
            </q-input>
            <q-input
              label="Instagram (seu @)"
              v-model="formValores.instagram"
              :disable="formDisable"
              hint="O instagram é opcional, divulgado no seu perfil."
              prefix="@"
              stack-label
              outlined
              dense
            >
              <template #prepend>
                <q-icon :name="fabInstagram" color="pink-5" />
              </template>
            </q-input>
            <q-select
              label="Classe favorita"
              v-model="formValores.classe"
              :disable="formDisable"
              :options="formClassesOpcoes"
              option-label="titulo"
              option-value="id"
              map-options
              emit-value
              outlined
              dense
            >
              <template #prepend v-if="formValores.classe">
                <q-icon :name="`img:/img/classes/${getIconeClasse(formValores.classe)}`" />
              </template>
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon :name="`img:/img/classes/${scope.opt.icone}`" v-if="scope.opt.icone" />
                    <q-icon name="do_not_disturb" v-else />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.titulo }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              label="Especialidade favorita"
              v-model="formValores.funcao"
              :disable="formDisable"
              :options="formFuncoesOpcoes"
              option-label="titulo"
              option-value="id"
              class="q-mt-lg"
              map-options
              emit-value
              outlined
              dense
            >
              <template #prepend v-if="formValores.funcao">
                <q-icon :name="`img:/img/especialidades/${getIconeFuncao(formValores.funcao)}`" />
              </template>
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon :name="`img:/img/especialidades/${scope.opt.icone}`" v-if="scope.opt.icone" />
                    <q-icon name="do_not_disturb" v-else />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.titulo }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              label="Equipe"
              v-model="formValores.equipe"
              :disable="formDisable"
              :options="formEquipesOpcoes"
              option-label="nome"
              option-value="id"
              class="q-mt-lg"
              map-options
              emit-value
              outlined
              dense
            >
              <template #prepend v-if="formValores.equipe">
                <q-icon :name="`img:${config.public.baseURL}/storage/equipes/${getIconeEquipe(formValores.equipe)}`" />
              </template>
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon :name="`img:${config.public.baseURL}/storage/equipes/${scope.opt.icone}`" v-if="scope.opt.icone" />
                    <q-icon name="group" v-else />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.nome }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
          <q-card-actions class="justify-center">
            <q-btn color="negative" label="Cancelar" padding="xs md" @click="router.back()"/>
            <q-btn color="primary" label="Confirmar" padding="xs md" type="submit" :loading="formDisable"/>
          </q-card-actions>
        </q-card>
      </q-form>

      <q-banner
        class="bg-warning q-mt-md rounded-borders"
        v-if="formValores.equipe && formValores.equipe !== (data.perfil.equipe?.id ? data.perfil.equipe.id : null)"
      >
        Você alterou a equipe. Essa informação vai passar por análise antes de ser divulgada na sua ficha.
      </q-banner>
    </div>
  </q-page>
</template>
