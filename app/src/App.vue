<template>

  <DndProvider :backend="HTML5Backend">
    <v-app>
      <RouterView/>
    </v-app>
  </DndProvider>

</template>

<script setup lang="ts">
import {supabase} from "@/plugins/supabase";
import {useAuthStore} from "@/stores/auth.store";
import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    useAuthStore().setSession(session);
  }
});

</script>