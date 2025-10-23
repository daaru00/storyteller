<template>
  <v-container max-width="800px">
    <v-row v-if="book">
      <v-col cols="12" md="4">
        <v-img :src="book.imageUrl" height="400px" />
      </v-col>
      <v-col cols="12" md="8">
        <h1>{{ book.title[locale] }}</h1>
        <v-chip size="small">{{ $t(`genres.${book.genre}`) }}</v-chip>
        <p class="mt-4">{{ book.summary[locale] }}</p>
        <v-btn class="mt-4" @click="startReading()" color="primary" :loading="loading">{{ $t('book.read') }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
definePageMeta({ name: 'book' })

const { locale } = useI18n()
import { useRoute } from 'vue-router'
const route = useRoute()
const bookId = route.params.id as string

const { getBook } = useApi()
const book = ref<Book | null>(null)
onMounted(async () => {
  book.value = await getBook(bookId)
})

const { readBook } = useApi()
const loading = ref(false)
const startReading = async () => {
  loading.value = true
  try {
    const reading = await readBook(bookId, locale.value)
    navigateTo(`/readings/${reading.id}`)
  } catch (error) {
    console.error('Error starting reading:', error)
  } finally {
    loading.value = false
  }
}
</script>
