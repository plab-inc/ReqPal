<script setup lang="ts">
import { supabase } from "@/plugins/supabase";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from '@/stores/theme.store';
import { useTheme } from "vuetify";
import {Ref} from "vue";

const themeStore = useThemeStore();
const theme = useTheme()

onMounted(() => {
  themeStore.syncWithBrowserSettings();
  applyTheme(themeStore.currentTheme);
});

watch(() => themeStore.currentTheme, (newTheme) => {
  applyTheme(newTheme);
});

supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    useAuthStore().setSession(session);
  }
});

function applyTheme(selectedTheme: string){
  theme.global.name.value = selectedTheme;
}

</script>

<template>

  <v-app>
    <RouterView/>
  </v-app>

</template>