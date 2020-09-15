<template>
  <div class="editor">
    <label
      class="v-label mb-0 mx-2"
      style="font-size: 14px;"
      v-if="$attrs.label"
      >{{ $attrs.label }}</label
    >
    <ckeditor
      :value="!!$attrs.value ? $attrs.value : ''"
      :config="editorConfig"
      v-on="$listeners"
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

<style>
.cke_maximized {
  z-index: 100000 !important;
}

.cke_dialog_background_cover {
  z-index: 100001 !important;
}
.cke_combopanel,
.cke_dialog_container,
.cke_notifications_area,
.cke_menu_panel {
  z-index: 100002 !important;
}
</style>
