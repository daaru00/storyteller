<template>
</template>

<script lang="ts" setup>
const { locale } = useI18n()
import { useRoute } from 'vue-router'
const route = useRoute()
const bookId = route.params.id as string

const { getReading } = useApi()
const reading = ref<Reading | null>(null)
onMounted(async () => {
  reading.value = await getReading(bookId)
})
</script>
