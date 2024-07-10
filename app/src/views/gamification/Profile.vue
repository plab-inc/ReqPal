<template>
  <v-container>
    <v-row>
      <v-col class="d-flex flex-column align-center justify-center">
        <v-avatar
            color="secondary"
            :image="profileStore.getAvatarURL"
            alt="profilePicture"
            size="140"
        ></v-avatar>
        <h2 class="profileData text-h4">{{ user?.user_metadata.username }}</h2>
        <h3 class="profileData text-h5">Beitritt: {{ joinedDate }}</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn title="Account Einstellungen" to="/account">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-tabs
        v-model="tab"
        color="primary"
        grow
    >
      <v-tab :value="0">
        <v-icon left class="mr-1">mdi-progress-star-four-points</v-icon>
        Level
      </v-tab>
      <v-tab :value="1">
        <v-icon left class="mr-1">mdi-medal-outline</v-icon>
        Achievements
      </v-tab>
      <v-tab :value="2">
        <v-icon left class="mr-1">mdi-chart-box-outline</v-icon>
        Statistik
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="0">
        <v-row>
          <v-col class="mt-6 d-flex align-center justify-center">
            <Levels></Levels>
          </v-col>
        </v-row>
      </v-tabs-window-item>

      <v-tabs-window-item :value="1">
        Achievements
      </v-tabs-window-item>

      <v-tabs-window-item :value="2">
        Statistik
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";
import {User} from "@supabase/supabase-js";
import {useProfileStore} from "@/stores/profile.ts";
import {ref} from "vue";
import Levels from "@/components/gamification/Levels.vue"

const tab = ref<number>(0);
const authStore = useAuthStore();
const profileStore = useProfileStore();

const user: User | null = authStore.user;
const isoDateString = user?.created_at;
let joinedDate: string;

if (isoDateString) {
  const parsedDate = new Date(isoDateString);
  joinedDate = parsedDate.toLocaleString('default', {year: 'numeric', month: 'long'});
}
</script>

<style scoped>
.profileData {
  margin-top: 10px;
  text-align: center;
}
</style>
