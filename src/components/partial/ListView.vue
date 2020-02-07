<template>
  <div class="list-view" :class="bodyColor.split('n-')[0] + 'n-5'">
    <v-row no-gutters>
      <v-col class="pa-4">
        <reference-list-view
          v-if="module === 'reference'"
          :data="data"
          :body-active-color="bodyActiveColor"
        />

        <sample-list-view v-if="module === 'sample'" :data="data" />

        <specimen-list-view v-if="module === 'specimen'" :data="data" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ReferenceListView from "../reference/ReferenceListView";
import SampleListView from "../sample/SampleListView";
import SpecimenListView from "../specimen/SpecimenListView";

export default {
  components: {
    ReferenceListView,
    SampleListView,
    SpecimenListView
  },
  props: ["module", "data", "bodyColor", "bodyActiveColor"],
  name: "ListView"
};
</script>

<style>
@page {
  width: 297mm;
  height: 210mm;
  margin: 5mm;
}

@media print {
  html,
  body,
  #app,
  .v-application--wrap,
  .dashboard,
  .v-content,
  .v-content__wrap,
  .container,
  .list-module-core,
  .table-card {
    all: unset !important;
  }
  a {
    text-decoration: none !important;
  }
}
</style>
