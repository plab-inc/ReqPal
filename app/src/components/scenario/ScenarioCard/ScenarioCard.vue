<template>
  <v-card
    variant="outlined"
    width="550"
    class="ma-3"
    rounded
    elevation="10"
  >
    <CardImageTeacher v-if=isTeacher :scenario="scenario" />
    <div class="elevation-8">
      <CardInfosTeacher v-if="isTeacher" :scenario="scenario" />
      <CardInfosStudent v-if="isStudent" :scenario="scenario" />
      <v-card-actions>
        <v-container class="pa-0 align-content-end" style="height: 75px">
          <CardActionsTeacher v-if="isTeacher" :scenario="scenario" />
          <CardActionsStudent v-if="isStudent" :scenario="scenario" />
          <v-row v-if="scenario && isTeacher" no-gutters>
            <v-btn block :append-icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                   :text="isTeacher ? 'Statistiken': 'Details'" @click="show = !show" />
          </v-row>
        </v-container>
      </v-card-actions>
    </div>
    <v-expand-transition>
      <div v-show="isStudent || show">
        <v-card-text>
          <CardDetailsTeacher v-if="isTeacher" />
          <CardDetailsStudent v-if="isStudent" />
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import { Scenario } from "@/types/scenario.ts";
import CardDetailsTeacher from "@/components/scenario/ScenarioCard/teacher/CardDetailsTeacher.vue";
import CardActionsTeacher from "@/components/scenario/ScenarioCard/teacher/CardActionsTeacher.vue";
import CardImageTeacher from "@/components/scenario/ScenarioCard/teacher/CardImageTeacher.vue";
import CardInfosTeacher from "@/components/scenario/ScenarioCard/teacher/CardInfosTeacher.vue";
import { useAuthStore } from "@/stores/auth.ts";
import CardInfosStudent from "@/components/scenario/ScenarioCard/student/CardInfosStudent.vue";
import CardDetailsStudent from "@/components/scenario/ScenarioCard/student/CardDetailsStudent.vue";
import CardActionsStudent from "@/components/scenario/ScenarioCard/student/CardActionsStudent.vue";

const props = defineProps<{
  scenario?: Scenario
}>();

const authStore = useAuthStore();
const show = ref<boolean>(false);

const isTeacher = true;
const isStudent = false;

</script>

<style scoped>
.svg-container {
  display: flex;
  height: 200px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  padding: 16px;
}
</style>
