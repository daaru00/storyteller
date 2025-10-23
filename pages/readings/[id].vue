<template>
  <v-container max-width="800px">
    <v-row v-if="reading">
      <v-col cols="12" md="4">
        <v-img :src="reading.imageUrl" height="400px" />
      </v-col>
      <v-col cols="12" md="8">
        <p>{{ reading.text }}</p>
      </v-col>
      <v-col>
        <v-row>
          <v-col cols="12" v-for="(choice, index) in reading.choices" :key="index" class="text-center">
            <v-btn @click="selectChoice(index)" :disabled="loading">
              <span class="choice">{{ choice }}</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
definePageMeta({ name: 'reading' })

const { locale } = useI18n()
import { useRoute } from 'vue-router'
const route = useRoute()
const readingId = route.params.id as string

const { getReading } = useApi()
const reading = ref<Reading | null>(null)
onMounted(async () => {
  reading.value = await getReading(readingId)
})

const { setReadingChoice } = useApi()
const loading = ref(false)
const selectChoice = async (choiceIndex: number) => {
  loading.value = true
  try {
    reading.value = await setReadingChoice(readingId, choiceIndex, locale.value)
  } catch (error) {
    console.error('Error setting reading choice:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.choice {
  display: block;
  word-break: break-word;
  white-space: normal;
}
</style>
