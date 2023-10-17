<script setup lang="ts">

import {useLessonFormStore} from "@/stores/lessonForm.store.ts";

interface Props {
  componentId: string,
}

const props = defineProps<Props>();

const lessonFormStore = useLessonFormStore();

const fields = ref<any>({
  options: lessonFormStore.getComponentFieldValues(props.componentId, 'options'),
});
</script>

<template>
  <v-card variant="outlined">
    <v-card-text class="text-h5">
      {{ fields.options }}
    </v-card-text>
  </v-card>
</template>
