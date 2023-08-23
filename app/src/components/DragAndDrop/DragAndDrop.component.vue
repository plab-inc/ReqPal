<script setup lang="ts">

import Container from "@/components/DragAndDrop/Container.component.vue";
import { useContainerStore } from "@/stores/DragAndDrop/container.store";

const boxStore = useContainerStore();

interface Props {
  dropFields?: string[];
  answers?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  dropFields: () => ['TestA', 'TestB', 'TestC'],
  answers: () => ['TestA', 'TestB'],
});

</script>

<template>

  <v-container>
    <v-card>
      <v-container ref="containerRef">

        <Container :box-titles="answers" container-id="Answers" class="above-fields"/>

        <div class="drop-fields">
          <Container
              v-for="(field) in dropFields"
              :container-id="field"
              class="drop-field"
          />
        </div>
      </v-container>
    </v-card>
  </v-container>

</template>

<style scoped>

.above-fields {
  width: 100%;
  text-align: center;
  height: 300px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.drop-fields {
  display: flex;
}

.drop-field {
  flex: 1;
  padding: 50px;
  border: 1px solid #ccc;
  text-align: center;
}
</style>