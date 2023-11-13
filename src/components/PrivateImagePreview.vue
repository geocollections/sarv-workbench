<template>
  <v-img class="private-image-preview" :src="blobUrl" v-bind="$attrs">
    <template v-slot:placeholder>
      <v-row no-gutters class="fill-height" align="center" justify="center">
        <v-progress-circular indeterminate color="grey lighten-5" />
      </v-row>
    </template>
  </v-img>
</template>

<script>
import { fetchRawFile } from "@/assets/js/api/apiCalls";

export default {
  name: "PrivateImagePreview",
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
      blobUrl: null,
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

<style scoped>
.private-image-preview {
  border-radius: 4px;
}
</style>
