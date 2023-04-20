<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>
<style>
html {
  overflow-y: auto !important;
}
html,
body {
  height: 100%;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*height: 100%;*/
  /*color: #2c3e50;*/
  font-family: "Noto Sans", "Roboto", sans-serif;
}

/* Overlay must hide everything except app header which has z-index of 50000 */
/* Had to remove that because of dialog overlay and z index issues (basically multiple dialogs not working properly) */
.v-overlay--active {
  /*z-index: 49999 !important;*/
}

/**
 * Temporary fix for breaking change in Vuetify v-grid
 * (see : https://github.com/vuetifyjs/vuetify/issues/11408)
 * TODO - remove this after migration
 */
/*.row:not([class*="my-"]):not([class*="ma-"]):not([class*="mt-"]):not([class*="mb-"]) {*/
/*  margin-top: 0 !important;*/
/*  margin-bottom: 0 !important;*/
/*}*/
</style>
