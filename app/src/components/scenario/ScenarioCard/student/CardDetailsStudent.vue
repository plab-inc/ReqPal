<template>
  <v-row no-gutters>
    <v-col>
      <v-progress-linear
          bg-color="surface-variant"
          class="mb-2"
          :color=progressBarColor()
          max="5"
          disabled
          height="25"
          :model-value=progressBarStatus()
          rounded="pill">
        <strong>{{ progressBarText() }}</strong>
      </v-progress-linear>
    </v-col>
    <v-col class="text-subtitle-1" v-if="scenarioStatistic">
      <div class="d-flex align-center flex-wrap mt-2">
        <v-chip color="warning" class="mb-1 mr-1" @click="router.push({name: 'Profil'})">
          <v-icon class="mr-2" color="warning"
                  :icon="'mdi-star-four-points-circle-outline'"></v-icon>
          {{ scenarioStatistic.score }} Punkte
        </v-chip>
        <AchievementChip v-for="achievement in scenarioStatistic.achievements" :achievement="achievement" :chip-class="'mb-1 mr-1'"></AchievementChip>
        <v-chip v-for="objectiveStatistic in scenarioStatistic.objectiveStatistics" class="mb-1 mr-1" color="info"
                @click="router.push({name: 'Profil'})">
          {{ objectiveStatistic.objective.name }}: {{ objectiveStatistic.xp }} XP
        </v-chip>
      </div>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import {useScenarioProgressStore} from "@/stores/scenarioProgress.ts";
import {defineProps} from "vue";
import {Scenario, ScenarioProgress} from "@/types/scenario.ts";
import {useScenarioStatisticStore} from "@/stores/scenarioStatistic.ts";
import {ScenarioUserStatistic} from "@/types/scenarioUserStatistic.ts";
import router from "@/router";
import AchievementChip from "@/components/achievement/AchievementChip.vue";

const props = defineProps<{
  scenario: Scenario
}>();

const scenarioProgressStore = useScenarioProgressStore();
const scenarioProgress: ScenarioProgress | undefined = scenarioProgressStore.getProgressByScenario(props.scenario);
const scenarioStatisticStore = useScenarioStatisticStore();
const scenarioStatistic: ScenarioUserStatistic | undefined = scenarioStatisticStore.getStatisticByScenario(props.scenario.id);

const progressBarStatus = () => {
  if (props.scenario.locked && !scenarioProgress) return 5;

  if (scenarioProgress) {
    if (scenarioProgress.ended) return 5;
    if (scenarioProgress.started) return 2;
    return 1;
  }
  return 0;
};

const progressBarColor = () => {
  if (props.scenario.locked && !scenarioProgress) return "red";
  if (scenarioProgress) {
    if (scenarioProgress.ended) return "success";
    if (scenarioProgress.started) return "error";
    return "warning";
  }
  return "info";
};

const progressBarText = () => {
  if (props.scenario.locked && !scenarioProgress) return "Gesperrt";
  if (scenarioProgress) {
    if (scenarioProgress.ended) return "Beendet";
    if (scenarioProgress.started) return "Lektionen Gestartet";
    return "Begonnen";
  }
  return "Noch Nicht Begonnen";
};
</script>