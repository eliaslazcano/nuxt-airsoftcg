<script setup>
import {fabInstagram} from '@quasar/extras/fontawesome-v6'

useSeoMeta({
  title: 'Airsoft CG - Equipes de Airsoft',
  ogTitle: 'Equipes de Airsoft',
  ogDescription: 'Equipes de Campo Grande e região',
})

const {data} = await useApi('/equipes')
</script>

<template>
  <q-page padding>
    <div style="width: 48rem; max-width: 100%" class="q-mx-auto q-pb-lg">
      <div class="text-center q-mb-lg">
        <div class="text-h4 font-bebas">Equipes de airsoft</div>
        <q-separator spaced style="width: 12rem" class="q-mx-auto"></q-separator>
        <div class="font-jost">equipes da região</div>
      </div>
      <div class="row q-col-gutter-md justify-center">
        <div class="col-12 col-sm-6 col-md-4" v-for="i in data.lista" :key="i.id">
          <q-card flat bordered class="full-height">
            <q-card-section class="text-center">
              <img
                alt=""
                :src="`img/equipes/${i.imagem}`"
                style="height: 8rem; max-width: 8rem; width: 100%; object-fit: contain" class="rounded-borders"
              >
              <div class="text-h6 q-mt-xs q-mb-none">{{i.nome}}</div>
            </q-card-section>
            <q-list padding bordered dense>
              <q-item v-if="i.instagram" :href="`https://www.instagram.com/${i.instagram}`" target="_blank">
                <q-item-section avatar>
                  <q-avatar class="bg-instagram">
                    <q-icon :name="fabInstagram" size="28px" color="white" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Instagram</q-item-label>
                  <q-item-label caption lines="1">@{{i.instagram}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
        <div class="col-12">
          <q-banner class="bg-info" rounded>
            Conhece mais alguma equipe da região?<br>Contribua conosco enviando informações para: <strong>contato@airsoftcg.com.br</strong>
          </q-banner>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>

</style>