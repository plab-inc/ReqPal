<script setup lang="ts">
import Help from "@/components/lesson/modules/Help.component.vue";
</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col cols="11">
        <v-divider color="warning"/>
      </v-col>
      <v-col cols="1" class="d-flex flex-grow-1 align-end justify-end">
        <div class="mr-2">
          <Help dialog-type="dividerTeacherExplanation"></Help>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>