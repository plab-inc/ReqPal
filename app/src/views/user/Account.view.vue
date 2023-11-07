<template>
  <h1>Account</h1>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-select
            v-model="selectedAvatar"
            label="Avatar auswählen"
            :items="avatarOptions"
            item-title="name"
            item-value="name"
            prepend-icon="mdi-camera-account"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :prepend-avatar="item.raw.src" class="pa-2">
            </v-list-item>
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-text-field
            v-model="username"
            label="Benutzername"
            prepend-icon="mdi-account-edit"
            @blur="checkUsernameExists"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-text-field
            v-model="email"
            label="E-Mail"
            prepend-icon="mdi-email"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn @click="updateEmail" color="primary">Ändern</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8">
        <v-text-field
            v-model="oldPassword"
            type="password"
            label="Altes Passwort"
            prepend-icon="mdi-lock-check"
        ></v-text-field>
        <v-text-field
            v-model="password"
            type="password"
            label="Neues Passwort"
            prepend-icon="mdi-lock"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useProfileStore} from "@/stores/profile.store.js";
import {useAuthStore} from "@/stores/auth.store.ts";

const avatarOptions = [
  { name: 'Owl', src: 'avatars/owl.png' },
  { name: 'Cat', src: 'avatars/cat.png' },
  { name: 'Panda', src: 'avatars/panda.png' },
  { name: 'Squirrel', src: 'avatars/squirrel.png' },
];

const profileStore = useProfileStore();
const authStore = useAuthStore();
const selectedAvatar = ref('meh');

const username = ref(authStore.user?.user_metadata.username);
const email = ref(authStore.user?.email);
const oldPassword = ref('');
const password = ref('');


const checkUsernameExists = async () => {

};

const updateEmail = () => {

};

const updatePassword = () => {

};

const updateSettings = () => {

};

</script>
