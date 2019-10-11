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
html,
body {
  height: 100%;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  color: #2c3e50;
}

/* Overlay must hide everything except app header which has z-index of 50000 */
.v-overlay--active {
  z-index: 49999 !important;
}
</style>
