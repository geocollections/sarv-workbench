<template>
  <div class="editor">
    <ckeditor v-model="editorData" :config="editorConfig"></ckeditor>
  </div>
</template>

<script>
import CKEditor from "ckeditor4-vue";

export default {
  name: "EditorNew",

  props: {
    data: {
      type: String,
      default: "<p></p>"
    }
  },

  components: {
    ckeditor: CKEditor.component
  },

  computed: {
    editorData: {
      get() {
        if (this.data && this.data.length > 0) return this.data;
        else return "<p></p>";
      },

      set(value) {
        if (value && value.length > 0) this.$emit("update:data", value);
        else this.$emit("update:data", "<p></p>");
      }
    }
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
