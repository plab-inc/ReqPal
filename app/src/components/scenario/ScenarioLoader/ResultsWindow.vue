<template>
  <div v-if="stepperStore.scenario">
    <v-row>
      <v-col>
        <div class="text-h3">
          Ergebnisse Szenario: {{ stepperStore.scenario?.title }}
        </div>
      </v-col>
    </v-row>
    <v-divider opacity="1" class="my-2"/>
    <v-row>
      <v-col>
        <div v-if="scenarioStatistic && scenarioResults && scenarioResults.length > 0">
          <div v-for="result in scenarioResults">
            <v-row class="mt-5">
              <v-col cols="10" class="text-h4">
                Lektion: {{ result.lessonQuestion.lesson.lessonDTO.title }}
              </v-col>
              <v-col cols="2">
                <div class="text-h5">
                  {{ result.totalLessonScore }} / {{ result.lessonQuestion.lesson.lessonDTO.points }}
                  <v-icon class="mb-1" size="35" color="warning"
                          :icon="'mdi-star-four-points-circle-outline'"></v-icon>
                </div>
              </v-col>
              <v-divider opacity="1" class="my-2"/>
              <v-col>
                <div v-for="questionResult in result.questionResults">
                  <v-row>
                    <v-col>
                      <component
                          :is="getLessonModuleInstance(questionResult.type)"
                          :questionResult="questionResult"
                      ></component>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
  <div v-else>
    <div class="text-h3">
      Kein Szenario geladen.
    </div>
  </div>
</template>
<script setup lang="ts">
import {useStepperStore} from "@/stores/stepper.ts";
import {useScenarioStatisticStore} from "@/stores/scenarioStatistic.ts";
import {LessonQuestionResult, ScenarioUserStatistic} from "@/types/scenarioUserStatistic.ts";
import {ComponentInstance, markRaw} from "vue";
import TrueOrFalseResult from "@/components/scenario/Results/TrueOrFalseResult.vue";
import RequirementResult from "@/components/scenario/Results/RequirementResult.vue";
import MultipleChoiceResult from "@/components/scenario/Results/MultipleChoiceResult.vue";
import SliderResult from "@/components/scenario/Results/SliderResult.vue";

const stepperStore = useStepperStore();
const scenarioStatisticStore = useScenarioStatisticStore();

let scenarioStatistic: ScenarioUserStatistic | undefined;
let scenarioResults: LessonQuestionResult[];
//TODO Reload?
if (stepperStore.scenario) {
  scenarioStatistic = scenarioStatisticStore.getStatisticByScenario(stepperStore.scenario.id);
  scenarioResults = scenarioStatisticStore.currentScenarioResults;
}

interface LessonModuleMap {
  [key: string]: ComponentInstance<any>;
}

const lessonModuleMap: LessonModuleMap = {
  'TrueOrFalse': markRaw(TrueOrFalseResult),
  'Requirement': markRaw(RequirementResult),
  'MultipleChoice': markRaw(MultipleChoiceResult),
  'Slider': markRaw(SliderResult)
};

const getLessonModuleInstance = (lessonModuleName: string): ComponentInstance<any> => {
  return lessonModuleMap[lessonModuleName];
};
</script>