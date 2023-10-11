<template>
  <v-app>
    <v-navigation-drawer
        location="left"
        width="250"
        expand-on-hover
        v-model:rail="rail"
        v-model="drawer"
        permanent
    >
      <v-list nav>
        <v-list-item v-if="authStore.user"
                     :title="authStore.user?.user_metadata.username"
                     :subtitle="authStore.user?.email"
                     :active="false"
                     prepend-avatar="@/assets/images/tom.jpg"
                     to="Profile"
        ></v-list-item>
        <v-list-item v-if="!authStore.user"
                     prepend-icon="mdi-login"
                     title="Login" to="Login"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item prepend-icon="mdi-home" title="Home" to="/" :active="false"></v-list-item>
        <div v-if="authStore.user">
          <v-list-item prepend-icon="mdi-school" title="Lektionen" to="Lessons"></v-list-item>
          <v-list-item prepend-icon="mdi-account" title="Profil" to="Profile"></v-list-item>
        </div>
        <v-list-item prepend-icon="mdi-email-fast" title="Feedback" to="Feedback"></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <template v-slot:append>
        <v-divider></v-divider>
        <v-list>
          <v-list-item v-if="authStore.user" prepend-icon="mdi-logout" title="Logout" @click="logout"></v-list-item>
          <v-list-item
              :prepend-icon="themeStore.currentTheme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
              :title="themeStore.currentTheme === 'light' ? 'Toggle Dark Theme' : 'Toggle Light Theme'"
              @click="themeStore.toggleUserTheme">
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <div v-for="alert in alertStore.alerts" :key="alert.id">
              <v-alert
                  closable
                  class="mb-2"
                  variant="outlined"
                  border="top"
                  density="compact"
                  :type="alert.type"
                  @click:close="alertStore.removeAlert(alert.id)"
              >
                {{ alert.message }}
              </v-alert>
              {{ removeAlertWithDelay(alert.id) }}
            </div>
            <v-sheet min-height="80vh" rounded="lg">
              <v-container>
                <router-view></router-view>
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import {useAlertStore} from "@/stores/alert.store";
import {useAuthStore} from "@/stores/auth.store.ts";
import router from "@/router/index.ts";
import {useThemeStore} from "@/stores/theme.store.ts";

const alertStore = useAlertStore();
const authStore = useAuthStore();
const themeStore = useThemeStore();

const rail = ref(true);
const drawer = ref(null);

const removeAlertWithDelay = (alertId: string, delay = 10000) => {
  setTimeout(() => {
    alertStore.removeAlert(alertId);
  }, delay);
};

const logout = () => {
  authStore.signOut();
  router.push('/')
}

</script>
