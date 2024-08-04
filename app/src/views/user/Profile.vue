<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      Meine Fortschritte
    </v-col>
  </v-row>
  <v-divider></v-divider>
  <v-container>
    <v-tabs
        v-model="tab"
        color="primary"
        grow
    >
      <v-tab :value="0">
        <v-icon left class="mr-1">mdi-progress-star-four-points</v-icon>
        Levels
      </v-tab>
      <v-tab :value="1">
        <v-icon left class="mr-1">mdi-medal-outline</v-icon>
        Achievements
      </v-tab>
      <v-tab :value="2">
        <v-icon left class="mr-1">mdi-chart-box-outline</v-icon>
        Statistiken
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
            <v-col v-if="objectiveLevels && objectiveLevels.length > 0" md="12" lg="6"
                   v-for="objectiveLevel in objectiveLevels"
                   class="mt-5 d-flex align-center justify-center">
              <ObjectiveLevelComponent :objectiveLevel="objectiveLevel"></ObjectiveLevelComponent>
            </v-col>
            <v-col v-else>
              Noch keine XP für Lernziele gesammelt.
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
            <v-col v-if="studentAchievementStore.reqPalAchievements.length > 0" md="6" lg="4"
                   v-for="achievement in studentAchievementStore.reqPalAchievements"
                   class="mt-5 d-flex">
              <ReqPalAchievementItem class="flex-grow-1" :achievement="achievement"></ReqPalAchievementItem>
            </v-col>
            <v-col v-else>
              Noch keine ReqPal Achievements gesammelt.
            </v-col>
          </v-row>
          <v-row class="mt-2">
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
            <v-col v-if="studentAchievementStore.achievements.length > 0" md="6" lg="4"
                   v-for="achievement in studentAchievementStore.achievements" class="mt-5 d-flex">
              <StudentAchievementItem class="flex-grow-1" :achievement="achievement"></StudentAchievementItem>
            </v-col>
            <v-col v-else>
              Noch keine Achievements gesammelt.
            </v-col>
          </v-row>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        <StudentStatistic></StudentStatistic>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script setup lang="ts">
import {ref} from "vue";
import ReqPalLevel from "@/components/profile/ReqPalLevel.vue"
import ObjectiveLevelComponent from "@/components/objectives/profile/ObjectiveLevel.vue";
import {useLevelStore} from "@/stores/level.ts";
import {ObjectiveLevel} from "@/types/level.ts";
import {useStudentAchievementStore} from "@/stores/studentAchievement.ts";
import ReqPalAchievementItem from "@/components/achievement/profile/ReqPalAchievementItem.vue";
import StudentAchievementItem from "@/components/achievement/profile/StudentAchievementItem.vue";
import StudentStatistic from "@/components/profile/StudentStatistic.vue";

const levelStore = useLevelStore();
const objectiveLevels = ref<ObjectiveLevel[] | null>(levelStore.getObjectiveLevels);

const studentAchievementStore = useStudentAchievementStore();

const tab = ref<number>(0);
</script>