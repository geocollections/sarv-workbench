<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App"
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
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji,
    Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
}

/* Overlay must hide everything except app header which has z-index of 50000 */
/* Had to remove that because of dialog overlay and z index issues (basically multiple dialogs not working properly) */
.v-overlay--active {
  /*z-index: 49999 !important;*/
}
</style>
