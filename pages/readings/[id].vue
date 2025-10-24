<template>
  <v-container max-width="800px">
    <v-row v-if="reading">
      <v-col cols="12" md="4">
        <v-img :src="reading.imageUrl" cover height="100%" />
      </v-col>
      <v-col cols="12" md="8">
        <p class="text-justify">{{ reading.text }}</p>
        <div class="text-right">
          <v-btn v-if="canSpeech && !isSpeaking" @click="startSpeech" icon="mdi-volume-high" size="x-small"></v-btn>
          <v-btn v-if="canSpeech && isSpeaking" @click="cancelSpeech" color="red-darken-1" icon="mdi-stop" size="x-small"></v-btn>
        </div>
      </v-col>
      <v-col>
        <v-row v-if="loading">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12">
            <v-list lines="two">
              <v-list-item v-for="(choice, index) in reading.choices" :key="index" @click="selectChoice(index)">
                <template v-slot:prepend>
                  <v-avatar><v-chip>{{ index + 1 }}</v-chip></v-avatar>
                </template>
                <span class="font-weight-regular text-high-emphasis">{{ choice }}</span>
              </v-list-item>
            </v-list>
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

const canSpeech = ref<boolean>(window.speechSynthesis !== undefined)
const isSpeaking = ref<boolean>(false)
const startSpeech = () => {
  if (!reading.value) return;

  cancelSpeech();
  const utterance = new SpeechSynthesisUtterance(reading.value.text);
  utterance.lang = locale.value;
  window.speechSynthesis.speak(utterance);
  isSpeaking.value = true;
}

const cancelSpeech = () => {
  window.speechSynthesis.cancel();
  isSpeaking.value = false;
}
</script>

<style scoped>
.choice {
  display: block;
  word-break: break-word;
  white-space: normal;
}
</style>
