<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      {{ 'Neues Szenario erstellen' }}
    </v-col>
    <v-col cols="auto">
      <v-btn-group
        elevation="3"
        variant="outlined"
        rounded
        divided
      >
        <v-btn color="warning" text="Hinweise"/>
        <v-btn color="error" text="Zurücksetzen" @click="scenarioFromStore.flushScenario()"/>
        <v-btn color="success" text="Szenario Speichern" @click="scenarioFromStore.saveScenario()"/>
      </v-btn-group>
    </v-col>
  </v-row>
  <v-divider></v-divider>
  <v-container>
    <v-form>
      <v-row no-gutters>
        <v-col cols="12">
          <v-text-field
            clearable
            v-model="scenarioFromStore.title"
            :rules="[requiredStringRule, requiredUniqueLessonTitleRule]"
            label="Titel des Szenarios"
            variant="outlined"
          ></v-text-field>
          <v-text-field
            clearable
            v-model="scenarioFromStore.description"
            label="Beschreibung des Szenarios"
            :rules="[requiredStringRule]"
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">
          <v-card>
            <Modeler ref="modelerRef"/>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import Modeler from "@/components/scenario/ScenarioModeler.vue";
import { requiredStringRule, requiredUniqueLessonTitleRule } from "@/utils/validationRules.ts";
import { scenarioModelerStore } from "@/stores/scenarioModeler.ts";

const scenarioFromStore = scenarioModelerStore();
</script>