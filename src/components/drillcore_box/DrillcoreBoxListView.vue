<template>
  <div class="list-row" v-if="data.length > 0">
    <v-row v-if="title">
      <v-col>
        <h1 class="text-center py-4" v-translate="title" />
      </v-col>
    </v-row>
    <v-row v-for="(box, index) in data" :key="index">
      <v-col cols="12" class="box">
        <v-divider v-if="index > 0" class="d-print-none" />
        <div class="py-2 d-flex align-center flex-column">
          <file-preview
            @click.native="$helpers.openFileInNewWindow(box)"
            prefix="attachment__"
            class="elevation-4 file-preview"
            :attachment="box"
            size="medium"
            style="max-width: 800px; max-height: 500px"
          />

          <slot name="itemTitle" v-bind:item="box"></slot>
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
import FilePreview from "@/components/FilePreview.vue";

export default {
  name: "DrillcoreBoxListView",
  components: { FilePreview },
  props: {
    data: {
      type: Array,
    },
    title: {
      type: Object,
    },
  },
};
</script>

<style scoped>
.file-preview {
  opacity: 1;
  transition: opacity 200ms ease-in;
}

.file-preview:hover {
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
