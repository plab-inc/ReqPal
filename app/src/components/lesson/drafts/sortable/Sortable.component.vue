<script lang="ts" setup>
import {HTML5Backend} from "react-dnd-html5-backend";
import Container from "@/components/lesson/drafts/sortable/Container.component.vue";
import {DndProvider} from "vue3-dnd";
import {QuestionDTO} from "@/types/lesson.types.ts";
import {SortableDragItem} from "@/types/drag.types.ts";
import {shuffleArray} from "@/utils/helper.ts";
import {ref} from "vue";

interface Props {
  question: QuestionDTO;
}

const props = defineProps<Props>();
const submitted = ref(false);

const answers: SortableDragItem[] = [{id: '1', text: 'Aussage 1'},
  {id: '2', text: 'Aussage 2'},
  {id: '3', text: 'Aussage 3'},
  {id: '4', text: 'Aussage 4'}];


onBeforeMount(() => {
  shuffleArray(answers);
})
</script>

<template>
  <v-card>
    <v-container>
      <v-form fast-fail>
        <v-row>
          <v-col order="1" order-md="2" md="6" align-self="center" class="text-center">
            <h3>{{ question.question }}</h3>
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