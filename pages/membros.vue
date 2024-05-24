<script setup>
import {removerAcentos, removerEspacosRepetidos} from '@eliaslazcano/utils'

const {data: pageData} = await useApi('/usuario/listagem')
const sessionStore = useSessionStore()
const config = useRuntimeConfig()

const iconSize = '.8rem'

const tbFilter = ref('')
const tbRows = computed(() => {
  if (!pageData.value?.usuarios) return []
  return pageData.value.usuarios.map(i => {
    const classesLista = pageData.value.classes ? pageData.value.classes : []
    const funcoesLista = pageData.value.funcoes ? pageData.value.funcoes : []
    const classe = classesLista.find(x => x.id === i.classe)
    const funcao = funcoesLista.find(x => x.id === i.funcao)
    return {id: i.id, nome: i.nome.toUpperCase(), foto: i.foto, classe, funcao}
  })
})
const tbRowsFiltered = computed(() => {
  const items = tbRows.value
  if (tbFilter.value.trim() !== '') {
    const strFiltro = removerEspacosRepetidos(removerAcentos(tbFilter.value.trim().toUpperCase()))
    return items.filter(i => removerEspacosRepetidos(removerAcentos(i.nome)).includes(strFiltro))
  }
  return items
})
</script>

<template>
  <q-page padding>
    <div class="q-mx-auto q-pb-lg" style="width: 32rem; max-width: 100%" v-if="pageData">
      <div class="full-width q-mb-sm">
        <div class="text-h6 text-center q-mb-xs">Membros</div>
      </div>

      <q-card flat bordered class="q-mb-md" v-if="!sessionStore.isAuthenticated">
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
            size="sm"
            padding="xs lg"
            to="/criar-conta"
          />
        </q-card-actions>
      </q-card>

      <div class="flex column items-center justify-center q-mb-md">
        <q-banner class="bg-info q-py-none" dense rounded style="min-height: 24px">
          <div>
            <q-icon name="pan_tool_alt" size="1rem"/> Clique em alguém para ver o perfil
          </div>
        </q-banner>
      </div>

      <q-card flat class="q-mb-md">
        <q-input label="Pesquisar" v-model="tbFilter" outlined dense>
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card>

      <q-card flat bordered class="q-mb-md">
        <q-list separator>
          <q-item v-for="i in tbRowsFiltered" :key="i.id" :to="`/perfil/${i.id}`" clickable>
            <q-item-section avatar>
              <q-avatar :color="i.foto ? null : 'primary'">
                <q-img :src="config.public.baseURL + `/usuario/avatar?id=${i.id}&thumb=40`" alt="" spinner-size="1rem" v-if="i.foto" />
                <q-icon name="person" color="white" v-else />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{i.nome}}</q-item-label>
              <q-item-label v-if="i.classe">
                <div class="q-gutter-x-xs">
                  <q-badge color="primary" v-if="i.classe" rounded>
                    <q-icon
                      :name="`img:img/classes/${i.classe.icone}`"
                      :size="iconSize"
                      class="q-mr-xs"
                    /> {{i.classe.titulo}}
                  </q-badge>
                  <q-badge color="secondary" v-if="i.funcao" rounded>
                    <q-icon
                      :name="`img:img/especialidades/${i.funcao.icone}`"
                      :size="iconSize"
                      class="q-mr-xs"
                    /> {{i.funcao.titulo}}
                  </q-badge>
                </div>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn icon="touch_app" color="primary" round flat dense></q-btn>
            </q-item-section>
          </q-item>
          <q-item v-if="tbRowsFiltered.length === 0 && tbRows.length > 0">
            <q-item-section avatar>
              <q-icon name="error_outline" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Nenhum resultado correspondente</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-else-if="tbRows.length === 0">
            <q-item-section avatar>
              <q-icon name="error_outline" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Nenhum membro no momento</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <p class="q-mb-none text-grey text-center jost-font-family" style="font-size: 1rem">{{ tbRows.length }} membros no total</p>
    </div>
  </q-page>
</template>