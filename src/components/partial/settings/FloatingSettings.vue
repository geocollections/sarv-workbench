<template>
  <v-menu
    v-model="settings"
    offset-x
    left
    nudge-top="15"
    nudge-left="15"
    z-index="50101"
    :close-on-click="false"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        fixed
        top
        right
        direction="left"
        style="top: 96px"
        fab
        color="red darken-2"
        dark
      >
        <v-icon v-if="settings">fas fa-times</v-icon>
        <v-icon v-else>fas fa-cog</v-icon>
      </v-btn>
    </template>

    <v-card class="text-center">
      <v-list>
        <v-list-item>
          <v-list-item-content class="justify-content-center">
            <v-list-item-title>NAVBAR</v-list-item-title>

            <v-radio-group v-model="navbarColor" row hide-details class="mt-1 mx-3">
              <v-radio class="mr-2" value="blue-grey" color="blue-grey" off-icon="fas fa-circle" on-icon="far fa-circle"></v-radio>
              <v-radio class="mr-2 green--text" value="green" color="green" off-icon="fas fa-circle green-button" on-icon="far fa-circle"></v-radio>
              <v-radio class="mr-2 red-button" value="red" color="red" off-icon="fas fa-circle" on-icon="far fa-circle"></v-radio>
            </v-radio-group>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>Sidebar right</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>Sidebar right active color</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>Sidebar left</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>Sidebar right active color</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: "FloatingSettings",
  data: () => ({
    settings: false,
    navbarColor: "blue-grey"
  })
};
</script>

<style>
  .green-button {
    color: green !important;
  }
</style>
