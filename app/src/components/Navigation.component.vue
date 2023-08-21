<template>
  <v-app-bar color="surface" class="px-3" flat>
    <v-app-bar-title>
      <RouterLink :to="{name: 'Home'}" class="text-h5 text-decoration-none text-primary">Lernplattform</RouterLink>
    </v-app-bar-title>
    <v-tabs centered>
      <v-tab v-for="(link, index) in links" :key="index" :to="{ name: link.name}">
        {{ link.title }}
      </v-tab>
    </v-tabs>
    <v-spacer></v-spacer>

    <div v-if="authStore.session">
      <span @click="$router.push('/profile')">{{ profileStore.username }}</span>
    </div>
    <v-btn v-if="authStore.session" variant="outlined" @click="logout()"> Logout</v-btn>
    <v-btn v-if="!authStore.session" variant="outlined" @click="$router.push('login')"> Login</v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.store";
import {useProfileStore} from "@/stores/profile.store";
import {links} from "@/types/navigationLinks.types";

import router from "@/router";

const authStore = useAuthStore();
const profileStore = useProfileStore();

onMounted(() => {
  if (authStore.session && authStore.user) {
    profileStore.fetchProfile(authStore.user?.id);
  }
});

const logout = () => {
  authStore.signOut();
  router.push('/')
}
</script>