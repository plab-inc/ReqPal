<template>
  <v-app-bar color="surface" class="px-3" flat>
    <v-app-bar-title @click="$router.push('/')"> Lernplattform </v-app-bar-title>

    <v-tabs centered color="surface">
      <v-tab variant="plain" v-for="link in links" :key="link" :to="link">
        {{ link }}
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
import { onMounted } from "vue";
import router from "@/router";

const links = ["Dashboard", "Lektionen", "Szenario", "Feedback"];
const authStore = useAuthStore();
const profileStore = useProfileStore();

onMounted(() => {
  if(authStore.session) {
    profileStore.fetchProfile(authStore.user?.id);
  }
});

const logout = () => {
  authStore.signOut();
  router.push("/")
}
</script>