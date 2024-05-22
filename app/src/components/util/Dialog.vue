<script setup lang="ts">

import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "Warnung"
  },
  message: {
    type: String,
    default: "Wollen Sie wirklich fortfahren?"
  },
  confirmLabel: {
    type: String,
    default: "Fortfahren"
  },
  cancelLabel: {
    type: String,
    default: "Abbrechen"
  },
  modelValue: {
    type: Boolean,
    default: true
  },
  onlyConfirmButton: {
    type: Boolean,
    default: false
  },
});
const emit = defineEmits();

function cancel() {
  openDialog.value = false;
  emit('cancel');
}

function confirm() {
  openDialog.value = false;
  emit('confirm');
}

const openDialog = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
openDialog.value = props.modelValue;
</script>

<template>
  <v-dialog @click:outside="cancel" v-model="openDialog" max-width="800px">
    <v-card variant="elevated" class="pa-4">
      <v-row>
        <v-col cols="1" class="d-flex align-center">
          <v-icon class="ml-2" icon="mdi-information" size="60"></v-icon>
        </v-col>
        <v-col cols="11" class="d-flex align-center">
          <v-card-title>{{ title }}</v-card-title>
        </v-col>
      </v-row>

      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="!onlyConfirmButton" color="success" @click="cancel">{{ cancelLabel }}</v-btn>
        <v-btn color="warning" @click="confirm">{{ confirmLabel }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

