<script setup>
import {computed} from 'vue'

const moment = useMoment()
const props = defineProps(['modelValue','rules','icon','title','subtitle'])
const emits = defineEmits(['update:modelValue'])

const iptRules = computed(() => {
  const basico = [v => !v || (v.length === 10 && moment(v, 'DD/MM/YYYY').isValid()) || 'Insira uma data válida']
  return props.rules ? [...props.rules, ...basico] : basico
})
</script>

<template>
  <q-input
    mask="##/##/####"
    placeholder="__/__/____"
    type="tel"
    :rules="iptRules"
    :modelValue="modelValue"
    @update:modelValue="x => emits('update:modelValue', x)"
  >
    <template v-slot:prepend>
      <q-icon name="calendar_month" />
    </template>
    <template v-slot:append>
      <q-btn icon="edit_calendar" color="orange-9" round dense>
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date
            mask="DD/MM/YYYY"
            :title="props.title ? props.title : null"
            :subtitle="props.subtitle ? props.subtitle : null"
            :minimal="!props.title && !props.subtitle"
            :modelValue="modelValue"
            @update:modelValue="x => emits('update:modelValue', x)"
          >
            <div class="row items-center justify-center">
              <q-btn v-close-popup label="Ok" color="primary" size="sm" />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-btn>
    </template>
  </q-input>
</template>
