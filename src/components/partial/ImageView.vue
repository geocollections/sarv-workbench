<template>
  <div class="image-view">
    <div class="row">
      <div class="col">
        <image-view-wrapper
          :object="module"
          :data="computedData"
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
  props: ["module", "data", "bodyActiveColor", "bodyColor"],
  computed: {
    computedData() {
      if (this.module === "location" || this.module === "drillcore_box") {
        const data = this.data.map((item) => {
          return { ...item, uuid_filename: item.attachment__uuid_filename };
        });
        return data;
      }

      return this.data;
    },
  },
};
</script>
