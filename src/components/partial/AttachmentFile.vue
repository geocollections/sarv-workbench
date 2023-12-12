<template>
  <div
    class="attachment-file d-flex flex-column align-center justify-center fill-height"
    v-if="data"
  >
    <div class="align-center align-end my-2" style="max-width: 100%">
      <div class="rotation d-flex flex-row justify-end mb-1" v-if="isImageFile">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" @click="rotateImage(-90)"
              ><v-icon>fas fa-undo-alt</v-icon></v-btn
            >
          </template>

          <span>{{ $t("attachment.rotateLeft") }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" @click="rotateImage(90)"
              ><v-icon>fas fa-redo-alt</v-icon></v-btn
            >
          </template>

          <span>{{ $t("attachment.rotateRight") }}</span>
        </v-tooltip>
      </div>

      <!-- AUDIO -->
      <audio v-if="isAudioFile && !data.is_private" controls>
        <source
          :src="$helpers.getPublicFileUrl(data.uuid_filename)"
          :type="data.attachment_format__value"
        />
        Your browser does not support the audio element.
        <i class="far fa-file-audio fa-5x"></i>
      </audio>

      <!-- VIDEO -->
      <video v-else-if="isVideoFile && !data.is_private" type="video" controls>
        <source
          :src="$helpers.getPublicFileUrl(data.uuid_filename)"
          :type="data.attachment_format__value"
        />
        Your browser does not support the video element.
        <i class="far fa-file-video fa-5x"></i>
      </video>

      <!-- IMAGE -->
      <file-preview
        v-else
        class="file-preview"
        :attachment="data"
        size="medium"
        icon-size="5rem"
        contain
        max="500"
        :style="imageStyle"
        @click.native="$helpers.openFileInNewWindow(data)"
      />
    </div>

    <div
      class="d-flex align-self-center justify-space-between px-2"
      style="width: 100%"
      v-if="isAudioFile || isVideoFile || isImageFile"
    >
      <div class="d-flex flex-wrap">
        <v-icon small>fas fa-external-link-alt</v-icon>
        <v-btn
          v-for="size in buttons"
          :key="size"
          small
          text
          link
          class="ma-1 text-capitalize blue--text text--darken-2"
          @click="$helpers.openFileInNewWindow(data)"
          >{{ $t(`common.${size}`) }}</v-btn
        >
      </div>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            icon
            v-bind="attrs"
            v-on="on"
            :title="$t('common.downloadFile')"
            :color="bodyActiveColor"
            :dark="bodyActiveColorDark"
          >
            <v-icon color="" small>fas fa-download</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="(size, index) in buttons"
            :key="index"
            @click="downloadFile(data, size)"
          >
            <v-list-item-title>{{ $t(`common.${size}`) }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div v-else>
      <v-btn
        small
        icon
        :title="$t('common.downloadFile')"
        :color="bodyActiveColor"
        :dark="bodyActiveColorDark"
        @click="downloadFile(data)"
      >
        <v-icon color="" small>fas fa-download</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import FilePreview from "@/components/FilePreview.vue";
import { fetchRawFile } from "@/assets/js/api/apiCalls";
export default {
  components: { FilePreview },
  props: {
    data: {
      required: true,
    },
    rotationDegrees: {
      required: false,
    },
  },
  name: "AttachmentFile",
  computed: {
    ...mapState("settings", ["bodyActiveColor", "bodyActiveColorDark"]),
    isAudioFile() {
      return !!(
        this.data.attachment_format__value &&
        this.data.attachment_format__value.includes("audio")
      );
    },

    isVideoFile() {
      if (this.data.attachment_format__value) {
        return !!this.data.attachment_format__value.includes("video");
      } else {
        // As of 18.09.2019 total of 1508 attachments are without attachment_format__value and only 1 is webm
        return !!this.data.uuid_filename.split(".")[1].includes("webm");
      }
    },

    isImageFile() {
      return this.$helpers.isImageFile(this.data);
    },

    buttons() {
      let buttons = ["small", "medium", "large", "original"];
      return buttons.filter((btn) =>
        btn === "original" ? true : this.isImageFile
      );
    },

    imageStyle() {
      let style = `transform:rotate(${this.rotationDegrees}deg);`;

      const height = document?.querySelector(
        ".attachment-file .image-preview"
      )?.offsetHeight;
      const width = document?.querySelector(
        ".attachment-file .image-preview"
      )?.offsetWidth;

      if (width > height) {
        const isOdd = (Math.abs(this.rotationDegrees) / 90) % 2 === 1;
        if (isOdd) {
          const margin = (width - height) / 2;
          style += ` margin: ${margin}px auto;`;
        } else style = `transform:rotate(${this.rotationDegrees}deg);`;
      }

      return style;
    },
  },
  methods: {
    async downloadFile(data, size) {
      const filename = this.downloadFileName(data.uuid_filename, size);
      let url = this.$helpers.getPublicFileUrl(data.uuid_filename, size);

      if (data.is_private) {
        try {
          const uuid = data.uuid_filename?.split(".")?.[0];
          let res = await fetchRawFile({ uuid });

          if (res.status !== 200) return;
          url = URL.createObjectURL(res.data);
        } catch (e) {
          return;
        }
      }

      this.downloadBlob(url, filename);
    },

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

    downloadFileName(filename, size) {
      if (!size || size === "original") return filename;
      return `${size}_${filename}`;
    },

    rotateImage(deg) {
      this.$emit("rotate", this.rotationDegrees + deg);
    },
  },
};
</script>

<style scoped>
.attachment-file .file-preview {
  background-color: transparent !important;
  border: none;

  height: auto;
  transition: 0.2s ease-in-out;
  transition-property: transform, margin;
}

.file-preview {
  cursor: pointer;
  transition: opacity 200ms ease-in-out;
}

.file-preview:hover {
  opacity: 0.8;
}

video {
  max-width: 100%;
  vertical-align: middle;
}
</style>
