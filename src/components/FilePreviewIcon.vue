<template>
  <v-icon class="black--text" :style="iconStyle">{{ icon }}</v-icon>
</template>

<script>
export default {
  name: "FilePreviewIcon",
  props: {
    iconSize: {
      type: String,
      required: false,
      default: "3rem",
    },
    square: {
      type: Boolean,
      required: false,
    },
    fileType: {
      type: String,
      required: false,
      default: "",
    },
  },
  computed: {
    iconStyle() {
      let style = `font-size: ${this.iconSize}; width: 100%;`;
      if (this.square) style += ` aspect-ratio: 1`;
      return style;
    },
    icon() {
      let iconClass = "far fa-file";
      const type = this.fileType;

      if (type.includes("application")) {
        if (type.includes("docx")) iconClass = "far fa-file-word";
        else if (type.includes("pdf")) iconClass = "far fa-file-pdf";
        else if (type.includes("xlsx") || type.includes("ods"))
          iconClass = "far fa-file-excel";
        else if (type.includes("zip")) iconClass = "far fa-file-archive";
        else iconClass = "far fa-file";
      } else if (type.includes("audio")) iconClass = "far fa-file-audio";
      else if (type.includes("image")) iconClass = "far fa-file-image";
      else if (type.includes("text")) iconClass = "far fa-file-alt";
      else if (type.includes("video")) iconClass = "far fa-file-video";

      return iconClass;
    },
  },
};
</script>

<style scoped></style>
