<template>
  <v-app>
    <v-app-bar scroll-behavior="elevate" class="bg-background d-print-none">
      <v-spacer></v-spacer>
      <lang-switcher class="mr-5" />
    </v-app-bar>
    <v-main style="padding-top: 64px;">
      <slot />
    </v-main>
    <footer-toolbar />
  </v-app>
</template>
