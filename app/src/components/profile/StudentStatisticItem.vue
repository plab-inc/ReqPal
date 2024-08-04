<template>
  <v-card variant="elevated" :color="color ? color : 'primary'" max-height="250">
    <v-card-item>
      <v-row>
        <v-col sm="2" class="d-flex justify-center align-center">
          <v-icon size="35">{{ icon }}</v-icon>
        </v-col>
        <v-col sm="10">
          <v-card-title>
            {{ statisticValue }} {{ statisticUnit }}
          </v-card-title>
          <v-card-subtitle>
            {{ statisticTitel }}
          </v-card-subtitle>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  statisticValue: number,
  statisticUnit: string,
  statisticTitel: string,
  icon: string,
  color?: string
}

defineProps<Props>();

</script>