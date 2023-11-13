<template>
  <div class="file-response">
    <template v-if="isLoading">
      <div class="loading-wrapper text-center">
        <v-progress-circular :size="118" color="blue" indeterminate />
        <div class="mt-2 text-center" style="font-size: 1.5rem">
          {{ $t("common.loadingFile") }}
        </div>
      </div>
    </template>

    <template v-else-if="blobUrl">
      <v-btn
        fab
        fixed
        top
        right
        dark
        @click="downloadBlob(blobUrl, $route.params.uuid)"
      >
        <v-icon>fas fa-file-download</v-icon>
      </v-btn>

      <img
        class="img"
        v-if="contentType?.startsWith('image')"
        :class="{ 'img--svg': contentType?.startsWith('image/svg') }"
        :src="blobUrl"
      />

      <video
        class="video"
        v-else-if="
          contentType?.startsWith('video') || contentType?.startsWith('audio')
        "
        controls
        autoplay
        :src="blobUrl"
      />

      <embed
        class="pdf"
        v-else-if="
          contentType === 'application/pdf' || contentType?.startsWith('text')
        "
        :type="contentType"
        :src="blobUrl"
      />

      <div v-else class="text-center" style="max-width: 500px">
        Sorry, this file preview is not yet supported. You can use the download
        button on the top right corner of the page
        <div class="mt-6" style="font-size: 10px">
          File type:
          <b
            style="cursor: pointer"
            @click="downloadBlob(blobUrl, $route.params.uuid)"
            >{{ contentType }}</b
          >
        </div>
      </div>
    </template>

    <div class="file-response__error" v-else>
      <div>Uh Oh! File Not Found</div>
      <div class="status-code">404</div>
      <div>We are sorry, but the file you requested was not found :(</div>
    </div>
  </div>
</template>

<script>
import { fetchRawFile } from "@/assets/js/api/apiCalls";

export default {
  name: "FileResponse",
  data() {
    return {
      fileResponse: null,
      blobUrl: null,
      isLoading: false,
    };
  },
  computed: {
    contentType() {
      return this.fileResponse?.headers?.["content-type"];
    },
    filename() {
      const contentDisposition =
        this.fileResponse?.headers?.["content-disposition"];
      return contentDisposition?.split("filename=")?.[1]?.split(";")?.[0];
    },
  },
  async mounted() {
    this.isLoading = true;
    this.fileResponse = await fetchRawFile({
      size: this.$route.params.size,
      uuid: this.$route.params.uuid,
    });
    this.isLoading = false;
    if (this.fileResponse.status !== 200) return;

    this.blobUrl = URL.createObjectURL(this.fileResponse.data);
  },
  methods: {
    downloadBlob(blobUrl, name = "myfile") {
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = name;

      document.body.appendChild(link);

      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );

      document.body.removeChild(link);
    },
  },
};
</script>

<style>
#app {
  background-color: rgb(14, 14, 14);
  overflow-x: auto !important;
  color: #fff;
}

.file-response {
  margin: auto;
}

.file-response .img,
.file-response .video {
  display: block;
  max-width: 100vw;
  max-height: 100vh;
}

.file-response .pdf {
  height: 100vh;
  width: 100vw;
}

.file-response .img--svg {
  max-width: unset;
  max-height: unset;
}

.file-response__error div {
  font-size: 1.25rem;
  text-align: center;
  margin: 0 24px;
  max-width: 600px;
}

.file-response__error .status-code {
  font-size: 8rem;
  text-align: center;
}
</style>
