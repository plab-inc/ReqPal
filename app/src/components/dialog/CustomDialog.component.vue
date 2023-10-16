<template>
  <v-dialog v-model="openDialog" max-width="800px">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn color="error" @click="confirm">{{ confirmLabel }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const openDialog = ref<boolean>(true);

const props = defineProps({
  title: {
    type: String,
    default: "Warning"
  },
  message: {
    type: String,
    default: "Are you sure you want to proceed?"
  },
  confirmLabel: {
    type: String,
    default: "Confirm"
  }
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
</script>
