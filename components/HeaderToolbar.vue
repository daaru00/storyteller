<template>
  <v-btn v-if="!isHomePage" @click="navigateTo('/')" icon="mdi-arrow-left"></v-btn>
  <v-spacer></v-spacer>
  <template v-if="isLoggedIn">
    <v-avatar class="cursor-pointer" size="32">
      <v-img :src="currentUser.image"></v-img>
    </v-avatar>
  </template>
  <template v-else>
    <v-btn @click="loginUser()">
      {{ $t('header.login') }}
    </v-btn>
  </template>
  <span class="mr-4"></span>
</template>

<script setup>
const { isLoggedIn, currentUser, loginUser } = useCustomAuth()
const router = useRouter()
const isHomePage = computed(() => router.currentRoute.value.name === 'home')
</script>

<style>
header a {
  text-decoration: none;
}

@media (max-width: 550px) {
  header .header-title {
    font-size: 1rem !important;
  }
}
</style>
