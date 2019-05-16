<template>
  <div class="list-view">
    <div class="row">
      <div class="col">

        <reference-list-view v-if="module === 'reference'" :data="data" />

        <attachment-list-view v-if="module === 'attachment'" :data="data" />

        <sample-list-view v-if="module === 'sample'" :data="data" />

      </div>
    </div>
  </div>
</template>

<script>
  import AttachmentListView from "../attachment/AttachmentListView";
  import ReferenceListView from "../reference/ReferenceListView";
  import SampleListView from "../sample/SampleListView";

  export default {
    components: {
      ReferenceListView,
      AttachmentListView,
      SampleListView
    },
    props: ['module', 'data'],
    name: "ListView",
  }
</script>

<style scoped>

</style>
