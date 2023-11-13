<template>
  <image-preview :src="blobUrl" v-bind="$attrs" />
</template>

<script>
import { fetchRawFile } from "@/assets/js/api/apiCalls";
import ImagePreview from "@/components/ImagePreview.vue";

export default {
  name: "PrivateImagePreview",
  components: { ImagePreview },
  props: {
    uuid: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: false,
      default: "small",
    },
  },
  data() {
    return {
      fileResponse: null,
      blobUrl: "",
      isLoading: false,
    };
  },
  async mounted() {
    this.isLoading = true;
    this.fileResponse = await fetchRawFile({
      size: this.size,
      uuid: this.uuid,
    });
    this.isLoading = false;
    if (this.fileResponse.status !== 200) return;

    this.blobUrl = URL.createObjectURL(this.fileResponse.data);
  },
};
</script>

<style scoped></style>
