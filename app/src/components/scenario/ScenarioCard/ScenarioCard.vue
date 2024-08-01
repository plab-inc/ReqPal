<template>
  <v-card
    variant="outlined"
    width="610"
    class="ma-2 border-opacity-100"
    rounded
    :border="scenario?.locked ? 'error md': 'white md'"
    elevation="10"
  >
    <CardImageTeacher v-if=authStore.isTeacher :scenario="scenario" />
    <div class="elevation-8">
      <CardInfosTeacher v-if="authStore.isTeacher" :scenario="scenario" />
      <CardInfosStudent v-if="authStore.isStudent && scenario" :scenario="scenario" />
      <v-card-actions>
        <v-container class="pa-0 align-content-end" style="height: 75px">
          <CardActionsTeacher v-if="authStore.isTeacher" :scenario="scenario" />
          <CardActionsStudent v-if="authStore.isStudent && scenario" :scenario="scenario" />
          <v-row v-if="scenario" no-gutters>
            <v-btn block color="white" variant="plain" :ripple="false"
                   :append-icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                   :text="authStore.isTeacher ? 'Statistiken': 'Details'" @click="show = !show" />
          </v-row>
        </v-container>
      </v-card-actions>
    </div>
    <v-expand-transition>
      <div v-show="show">
        <v-card-text>
          <CardDetailsTeacher v-if="authStore.isTeacher" />
          <CardDetailsStudent v-if="authStore.isStudent && scenario" :scenario="scenario" />
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
</script>