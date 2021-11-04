<template>
  <spinner
    v-show="loadingState"
    v-bind="$attrs"
    class="loading-overlay"
    size="massive"
    :message="spinnerMessage"
  ></spinner>
</template>

<script>
import Spinner from "vue-simple-spinner";
import { mapState } from "vuex";

export default {
  name: "SpinnerWrapper",
  components: {
    Spinner,
  },
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
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1040;
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
  padding: 200% 0;
}
</style>
