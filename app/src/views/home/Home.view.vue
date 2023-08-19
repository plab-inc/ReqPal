<template>
  <v-container>
    <v-row class="mt-4">
      <v-parallax style="max-height: 500px" src="@/assets/images/janko-ferlic-sfL_QOnmy00-unsplash.jpg">
        <div class="d-flex flex-column fill-height justify-center align-center text-white">
          <h1 class="text-h4 font-weight-thin mb-4">
            Willkommen auf der Lernplattform
          </h1>
          <h4 class="subheading">
            Start learning today!
          </h4>
        </div>
      </v-parallax>
    </v-row>

    <v-row class="my-12">
      <v-col md="8">
        <v-card class="mb-6">
          <v-card-title class="text-h6 text-md-h5 text-lg-h4">Eine interaktive Lernplattform!</v-card-title>
          <v-card-text class="text-subtitle-1">
            Diese Lernplattform bietet eine moderne und benutzerfreundliche Umgebung, um Wissen auf eine unterhaltsame
            und
            interaktive Weise zu vermitteln. Hier werden spannende Möglichkeiten angeboten, um Fähigkeiten im Bereich
            der
            Wirtschaftsinformatik zu erweitern und neue Horizonte zu entdecken.
            Die verschiedenen Aufgaben richten sich an Lernende mit unterschiedlichen Vorkenntnissen, so dass für jeden
            etwas dabei ist.
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="4">
        <v-img
            src="@/assets/images/tim-mossholder-WE_Kv_ZB1l0-unsplash.jpg"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col md="4">
        <v-img
            src="@/assets/images/maya-maceka-yW-Qgw_IJXg-unsplash.jpg"
        />
      </v-col>
      <v-col md="8">
        <v-card class="mb-6">
          <v-card-title class="text-h6 text-md-h5">Merkmale</v-card-title>
          <v-card-text class="text-subtitle-1">
            <ul class="list-disc pl-6 mb-4 text-subtitle-1">
              <li>Vielfältige Kursauswahl</li>
              <li>Interaktive Lernmethoden</li>
              <li>Flexible Lernzeiten</li>
              <li>Kostenlos</li>
            </ul>
            Beachte, dass für die volle Funktionalität der Anwendung, ein Account mit Nutzernamen und Passwort benötigt
            wird.
            Ein Account kann hier kostenlos angelegt werden, so dass direkt durchgestartet werden kann!
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
