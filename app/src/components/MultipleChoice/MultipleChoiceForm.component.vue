<script setup lang="ts">

import {ref} from "vue";
import {booleanValueRule, noEmptyStringRule} from "@/utils/validationRules";

import {mcAnswer} from "@/types/lesson.types";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import AlertService from "@/services/alert.service.ts";

const minAnswers = 3;
const maxAnswers = 10;

const props = defineProps<{ componentId: number }>();

const isFormValid = ref(false);
const rules = {
  requiredBool: booleanValueRule,
  requiredString: noEmptyStringRule
};

const answers = ref<mcAnswer[]>([]);
for (let i = 0; i < minAnswers; i++) {
  addAnswer();
}

function addAnswer() {
  answers.value.push({id: -1, description: "", solution: false});
}

function removeAnswer(index: number) {
  answers.value.splice(index, 1);
}

const lessonFormStore = useLessonFormStore();

const fields = ref({
  question: lessonFormStore.getComponentFieldValues(props.componentId, 'question'),
  hint: lessonFormStore.getComponentFieldValues(props.componentId, 'hint')
});

watch(fields, (newFields) => {
  lessonFormStore.setComponentData(props.componentId, 'question', newFields.question);
  lessonFormStore.setComponentData(props.componentId, 'hint', newFields.hint);
}, {deep: true});

watch(answers, (newAnswers) => {
  newAnswers.forEach((a, index) => a.id = index)
  const filteredAnswers = newAnswers.filter(a => a.description.trim() !== '');
  const newDataJson = JSON.stringify(filteredAnswers);
  lessonFormStore.setComponentData(props.componentId, 'solution', newDataJson);
}, {deep: true});

onBeforeMount(() => {
  const answerJson = lessonFormStore.getComponentFieldValues(props.componentId, 'solution');
  if (typeof answerJson === 'string' && answerJson) {
    try {
      const parsedAnswers = JSON.parse(answerJson);
      if (Array.isArray(parsedAnswers) && parsedAnswers.length > 0) {
        answers.value = parsedAnswers;
      }
    } catch (error) {
      AlertService.addErrorAlert('Antworten konnten nicht geladen werden: ' + error);
    }
  }
})

</script>

<template>
  <v-container>
    <v-form v-model="isFormValid">
      <v-text-field
          v-model="fields.question"
          label="Multiple Choice Frage"
          :rules="[rules.requiredString]"
      ></v-text-field>

      <v-row>
        <v-col md="10" order="2" order-md="1">
          <div v-for="(answer, index) in answers" :key="index">
            <v-row>
              <v-col md="7">
                <v-text-field
                    v-model="answer.description"
                    :label="'Antwort ' + (index + 1)"
                    :rules="[rules.requiredString]"
                ></v-text-field>
              </v-col>
              <v-col md="3" sm="8">
                <v-radio-group v-model="answer.solution" :rules="[rules.requiredBool]" label="Lösung der Antwort:">
                  <v-radio label="Richtig" v-bind:value="true"></v-radio>
                  <v-radio label="Falsch" v-bind:value="false"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col md="2" sm="4">
                <v-btn v-if="index >= minAnswers" @click="removeAnswer(index)">
                  <v-icon>
                    mdi-delete
                  </v-icon>
                  Entfernen
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col md="2" order="1" order-md="2">
          <v-text-field
              label="Hinweis"
              v-model="fields.hint"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-btn v-if="answers.length < maxAnswers" @click="addAnswer" class="mt-4">
        <v-icon>
          mdi-plus
        </v-icon>
        Antwort
      </v-btn>
    </v-form>
  </v-container>
</template>

<style scoped>
</style>