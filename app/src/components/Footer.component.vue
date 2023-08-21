<template>
  <v-footer>
    <v-container>
      <v-row>
        <v-col sm="6" md="2">
          <div class="text-body-1">
            <RouterLink :to="{name: 'Home'}" class="text-body-1 text-decoration-none text-primary">Lernplattform
            </RouterLink>
            <p>&copy; Projektarbeit 2023</p>
          </div>
        </v-col>
        <v-col sm="6" md="10">
          <p class="text-body-1">Menu</p>
          <v-list>
            <v-list-item v-for="(link, index) in links" :key="index">
              <RouterLink :to="{ name: link.name}" class="text-body-1 text-decoration-none text-primary">{{
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