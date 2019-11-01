<template>
  <v-app :style="{ zoom: accessibility.zoom === 1 ? 'unset' : + accessibility.zoom + ' !important' }">
    <router-view />
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapState(["accessibility"])
  },
  created() {
    let zoomLevel = this.$localStorage.get("SARV_APP_ZOOM_LEVEL", 1);
    if (zoomLevel) this.$store.dispatch("updateAppZoom", zoomLevel);
  }
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
  /*height: 100%;*/
  /*color: #2c3e50;*/
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
}

/* Overlay must hide everything except app header which has z-index of 50000 */
.v-overlay--active {
  z-index: 49999 !important;
}
</style>
