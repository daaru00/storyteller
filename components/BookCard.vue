<template>
  <v-card :to="`/books/${book.id}`" class="ma-4" outlined :width="width || 200">
    <v-img :src="book.imageUrl" aspect-ratio="9:16" height="350px">
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            color="grey-lighten-4"
            indeterminate
          ></v-progress-circular>
        </div>
      </template>
    </v-img>
    <v-card-title style="white-space: wrap;">{{ book.title[locale] }}</v-card-title>
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  book: Book,
  width?: string | number
}>()

const { locale } = useI18n()
</script>
