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

.profileContainerCol {
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profileContainerRow {
  border: 1px solid black;
  padding: 10px 20px 10px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.profileData {
  margin: 5px 0px 5px 0px;
}

</style>
