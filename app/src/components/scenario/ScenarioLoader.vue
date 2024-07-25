<template>
  <div>
    <v-stepper v-model="stepperStore.currentStep" class="elevation-0">
      <template v-slot:default>
        <v-card variant="outlined" elevation="8" class="ma-2">
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
            <div v-if="step.startStep && !step.placeholderStep && !step.endStep">
              Start
            </div>
            <div v-if="!step.startStep && !step.placeholderStep && !step.endStep">
              {{ lessonStore.currentLesson?.lessonDTO.title }}
              <LessonQuestions v-if="!step.startStep && !step.placeholderStep && !step.endStep"
                               :components="lessonStore.getLessonModules" />
            </div>
            <div v-if="!step.startStep && !step.placeholderStep && step.endStep">
              End
            </div>
            <div v-if="!step.startStep && step.placeholderStep && !step.endStep">
              No idea how you got here.
            </div>
          </v-stepper-window-item>
        </v-stepper-window>

        <v-stepper-actions class="justify-end">
          <template v-slot:prev />
          <template v-slot:next>
            <div>
              <v-btn variant="outlined" v-if="stepperStore.getCurrentStep.startStep" @click="stepperStore.start">Start
              </v-btn>
              <v-btn variant="outlined"
                     v-if="!stepperStore.getCurrentStep.endStep && !stepperStore.getCurrentStep.startStep && !stepperStore.getCurrentStep.placeholderStep"
                     @click="stepperStore.nextStep">Save Progress
              </v-btn>
              <v-btn variant="outlined"
                     v-if="!stepperStore.getCurrentStep.endStep && !stepperStore.getCurrentStep.startStep && !stepperStore.getCurrentStep.placeholderStep"
                     @click="stepperStore.nextStep">Next Lesson
              </v-btn>
            </div>
          </template>
        </v-stepper-actions>
      </template>
    </v-stepper>
  </div>
</template>

<script setup lang="ts">
import { useLessonStore } from "@/stores/lesson";
import { useStepperStore } from "@/stores/stepper";
import LessonQuestions from "@/components/lesson/generator/LessonQuestions.vue";

const lessonStore = useLessonStore();
const stepperStore = useStepperStore();

stepperStore.initializeSteps();
</script>