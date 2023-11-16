<template>
  <v-app>
    <v-progress-linear style="position: fixed; z-index: 999;"
                       indeterminate
                       color="warning"
                       :active="utilStore.showLoadingBar"
    />
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
                     to="/account"
                     elevation="3"
                     rounded
        />
        <v-list-item v-if="!authStore.user"
                     prepend-icon="mdi-login"
                     title="Login" to="Login"
                     rounded
        />
      </v-list>
      <v-divider class="my-1"/>
      <v-list nav>
        <v-list-item
            rounded prepend-icon="mdi-home"
            title="Home" to="/"
            exact/>
        <div v-if="authStore.user">
          <v-list-item
              rounded v-if="authStore.isTeacher"
              prepend-icon="mdi-school"
              title="Erstellte Lektionen"
              to="/lessons"/>
          <v-list-group value="Lektionen" v-if="!authStore.isTeacher">
            <template v-slot:activator="{ props }">
              <v-list-item
                  v-bind="props"
                  prepend-icon="mdi-school"
                  title="Lernen"
                  rounded
              />
            </template>
            <v-list-item
                rounded
                to="/lessons"
                title="Lektionen"
                :subtitle="lessonStore.openLessons <= 0 ? 'Keine Lektionen' : lessonStore.openLessons +'Offen'"
            >
              <template v-slot:prepend>
                <v-progress-circular
                    class="mr-4"
                    size="27"
                    :model-value="(lessonStore.lessons.length - lessonStore.openLessons / lessonStore.lessons.length) * 100"/>
              </template>
            </v-list-item>
            <v-list-item
                title="Meine Punkte"
                :subtitle="profileStore.points"
                rounded
            >
              <template v-slot:prepend>
                <v-icon class="mr-n5 ml-n1" size="34" color="warning">
                  mdi-star-four-points-circle-outline
                </v-icon>
              </template>
            </v-list-item>
          </v-list-group>
        </div>
        <div v-if="authStore.user && authStore.isTeacher">
          <v-divider class="my-1"/>
          <v-list-item rounded prepend-icon="mdi-text-box-multiple" title="Meine Kataloge" to="/catalogs"/>
          <v-list-item rounded prepend-icon="mdi-upload" title="Neuen Katalog Hochladen" to="/catalogs/upload"/>
          <v-list-item rounded prepend-icon="mdi-tools" title="Lektionen Erstellen" to="/builder"/>
          <v-divider class="my-1"/>
        </div>
        <div v-if="authStore.user">
          <v-list-item rounded prepend-icon="mdi-cog" title="Account Einstellungen" to="/account"/>
          <v-list-item rounded prepend-icon="mdi-email-fast" title="Feedback" to="/feedback"/>
        </div>
      </v-list>
      <template v-slot:append>
        <v-divider class="my-1"/>
        <v-list>
          <v-list-item
              v-if="authStore.user"
              prepend-icon="mdi-logout"
              title="Logout" @click="logout"
          />
          <v-list-item
              :prepend-icon="themeStore.currentTheme === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny'"
              :title="themeStore.currentTheme === 'light' ? 'Dunkles Thema' : 'Helles Thema'"
              @click="themeStore.toggleUserTheme"
          />
          <v-list-item
              prepend-icon="mdi-scale-balance"
              title="Rechtliche Hinweise"
              to="/legal"
          />
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
import router from "@/router";
import {useUtilStore} from "@/stores/util.store.ts";
import {useAuthStore} from "@/stores/auth.store.ts";
import {useThemeStore} from "@/stores/theme.store.ts";
import CustomDialog from "@/components/util/CustomDialog.component.vue";
import {useProfileStore} from "@/stores/profile.store.ts";
import alertSfx from "@/assets/sound/alert.mp3";
import {useLessonStore} from "@/stores/lesson.store.ts";

const utilStore = useUtilStore();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const themeStore = useThemeStore();
const lessonStore = useLessonStore();

const rail = ref(true);
const drawer = ref(null);
const audio = new Audio(alertSfx);

onBeforeMount(async () => {
  if (authStore.user) {
    await profileStore.fetchProfile(authStore.user.id);

    //TODO Broken
    //await profileStore.fetchPoints(authStore.user.id);
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

watch(() => utilStore.alerts.length, (newLength, oldLength) => {
  if (newLength > oldLength) {
    audio.volume = 0.2;
    audio.play();
  }
});

</script>