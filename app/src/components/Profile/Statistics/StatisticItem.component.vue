<template>
 <div :class="'container bg-'+color">
    <h1>{{text}}</h1>
 </div>
</template>

<script setup lang="ts">
interface Props {
  text: String,
  highlight: boolean
}

const props = defineProps<Props>();
let color : String = 'info';
if(props.highlight) {
  color = 'primary';
}

</script>
<style scoped>

.container {
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px 10px 10px 10px;
  margin: 10px 10px 10px 10px;
}

</style>
