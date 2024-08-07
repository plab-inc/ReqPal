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
      <CommonNavTop />
      <template v-if="authStore.isTeacher">
        <TeacherNav />
      </template>
      <template v-if="authStore.isStudent">
        <StudentNav />
      </template>
      <template v-if="authStore.user && authStore.isModerator">
        <ModeratorNav />
      </template>
      <CommonNavBottom />
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        {{alertStore.gamificationAlerts}}
        {{alertStore.gamificationAlertQueue}}
        <v-btn @click="alertStore.addGamificationAlert({action: 'Lernziel' ,created_at: '',id: '',received_xp: Math.random() ,user_id: ''})">add alert</v-btn>
        <div v-for="(alert, index) in alertStore.gamificationAlerts" :key="alert.id">
          <Snackbar :text="alert.message" :id="alert.id" :index="index"></Snackbar>
        </div>
        <!--
        <div v-for="(alert, index) in utilStore.gamificationAlerts" :key="alert.id">
          <Snackbar :text="alert.message" :id="alert.id" :index="index"></Snackbar>
          {{ removeAlertWithDelay(alert.id) }}
        </div>
-->
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
            <v-sheet min-height="95vh" rounded="lg">
              <v-container fluid>
                <router-view></router-view>
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
        <div v-for="dialog in utilStore.dialogs">
          <Dialog
            @confirm="dialog.onConfirm(); utilStore.closeDialog(dialog.id)"
            @cancel="utilStore.closeDialog(dialog.id)"
            :title="dialog.content.title"
            :message="dialog.content.message"
            :confirm-label="dialog.content.confirmLabel"
            :cancel-label="dialog.content.cancelLabel"
            :onlyConfirmButton="dialog.onlyConfirmButton"
          />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { useUtilStore } from "@/stores/util.ts";
import { useAuthStore } from "@/stores/auth.ts";
import { useProfileStore } from "@/stores/profile.ts";
import { supabase } from "@/plugins/supabase.ts";
import { XpActivityLogDTO } from "@/types/xpActivityLog.ts";
import Snackbar from "@/components/util/Snackbar.vue";
import Dialog from "@/components/util/Dialog.vue";
import CommonNavTop from "@/layouts/navigation/CommonTop.vue";
import TeacherNav from "@/layouts/navigation/Teacher.vue";
import StudentNav from "@/layouts/navigation/Student.vue";
import ModeratorNav from "@/layouts/navigation/Moderator.vue";
import CommonNavBottom from "@/layouts/navigation/CommonBottom.vue";
import {useGamificationAlertStore} from "@/stores/alert.ts";

const utilStore = useUtilStore();
const alertStore = useGamificationAlertStore();
const authStore = useAuthStore();
const profileStore = useProfileStore();

const rail = ref(true);
const drawer = ref(null);

onBeforeMount(async () => {
  if (authStore.user) {
    await profileStore.fetchProfile(authStore.user.id);
  }
});

const removeAlertWithDelay = (alertId: string, delay = 10000) => {
  setTimeout(() => {
    utilStore.removeAlert(alertId);
  }, delay);
};

supabase
  .channel("schema-db-changes")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      table: "xp_activity_logs",
      schema: "public",
      filter: `user_id=eq.${authStore.user?.id}`
    },
    (payload) => {
      let activity: XpActivityLogDTO = payload.new as XpActivityLogDTO;
      alertStore.addGamificationAlert(activity);
    }
  )
  .subscribe();
</script>