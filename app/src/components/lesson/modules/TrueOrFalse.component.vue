<script setup lang="ts">

import {ref} from "vue";
import {booleanValueRule, noEmptyStringRule} from "@/utils/validationRules.ts";
import Hint from "@/components/lesson/modules/Hint.component.vue";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import Help from "@/components/lesson/modules/Help.component.vue";

interface Props {
  componentId: string,
}

const props = defineProps<Props>();
const submitted = ref(false);
let result: boolean | null;
const isFormValid = ref(false);
const rules = {
  requiredBool: booleanValueRule,
  requiredString: noEmptyStringRule
};

const lessonFormStore = useLessonFormStore();
const question = lessonFormStore.getComponentFieldValues(props.componentId, 'question')
const hint = lessonFormStore.getComponentFieldValues(props.componentId, 'hint')
const trueOrFalseExplanation =
    "In einer True or False Aufgabe ist das Ziel, zu entscheiden, ob eine Aussage wahr (True) oder falsch (False) ist. " +
    "Sie haben zwei Optionen zur Auswahl, und Ihre Aufgabe besteht darin, diejenige auszuwählen, die am besten zur Aussage passt. " +
    "Beachten Sie, dass dementsprechend nur eine Option ausgewählt werden kann. " +
    "Eine 'True' Auswahl bedeutet, dass die Aussage korrekt ist, während 'False' bedeutet, dass die Aussage nicht korrekt ist. " +
    "Bitte lesen Sie die Aussage sorgfältig durch und entscheiden Sie, ob sie wahr oder falsch ist."

const fields = ref<any>({
  options: lessonFormStore.getComponentFieldValues(props.componentId, 'options'),
});

function updateStoreData(fields: any) {
  lessonFormStore.setComponentData(props.componentId, 'options', fields.options);
}

watch(fields, (newFields) => {
  updateStoreData(newFields)
}, {deep: true});

</script>

<template>
  <v-card variant="flat">
    <v-container>
      <v-row>
        <v-col cols="10">
          <v-row>
            <v-col class="d-flex justify-start align-center">
              <div class="text-h6 text-md-h5 mr-2">True or False?</div>
              <Help title="True Or False Aufgabe: Erklärung" :text="trueOrFalseExplanation"></Help>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div class="text-h6">{{ question }}</div>
              <div class="text-h6" v-if="submitted">Solution:</div>
              <v-container>
                <v-form v-model="isFormValid" fast-fail>
                  <v-radio-group v-model="fields.options" :rules="[rules.requiredBool]">
                    <v-radio label="True" :value="true"
                             :class="{'disabled': submitted,'right': result === true, 'wrong': result === false}"></v-radio>
                    <v-radio label="False" :value="false"
                             :class="{'disabled': submitted, 'right': result === false, 'wrong': result === true}"></v-radio>
                  </v-radio-group>
                </v-form>
              </v-container>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2">
          <Hint v-if="hint" :hint="hint"></Hint>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

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
