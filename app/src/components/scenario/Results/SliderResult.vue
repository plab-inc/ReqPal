<template>
  <v-card variant="outlined">
    <v-container>
      <v-row>
        <v-col>
          <v-row>
            <v-col cols="auto">
              <div class="text-h6 text-md-h5">Slider</div>
            </v-col>
            <v-col cols="auto" class="d-flex flex-grow-1 justify-end mr-2" align-self="center">
              <div class="text-h5">
                {{ roundNumberToTwoDecimals(sliderResult.score) }} / {{ questionResult.questionData.points }}
                <v-icon class="mb-1" size="35" color="warning"
                        :icon="'mdi-star-four-points-circle-outline'"></v-icon>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <v-col cols="auto">
              <div class="text-h6 text-md-h5">Frage: {{ questionResult.questionData.question }}</div>
            </v-col>
            <v-col cols="auto" class="d-flex flex-grow-1 justify-end mr-2" align-self="center">
              <div class="text-h5">
                <div v-if="sliderResult.correct">
                  Richtig
                  <v-icon class="mb-1" size="35" color="success"
                          :icon="'mdi-check-circle-outline'"></v-icon>
                </div>
                <div v-else>
                  Falsch
                  <v-icon class="mb-1" size="35" color="error"
                          :icon="'mdi-close-circle-outline'"></v-icon>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
import {QuestionResult, SliderResult} from "@/types/scenarioUserStatistic.ts";
import {onBeforeMount} from "vue";
import {roundNumberToTwoDecimals} from "@/utils/helper.ts";

interface Props {
  questionResult: QuestionResult,
}

const props = defineProps<Props>();
let sliderResult: SliderResult;

onBeforeMount(() => {
  if (props.questionResult.type === 'Slider') {
    sliderResult = props.questionResult.resultData as SliderResult;
  }
})
</script>