<template>
  <v-app>
    <RouterView />
  </v-app>
</template>

<script setup lang="ts">
import { supabase } from "@/plugins/supabase";
import { useAuthStore } from "@/stores/auth.store";
import {useLessonStore} from "@/stores/lesson.store";

supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    useAuthStore().setSession(session);
    useLessonStore().init();
  }
});

</script>