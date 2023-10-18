<template>
  <v-card variant="flat">
    <v-container>
      <v-row>
        <v-col cols="10">
          <div class="text-h6 text-md-h5">True Or False?</div>
          <div class="text-h6">{{ question }}</div>
          <div class="text-h6" v-if="submitted">Solution:</div>
          <v-container>
            <v-form fast-fail>
              <v-radio-group v-model="selectedAnswer" :rules="[rules.requiredBool]">
                <v-radio label="True" v-bind:value="true"
                         :class="{'disabled': submitted,'right': result === true, 'wrong': result === false}"></v-radio>
                <v-radio label="False" v-bind:value="false"
                         :class="{'disabled': submitted, 'right': result === false, 'wrong': result === true}"></v-radio>
              </v-radio-group>
            </v-form>
          </v-container>
        </v-col>
        <v-col cols="2">
          <Hint v-if="hint" :hint="hint"></Hint>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {requiredBooleanRule} from "@/utils/validationRules.ts";
import Hint from "@/components/lesson/modules/Hint.component.vue";

interface Props {
  componentId: number,
  question: string | any,
  options: any,
  hint: string | any,
}

const props = defineProps<Props>();
const selectedAnswer = ref<boolean>();
const submitted = ref(false);
let result: boolean | null;

const isFormValid = ref(false);
const rules = {
  requiredBool: requiredBooleanRule
};

async function submitAnswers(): Promise<void> {
  //TODO
}

</script>

<style scoped>
.right {
  color: #52ff52;
  font-weight: bold;
}

.wrong {
  color: #ff4b4b;
  font-weight: bold;
}

.disabled {
  cursor: not-allowed;
  pointer-events: none;
}
</style>