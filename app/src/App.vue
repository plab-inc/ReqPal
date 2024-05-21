<script setup lang="ts">
import {supabase} from "@/plugins/supabase";
import {useAuthStore} from "@/stores/auth.ts";
import {useThemeStore} from '@/stores/theme.ts';
import {useTheme} from "vuetify";
import {errorHandler} from "@/errors/handler.ts";

const themeStore = useThemeStore();
const theme = useTheme();

themeStore.syncWithBrowserSettings();
applyTheme(themeStore.currentTheme);

onMounted(() => {
  window.addEventListener('unhandledrejection', errorHandler);
})

watch(() => themeStore.currentTheme, (newTheme) => {
  applyTheme(newTheme);
});

supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    useAuthStore().setSession(session);
  }
});

function applyTheme(selectedTheme: string) {
  theme.global.name.value = selectedTheme;
}

</script>

<template>
  <RouterView/>
</template>