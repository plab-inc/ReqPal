<script setup lang="ts">

import TrueOrFalse from "@/components/lesson/modules/TrueOrFalse.component.vue"
import Requirement from "@/components/catalog/requirement/Requirement.component.vue"
import MultipleChoice from "@/components/lesson/modules/MultipleChoice.component.vue"
import Slider from "@/components/lesson/modules/Slider.component.vue"
import Textfield from "@/components/lesson/modules/Textfield.component.vue"
import Notes from "@/components/lesson/modules/Notes.component.vue"
import Product from "@/components/lesson/modules/Product.component.vue"
import {useLessonStore} from "@/stores/lesson.store.ts";
import {useProfileStore} from "@/stores/profile.store.ts";
import {useAuthStore} from "@/stores/auth.store.ts";
import StatItem from "@/components/lesson/lessonResults/StatItem.component.vue";

const lessonStore = useLessonStore();
const currentLesson = lessonStore.getCurrentLesson;
const profileStore = useProfileStore();

interface ComponentsMap {
  [key: string]: Component;
}

const componentsMap: ComponentsMap = {
  'TrueOrFalse': markRaw(TrueOrFalse),
  'Requirement': markRaw(Requirement),
  'MultipleChoice': markRaw(MultipleChoice),
  'Slider': markRaw(Slider),
  'Textfield': markRaw(Textfield),
  'Note': markRaw(Notes),
  'Products': markRaw(Product),
};
const getComponentInstance = (componentName: string): Component => {
  return componentsMap[componentName];
};

function isRequirementOrTextfield(componentType: string): boolean {
  return componentType === 'Requirement' || componentType === 'Textfield';
}

onBeforeMount(async () => {
  const authStore = useAuthStore();
  if (authStore.user) {
    await profileStore.fetchPoints(authStore.user.id);
  }
})
</script>

<template>
  <v-container>

    <v-row class="mb-4 d-flex align-center">
      <v-col md="4">
        <div class="text-h3">Ergebnisse für Lektion:</div>
      </v-col>
      <v-col md="4">
        <StatItem :text="lessonStore.scoredPoints + '/' + currentLesson?.points + ' Punkten'"
                  :color="'success'"></StatItem>
      </v-col>
      <v-col md="4">
        <StatItem :text="profileStore.points + ' Gesamtpunktzahl'" :color="'primary'"></StatItem>
      </v-col>
    </v-row>

    <v-row class="mb-4">
      <v-col cols="10">
        <div class="text-h3">{{ currentLesson?.title }}</div>
        <div class="text-h5 mt-4">{{ currentLesson?.description }}</div>
      </v-col>
    </v-row>
  </v-container>

  <v-divider></v-divider>

  <v-row class="mt-4">
    <v-col>
      <v-container v-if="lessonStore.components.length > 0">
        <v-row v-for="question in lessonStore.components">
          <v-col class="my-2">
            <v-sheet
                :class="isRequirementOrTextfield(question.type) ? '' : 'pa-3'"
                rounded
                :elevation="isRequirementOrTextfield(question.type) ? '0' : '3'">
              <component
                  :is="getComponentInstance(question.type)"
                  :key="question.uuid"
                  :componentId="question.uuid"
              ></component>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>

</template>

<style scoped>

</style>
