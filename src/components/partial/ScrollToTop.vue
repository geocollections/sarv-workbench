<template>
  <v-fab-transition>
    <v-btn
      v-show="showFab"
      fab
      fixed
      bottom
      right
      :color="bodyActiveColor"
      dark
      @click="toTop"
      style="z-index: 1500"
    >
      <v-icon large small>fas fa-chevron-up</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
import throttle from "lodash/throttle";

export default {
  name: "ScrollToTop",

  props: {
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
  },

  data() {
    return {
      showFab: false,
    };
  },

  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },

  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  },

  methods: {
    onScroll: throttle(function (event) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || event.target.scrollTop || 0;

      this.showFab = top > 400;
    }, 500),

    toTop() {
      this.$vuetify.goTo(0);
    },
  },
};
</script>

<style scoped></style>
