<template>
  <image-preview
    v-if="isPublic"
    :src="$helpers.getPublicImageUrl(attachment.uuid_filename, size)"
    :lazy-src="$helpers.getPublicImageUrl(attachment.uuid_filename, 'small')"
    :contain="contain"
    :square="square"
    :max="max"
  />

  <lazy v-else style="width: 100%">
    <private-image-preview
      :uuid="uuid"
      size="small"
      :contain="contain"
      :square="square"
      :max="max"
    />
  </lazy>
</template>

<script>
import PrivateImagePreview from "@/components/PrivateImagePreview.vue";
import Lazy from "@/components/Lazy.vue";
import ImagePreview from "@/components/ImagePreview.vue";

export default {
  name: "ImagePreviewWrapper",
  components: { ImagePreview, Lazy, PrivateImagePreview },
  props: {
    attachment: {
      type: Object,
      required: true,
    },
    isPublic: {
      type: Boolean,
      required: true,
    },
    size: {
      type: String,
      required: false,
      default: "small",
    },
    contain: {
      type: Boolean,
      required: false,
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
    uuid() {
      return this.attachment?.uuid_filename?.split(".")?.[0];
    },
  },
};
</script>

<style scoped></style>
