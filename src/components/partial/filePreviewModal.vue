<template>
  <b-modal
    style="text-align: center"
    id="filePreview"
    header-bg-variant="dark"
    header-text-variant="light"
    centered
    size="lg"
    lazy
    scrollable
    ref="filePreview"
    :title="
      data ? data.description + ' (Author ' + data.author__agent + ')' : ''
    "
    :hide-footer="true"
  >
    <file-preview :data="data" />
  </b-modal>
</template>

<script>
import FilePreview from "./FilePreview";
export default {
  name: "file-preview-modal",
  components: { FilePreview },

  props: {
    data: {
      type: Object,
      required: null
    }
  },
  mounted() {
    this.$parent.$on("show-file-preview-modal", this.showModal);
    this.$parent.$on("close-file-preview-modal", this.hideModal);
  },
  methods: {
    showModal() {
      this.$refs.filePreview.show();
    },
    hideModal() {
      this.$refs.filePreview.hide();
    }
  }
};
</script>

<style scoped></style>
