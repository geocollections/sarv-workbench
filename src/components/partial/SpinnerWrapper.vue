<template>
  <spinner
    v-show="loadingState"
    v-bind="$attrs"
    class="loading-overlay"
    size="massive"
    :message="$t('common.loading')"
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
    ...mapState("search", ["loadingState"]),
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
