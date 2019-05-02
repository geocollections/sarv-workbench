<template>
  <div class="list-view">
    <div class="row">
      <div class="col">

        <reference-list-view v-if="module === 'reference'" :data="data" />

        <attachment-list-view v-if="module === 'attachment'" :data="data" />

      </div>
    </div>
  </div>
</template>

<script>
  import AttachmentListView from "../attachment/AttachmentListView";
  import ReferenceListView from "../reference/ReferenceListView";

  export default {
    components: {
      ReferenceListView,
      AttachmentListView
    },
    props: ['module', 'data'],
    name: "ListView",
  }
</script>

<style scoped>

</style>
