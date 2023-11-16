<template>
  <v-row>
    <v-col class="d-flex flex-column align-center justify-center">
      <v-avatar
          color="secondary"
          :image="profileStore.getAvatar"
          alt="profilePicture"
          size="160"></v-avatar>
    </v-col>
    <v-col class="d-flex flex-column align-center justify-center">
      <h1 class="profileData">{{ user?.user_metadata.username }}</h1>
      <h2 class="profileData">{{ user?.email }}</h2>
      <h2 class="profileData">Joined {{ joinedDate }}</h2>
    </v-col>
    <v-col class="d-flex justify-end">
      <v-btn class="profileData">Edit Profile</v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.store.ts";
import {User} from "@supabase/supabase-js";
import {useProfileStore} from "@/stores/profile.store.ts";

const authStore = useAuthStore();
const profileStore = useProfileStore();

const user: User | null = authStore.user;
const isoDateString = user?.created_at;
let joinedDate: string;

if (isoDateString) {
  const parsedDate = new Date(isoDateString);
  joinedDate = parsedDate.toLocaleString('default', {year: 'numeric', month: 'long'});
}

</script>
<style scoped>

.profileData {
  margin: 5px 0 5px 0;
}

</style>
