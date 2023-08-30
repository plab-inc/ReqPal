<script lang="ts" setup>
import {HTML5Backend} from "react-dnd-html5-backend";
import Container from "@/components/Sortable/Container.component.vue";
import {DndProvider} from "vue3-dnd";
import {Question, SortableAnswer} from "@/types/lesson.types";
import {DragItem} from "@/interfaces/Sortable.interfaces";
import {shuffleArray} from "@/utils/helper";
import {useLessonStore} from "@/stores/lesson.store";
import {ref} from "vue";

interface Props {
  question: Question;
}

const props = defineProps<Props>();
const lessonStore = useLessonStore();
const submitted = ref(false);

const answers: DragItem[] = [{id: '1', text: 'Aussage 1'},
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
  lessonStore.compareUserSortableAnswers(results, props.question.id);
  submitted.value = true;
};

onBeforeMount(() => {
  shuffleArray(answers);
})
</script>

<template>
  <v-card>
    <v-container>
      <h3 v-if="submitted">Whole answer is correct: {{ question.userResults?.wholeAnswerIsCorrect }}</h3>
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
          <v-btn @click="submitAnswers">Submit</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<style scoped>
</style>