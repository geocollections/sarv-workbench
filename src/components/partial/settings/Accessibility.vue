<template>
  <div class="accessibility">
    <v-row no-gutters>
      <v-col class="mx-2">
        <span>Zoom level: <span class="font-weight-bold">{{ zoom }}</span></span>
        <v-radio-group v-model="zoom" row class="zoom-radios" messages="Use with caution, may break some elements">
          <v-radio
            v-for="entity in zoomOptions"
            :key="entity.value"
            :label="entity.text"
            :value="entity.value"
            class="mb-2"
            color="deep-orange"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Accessibility",
  data: () => ({
    zoom: 1,
    zoomOptions: [
      { value: 0.7, text: "70%" },
      { value: 0.8, text: "80%" },
      { value: 0.9, text: "90%" },
      { value: 1, text: "100%" },
      { value: 1.1, text: "110%" },
      { value: 1.2, text: "120%" },
      { value: 1.3, text: "130%" },
      { value: 1.4, text: "140%" },
      { value: 1.5, text: "150%" }
    ]
  }),
  created() {
    let zoomLevel = this.$localStorage.get("SARV_APP_ZOOM_LEVEL", 1);
    if (zoomLevel) this.zoom = zoomLevel;
  },
  watch: {
    zoom(newVal) {
      this.$localStorage.set("SARV_APP_ZOOM_LEVEL", newVal);
      this.$store.dispatch("updateAppZoom", newVal);
    }
  }
};
</script>

<style scoped>
.zoom-radios >>> label {
  margin-bottom: 0 !important;
}
</style>
