<script setup lang="ts">

import {useAuthStore} from "@/stores/auth.store.ts";
import {useLessonStore} from "@/stores/lesson.store.ts";
import {useProfileStore} from "@/stores/profile.store.ts";

const lessonStore = useLessonStore();
const currentLesson = lessonStore.getCurrentLesson?.lessonDTO;
const userScore = lessonStore.getCurrentLesson?.userScore;
const profileStore = useProfileStore();
const fullScore = ref<boolean>(false);

const newScore = ref<number>(0);
const finishedForFirstTime = ref<boolean>(true);

if (userScore && currentLesson) {
  fullScore.value = userScore >= currentLesson.points;
}

onBeforeMount(async () => {
  const authStore = useAuthStore();
  if (authStore.user && currentLesson) {
    await profileStore.fetchPoints(authStore.user.id);
    newScore.value = await lessonStore.getUserResultsForLesson(currentLesson.uuid);
    const data = await lessonStore.checkLessonFinishedForFirstTime(currentLesson.uuid);
    if (data !== null && data !== undefined) finishedForFirstTime.value = data;
  }
})
</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <div class="text-h5">Statistiken</div>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row class="mt-10">
        Stats
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>

</style>