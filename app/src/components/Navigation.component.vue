<template>
  <v-app-bar color="surface" class="px-3" flat>

    <v-app-bar-nav-icon class="hidden-md-and-up"
                        color="primary"
                        @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <v-app-bar-title>
      <RouterLink :to="{name: 'Home'}" class="text-h5 text-decoration-none text-primary">Lernplattform</RouterLink>
    </v-app-bar-title>

    <v-tabs centered class="hidden-sm-and-down">
      <v-tab v-for="(link, index) in links" :key="index" :to="{ name: link.name}">
        {{ link.title }}
      </v-tab>
    </v-tabs>
    <v-spacer class="hidden-sm-and-down"></v-spacer>

    <v-btn color="primary" variant="plain" end rounded="false">
      Theme

      <v-menu activator="parent">
        <v-list>
            <v-list-item variant="plain" v-for="(theme, index) in themeOptions" :key="index" @click="themeStore.setUserTheme(theme.toLocaleLowerCase())">
              {{ theme }}
            </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>

    <v-btn v-if="authStore.session" variant="outlined" @click="logout()"> Logout</v-btn>
    <v-btn v-if="!authStore.session" variant="outlined" @click="$router.push('login')"> Login</v-btn>
  </v-app-bar>

  <v-navigation-drawer
      class="hidden-md-and-up"
      v-model="drawer"
      location="top"
      temporary
  >
    <v-list density="compact" nav class="text-center">
      <v-list-item v-for="(link, index) in links" :key="index" :to="{ name: link.name}">
        {{ link.title }}
      </v-list-item>
      <v-list-item v-if="authStore.session" :to="{ name: 'Profile'}">
        Profile
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { useProfileStore } from "@/stores/profile.store";
import { useThemeStore } from "@/stores/theme.store"
import { links } from "@/types/navigationLinks.types";
import router from "@/router";

const authStore = useAuthStore();
const profileStore = useProfileStore();
const themeStore = useThemeStore();

const drawer = ref<boolean>(false);
const themeOptions = ref(["Light", "Dark"]);

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