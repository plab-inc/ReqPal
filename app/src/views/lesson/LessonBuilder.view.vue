<script setup lang="ts">

  import LessonBuilder from "@/components/LessonBuilder/LessonBuilder.component.vue";
  import {HTML5Backend} from "react-dnd-html5-backend";
  import {DndProvider} from "vue3-dnd";
  import LessonModuleBox from "@/components/LessonBuilder/LessonModuleBox.component.vue";
  import {useLessonFormStore} from "@/stores/lessonForm.store.ts";

  const templates = ['Requirement','TrueOrFalse', 'Multiple Choice']
  const LessonBuilderRef = ref<InstanceType<typeof LessonBuilder> | null>(null);

  const lessonBuilderStore = useLessonFormStore();

</script>

<template>
  <DndProvider :backend="HTML5Backend">
    <v-container>
      <v-row>
        <v-col cols="10">
          <LessonBuilder ref="LessonBuilderRef"/>
        </v-col>
        <v-col cols="2">
          <v-card>
            <v-container>
              <v-row>
                <v-col v-for="template in templates" :key="template">
                  <LessonModuleBox :title="template"/>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
          <v-container>
            <v-row>
              <v-col>
                <v-btn block disabled @click="lessonBuilderStore.clearComponents()">Reset</v-btn>
              </v-col>
              <v-col>
                <v-btn block @click="console.log(lessonBuilderStore.componentsToJSON())">Save</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </DndProvider>
</template>