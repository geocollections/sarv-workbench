<template>
  <v-row class="d-print-none">
    <v-col>
      <span class="table-title">
        {{ $t(title) }}
      </span>
    </v-col>
    <v-col class="text-right" align-self="center">
      <v-btn
        :class="{ 'mt-2': showImportButton }"
        :to="{ path: buttonPath }"
        :color="bodyActiveColor"
        :dark="bodyActiveColorDark"
      >
        <v-icon left>fas fa-plus</v-icon>
        {{ $t("add.new") }}
      </v-btn>
      <v-btn
        class="ml-2 mt-2"
        v-if="showImportButton"
        :to="{ path: `/${$route.meta.object}/import` }"
        :color="bodyActiveColor"
        :dark="bodyActiveColorDark"
      >
        {{ $t("buttons.import") }}
        <v-icon right>fas fa-file-import</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "TableViewTitle",
  props: {
    title: {
      type: String,
      required: true,
    },
    buttonPath: {
      type: String,
      required: true,
    },
    showImportButton: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    ...mapState("settings", ["bodyActiveColor", "bodyActiveColorDark"]),
  },
};
</script>

<style scoped>
.table-title {
  font-size: 2rem;
  font-weight: 600;
}
</style>
