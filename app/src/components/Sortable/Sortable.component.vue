<script lang="ts" setup>
import {HTML5Backend} from "react-dnd-html5-backend";
import Container from "@/components/Sortable/Container.component.vue";
import {DndProvider} from "vue3-dnd";

</script>

<template>
  <h3>Sortable Component</h3>
  <DndProvider :backend="HTML5Backend">
    <Container></Container>
  </DndProvider>
</template>

<style lang="ts" scoped>

</style>