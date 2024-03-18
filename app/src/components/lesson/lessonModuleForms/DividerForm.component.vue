<script setup lang="ts">
import Help from "@/components/lesson/lessonBuilder/Help.component.vue";
</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col cols="11">
        <v-divider color="warning"/>
      </v-col>
      <v-col cols="1" class="d-flex flex-grow-1 align-end justify-end">
        <Help dialog-type="dividerTeacherExplanation"></Help>
      </v-col>
    </v-row>
  </v-container>
</template>