<template>
  <div class="py-4">
    <v-icon left>mdi-clock-outline</v-icon>
    {{ time }} {{ $t('book.readingTime') }}
  </div>
</template>

<script lang="ts" setup>
const props =defineProps<{
  counter: number
}>()

const time = computed(() => {
  const wordsPerMinute = 2
  const minutes = Math.ceil(props.counter / wordsPerMinute)
  return minutes
})
</script>
