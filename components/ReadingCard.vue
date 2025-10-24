<template>
  <v-card :to="`/readings/${reading.id}`" class="ma-4 reading-card" outlined :width="width || 200">
    <v-img :src="reading.imageUrl" aspect-ratio="9:16" height="350px" class="card-image">
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            color="grey-lighten-4"
            indeterminate
          ></v-progress-circular>
        </div>
      </template>
    </v-img>
    <v-card-title style="white-space: wrap; min-height: 4em;">{{ reading.book.title[locale] }}</v-card-title>
    <reading-progress :progress="reading.progress" />
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  reading: Reading,
  width?: string | number
}>()

const { locale } = useI18n()
</script>

<style scoped>
.reading-card {
  display: flex;
  flex-direction: column;
}
.card-image {
  flex: revert;
}
</style>
