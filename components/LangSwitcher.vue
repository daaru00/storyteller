<template>
  <span class="select-container">
    <v-select v-model="selected" :items="available" :clearable="false" variant="underlined" density="compact"/>
  </span>
</template>

<script setup>
const { locale, locales, setLocale } = useI18n()
const available = computed(() => locales.value.map(locale => ({
  title: locale.name,
  value: locale.code
})))
const selected = computed({
  get() {
    return locale.value
  },
  set(code) {
    if (locale.value !== code) {
      setLocale(code)
    }
  }
})
</script>

<style scoped>
.select-container {
  width: auto;
  margin-top: 0.65em;
  margin-right: 0.75em;
}
</style>
