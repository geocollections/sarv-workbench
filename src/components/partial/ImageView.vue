<template>
  <div class="list-view">
    <div class="row">
      <div class="col">
        <attachment-image-view
          v-if="module === 'attachment'"
          :data="data"
          :body-active-color="bodyActiveColor"
          :body-color="bodyColor"
        />

        <specimen-image-view
          v-if="module === 'specimen'"
          :data="data"
          :body-active-color="bodyActiveColor"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AttachmentImageView from "../attachment/AttachmentImageView";
import SpecimenImageView from "../specimen/SpecimenImageView";

export default {
  name: "ImageView",
  components: {
    AttachmentImageView,
    SpecimenImageView
  },
  props: ["module", "data", "bodyActiveColor", "bodyColor"]
};
</script>

<style scoped></style>
