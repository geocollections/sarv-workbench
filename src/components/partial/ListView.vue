<template>
  <div class="list-view">
    <div class="row">
      <div class="col">
        <reference-list-view v-if="module === 'reference'" :data="data" />

        <sample-list-view v-if="module === 'sample'" :data="data" />

        <specimen-list-view v-if="module === 'specimen'" :data="data" />
      </div>
    </div>
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
  props: ["module", "data"],
  name: "ListView"
};
</script>

<style scoped></style>
