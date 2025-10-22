<template>
  <v-snackbar
    v-model="isOpen"
    :color="lastNotification ? lastNotification.color : ''"
    rounded="md"
    timeout="6000"
  >
    {{ lastNotification ? $t(lastNotification.title) : '' }}
    <template v-slot:actions>
      <v-btn
        @click="isOpen = false"
        icon="mdi-close"
      ></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
const isOpen = ref(false)
const lastNotification = ref(null)
const { notifications } = useNotifications()
watch(notifications.value, (value) => {
  if (Array.isArray(value) && value.length > 0) {
    lastNotification.value = notifications.value[notifications.value.length - 1]
    isOpen.value = true
  } else {
    lastNotification.value = null
    isOpen.value = false
  }
})
</script>
