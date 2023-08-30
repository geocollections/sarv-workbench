<template>
  <div v-show="true" class="loading-overlay text-center">
    <v-progress-circular :size="118" color="blue" indeterminate>
    </v-progress-circular>
    <div class="mt-2 grey--text text--darken-3" style="font-size: 1.5rem">
      {{ spinnerMessage }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SpinnerWrapper",
  computed: {
    ...mapState("search", ["loadingState", "loadingType", "loadingPercent"]),

    spinnerMessage() {
      if (this.loadingType === "edit")
        return `${this.$t("common.loadingEdit")} ${this.loadingPercent} %`;
      else if (this.loadingType === "add")
        return `${this.$t("common.loadingAdd")} ${this.loadingPercent} %`;
      else return `${this.$t("common.loading")}`;
    },
  },
};
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  left: 50%;
  top: 50vh;
  transform: translate(-50%, -50%);
  z-index: 1040;
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
  padding: 200% 0;
}
</style>
