<template>
  <div>
    <v-stepper v-model="stepperStore.currentStep" class="elevation-0">
      <template v-slot:default>
        <v-card variant="outlined" color="info" elevation="12" class="ma-2">
          <v-stepper-header elevation="0">
            <template v-for="(step, index) in stepperStore.allSteps" :key="index">
              <v-stepper-item
                :complete="stepperStore.currentStep > index"
                :step="step.title"
                :title="step.title"
                :icon="stepperStore.getStepIcon(step)"
                :color="stepperStore.getStepColor(step)"
                :value="index"
                :editable="false"
              ></v-stepper-item>
              <v-divider v-if="index < stepperStore.allSteps.length - 1" opacity="0.8" />
            </template>
          </v-stepper-header>
        </v-card>

        <v-stepper-window style="min-height: 72vh">
          <v-stepper-window-item v-for="(step, index) in stepperStore.allSteps" :key="index" :value="index">
            <StartWindow v-if="step.startStep && !step.placeholderStep && !step.endStep" />
            <LessonWindow v-if="!step.startStep && !step.placeholderStep && !step.endStep" />
            <ResultsWindow v-if="!step.startStep && !step.placeholderStep && step.endStep" />
          </v-stepper-window-item>
        </v-stepper-window>

        <v-row class="justify-end ma-2" no-gutters>
          <v-col cols="auto">
            <v-btn size="x-large" text="Szenario Starten" variant="outlined" color="white"
                   v-if="stepperStore.getCurrentStep.startStep" @click="stepperStore.start" />
            <v-btn variant="outlined" size="x-large" text="Fortschritt speichern und beenden" color="white" class="mr-2"
                     v-if="!stepperStore.getCurrentStep.endStep && !stepperStore.getCurrentStep.startStep && !stepperStore.getCurrentStep.placeholderStep"
                   @click="stepperStore.nextStep" />
            <v-btn variant="outlined" size="x-large" text="Nächste Lektion" color="white"
                     v-if="!stepperStore.getCurrentStep.endStep && !stepperStore.getCurrentStep.startStep && !stepperStore.getCurrentStep.placeholderStep"
                   @click="stepperStore.nextStep" />
          </v-col>
        </v-row>
      </template>
    </v-stepper>
  </div>
</template>

<script setup lang="ts">
import { useStepperStore } from "@/stores/stepper.ts";
import StartWindow from "@/components/scenario/ScenarioLoader/StartWindow.vue";
import ResultsWindow from "@/components/scenario/ScenarioLoader/ResultsWindow.vue";
import LessonWindow from "@/components/scenario/ScenarioLoader/LessonWindow.vue";
import { onMounted } from "vue";

const stepperStore = useStepperStore();

onMounted(() => stepperStore.initializeSteps());
</script>
