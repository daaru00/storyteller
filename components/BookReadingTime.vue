<template>
  <div class="py-4">
    <v-icon left>mdi-clock-outline</v-icon>
    <span class="ml-1" v-if="counter > 0">{{ time }} {{ $t('book.readingTime') }}</span>
    <span class="ml-1" v-else>{{ $t('book.infinite') }}</span>
  </div>
</template>

<script lang="ts" setup>
const props =defineProps<{
  counter: number
}>()

const time = computed(() => {
  if (props.counter === 0) {
    return 0
  }
  const wordsPerMinute = 2
  const minutes = Math.ceil(props.counter / wordsPerMinute)
  return minutes
})
</script>
