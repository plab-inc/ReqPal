<template>

  <v-app>
    <RouterView/>
  </v-app>

</template>

<script setup lang="ts">
import {supabase} from "@/plugins/supabase";
import {useAuthStore} from "@/stores/auth.store";

supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    useAuthStore().setSession(session);
  }
});

</script>