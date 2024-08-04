<script setup lang="ts">
import Delete from "@/components/lesson/builder/helper/Delete.vue";
import PointsInput from "@/components/lesson/builder/helper/PointsInput.vue";
import Help from "@/components/lesson/builder/helper/Help.vue";
import {useLessonFormStore} from "@/stores/lessonForm.ts";
import {requiredStringRule} from "@/utils/validationRules.ts";
import {ref, watch} from "vue";

interface multipleChoiceAnswer {
  id: number,
  description: string,
  solution: boolean
}

const minAnswers = 3;
const maxAnswers = 6;

const props = defineProps<{ componentId: string }>();

const lessonFormStore = useLessonFormStore();

const fields = ref<any>({
  question: "",
  hint: "",
});

const answers = ref<multipleChoiceAnswer[]>([]);

init();

function init() {
  const storedOptions = lessonFormStore.getLessonModuleFieldValues(props.componentId, 'options') || {
    type: "MultipleChoice",
    answers: []
  };

  const storedSolutions = lessonFormStore.getLessonModuleFieldValues(props.componentId, 'solution') || {
    type: "MultipleChoice",
    answers: []
  };

  fields.value.question = lessonFormStore.getLessonModuleFieldValues(props.componentId, 'question');
  fields.value.hint = lessonFormStore.getLessonModuleFieldValues(props.componentId, 'hint');
  let initialAnswers = [];
  if (storedOptions.answers.length > 0 && storedSolutions.answers.length > 0) {
    initialAnswers = storedOptions.answers.map((option: any, index: number) => ({
      id: option.id,
      description: option.description,
      solution: storedSolutions.answers[index].solution
    }));
  } else {
    while (initialAnswers.length < minAnswers) {
      initialAnswers.push(createNewAnswer(initialAnswers.length));
    }
  }
  answers.value = initialAnswers;
  updateStoreData(answers.value);
}

function createNewAnswer(id: number): multipleChoiceAnswer {
  return {id, description: "", solution: false};
}

function updateStoreData(newAnswers: multipleChoiceAnswer[]) {
  const options = newAnswers.map(a => ({id: a.id, description: a.description.trim()}));
  const solutions = newAnswers.map(a => ({id: a.id, solution: a.solution}));

  lessonFormStore.setLessonModuleData(props.componentId, 'options', {type: "MultipleChoice", answers: options});
  lessonFormStore.setLessonModuleData(props.componentId, 'solution', {type: "MultipleChoice", answers: solutions});
}

function addAnswer() {
  answers.value.push(createNewAnswer(answers.value.length));
}

function removeAnswer(index: number) {
  answers.value.splice(index, 1);
}

watch(answers, updateStoreData, {deep: true});
watch(fields, (newFields) => {
  lessonFormStore.setLessonModuleData(props.componentId, 'question', newFields.question);
  lessonFormStore.setLessonModuleData(props.componentId, 'hint', newFields.hint);
}, {deep: true});

</script>

<template>
  <v-container>
    <v-text-field
        v-model="fields.question"
        label="Multiple Choice Frage"
        :rules="[requiredStringRule]"
    ></v-text-field>

    <v-row no-gutters>
      <v-col md="8">
        <v-row v-for="(answer, index) in answers" :key="index">
          <v-col md="7">
            <v-text-field
                v-model="answer.description"
                :label="'Antwort ' + (index + 1)"
                :rules="[requiredStringRule]"
            ></v-text-field>
          </v-col>
          <v-col md="3" sm="8">
            <v-radio-group v-model="answer.solution" label="Lösung der Antwort:">
              <v-radio label="Richtig" :value="true"></v-radio>
              <v-radio label="Falsch" :value="false"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col md="2" sm="4">
            <v-btn v-if="index >= minAnswers" @click="removeAnswer(index)" icon>
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col md="4">
        <v-text-field
            label="Hinweis"
            v-model="fields.hint"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-btn v-if="answers.length < maxAnswers" @click="addAnswer" class="mb-4" icon>
          <v-icon>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="2">
        <PointsInput :component-id="props.componentId" :answer-amount="answers.length"></PointsInput>
      </v-col>
      <v-col cols="10" class="d-flex flex-grow-1 align-center justify-end">
        <Help dialog-type="mcExplanation"/>
        <div class="mx-1"/>
        <Delete :component-id="props.componentId"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>