<template>
  <v-card :to="`/books/${book.id}`" class="ma-4 book-card" outlined :width="width || 200">
    <v-img :src="book.imageUrl" aspect-ratio="9:16" height="350px" class="card-image">
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            color="grey-lighten-4"
            indeterminate
          ></v-progress-circular>
        </div>
      </template>
    </v-img>
    <v-card-text style="white-space: wrap; min-height: 4em;">{{ book.title[locale] }}</v-card-text>
    <v-card-actions>
      <book-reading-time :counter="book.counter" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  book: Book,
  width?: string | number
}>()

const { locale } = useI18n()
</script>

<style scoped>
.book-card {
  display: flex;
  flex-direction: column;
}
.card-image {
  flex: revert;
}
</style>
