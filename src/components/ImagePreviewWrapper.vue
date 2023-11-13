<template>
  <image-preview
    v-if="isPublic"
    :src="$helpers.getPublicImageUrl(uuid, size)"
    :lazy-src="$helpers.getPublicImageUrl(uuid, 'small')"
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
    uuid: {
      type: String,
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
};
</script>

<style scoped></style>
