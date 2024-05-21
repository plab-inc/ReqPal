<script setup lang="ts">

import Container from "@/components/drafts/lesson/dragAndDrop/Container.vue";
import CustomDragLayer from "@/components/drafts/lesson/dragAndDrop/CustomDragLayer.vue";
import {useContainerStore} from "@/stores/container.ts";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "vue3-dnd";

const boxStore = useContainerStore();

interface Props {
  dropFields?: string[];
  answers?: string[];
  answerContainerHeightPx?: number;
}

const props = withDefaults(defineProps<Props>(), {
  dropFields: () => ['DropFieldA', 'DropFieldB', 'DropFieldC'],
  answers: () => ['AnswerA', 'AnswerB', "AnswerC"],
  answerContainerHeightPx: 350
});

const firstContainerHeight = ref(props.answerContainerHeightPx);
const otherContainerHeight = computed(() => firstContainerHeight.value / 2);

</script>

<template>

  <DndProvider :backend="HTML5Backend">
    <v-container>
      <v-card>
        <v-container>
          <v-row no-gutters>
            <v-col>
              <Container :box-titles="answers" container-id="Answers" title="Antworten"
                         :style="{ height: `${firstContainerHeight}px` }"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col
                v-for="(field, index) in dropFields"
                :key="index"
                cols="12" sm="6" md="4"
                class="drop-field"
            >
              <Container :container-id="field" :title="field" :style="{ height: `${otherContainerHeight}px` }"/>
            </v-col>
          </v-row>
          <CustomDragLayer/>
          <v-row align="center">
            <v-col>
              <v-btn color="primary" @click="console.log(boxStore.getAnswersInContainers())" block>Print to Console
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-container>
  </DndProvider>

</template>

<style scoped>

</style>