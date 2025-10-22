<template>
  <v-app>
    <v-app-bar scroll-behavior="elevate" class="bg-background">
      <client-only>
        <header-toolbar />
      </client-only>
    </v-app-bar>
    <v-main>
      <slot />
      <notification-alert />
    </v-main>
    <footer-toolbar />
  </v-app>
</template>

<script setup>
const { isLoggedIn, currentUser } = useCustomAuth()
const { locale, setLocale } = useI18n()
onMounted(() => {
  if (isLoggedIn.value && currentUser.locale && locale.value !== currentUser.locale) {
    setLocale(currentUser.locale)
  }
})
</script>
