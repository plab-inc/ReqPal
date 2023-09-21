<template>
  <v-row>
    <v-col order="2" order-lg="1" lg="6"
           class="d-flex flex-column align-center justify-center align-lg-start justify-lg-center">
      <h1 class="profileData">{{ user?.user_metadata.username }}</h1>
      <h2 class="profileData">{{ user?.email }}</h2>
      <h2 class="profileData">Joined {{ joinedDate }}</h2>
    </v-col>
    <v-col order="1" order-lg="2" lg="6" class="d-flex align-center justify-center align-lg-center justify-lg-end">
      <div class="d-flex flex-column align-center justify-center">
        <v-avatar class="profileData"
                  color="secondary"
                  image="@/assets/images/profile-test.jpg"
                  alt="profilePicture"
                  size="160"></v-avatar>
        <v-btn class="profileData">Edit Profile</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.store";
import {User} from "@supabase/supabase-js";

const authStore = useAuthStore();
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
