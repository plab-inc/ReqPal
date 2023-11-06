<template>
  <v-app>
    <v-progress-linear style="position: fixed; z-index: 999;"
                       indeterminate
                       color="warning"
                       :active="utilStore.showLoadingBar"

    ></v-progress-linear>
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
                     :prepend-avatar="profileStore.getAvatar"
                     to="/profile"
        ></v-list-item>
        <v-list-item v-if="!authStore.user"
                     prepend-icon="mdi-login"
                     title="Login" to="Login"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item prepend-icon="mdi-home" title="Home" to="/" exact></v-list-item>
        <div v-if="authStore.user">
          <v-list-item v-if="true" prepend-icon="mdi-school" title="Erstellte Lektionen" to="/lessons"></v-list-item>
          <v-list-group value="Lektionen" v-if="true">
            <template v-slot:activator="{ props }">
              <v-list-item
                  v-bind="props"
                  prepend-icon="mdi-school"
                  title="Lernen"
              ></v-list-item>
            </template>
            <v-list-item to="/lessons" title="Lektionen" subtitle="Noch 2 offen">
              <template v-slot:append>
                <v-progress-circular class="ma-1" size="27" model-value="20"></v-progress-circular>
              </template>
            </v-list-item>
            <v-list-item title="Meine Punkte" subtitle="250">
              <template v-slot:append>
                <v-icon class="pr-1" size="30" color="warning">
                  mdi-star-four-points-circle-outline
                </v-icon>
              </template>
            </v-list-item>
          </v-list-group>
        </div>
        <div v-if="authStore.user && authStore.isTeacher">
          <v-divider></v-divider>
          <v-list-item prepend-icon="mdi-text-box-multiple" title="Meine Kataloge" to="/catalogs"></v-list-item>
          <v-list-item prepend-icon="mdi-upload" title="Neuen Katalog Hochladen" to="/catalogs/upload"></v-list-item>
          <v-list-item prepend-icon="mdi-tools" title="Lektionen Erstellen" to="/builder"></v-list-item>
          <v-divider></v-divider>
        </div>
        <div v-if="authStore.user">
          <v-list-item prepend-icon="mdi-account" title="Profil" to="/profile"></v-list-item>
          <v-list-item prepend-icon="mdi-email-fast" title="Feedback" to="/feedback"></v-list-item>
        </div>
      </v-list>

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
      <v-container fluid>
        <v-row>
          <v-col>
            <div v-for="alert in utilStore.alerts" :key="alert.id">
              <v-alert
                  closable
                  class="mb-2"
                  variant="outlined"
                  border="top"
                  density="compact"
                  :type="alert.type"
                  @click:close="utilStore.removeAlert(alert.id)"
              >
                {{ alert.message }}
              </v-alert>
              {{ removeAlertWithDelay(alert.id) }}
            </div>
            <v-sheet min-height="80vh" rounded="lg">
              <v-container fluid>
                <router-view></router-view>
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
        <div v-for="dialog in utilStore.dialogs">
          <CustomDialog @confirm="dialog.onConfirm(); utilStore.closeDialog(dialog.id)"
                        @cancel="utilStore.closeDialog(dialog.id)"
                        :title="dialog.content.title"
                        :message="dialog.content.message"
                        :confirm-label="dialog.content.confirmLabel"
                        :cancel-label="dialog.content.cancelLabel"
                        :onlyConfirmButton="dialog.onlyConfirmButton"
          ></CustomDialog>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import router from "@/router/index.ts";
import {useUtilStore} from "@/stores/util.store.ts";
import {useAuthStore} from "@/stores/auth.store.ts";
import {useThemeStore} from "@/stores/theme.store.ts";
import CustomDialog from "@/components/dialog/CustomDialog.component.vue";
import {useProfileStore} from "@/stores/profile.store.ts";

const utilStore = useUtilStore();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const themeStore = useThemeStore();

const rail = ref(true);
const drawer = ref(null);

onBeforeMount(async () => {
  if (authStore.user) {
    console.log("meh")
    await profileStore.fetchProfile(authStore.user.id);
  }
})

const removeAlertWithDelay = (alertId: string, delay = 10000) => {
  setTimeout(() => {
    utilStore.removeAlert(alertId);
  }, delay);
};

const logout = () => {
  authStore.signOut();
  router.push('/')
}

</script>
