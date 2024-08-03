<template>
  <v-container class="my-container">
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
        <v-btn title="Account Einstellungen" to="/profile/settings">
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
        <v-container>
          <v-row class="mt-2">
            <v-col>
              <div class="text-h6">
                Lernplattform Fortschritte
              </div>
            </v-col>
            <v-col class="d-flex align-center justify-center">
              <ReqPalLevel></ReqPalLevel>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-h6">
              <div>
                Lernziel Fortschritte
              </div>
            </v-col>
            <v-col md="12" lg="6" v-for="objectiveLevel in objectiveLevels"
                   class="mt-5 d-flex align-center justify-center">
              <ObjectiveLevelComponent :objectiveLevel="objectiveLevel"></ObjectiveLevelComponent>
            </v-col>
          </v-row>
        </v-container>
      </v-tabs-window-item>

      <v-tabs-window-item :value="1">
        <v-container>
          <v-row class="mt-2">
            <v-col>
              <div class="text-h6">
                ReqPal Achievements
              </div>
            </v-col>
            <v-col md="6" lg="4" v-for="achievement in studentAchievementStore.reqPalAchievements"
                   class="mt-5 d-flex align-center justify-center">
              <ReqPalAchievementItem :achievement="achievement"></ReqPalAchievementItem>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-divider></v-divider>
            </v-col>
          </v-row>

          <v-row class="mt-2">
            <v-col>
              <div class="text-h6">
                Achievements aus Szenarien
              </div>
            </v-col>
            <v-col md="6" lg="4" v-for="achievement in studentAchievementStore.achievements" class="mt-5 d-flex">

            </v-col>
          </v-row>
        </v-container>
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
import ReqPalLevel from "@/components/level/ReqPalLevel.vue"
import ObjectiveLevelComponent from "@/components/objectives/ObjectiveLevel.vue";
import {useLevelStore} from "@/stores/level.ts";
import {ObjectiveLevel} from "@/types/level.ts";
import {useStudentAchievementStore} from "@/stores/studentAchievement.ts";
import ReqPalAchievementItem from "@/components/achievement/profile/ReqPalAchievementItem.vue";

const levelStore = useLevelStore();
const objectiveLevels = ref<ObjectiveLevel[] | null>(levelStore.getObjectiveLevels);

const studentAchievementStore = useStudentAchievementStore();

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
.my-container {
  padding-left: 20px;
  padding-right: 20px;
}

.profileData {
  margin-top: 10px;
  text-align: center;
}

</style>
