<template>
  <NuxtLayout name="empty">
    <v-row class="mt-10" align="center" justify="center">
      <v-col cols="12">
        <h1 class="text-h3 text-center text-error">{{ props.error.statusMessage || props.error.message || 'An error occurred' }}</h1>
        <v-row class="mt-10" align="center" justify="center">
          <v-btn size="x-large" color="error" @click="back">Back home</v-btn>
        </v-row>
      </v-col>
    </v-row>
  </NuxtLayout>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: () => ({})
  }
})

onMounted(() => {
  console.error('An error occurred: '+props.error.message)
})

const back = () => clearError({ redirect: '/' })
</script>
