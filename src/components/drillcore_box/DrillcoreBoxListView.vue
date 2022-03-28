<template>
  <div class="list-row" v-if="data.length > 0">
    <v-row no-gutters v-for="(box, index) in data" :key="index">
      <v-col cols="12" class="box">
        <v-divider v-if="index > 0" class="d-print-none pa-0 ma-0" />
        <div class="py-2 d-flex align-center flex-column">
          <slot name="itemTitle" :item="box"></slot>
          <img
            v-for="(image, imageKey) in box.attachments"
            :key="imageKey"
            :alt="image.original_filename"
            @click="openFileInNewWindow(image)"
            style="max-width: 800px; max-height: 500px"
            class="rounded elevation-2 my-2"
            :src="getFileUrl(image.uuid_filename, 'medium')"
            :title="getFileUrl(image.uuid_filename, 'medium')"
          />
        </div>
      </v-col>
    </v-row>
  </div>
  <div v-else>
    <div
      class="text-center"
      v-translate="{ et: 'Andmed puuduvad', en: 'No data available' }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "DrillcoreBoxListView",
  props: {
    data: {
      type: Array,
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
  },
  methods: {
    openFileInNewWindow(file) {
      if (file) {
        let url = "";
        if (this.isImageFile(file)) {
          url = this.getFileUrl(file.uuid_filename, "large");
        } else {
          url = this.getFileUrl(file.uuid_filename);
        }

        window.open(url, "FileWindow", "width=800,height=750");
      }
    },
    getFileUrl(uuid, size = null) {
      if (uuid) {
        if (size) {
          return `${this.$constants.IMAGE_URL}${size}/${uuid.substring(
            0,
            2
          )}/${uuid.substring(2, 4)}/${uuid}`;
        } else {
          return `${this.$constants.IMAGE_URL}${uuid.substring(
            0,
            2
          )}/${uuid.substring(2, 4)}/${uuid}`;
        }
      }
    },
    isImageFile(image) {
      if (image.uuid_filename) {
        let fileType = image.uuid_filename.split(".")[1];
        // As of 18.09.2019 total of 1508 attachments are without attachment_format__value which 859 are jpg and 2 png
        return !!(fileType.includes("jpg") || fileType.includes("png"));
      }
      return false;
    },
  },
};
</script>

<style scoped>
img {
  opacity: 1;
  transition: opacity 200ms ease-in;
}

img:hover {
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 200ms ease-in;
}

@media print {
  .box {
    break-inside: avoid;
    height: 15cm;
  }

  .sarv-link {
    text-decoration: none;
  }
}
</style>
