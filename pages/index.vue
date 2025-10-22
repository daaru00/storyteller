<template>
  <client-only>
    <div v-if="isLoggedIn">
      {{ currentUser }}
    </div>
    <v-btn v-else @click="loginUser()">
      Login
    </v-btn>
  </client-only>
</template>

<script setup>
const { isLoggedIn, currentUser, loginUser } = useCustomAuth()
</script>
