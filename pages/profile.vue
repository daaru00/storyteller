<template>
  <v-container max-width="800px">
    <v-row align="center" justify="center" class="my-8" v-if="profile">
      <v-col cols="12">
        <h2 class="text-h4">{{ $t('profile.readingTime', { time: readingTime }) }}</h2>
        <v-progress-linear :model-value="profile?.counter" :max="levels[currentLevel]" height="20" color="blue">
          <div class="text-center white--text font-weight-bold">
            {{ $t('profile.level', { level: currentLevel }) }}
          </div>
        </v-progress-linear>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn color="red" @click="logout()">{{ $t('profile.logout') }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
definePageMeta({ name: 'profile' })

const { getProfile } = useApi()
const profile = ref<Profile | null>(null)
onMounted(async () => {
  profile.value = await getProfile()
})

const { logOutCurrentUser } = useCustomAuth()
function logout() {
  logOutCurrentUser()
  navigateTo('/')
}

const levels = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500]
const currentLevel = computed(() => {
  if (!profile.value) {
    return 1
  }
  for (let i = levels.length - 1; i >= 0; i--) {
    if (profile.value.counter >= levels[i]) {
      return i + 1
    }
  }
  return 1
})

const readingTime = computed(() => {
  if (!profile.value || profile.value.counter === 0) {
    return 0
  }
  const wordsPerMinute = 2
  const minutes = Math.ceil(profile.value.counter / wordsPerMinute)
  return minutes
})
</script>
