<template>
  <div class="editor">
    <label
      class="v-label mb-0 mx-2"
      style="font-size: 14px;"
      v-if="$attrs.label"
      >{{ $attrs.label }}</label
    >
    <ckeditor
      v-bind="$attrs"
      v-on="$listeners"
      :config="editorConfig"
    ></ckeditor>
  </div>
</template>

<script>
import CKEditor from "ckeditor4-vue";

export default {
  name: "Editor",

  inheritAttrs: false,

  components: {
    ckeditor: CKEditor.component
  },

  data() {
    return this.setDefaultEditorConfig();
  },

  methods: {
    setDefaultEditorConfig() {
      return {
        editorConfig: {
          language: this.$i18n.locale === "ee" ? "et" : "en"
        }
      };
    }
  }
};
</script>

<style scoped></style>
