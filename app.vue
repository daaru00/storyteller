<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const config = useAppConfig()
useHead({
  title: config.title,
  meta: [],
  bodyAttrs: {},
  script: [],
  htmlAttrs: {
    prefix: 'og: http://ogp.me/ns#'
  }
})

const { locale } = useI18n()
useSeoMeta({
  ogType: 'website',
  title: config.title,
  ogTitle: config.title,
  ogLocale: locale.value,
})
</script>

<style>
.multiline {
  white-space: pre-line;
}
a {
  color: inherit;
}
.user-select-none {
  -webkit-touch-callout: none;
    -webkit-user-select: none;
     -khtml-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
}
.grow-container {
  min-height: 60dvh;
}
.v-main {
  overflow-x: hidden;
}
.text-no-wrap {
  white-space: nowrap;
}
.v-btn--variant-flat.v-btn--icon {
  background-color: transparent !important;
}
.v-btn--variant-flat.v-btn--icon .v-btn__overlay {
  background-color: transparent !important;
}
.v-card--variant-flat {
  background-color: transparent !important;
}
.field-unit-prefix .v-text-field__suffix {
  margin-left: 0.5em;
  color: inherit;
}
footer {
  flex: initial !important;
}
</style>
