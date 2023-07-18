<template>
    <h1>Lektionen</h1>
  <div>
    <MultipleChoice :question=question :answers=answers
    ></MultipleChoice>
  </div>
</template>
  
<script setup lang="ts">

import MultipleChoice from "@/components/MultipleChoice.component.vue";

const question = "Welche dieser Aussagen stimmen?"

const answers = [
  { text: "Option 1", right: false, id: 1 },
  { text: "Option 2", right: true, id: 2 },
  { text: "Option 3", right: false, id: 3 },
]

</script>
  