<script setup lang="ts">
import {supabase} from "@/plugins/supabase";
import {useAuthStore} from "@/stores/auth.store";
import {useThemeStore} from '@/stores/theme.store';
import {useTheme} from "vuetify";
import {unhandledRejectionHandler, globalErrorHandler} from "@/errors/handler.errors.ts";

const themeStore = useThemeStore();
const theme = useTheme();

themeStore.syncWithBrowserSettings();
applyTheme(themeStore.currentTheme);

window.addEventListener('unhandledrejection', unhandledRejectionHandler);
window.addEventListener('error', globalErrorHandler);

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