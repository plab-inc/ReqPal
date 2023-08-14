<template>
  <v-card>
    <v-container>
      <h2>True Or False Test</h2>

      <p>{{ props.question.description }}</p>
      <p v-if="submitted">Lösung:</p>

      <v-btn @click="submitAnswers">Submit</v-btn>

    </v-container>
  </v-card>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {useLessonStore} from "@/stores/lesson.store";
import {Answer, Question} from "@/types/lesson.types";

interface Props {
  question: Question;
}

const props = defineProps<Props>();
const selectedAnswers = ref<boolean[]>([]);
const submitted = ref(false);
const lessonStore = useLessonStore();

async function submitAnswers(): Promise<void> {

}

onBeforeMount(async () => {

});

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