<script setup lang="ts">
import Help from "@/components/lesson/builder/helper/Help.vue";
import Delete from "@/components/lesson/builder/helper/Delete.vue";

const props = defineProps<{ componentId: string }>();
</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col cols="11">
        <v-divider color="warning"/>
      </v-col>
      <v-col cols="1" class="d-flex align-center">
        <Help dialog-type="dividerTeacherExplanation"/>
        <div class="mx-1"/>
        <Delete :component-id="props.componentId"/>
      </v-col>
    </v-row>
  </v-container>
</template>