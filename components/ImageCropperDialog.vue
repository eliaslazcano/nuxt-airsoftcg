<template>
  <input ref="fileInputRef" type="file" accept="image/*" @change="abrirCropper" hidden/>
  <q-dialog v-model="cropperDialog" persistent>
    <q-card style="width: 500px; max-width: 100%">
      <q-card-section class="q-pb-none">
        <cropper
          ref="cropperRef"
          :src="imagemOrigem"
          :stencil-props="{aspectRatio: 1}"
          :stencil-component="circulo ? CircleStencil : RectangleStencil"
          :canvas="{height: props.tamanhoSaida[0], width: props.tamanhoSaida[1]}"
        />
      </q-card-section>
      <q-card-actions class="justify-center">
        <q-btn flat color="red" label="Cancelar" @click="fecharCropper" />
        <q-btn flat color="blue" label="Confirmar" @click="cropparImagem" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {converteBlobPraBase64} from '@eliaslazcano/utils'
import {Cropper, CircleStencil, RectangleStencil} from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import 'vue-advanced-cropper/dist/theme.bubble.css'

const emits = defineEmits(['cropped'])
const props = defineProps({
  tamanhoSaida: {type: Array, default: () => [256,256]},
  circulo: {type: Boolean, default: false}
})

const fileInputRef = ref()
const cropperRef = ref()
const cropperDialog = ref(false)

const imagemOrigem = ref('') //Base64
const imagemOrigemMimetype = ref(null)

const selecionarArquivo = () => fileInputRef.value.click()

const abrirCropper = async (event) => {
  if (!event) return
  const file = event.target.files[0]
  imagemOrigem.value = await converteBlobPraBase64(file)
  imagemOrigemMimetype.value = file.type
  cropperDialog.value = true
}

const fecharCropper = () => {
  fileInputRef.value.value = null
  cropperDialog.value = false
}

const cropparImagem = () => {
  const { canvas } = cropperRef.value.getResult()
  emits('cropped', canvas)
  fecharCropper()
}

defineExpose({selecionarArquivo})
</script>
