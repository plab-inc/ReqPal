<template>
  <v-data-table-virtual
    :v-model="lessonStore.getLessons"
    v-model:expanded="expanded"
    :headers="authStore.isModerator ? headersModerator : headers"
    :items="filters.includes('showOnlyOwn') ? filteredLessons : lessons"
    item-value="lessonDTO.uuid"
    select-strategy="all"
    hover
    height="75vh"
    no-data-text="Sie haben noch keine Lektionen erstellt."
  >
    <template v-slot:item.objectives="{ item }">
      <v-chip v-for="objective in item.objectives"
              prepend-icon="mdi-trophy"
              density="comfortable"
              variant="outlined"
              elevation="3" class="mr-1"
              @click="router.push({name: 'Objectives'})"
      >
        {{ objective.name }}
      </v-chip>
    </template>

    <template v-slot:item.creatorUsername="{ item }">
      <v-chip
        :prepend-avatar="'avatars/' + item.creatorAvatar + '.png'"
        elevation="8"
      >
        {{ item.creatorUsername }}
      </v-chip>
    </template>

    <template v-slot:item.actions="{ item }">
      <div>
        <v-tooltip text="Vorschau der Lektion" location="left">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              color="info"
              variant="plain"
              size="small"
              icon="mdi-eye-outline"
              @click.stop="openLessonDetails(item)"
            />
          </template>
        </v-tooltip>
        <v-tooltip text="Lektion in Builder kopieren" location="top">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              color="success"
              variant="plain"
              size="small"
              icon="mdi-content-copy"
              @click.stop="copyLesson(item)"
            />
          </template>
        </v-tooltip>
        <v-tooltip text="Lektion bearbeiten" location="top">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              color="success"
              variant="plain"
              size="small"
              icon="mdi-pencil"
              @click.stop="editLesson(item)"
            />
          </template>
        </v-tooltip>
        <v-tooltip text="Lektion löschen" location="top">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              color="error"
              variant="plain"
              size="small"
              icon="mdi-delete"
              @click.stop="deleteLesson(item)"
            />
          </template>
        </v-tooltip>
      </div>
    </template>
  </v-data-table-virtual>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useUtilStore } from "@/stores/util.ts";
import { DeleteLesson } from "@/utils/dialogs.ts";
import { useLessonStore } from "@/stores/lesson.ts";
import { Lesson } from "@/types/lesson.ts";
import lessonService from "@/services/database/lesson.ts";
import router from "@/router";
import { useLessonFormStore } from "@/stores/lessonForm.ts";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "@/stores/auth.ts";

const lessonStore = useLessonStore();
const lessonFormStore = useLessonFormStore();
const authStore = useAuthStore();
const utilStore = useUtilStore();
const expanded = ref<any>([]);

const props = defineProps<{ filters: string[] }>();
const lessons = lessonStore.getLessons;

const headers = ref([
  { title: "Titel", value: "lessonDTO.title", sortable: true, width: "auto", align: "start" },
  { title: "Beschreibung", value: "lessonDTO.description", sortable: true, width: "auto", align: "center" },
  { title: "Lernziele", value: "objectives", sortable: true, width: "auto", align: "center" },
  { title: "Punkte", value: "lessonDTO.points", sortable: true, width: "auto", align: "center" },
  { title: "Aktionen", value: "actions", sortable: false, width: "auto", align: "end" }
] as const);

const headersModerator = ref([
  { title: "Titel", value: "lessonDTO.title", sortable: true, width: "auto", align: "start" },
  { title: "Beschreibung", value: "lessonDTO.description", sortable: true, width: "auto", align: "center" },
  { title: "Lernziele", value: "objectives", sortable: true, width: "auto", align: "center" },
  { title: "Punkte", value: "lessonDTO.points", sortable: true, width: "auto", align: "center" },
  { title: "Besitzer", value: "creatorUsername", sortable: true, width: "auto", align: "center" },
  { title: "Aktionen", value: "actions", sortable: false, width: "auto", align: "end" }
] as const);

const filteredLessons = computed(() => {
  if (props.filters.includes("showOnlyOwn")) {
    return lessons.filter(lesson =>
      lesson.lessonDTO.user_id === authStore.user?.id
    );
  }
  return lessons;
});

async function editLesson(item: Lesson) {
  await lessonService.pull.getLesson(item.lessonDTO.uuid).then((lesson) => {
    if (lesson) {
      lessonFormStore.hydrate(lesson);
      router.push({ path: "lesson/builder" });
    }
  });
}

async function copyLesson(item: Lesson) {
  await lessonService.pull.getLesson(item.lessonDTO.uuid).then((lesson) => {
    if (lesson) {
      lesson.uuid = uuidv4();
      lesson.questions.forEach((question) => {
        question.uuid = uuidv4();
      });
      lessonFormStore.hydrate(lesson);
      router.push({ path: "lesson/builder" });
    }
  });
}

async function openLessonDetails(lesson: Lesson) {
  await router.push({ name: "LessonTeacherOverview", params: { lessonUUID: lesson.lessonDTO.uuid } });
}

function deleteLesson(item: Lesson) {
  utilStore.openDialog(DeleteLesson, () => {
    lessonStore.deleteLesson(item.lessonDTO.uuid);
  });
}

</script>
