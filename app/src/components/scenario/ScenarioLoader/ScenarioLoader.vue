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

        <v-row class="align-center" no-gutters>
          <v-col class="d-flex align-center" cols="auto"
                 v-if="!stepperStore.getCurrentStep.startStep && !stepperStore.getCurrentStep.endStep">
            <v-tooltip location="top right" text="Insgesamt gesammelte Punkte">
              <template v-slot:activator="{ props }">
                <div class="text-h4" v-bind="props">
                  {{ statisticStore.currentScenarioStatistic ? statisticStore.currentScenarioStatistic.score : 0 }}
                  <v-icon class="mb-1" size="35" color="warning"
                          :icon="'mdi-star-four-points-circle-outline'"></v-icon>
                </div>
              </template>
            </v-tooltip>
            <div class="ml-4" style="max-width: 595px; overflow-x: auto; white-space: nowrap;">
              <AchievementChip v-for="achievement in statisticStore.currentScenarioStatistic?.achievements"
                               :achievement="achievement" :chip-class="'mb-1 mr-1'" />
            </div>
          </v-col>

          <v-col cols="auto" class="ml-auto d-flex justify-end">
            <v-btn
              variant="outlined"
              size="x-large"
              text="Szenario Verlassen"
              color="warning"
              class="mr-2"
              v-if="stepperStore.getCurrentStep.startStep || stepperStore.getCurrentStep.endStep"
              to="/scenario"
            />

            <v-btn
              size="x-large"
              color="success"
              text="Szenario Starten"
              variant="outlined"
              v-if="stepperStore.getCurrentStep.startStep"
              @click="stepperStore.start"
              append-icon="mdi-play"
            />

            <v-btn
              variant="outlined"
              size="x-large"
              text="Lektions Fortschritt Speichern und Szenario verlassen"
              color="warning"
              class="mr-2"
              v-if="!stepperStore.getCurrentStep.endStep && !stepperStore.getCurrentStep.startStep && !stepperStore.getCurrentStep.placeholderStep"
              @click="quitScenario()"
            />

            <v-btn
              variant="outlined"
              color="success"
              size="x-large"
              text="Nächste Lektion"
              v-if="!stepperStore.getCurrentStep.endStep && !stepperStore.getCurrentStep.startStep && !stepperStore.getCurrentStep.placeholderStep"
              @click="submitLesson"
              append-icon="mdi-play"
            />
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
import { useLessonStore } from "@/stores/lesson.ts";
import { QuestionAnswer } from "@/types/lesson.ts";
import router from "@/router/index.ts";
import { useUtilStore } from "@/stores/util.ts";
import { useScenarioStatisticStore } from "@/stores/scenarioStatistic.ts";
import AchievementChip from "@/components/achievement/AchievementChip.vue";

onMounted(() => {
  if (!stepperStore.scenario) {
    router.push({ path: "/scenario" });
  }
});

const stepperStore = useStepperStore();
const lessonStore = useLessonStore();
const statisticStore = useScenarioStatisticStore();
const utilStore = useUtilStore();

const saveLesson = async () => {
  utilStore.startLoadingBar();
  const questionAnswers: QuestionAnswer[] | null = await lessonStore.generateQuestionAnswers();
  if (questionAnswers) {
    await stepperStore.saveLessonAnswers(questionAnswers)
      .then(() => utilStore.addAlert("Lektions Fortschritt gespeichert.", "info"))
      .finally(() => utilStore.stopLoadingBar());
  }
};

const quitScenario = async () => {
  await saveLesson().then(() => router.push("/scenario"));
};

const submitLesson = async () => {
  if (!(await lessonStore.isLessonFormValid())) return;
  const questionAnswers: QuestionAnswer[] | null = await lessonStore.generateQuestionAnswers();
  if (questionAnswers) await stepperStore.nextStep(questionAnswers);
};
</script>