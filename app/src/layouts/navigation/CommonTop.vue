<template>
  <v-list nav class="pb-0 pt-2">
    <v-list-item v-if="!authStore.isPending && authStore.user"
                 :title="authStore.user?.user_metadata.username"
                 :subtitle="authStore.user?.email"
                 :active="false"
                 :prepend-avatar="profileStore.avatar ? profileStore.getAvatarURL : ''"
                 :prepend-icon="!profileStore.avatar ? 'mdi-account-circle' : ''"
                 :to="authStore.isStudent ? '/profile' : '/account'"
                 elevation="3"
                 variant="outlined"
                 rounded
    />
    <v-list-item v-if="!authStore.user"
                 prepend-icon="mdi-login"
                 title="Login" to="Login"
                 rounded
    />
    <v-divider class="mt-1 mb-1" opacity="0.5" />
    <v-list-item
      rounded prepend-icon="mdi-home"
      title="Home" to="/"
      exact
    />
    <div v-if="authStore.user && authStore.isPending">
      <v-list-item rounded prepend-icon="mdi-account-clock" title="Anfrage Status" to="/teacher-request" />
    </div>
    <v-divider v-if="authStore.user" class="my-1" opacity="0.5" />
  </v-list>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth.ts";
import { useProfileStore } from "@/stores/profile.ts";

const authStore = useAuthStore();
const profileStore = useProfileStore();
</script>
