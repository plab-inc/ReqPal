<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.store.ts";
import {useProfileStore} from "@/stores/profile.store.ts";
import {useAuthStore} from "@/stores/auth.store.ts";
import StatItem from "@/components/lesson/lessonResults/StatItem.component.vue";
import LessonQuestions from "@/components/lesson/lessonGenerator/LessonQuestions.component.vue";
import alertService from "@/services/util/alert.service.ts";
import router from "@/router";
import AlertService from "@/services/util/alert.service.ts";
import ScoreOverview from "@/components/lesson/lessonResults/ScoreOverview.component.vue";

const lessonStore = useLessonStore();
const currentLesson = lessonStore.getCurrentLesson?.lessonDTO;
const isFinished = lessonStore.getCurrentLesson?.isFinished;
const profileStore = useProfileStore();

const finishedForFirstTime = ref<boolean>(true);

async function resetLesson() {
  if (lessonStore.currentLesson) {
    try {
      await lessonStore.restartLessonForUser(lessonStore.currentLesson.lessonDTO.uuid);
      await router.push({name: 'Lessons'});
    } catch (error: any) {
      AlertService.addErrorAlert("Fehler beim Zurücksetzen: " + error.message);
    }
  }
}

onBeforeMount(async () => {
  const authStore = useAuthStore();
  if (authStore.user && currentLesson) {
    await profileStore.fetchPoints(authStore.user.id);
    const data = await lessonStore.checkLessonFinishedForFirstTime(currentLesson.uuid);
    if (data !== null && data !== undefined) finishedForFirstTime.value = data;
  }
})
</script>

<template>
  <v-container v-if="!isFinished">
    <div class="text-h2">Diese Lektion wurde noch nicht bearbeitet!</div>
  </v-container>

  <div v-else>
    <v-container>
      <v-row>
        <v-col md="9">
          <div class="text-h3">Ergebnisse</div>
          <div class="text-h3 mt-4">{{ currentLesson?.title }}</div>
          <div class="text-h5 mt-4">{{ currentLesson?.description }}</div>
        </v-col>
        <v-col md="3">
          <v-row>
            <v-col>
              <StatItem :text="profileStore.points + ''" :color="'primary'"></StatItem>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <ScoreOverview class="my-5"></ScoreOverview>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="d-flex justify-end my-2">
          <v-btn color="warning" class="mr-2" @click="alertService.addHelpDialog('resetLesson', resetLesson)">Nochmal
            bearbeiten
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>

    <v-row class="mt-4">
      <v-col>
        <LessonQuestions></LessonQuestions>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>

</style>
