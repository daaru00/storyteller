<template>
  <div v-if="readings.length > 0" class="mx-3">
    <div class="mb-3">
      <h2 class="text-h2">{{ $t('reading.list') }}</h2>
    </div>
    <div>
      <v-sheet class="mx-auto">
        <v-slide-group selected-class="bg-success">
          <v-slide-group-item v-for="reading in readings" :key="reading.id">
            <ReadingCard :reading="reading" />
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { listReadings } = useApi()
const readings = ref<Reading[]>([])
const nextToken = ref<string | undefined>(undefined)
const loading = ref(false)

const loadReadings = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const response = await listReadings(nextToken.value)
    readings.value.push(...response.readings)
    nextToken.value = response.nextToken
    if (nextToken.value) {
      await loadReadings()
    }
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  loadReadings()
})
</script>

<style scoped>
.horizontal-scroll {
  overflow-x: auto;
  flex-wrap: nowrap;
}
</style>
