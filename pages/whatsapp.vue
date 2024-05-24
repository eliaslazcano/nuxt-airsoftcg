<script setup>
useSeoMeta({
  title: 'Airsoft CG - Grupos de Whatsapp', //Titulo para o browser
  description: 'Encontre grupos para jogar ou comercializar artigos de airsoft.', //Descricao para o browser
  ogTitle: 'Grupos de Whatsapp', //Titulo para whats
  ogDescription: 'Encontre grupos para jogar ou comercializar artigos de airsoft.', //Texto para whatsapp
})

const {data} = await useApi('/whatsapp-grupos')
</script>

<template>
  <q-page padding>
    <div style="width: 64rem; max-width: 100%" class="q-mx-auto q-pb-lg">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6" v-for="i in data.lista" :key="i.id">
          <q-card flat bordered>
            <q-card-section>
              <div class="row q-col-gutter-lg">
                <div class="col-3">
                  <img
                    alt=""
                    class="rounded-borders"
                    :src="`img/whatsapp/${i.imagem}`"
                    style="height: 10rem; max-width: 10rem; width: 100%; object-fit: cover"
                  >
                </div>
                <div class="col-9">
                  <div class="q-mb-xs" style="font-size: 1.1rem; font-weight: 500">{{i.titulo}}</div>
                  <div class="text-grey">{{i.legenda}}</div>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions class="justify-center">
              <q-btn flat color="positive" :href="i.link" target="_blank">
                Entrar no grupo
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>
        <div class="col-12">
          <q-banner class="bg-info" rounded>
            Conhece mais algum grupo?<br>Contribua conosco enviando informações para: <strong>contato@airsoftcg.com.br</strong>
          </q-banner>
        </div>
      </div>
    </div>
  </q-page>
</template>
