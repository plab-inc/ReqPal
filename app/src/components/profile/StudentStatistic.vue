<template>
  <v-container v-if="profileStore.userStatistic" class="statistics-container">
    <v-row class="mt-2" no-gutters justify="start">
      <v-col>
        <div class="text-h6">
          Szenarien
        </div>
      </v-col>
      <v-col class="d-flex justify-start flex-wrap">
        <StudentStatisticItem statistic-titel="Anzahl abgeschlossener Szenarien" :icon="scenarioIcon"
                              statistic-unit="" :color="scenarioColor"
                              :statistic-value="profileStore.userStatistic.total_scenarios ? profileStore.userStatistic.total_scenarios : 0"></StudentStatisticItem>
        <StudentStatisticItem statistic-titel="Gesamtpunkte" :icon="pointsIcon" statistic-unit="" :color="scenarioColor"
                              :statistic-value="profileStore.userStatistic.total_points ? profileStore.userStatistic.total_points : 0"></StudentStatisticItem>
      </v-col>
    </v-row>
    <v-row class="mt-2" no-gutters justify="start">
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="mt-2" no-gutters justify="start">
      <v-col>
        <div class="text-h6">
          Level und XP
        </div>
      </v-col>
      <v-col class="d-flex justify-start flex-wrap">
        <StudentStatisticItem statistic-titel="Gesamte ReqPal-XP" :icon="levelIcon" statistic-unit="XP"
                              :color="levelColor"
                              :statistic-value="profileStore.userStatistic.total_reqpal_xp ? profileStore.userStatistic.total_reqpal_xp : 0"></StudentStatisticItem>
        <StudentStatisticItem statistic-titel="Gesamte Lernziel-XP" :icon="levelIcon" statistic-unit="XP"
                              :color="levelColor"
                              :statistic-value="profileStore.userStatistic.total_objective_xp ? profileStore.userStatistic.total_objective_xp : 0"></StudentStatisticItem>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="mt-2" no-gutters justify="start">
      <v-col>
        <div class="text-h6">
          Achievements
        </div>
      </v-col>
      <v-col class="d-flex justify-start flex-wrap">
        <StudentStatisticItem statistic-titel="Gesamtanzahl aller Achievement-Arten" :icon="achievementIcon"
                              statistic-unit="" :color="achievementColor"
                              :statistic-value="studentAchievementStore.getTotalAmountOfAchievementsAndReqPalAchievements"></StudentStatisticItem>
        <StudentStatisticItem statistic-titel="Gesamtanzahl aller gesammelten Achievements aus Szenarien"
                              :icon="achievementIcon" statistic-unit="" :color="achievementColor"
                              :statistic-value="studentAchievementStore.getTotalAmountOfNonUniqueAchievements"></StudentStatisticItem>
        <StudentStatisticItem statistic-titel="Gesamtanzahl aller einzigartigen Achievements aus Szenarien"
                              :icon="achievementIcon" statistic-unit="" :color="achievementColor"
                              :statistic-value="studentAchievementStore.getTotalAmountOfUniqueAchievements"></StudentStatisticItem>
        <StudentStatisticItem statistic-titel="Gesamtanzahl aller ReqPalAchievements" :icon="achievementIcon"
                              statistic-unit="" :color="achievementColor"
                              :statistic-value="studentAchievementStore.getTotalAmountOfReqPalAchievements"></StudentStatisticItem>
      </v-col>
    </v-row>
  </v-container>
  <v-row v-else>
    <v-col>
      Keine Statistiken.
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import {useProfileStore} from "@/stores/profile.ts";
import StudentStatisticItem from "@/components/profile/StudentStatisticItem.vue";
import {useStudentAchievementStore} from "@/stores/studentAchievement.ts";

const studentAchievementStore = useStudentAchievementStore();
const profileStore = useProfileStore();

const achievementIcon: string = "mdi-medal-outline";
const pointsIcon: string = "mdi-star-four-points-circle-outline";
const levelIcon: string = "mdi-star";
const scenarioIcon: string = "mdi-ray-start-vertex-end";

const levelColor: string = "info";
const achievementColor: string = "primary";
const scenarioColor: string = "success";
</script>