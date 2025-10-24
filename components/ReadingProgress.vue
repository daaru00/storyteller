<template>
  <v-progress-linear :model-value="progress" height="6" rounded></v-progress-linear>
</template>

<script lang="ts" setup>
defineProps<{
  progress: number,
}>()
</script>
