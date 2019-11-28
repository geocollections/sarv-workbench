<template>
  <div class="accessibility">
    <v-row no-gutters>
      <v-col class="mx-2 vuetify-checkbox">
        <v-checkbox
          hide-details class="mt-0 mb-2" :ripple="false" :color="bodyActiveColor" v-model="showRecentUrls">
          <template v-slot:label>
            <span class="mr-1">Show recent URLs:</span>
            <span class="font-weight-bold">{{ showRecentUrls }}</span>
          </template>
        </v-checkbox>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="mx-2">
        <span
          >Zoom level: <span class="font-weight-bold">{{ zoom }}</span></span
        >
        <v-radio-group
          v-model="zoom"
          row
          class="zoom-radios"
          messages="Use with caution, may break some elements"
        >
          <v-radio
            v-for="entity in zoomOptions"
            :key="entity.value"
            :label="entity.text"
            :value="entity.value"
            class="mb-2"
            :dark="bodyDark"
            :color="bodyActiveColor"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "Accessibility",
  props: {
    bodyDark: {
      type: Boolean,
      required: false,
      default: false
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "black"
    }
  },
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
  computed: {
    ...mapState(["recentUrlsState"]),
    showRecentUrls: {
      get() {
        return this.recentUrlsState;
      },

      set(value) {
        this.$store.dispatch("updateRecentUrlsState", value);
      }
    }
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
