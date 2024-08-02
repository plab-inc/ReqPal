<template>
  <div v-if="stepperStore.scenario">
    <v-row>
      <v-col>
        <v-row>
          <v-col cols="auto">
            <div class="text-h3">
              Ergebnisse Szenario: {{ stepperStore.scenario?.title }}
            </div>
          </v-col>
          <v-col cols="auto" class="d-flex flex-grow-1 justify-end mr-2" align-self="center" v-if="scenarioStatistic">
            <div class="text-h5 text-md-h4">
              {{ scenarioStatistic.score }} / {{ totalScenarioScore }}
              <v-icon class="mb-1" size="35" color="warning"
                      :icon="'mdi-star-four-points-circle-outline'"></v-icon>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-divider opacity="1" class="my-2"/>
    <v-row v-if="scenarioStatistic">
      <v-col>
        <div class="d-flex align-center flex-wrap mt-2">
          <div class="text-h6 mr-5">
            Erhaltene Achievements:
          </div>
          <v-chip v-for="achievement in scenarioStatistic.achievements" class="mb-1 mr-1" color="success">
            <v-icon class="mr-2">
              <v-img :src="getAchievementImageUrl(achievement.image)"
                     :alt="'ReqPal-Achievement Level Image: '+achievement.image"></v-img>
            </v-icon>
            {{ achievement.title }}
          </v-chip>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex align-center flex-wrap mt-2">
          <div class="text-h6 mr-5">
            Erhaltene XP für Lernziele:
          </div>
          <v-chip v-for="objectiveStatistic in scenarioStatistic.objectiveStatistics" class="mb-1 mr-1" color="info">
            {{ objectiveStatistic.objective.name }}: {{ objectiveStatistic.xp }} XP
          </v-chip>
        </div>
      </v-col>
    </v-row>
    <v-divider opacity="1" class="my-2"/>
    <v-row>
      <v-col>
        <div v-if="scenarioStatistic && scenarioResults && scenarioResults.length > 0">
          <div v-for="result in scenarioResults">
            <v-row class="mt-5">
              <v-col>
                <v-row>
                  <v-col cols="auto">
                    <div class="text-h5 text-md-h4">Lektion: {{ result.lessonQuestion.lesson.lessonDTO.title }}</div>
                  </v-col>
                  <v-col cols="auto" class="d-flex flex-grow-1 justify-end mr-2" align-self="center">
                    <div class="text-h5 text-md-h4">
                      {{ result.totalLessonScore }} / {{ result.lessonQuestion.lesson.lessonDTO.points }}
                      <v-icon class="mb-1" size="35" color="warning"
                              :icon="'mdi-star-four-points-circle-outline'"></v-icon>
                    </div>
                  </v-col>
                </v-row>
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
import {ComponentInstance, markRaw, onBeforeMount} from "vue";
import TrueOrFalseResult from "@/components/scenario/Results/TrueOrFalseResult.vue";
import RequirementResult from "@/components/scenario/Results/RequirementResult.vue";
import MultipleChoiceResult from "@/components/scenario/Results/MultipleChoiceResult.vue";
import SliderResult from "@/components/scenario/Results/SliderResult.vue";
import {getAchievementImageUrl} from "@/utils/achievementImage.ts";

const stepperStore = useStepperStore();
const scenarioStatisticStore = useScenarioStatisticStore();
let totalScenarioScore = 0;

let scenarioStatistic: ScenarioUserStatistic | null;
let scenarioResults: LessonQuestionResult[];


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

onBeforeMount(() => {
  if (stepperStore.scenario) {
    scenarioStatistic = scenarioStatisticStore.currentScenarioStatistic;
    scenarioResults = scenarioStatisticStore.currentScenarioResults;
    scenarioResults.forEach(res => {
      if (res.lessonQuestion.lesson.lessonDTO.points)
        totalScenarioScore += res.lessonQuestion.lesson.lessonDTO.points;
    })
  }
})
</script>