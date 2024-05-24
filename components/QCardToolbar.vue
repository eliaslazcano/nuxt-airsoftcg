<script setup>
defineProps({
  title: {type: String, default: ''},
  separator: {type: Boolean, default: false}
})
</script>

<template>
  <div class="row items-center q-pr-sm">
    <div class="doc-card-title q-my-xs q-mr-sm">{{title}}</div>
    <q-space></q-space>
    <div class="header-btn row no-wrap items-center">
      <slot></slot>
    </div>
  </div>
  <q-separator v-if="separator"></q-separator>
</template>

<style>
.doc-card-title {
  margin-left: -12px;
  padding: 4px 8px 4px 28px;
  position: relative;
  border-radius: 3px 5px 5px 0;
  background: #d8e1e5;
  color: #757575;
  font-size: 18px;
  letter-spacing: .7px
}

.doc-card-title:after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 0;
  height: 0;
  border: 0 solid transparent;
  border-width: 9px 0 0 11px;
  border-top-color: #b0c2ca
}

body.body--dark .doc-card-title {
  background: #475d66;
  color: #cbcbcb;
}

body.body--dark .doc-card-title:after {
  border-top-color: #324147
}

.header-btn .q-btn {
  color: #757575;
  transition: color .6s cubic-bezier(.25,.8,.5,1)
}

.header-btn .q-btn.q-btn--round {
  font-size: 12px;
}

.header-btn .q-btn.q-btn--round .q-icon {
  font-size: 21px;
}

.header-btn .q-btn:not(.disabled):hover {
  color: #212121
}

.header-btn  .q-btn .q-focus-helper,.header-btn .q-btn .q-focus-helper:before,.header-btn .q-btn .q-focus-helper:after {
  transition: background-color .6s cubic-bezier(.25,.8,.5,1),opacity .6s cubic-bezier(.25,.8,.5,1)
}

body.body--dark .header-btn .q-btn {
  color: #929397
}

body.body--dark .header-btn .q-btn:not(.disabled):hover {
  color: #fff
}
</style>
