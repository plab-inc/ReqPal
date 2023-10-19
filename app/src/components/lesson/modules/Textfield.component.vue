<script setup lang="ts">
import {useLessonStore} from "@/stores/lesson.store.ts";

interface Props {
  componentId: string,
}

const props = defineProps<Props>();

const lessonStore = useLessonStore();

const fields = ref<any>({
  options: lessonStore.getComponentFieldValues(props.componentId, 'options'),
});
</script>

<template>
  <v-card variant="outlined">
    <v-card-text class="text-h5">
      {{ fields.options }}
    </v-card-text>
  </v-card>
</template>
