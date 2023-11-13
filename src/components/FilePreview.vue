<template>
  <image-preview-wrapper
    v-if="isImage"
    class="grey lighten-2"
    :is-public="isPublic"
    :attachment="attachment"
    :contain="contain"
    :square="square"
    :max="max"
  />

  <file-preview-icon
    v-else
    :icon-size="iconSize"
    :file-type="attachment.attachment_format__value"
    :square="square"
  />
</template>

<script>
import FilePreviewIcon from "@/components/FilePreviewIcon.vue";
import ImagePreviewWrapper from "@/components/ImagePreviewWrapper.vue";

export default {
  name: "FilePreview",
  components: { ImagePreviewWrapper, FilePreviewIcon },
  props: {
    attachment: {
      type: Object,
      required: true,
    },
    contain: {
      type: Boolean,
      required: false,
    },
    iconSize: {
      type: String,
      required: false,
      default: "3rem",
    },
    square: {
      type: Boolean,
      required: false,
    },
    max: {
      type: String,
      required: false,
    },
  },
  computed: {
    isPublic() {
      return !this.attachment.is_private;
    },
    isImage() {
      const imageMimeTypes = [
        "image/jpe",
        "image/jpg",
        "image/jpeg",
        "image/png",
      ];
      return imageMimeTypes.includes(this.attachment?.attachment_format__value);
    },
  },
};
</script>

<style scoped></style>
