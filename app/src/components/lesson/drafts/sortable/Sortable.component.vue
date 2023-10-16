<script lang="ts" setup>
import {HTML5Backend} from "react-dnd-html5-backend";
import Container from "@/components/lesson/drafts/sortable/Container.component.vue";
import {DndProvider} from "vue3-dnd";
import {Question, SortableAnswer} from "@/types/lesson.types.ts";
import {SortableDragItem} from "@/interfaces/DragItems.interfaces.ts";
import {shuffleArray} from "@/utils/helper.ts";
import {useLessonStore} from "@/stores/lesson.store.ts";
import {ref} from "vue";

interface Props {
  question: Question;
}

const props = defineProps<Props>();
const lessonStore = useLessonStore();
const submitted = ref(false);

const answers: SortableDragItem[] = [{id: '1', text: 'Aussage 1'},
  {id: '2', text: 'Aussage 2'},
  {id: '3', text: 'Aussage 3'},
  {id: '4', text: 'Aussage 4'}];

const submitAnswers = () => {
  const results: SortableAnswer[] = [];
  answers.forEach((answer, index) => {
    results.push({
      id: answer.id,
      description: answer.text,
      order: index
    });
  });
  submitted.value = true;
};

onBeforeMount(() => {
  shuffleArray(answers);
})
</script>

<template>
  <v-card>
    <v-container>
      <div class="text-h6" v-if="submitted">Whole answer is correct: {{ question.userResults?.wholeAnswerIsCorrect }}</div>
      <v-form @submit.prevent="submitAnswers" fast-fail>
        <v-row>
          <v-col order="1" order-md="2" md="6" align-self="center" class="text-center">
            <h3>{{ question.description }}</h3>
          </v-col>
          <v-col order="2" order-md="1" md="6">
            <DndProvider :backend="HTML5Backend">
              <Container :answers="answers" :allow-drag-and-drop="!submitted"></Container>
            </DndProvider>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn type="submit" :disabled="submitted">Submit</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-card>
</template>

<style scoped>
</style>