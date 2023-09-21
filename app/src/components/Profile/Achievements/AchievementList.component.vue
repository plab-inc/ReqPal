<template>

    <div class="profileContainerRow">
      <h1>Achievements</h1>
      <v-btn variant="plain">View All</v-btn>
    </div>

</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.store";
import {User} from "@supabase/supabase-js";

const authStore = useAuthStore();
const user: User | null = authStore.user;

</script>
<style scoped>

.profileContainerRow {
  border: 1px solid black;
  padding: 10px 20px 10px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

</style>
