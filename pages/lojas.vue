<script setup>
import {formatarTelefone} from '@eliaslazcano/utils'
import {fabWhatsapp, fabInstagram} from '@quasar/extras/fontawesome-v6'

useSeoMeta({
  title: 'Airsoft CG - Lojas e Armeiros',
  ogTitle: 'Lojas e Armeiros',
  ogDescription: 'Comerciantes de Airsoft em Campo Grande',
})

const {data} = await useApi('/lojas')
</script>

<template>
  <q-page padding>
    <div style="width: 64rem; max-width: 100%" class="q-mx-auto q-pb-lg">
      <div class="text-center q-mb-lg">
        <div class="text-h4 font-bebas">Lojas e Armeiros</div>
        <q-separator spaced style="width: 12rem" class="q-mx-auto"></q-separator>
        <div class="font-jost">comércio regional</div>
      </div>
      <div class="row q-col-gutter-lg justify-center">
        <div class="col-12 col-sm-6 col-lg-4" v-for="i in data.lojas" :key="i.id">
          <q-card flat bordered class="full-height">
            <q-card-section class="text-center">
              <img
                alt=""
                :src="`img/lojas/${i.imagem}`"
                style="height: 10rem; max-width: 10rem; width: 100%; object-fit: contain"
              />
              <div class="text-h6 q-mt-xs q-mb-none">{{i.nome}}</div>
            </q-card-section>
            <q-list padding bordered>
              <q-item-label header>Links</q-item-label>
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
              <q-item v-if="i.whatsapp" :href="`https://api.whatsapp.com/send?phone=55${i.whatsapp}`" target="_blank">
                <q-item-section avatar>
                  <q-avatar style="background: #00bd07">
                    <q-icon :name="fabWhatsapp" size="28px" color="white" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Whatsapp</q-item-label>
                  <q-item-label caption lines="1">{{formatarTelefone(i.whatsapp)}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="i.website" :href="`https://${i.website}`" target="_blank">
                <q-item-section avatar>
                  <q-avatar color="blue">
                    <q-icon name="link" color="white" size="28px"/>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Site</q-item-label>
                  <q-item-label caption lines="1">{{i.website}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="i.endereco" :href="`https://www.google.com.br/maps/search/` + encodeURIComponent(i.endereco)" target="_blank">
                <q-item-section avatar>
                  <q-avatar color="indigo">
                    <q-icon name="store" color="white" size="28px"/>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Endereço</q-item-label>
                  <q-item-label caption lines="1">{{i.endereco}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
        <div class="col-12">
          <q-banner class="bg-info" rounded>
            Conhece mais algum comércio na região?<br>Contribua conosco enviando informações para: <strong>contato@airsoftcg.com.br</strong>
          </q-banner>
        </div>
      </div>
    </div>
  </q-page>
</template>
