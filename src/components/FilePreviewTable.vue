<template>
  <div class="file-preview-table">
    <template v-if="isPublic">
      <v-img
        v-if="isImage"
        :class="inputClass"
        :src="$helpers.getPublicImageUrl(attachment.uuid_filename, 'small')"
        :lazy-src="
          $helpers.getPublicImageUrl(attachment.uuid_filename, 'small')
        "
        :contain="contain"
        class="grey lighten-2 attachment-table-image-preview"
        :max-width="maxWidth"
        :min-width="minWidth"
        :max-height="maxHeight"
        :min-height="minHeight"
        :aspect-ratio="aspectRatio"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height" align="center" justify="center">
            <v-progress-circular indeterminate color="grey lighten-5" />
          </v-row>
        </template>
      </v-img>

      <v-icon
        v-else
        :class="`${bodyActiveColor}--text ${inputClass}`"
        :style="iconStyle"
        >{{ icon }}</v-icon
      >
    </template>

    <template v-else>
      <lazy v-if="isImage">
        <private-image-preview
          v-once
          :class="inputClass"
          :uuid="attachment?.uuid_filename?.split('.')?.[0]"
          size="small"
          :contain="contain"
          class="grey lighten-2"
          :max-width="maxWidth"
          :min-width="minWidth"
          :max-height="maxHeight"
          :min-height="minHeight"
          :aspect-ratio="aspectRatio"
        />
      </lazy>

      <v-icon
        v-else
        :class="`${bodyActiveColor}--text ${inputClass}`"
        :style="iconStyle"
        >{{ icon }}</v-icon
      >
    </template>
  </div>
</template>

<script>
import Lazy from "@/components/Lazy.vue";
import PrivateImagePreview from "@/components/PrivateImagePreview.vue";

export default {
  name: "FilePreviewTable",
  components: { PrivateImagePreview, Lazy },
  props: {
    attachment: {
      type: Object,
      required: true,
    },
    contain: Boolean,
    maxHeight: {
      type: String,
      required: false,
      default: "200",
    },
    minHeight: {
      type: String,
      required: false,
      default: "none",
    },
    maxWidth: {
      type: String,
      required: false,
      default: "200",
    },
    minWidth: {
      type: String,
      required: false,
      default: "none",
    },
    aspectRatio: {
      type: String,
      required: false,
      default: "none",
    },
    iconSize: {
      type: String,
      required: false,
      default: "3rem",
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
    inputClass: {
      type: String,
      required: false,
      default: "",
    },
  },
  computed: {
    isPublic() {
      return !this.attachment.is_private;
    },
    isImage() {
      return this.attachment?.attachment_format__value?.includes("image");
    },
    icon() {
      let fileType = this.attachment.attachment_format__value;
      if (fileType) {
        if (fileType.includes("application")) {
          if (fileType.includes("docx")) return "far fa-file-word";
          else if (fileType.includes("pdf")) return "far fa-file-pdf";
          else if (fileType.includes("xlsx") || fileType.includes("ods"))
            return "far fa-file-excel";
          else if (fileType.includes("zip")) return "far fa-file-archive";
          else return "far fa-file";
        } else if (fileType.includes("audio")) return "far fa-file-audio";
        else if (fileType.includes("image")) return "far fa-file-image";
        else if (fileType.includes("text")) return "far fa-file-alt";
        else if (fileType.includes("video")) return "far fa-file-video";
        else return "far fa-file";
      } else {
        fileType = this.attachment.uuid_filename.split(".")[1];
        // As of 18.09.2019 total of 1508 attachments are without attachment_format__value
        if (fileType.includes("jpg") || fileType.includes("png"))
          return "far fa-file-image";
        // 859 jpg and 2 png
        else if (fileType.includes("pdf")) return "far fa-file-pdf";
        // 635 pdf
        else if (fileType.includes("xls") || fileType.includes("ods"))
          return "far fa-file-excel";
        // 4 xls and 2 ods
        else if (fileType.includes("txt")) return "far fa-file-alt";
        // 1 txt
        else if (fileType.includes("webm")) return "far fa-file-video";
        // 1 webm
        else return "far fa-file"; // 4 hz1
      }
    },
    iconStyle() {
      let style = `font-size: ${this.iconSize}; width: 100%;`;
      if (this.aspectRatio) style += ` aspect-ratio: ${this.aspectRatio}`;
      return style;
    },
  },
};
</script>

<style scoped>
.file-preview-table {
  display: contents;
}
</style>
