<template>
  <v-dialog
    :model-value="dialog"
    @update:model-value="close"
    opacity="0.3"
    max-width="900"
  >
    <v-sheet>
      <v-card
        variant="outlined">
        <v-card-title>
          Edit Requirement: {{ editedItem.requirement_id }}
        </v-card-title>
        <v-card-text>
          <div v-if="editedItem">
            <h3>{{ editedItem.title }}</h3>
            <p>{{ editedItem.description }}</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="close">Schließen</v-btn>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  dialog: Boolean,
  editedItem: Object,
});

const emit = defineEmits(["update:dialog"]);

function close() {
  emit('update:dialog', false);
}
</script>
