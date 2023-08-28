<script lang="ts" setup>
import {HTML5Backend} from "react-dnd-html5-backend";
import Container from "@/components/Sortable/Container.component.vue";
import {DndProvider} from "vue3-dnd";
import {Question} from "@/types/lesson.types";
import {DragItem} from "@/interfaces/Sortable.interfaces";
import {shuffleArray} from "@/utils/helper";

interface Props {
  question: Question;
}

const props = defineProps<Props>();

const answers : DragItem[] = [{id: '123', text: 'Aussage 1', order: 0}, {id: '32', text: 'Aussage 2', order: 0}, {id: '54', text: 'Aussage 3', order: 0},
  {id: '12', text: 'Aussage 4', order: 0}];

const submitAnswers = () => {
  console.log("ERGEBNISSE:");
  answers.forEach(answer => {
    console.log(answer.text + ' ' + answer.order);
  });
};

onBeforeMount(() => {
  shuffleArray(answers);
  answers.forEach((answer, index) => {
    answer.order = index;
    console.log(answer?.text + " " + answer?.order)
  });
})
</script>

<template>

  <v-card>
    <v-container>
      <v-row>
        <v-col order="1" order-md="2" md="6" align-self="center" class="text-center">
          <h3>{{ question.description }}</h3>
        </v-col>
        <v-col order="2" order-md="1" md="6">
          <DndProvider :backend="HTML5Backend">
            <Container :answers="answers"></Container>
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

<style lang="ts" scoped>

</style>