<template>
  <q-page>
    <div style="width: 64rem; max-width: 100%" class="q-mx-auto q-py-lg q-px-sm">
      <div class="row">
        <div class="col-12 col-sm-4 col-md-5">
          <q-img src="/img/logo-vetorizado.svg" width="100%" fit="contain" class="q-mb-md"></q-img>
        </div>
        <div class="col-12 col-sm-8 col-md-7">
          <h6 class="text-weight-bold font-jost q-my-none">Olá, somos a</h6>
          <h4 class="text-weight-bold font-bebas q-my-none">
            Comunidade airsoft de Campo Grande
          </h4>
          <p class="font-jost text-h6 q-my-md" style="line-height: 1.7rem">Nossa missão é ser um espaço comunitário para qualquer
            pessoa interessada no airsoft e contribuir para o esporte.</p>
          <p class="font-jost text-h6 q-mb-md" style="line-height: 1.7rem">Aqui você pode encontrar divulgações de jogos, equipes, grupos de WhatsApp e lojistas da região.</p>
          <p class="font-jost text-h6 q-mb-none" style="line-height: 1.7rem">Você também pode contribuir fazendo publicação de jogos neste site.</p>
        </div>
      </div>

      <q-img src="/img/capa/noturno.jpg" height="20rem" style="border-radius: 8px" class="q-mt-md">
        <div class="absolute-full text-subtitle2 flex flex-center" style="background: rgba(0, 0, 0, .6);">
          <div class="text-center">
            <h4 class="text-h4 text-weight-bold font-jost q-mt-none q-mb-sm">Ainda não conhece o esporte?</h4>
            <q-btn color="white" text-color="black" size="sm" label="Mais Informações" to="/sobre"/>
          </div>
        </div>
      </q-img>

      <q-img src="/img/capa/corvobranco.jpg" height="20rem" style="border-radius: 8px" class="q-mt-md">
        <div class="absolute-full text-subtitle2 flex flex-center" style="background: rgba(0, 0, 0, .6);">
          <div class="text-center">
            <h4 class="text-h4 text-weight-bold font-jost q-mt-none q-mb-sm">Operação Corvo Branco</h4>
            <q-btn color="white" text-color="black" size="sm" label="Sobre o evento" to="/jogo/3"/>
          </div>
        </div>
      </q-img>
    </div>
  </q-page>
</template>
