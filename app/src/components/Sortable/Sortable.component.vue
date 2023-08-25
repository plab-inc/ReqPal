<script lang="ts" setup>
import {HTML5Backend} from "react-dnd-html5-backend";
import Container from "@/components/Sortable/Container.component.vue";
import {DndProvider} from "vue3-dnd";
import {Answer, Question} from "@/types/lesson.types";
import {ref} from "vue";
import {useLessonStore} from "@/stores/lesson.store";

interface Props {
  question: Question;
}

const props = defineProps<Props>();

const answers = [{id: 1, text: 'Aussage 1'}, {id: 2, text: 'Aussage 2'}, {id: 3, text: 'Aussage 3'},
  {id: 4, text: 'Aussage 4'}];

</script>

<template>

  <v-card>
    <v-container>
      <v-row>
        <v-col order="1" order-md="2" md="6" align-self="center" class="text-center">
          <h3>{{question.description}}</h3>
        </v-col>
        <v-col order="2" order-md="1" md="6">
          <DndProvider :backend="HTML5Backend">
            <Container :answers="answers"></Container>
          </DndProvider>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="">Submit</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>

</template>

<style lang="ts" scoped>

</style>