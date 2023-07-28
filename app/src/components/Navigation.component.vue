<template>
  <v-app-bar color="surface" class="px-3" flat>
    <v-app-bar-title @click="$router.push('/')"> Lernplattform </v-app-bar-title>


    <v-tabs centered color="surface">
      <v-tab variant="plain" v-for="(link, index) in links" :key="index" :to="{ name: link.name}">
        {{ link.title }}
      </v-tab>
    </v-tabs>
    <v-spacer></v-spacer>

    <div v-if="authStore.session">
      <span @click="$router.push('/profile')">{{ profileStore.username }}</span>
    </div>
    <v-btn v-if="authStore.session" variant="outlined" @click="logout()"> Logout </v-btn>
    <v-btn v-if="!authStore.session" variant="outlined" @click="$router.push('login')"> Login </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { useProfileStore } from "@/stores/profile.store";

import router from "@/router";

interface Link {
  title: string,
  name: string
}

const links: Link[] = [
  { title: "Dashboard", name: "Dashboard" },
  { title: "Lektionen", name: "AllLessons" },
  { title: "Szenario", name: "Szenario" },
  { title: "Feedback", name: "Feedback" }
];

const authStore = useAuthStore();
const profileStore = useProfileStore();

onMounted(() => {
  if(authStore.session && authStore.user) {
    profileStore.fetchProfile(authStore.user?.id);
  }
});

const logout = () => {
  authStore.signOut();
  router.push("/")
}
</script>