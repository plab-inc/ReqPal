<template>
  <div class="profileContainerRow">

  </div>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.store";
import {User} from "@supabase/supabase-js";

const authStore = useAuthStore();
const user: User | null = authStore.user;

</script>
<style scoped>
</style>
