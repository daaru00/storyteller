<template>
  <client-only>
    <reading-list v-if="isLoggedIn" />
  </client-only>
  <book-list />
</template>

<script setup>
definePageMeta({ name: 'home' })

const { isLoggedIn } = useCustomAuth()
</script>
