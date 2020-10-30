<template>
  <div class="scroll-to-links mb-2" v-if="$route.meta.isEdit && formSections">
    <v-btn-toggle
      dense
      borderless
      tile
      class="flex-wrap"
      style="background: unset"
    >
      <v-btn
        v-for="(value, name) in formSections"
        class="scroll-to-button text-none"
        :key="name"
        @click="$vuetify.goTo(`#block-${name}`, scrollToOptions)"
        x-small
      >
        <v-icon x-small left>{{
          getIconPack(name) + " " + getIcon(name)
        }}</v-icon>
        {{ $t("sidebar." + $route.meta.table + "." + name) }}
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ScrollToLinks",
  data: () => ({
    duration: 100,
    easing: "easeInOutCubic",
    offset: 5
  }),
  computed: {
    // ...mapState("settings", ["formSections"])
    ...mapState("settings", {
      formSections: function(state) {
        return state.formSections[this.$route.meta.object];
      }
    }),

    scrollToOptions() {
      return {
        duration: this.duration,
        offset: this.offset,
        easing: this.easing
      };
    }
  },
  methods: {
    getIcon(name) {
      if (name === "info") return "fa-project-diagram";
      if (name === "other") return "fa-project-diagram";
      if (name === "description") return "fa-pen-fancy";
      if (name === "members") return "fa-user-friends";
      if (name === "files") return "fa-folder-open";
      if (name === "sites") return "fa-globe-americas";
      if (name === "location") return "fa-globe";
      if (name === "samples") return "fa-vial";
      if (name === "digital") return "fa-file-pdf";
      if (name === "libraries") return "fa-book";
      if (name === "localities") return "fa-map-marked";
      if (name === "requiredFields") return "fa-check";
      if (name === "referenceAndDataset") return "fa-book";
      if (name === "datacite") return "fa-sitemap";
      if (name === "relatedInfo") return "fa-sitemap";
      if (name === "map") return "fa-map";
      if (name === "additionalInfo") return "fa-project-diagram";
      if (name === "relatedData") return "fa-table";
      if (name === "localityInfo") return "fa-map-signs";
      if (name === "details") return "fa-info";
      if (name === "specimen") return "fa-fish";
      if (name === "abstract") return "fa-sticky-note";
      if (name === "groundwater") return "fa-water";
      else return "fa-fish";
    },

    getIconPack() {
      return "fas";
    }
  }
};
</script>

<style scoped>
.scroll-to-button {
  border: unset;
  font-size: 0.675rem;
}
</style>
