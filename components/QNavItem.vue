<script setup lang="ts">
defineProps(['to','icon','title'])
</script>

<template>
  <q-item clickable exact :to="to">
    <q-item-section avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{title}}</q-item-label>
    </q-item-section>
  </q-item>
</template>