<template>
  <div v-if="books.length > 0" v-for="genre in GENRES" :key="genre.id" class="mx-3">
    <div>
      <h2>{{ genre.name }}</h2>
    </div>
    <div>
      <v-sheet class="mx-auto">
        <v-slide-group selected-class="bg-success" :show-arrows="!xs">
          <v-slide-group-item v-for="book in getBooksByGenre(genre.id)" :key="book.id">
            <BookCard :book="book" />
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify'

const { listBooks } = useApi()
const books = ref<Book[]>([])
const nextToken = ref<string | undefined>(undefined)
const loading = ref(false)
const { xs } = useDisplay()

const loadBooks = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const response = await listBooks(nextToken.value)
    books.value.push(...response.books)
    nextToken.value = response.nextToken
    if (nextToken.value) {
      await loadBooks()
    }
  } finally {
    loading.value = false
    console.log('loading', loading.value)
  }
}
onMounted(() => {
  loadBooks()
})

const { GENRES } = useBookGenres()
const getBooksByGenre = (genre: string) => {
  return books.value.filter(book => book.genre === genre)
}
</script>

<style scoped>
.horizontal-scroll {
  overflow-x: auto;
  flex-wrap: nowrap;
}
</style>
