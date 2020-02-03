<template>
  <div class="image-view">
    <div class="row">
      <div class="col">
        <image-view-wrapper
          :object="module"
          :data="data"
          :body-active-color="bodyActiveColor"
          :body-color="bodyColor"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ImageViewWrapper from "./image_view/ImageViewWrapper";

export default {
  name: "ImageView",
  components: { ImageViewWrapper },
  props: ["module", "data", "bodyActiveColor", "bodyColor"]
};
</script>

<style scoped></style>
