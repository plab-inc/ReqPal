<template>
  <v-list nav class="py-0">
    <v-divider class="mb-1" opacity="0.5" />
    <div v-if="authStore.user">
      <v-list-item rounded prepend-icon="mdi-cog" title="Account Einstellungen" to="/account" />
      <v-list-item rounded prepend-icon="mdi-email-fast" title="Feedback" to="/feedback" />
      <v-list-item rounded prepend-icon="mdi-logout" title="Logout" @click="logout" />
      <v-divider class="my-1" />
    </div>
    <v-list-item
      rounded
      :prepend-icon="themeStore.currentTheme === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny'"
      :title="themeStore.currentTheme === 'light' ? 'Dunkles Thema' : 'Helles Thema'"
      @click="themeStore.toggleUserTheme"
    />
    <v-list-item rounded prepend-icon="mdi-scale-balance" title="Rechtliche Hinweise" to="/legal" />
  </v-list>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth.ts";
import { useThemeStore } from "@/stores/theme.ts";
import router from "@/router/index.ts";

const authStore = useAuthStore();
const themeStore = useThemeStore();

const logout = () => {
  authStore.signOut();
  router.push("/");
};
</script>
