<script setup lang="ts">
import { fabWhatsapp } from '@quasar/extras/fontawesome-v6'

useHead({
  title: 'Airsoft CG',
  meta: [
    { name: 'description', content: 'Comunidade Airsoft de Campo Grande.' },
    { property: 'og:title', content: 'Comunidade Airsoft CG' },
    { property: 'og:description', content: 'Descubra ou publique jogos de Airsoft, encontre lojas locais e grupos de WhatsApp.' },
    { property: 'og:image', content: 'https://airsoftcg.com.br/img/logo.webp' },
  ],
  link: [
    {rel: 'icon', type: 'image/webp', sizes: '300x300', href: '/img/logo.webp'},
    {rel: 'icon', type: 'image/png', sizes: '128x128', href: '/icons/favicon-128x128.png'},
    {rel: 'icon', type: 'image/png', sizes: '96x96', href: '/icons/favicon-96x96.png'},
    {rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icons/favicon-32x32.png'},
    {rel: 'icon', type: 'image/png', sizes: '16x16', href: '/icons/favicon-16x16.png'},
    {rel: 'icon', type: 'image/ico', href: '/favicon.ico'},
  ]
})

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const session = useSessionStore()
const runtimeConfig = useRuntimeConfig()

const modoMobile = computed(() => $q.screen.lt.md)
const menuAberto = ref(false)
const nomeDeExibicao = computed(() => {
  if (!session.isAuthenticated) return ''
  return session.payload.apelido ? session.payload.apelido : session.payload.nome
})
</script>

<template>
  <NuxtLoadingIndicator />
  <transition appear mode="out-in">
    <div id="q-app">
      <q-layout view="lHh LpR fFf" :style="{ backgroundColor: !$q.dark.isActive ? '#fafafa' : null }">
        <q-header :bordered="$q.dark.isActive" :elevated="!$q.dark.isActive" :class="{'bg-dark': $q.dark.isActive}">
          <q-toolbar>
            <q-btn
              v-if="modoMobile"
              icon="menu"
              aria-label="Menu"
              label="Menu"
              padding="xs md"
              @click="menuAberto = !menuAberto"
              outline
            />
            <nuxt-link v-else class="flex no-wrap items-center text-white" to="/">
              <q-avatar>
                <img src="/img/logo-vetorizado.svg" alt="">
              </q-avatar>
              <q-toolbar-title class="text-h6">{{runtimeConfig.public.headerTitle}}</q-toolbar-title>
            </nuxt-link>
            <q-space></q-space>
            <q-btn
              v-if="session.isAuthenticated && route.name !== 'home'"
              icon="arrow_back"
              class="q-mr-xs"
              @click="router.back()"
              flat
              round
              dense
            >
              <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">VOLTAR</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="more_vert">
              <q-menu anchor="bottom end" self="top right" auto-close>
                <q-list>
                  <q-item clickable exact :to="`/perfil/${session.payload.usuario}`" v-if="session.isAuthenticated">
                    <q-item-section avatar>
                      <q-icon name="face_retouching_natural" />
                    </q-item-section>
                    <q-item-section>Meu perfil</q-item-section>
                  </q-item>
                  <q-item clickable @click="$q.dark.toggle()">
                    <q-item-section avatar>
                      <q-icon :name="$q.dark.isActive ? 'wb_incandescent' : 'dark_mode'" />
                    </q-item-section>
                    <q-item-section>Tema {{ $q.dark.isActive ? 'claro' : 'escuro' }}</q-item-section>
                  </q-item>
                  <q-item clickable exact to="/auth/trocar-senha" v-if="session.isAuthenticated">
                    <q-item-section avatar>
                      <q-icon name="lock_reset" />
                    </q-item-section>
                    <q-item-section>Trocar senha</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable @click="session.logout()" v-if="session.isAuthenticated">
                    <q-item-section avatar>
                      <q-icon name="logout" color="negative" />
                    </q-item-section>
                    <q-item-section>Desconectar</q-item-section>
                  </q-item>
                  <q-item clickable to="/login" v-else>
                    <q-item-section avatar>
                      <q-icon name="login" />
                    </q-item-section>
                    <q-item-section>Login / Registro</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-toolbar>
        </q-header>

        <q-drawer v-model="menuAberto" show-if-above bordered>
          <q-list>
            <!-- Perfil do usuário -->
            <q-item
              v-if="session.isAuthenticated"
              :to="`/perfil/${session.payload.usuario}`"
              style="padding-top: 5px; padding-bottom: 5px"
              exact
            >
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  <img
                    v-if="session.payload.foto"
                    :src="`${runtimeConfig.public.baseURL}/usuario/avatar?id=${session.payload.usuario}&thumb=40&sessao=${session.payload.sessao}`"
                    alt=""
                  >
                  <q-icon v-else name="person" size="1.5em" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1">{{nomeDeExibicao}}</q-item-label>
                <q-item-label caption lines="1">Membro</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-else to="/login" exact style="padding-top: 5px; padding-bottom: 5px">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  <q-icon name="person" size="28px" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1">Visitante Anônimo</q-item-label>
                <q-item-label caption lines="1">Clique para entrar</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <!-- Rotas de navegação -->
            <q-item-label header>Conteúdo principal</q-item-label>
            <q-nav-item to="/" icon="home" title="Início"/>
            <q-nav-item to="/jogos" icon="flag" title="Jogos publicados"/>
            <q-nav-item to="/jogo/form" icon="add_circle" title="Criar jogo"/>
            <q-nav-item to="/membros" icon="group" title="Membros"/>
            <q-separator spaced inset />
            <q-item-label header>Informações Extras</q-item-label>
            <q-nav-item to="/equipes" icon="diversity_3" title="Equipes de Airsoft"/>
            <q-nav-item to="/whatsapp" :icon="fabWhatsapp" title="Grupos de Whatsapp"/>
            <q-nav-item to="/lojas" icon="storefront" title="Lojas e Armeiros"/>
            <q-nav-item to="/sobre" icon="info" title="Sobre o Airsoft"/>
          </q-list>

          <div class="text-center q-pa-sm">
            <q-btn
              v-if="session.isAuthenticated"
              rounded
              size="sm"
              icon="logout"
              label="Desconectar"
              color="negative"
              padding="xs md"
              @click="session.logout()"
            />
            <q-btn
              v-else
              rounded
              size="sm"
              label="Login / Registre-se"
              to="/login"
              :color="$q.dark.isActive ? 'white' : 'primary'"
              :text-color="$q.dark.isActive ? 'black' : 'white'"
              padding="xs md"
            />
          </div>
        </q-drawer>

        <q-page-container>
          <NuxtPage />
        </q-page-container>

        <q-footer
          bordered
          :class="{'bg-dark': $q.dark.isActive, 'bg-grey-3': !$q.dark.isActive}"
          v-if="$q.screen.lt.sm"
        >
          <q-tabs
            dense
            no-caps
            active-color="primary"
            indicator-color="transparent"
            :class="{'text-grey-4': $q.dark.isActive, 'text-grey-8': !$q.dark.isActive}"
          >
            <q-route-tab
              icon="flag"
              to="/jogos"
              label="Jogos"
              exact
            />
            <q-route-tab
              icon="group"
              to="/membros"
              label="Membros"
              exact
            />
            <q-route-tab
              icon="face_retouching_natural"
              :to="session.isAuthenticated ? `/perfil/${session.payload.usuario}` : '/login'"
              label="Perfil"
              exact
            />
          </q-tabs>
        </q-footer>
        <q-footer
          bordered
          class="q-px-xs"
          :class="{'bg-dark': $q.dark.isActive}"
          v-else
        >
          <div class="flex justify-center text-caption">
            <span>&copy; {{runtimeConfig.public.footerTitle}}</span>
          </div>
        </q-footer>

        <q-page-sticky position="bottom-right" :offset="[12, 12]">
          <q-btn push fab-mini icon="lightbulb" color="primary" @click="$q.dark.toggle" />
        </q-page-sticky>
      </q-layout>
    </div>
  </transition>
</template>
