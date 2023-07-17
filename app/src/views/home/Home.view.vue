<template>
  <h1>Willkommen auf der Lernplattform!</h1>

  <v-tabs centered color="grey-darken-2">
    <v-tab key="login" to="/login">
      <p>Login</p>
    </v-tab>
    <v-tab key="signup" to="/signup">
      <p>Sign Up</p>
    </v-tab>
    <v-tab key="resetPassword" to="/resetPassword">
      <p>Reset Password</p>
    </v-tab>
  </v-tabs>
</template>

<script setup lang="ts"></script>
