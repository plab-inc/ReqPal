<template>
  <v-list nav class="py-0">
    <v-list-item v-if="!authStore.isPending && authStore.user"
                 :title="authStore.user?.user_metadata.username"
                 :subtitle="authStore.user?.email"
                 :active="false"
                 :prepend-avatar="profileStore.avatar ? profileStore.getAvatarURL : ''"
                 :prepend-icon="!profileStore.avatar ? 'mdi-account-circle' : ''"
                 :to="authStore.isStudent ? '/profile' : '/account'"
                 elevation="3"
                 rounded
    />
    <v-list-item v-if="!authStore.user"
                 prepend-icon="mdi-login"
                 title="Login" to="Login"
                 rounded
    />
    <v-divider class="mt-2 mb-1" />
    <v-list-item
      rounded prepend-icon="mdi-home"
      title="Home" to="/"
      exact
    />
    <div v-if="authStore.user && authStore.isPending">
      <v-list-item rounded prepend-icon="mdi-account-clock" title="Anfrage Status" to="/teacher-request" />
    </div>
    <v-divider class="my-1" />
  </v-list>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth.ts";
import { useProfileStore } from "@/stores/profile.ts";

const authStore = useAuthStore();
const profileStore = useProfileStore();
</script>
