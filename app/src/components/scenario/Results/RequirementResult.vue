<template>
    <v-container>
      <v-row>
        <v-col>
          <v-row>
            <v-col cols="auto">
              <div class="text-h6 text-md-h5">Requirement</div>
            </v-col>
            <v-col cols="auto" class="d-flex flex-grow-1 justify-end mr-2" align-self="center">
              <div class="text-h5">
                {{ roundNumberToTwoDecimals(requirementResult.score) }} / {{ questionResult.questionData.points }}
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
                {{ totalCorrect }} / {{ requirementResult.productResults.length }} Richtig
                <v-icon v-if="totalCorrect > 0" class="mb-1" size="35" color="success"
                        :icon="'mdi-check-circle-outline'"></v-icon>
                <v-icon v-else class="mb-1" size="35" color="error"
                        :icon="'mdi-close-circle-outline'"></v-icon>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { QuestionResult, RequirementResult } from "@/types/scenarioUserStatistic.ts";
import { onBeforeMount } from "vue";
import { roundNumberToTwoDecimals } from "@/utils/helper.ts";

interface Props {
  questionResult: QuestionResult,
}

const props = defineProps<Props>();
let totalCorrect = 0;

let requirementResult: RequirementResult;

onBeforeMount(() => {
  if (props.questionResult.type === 'Requirement') {
    requirementResult = props.questionResult.resultData as RequirementResult;
    requirementResult.productResults.forEach(r => {
      if (r.correct) {
        totalCorrect++;
      }
    })
  }
})
</script>