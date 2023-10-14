<script setup lang="ts">
import Notes from "@/components/Notes/Notes.component.vue";
import {requiredRule} from "@/utils/validationRules.ts";

const text = ref<string>("");
const rules = {
  required: requiredRule
};
</script>

<template>
  <div class="text-subtitle-1">{{ 'Füge hier einen Titel oder eine Beschreibung zur Aufgabe hinzu.' }}</div>
  <Notes v-model="text" :rules="[rules.required]" :textLabel="'Beschreibung'"></Notes>
</template>
