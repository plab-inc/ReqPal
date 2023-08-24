<template>
  <v-footer>
    <v-container>
      <v-row>
        <v-col sm="6" md="2">
          <div>
            <RouterLink :to="{name: 'Home'}" class="text-decoration-none text-primary">
              Lernplattform
            </RouterLink>
            <p>&copy; Projektarbeit 2023</p>
          </div>
        </v-col>
        <v-col sm="6" md="10">
          <p>Menu</p>
          <v-list density="compact">
            <v-list-item v-for="(link, index) in links" :key="index">
              <RouterLink :to="{ name: link.name}" class="text-decoration-none text-primary">{{
                  link.title
                }}
              </RouterLink>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import {links} from "@/types/navigationLinks.types";
</script>