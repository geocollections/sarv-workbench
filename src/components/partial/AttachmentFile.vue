<template>
  <div
    class="file-preview d-flex flex-column align-center justify-center fill-height"
    v-if="data"
  >
    <div class="align-center align-end my-2">
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
      <audio v-if="isAudioFile" controls>
        <source
          :src="$helpers.getFileUrl(data.uuid_filename)"
          :type="data.attachment_format__value"
        />
        Your browser does not support the audio element.
        <i class="far fa-file-audio fa-5x"></i>
      </audio>

      <!-- VIDEO -->
      <video v-else-if="isVideoFile" type="video" controls>
        <source
          :src="$helpers.getFileUrl(data.uuid_filename)"
          :type="data.attachment_format__value"
        />
        Your browser does not support the video element.
        <i class="far fa-file-video fa-5x"></i>
      </video>

      <!-- IMAGE -->

      <img
        v-else-if="isImageFile"
        :src="$helpers.getFileUrl(data.uuid_filename, 'medium')"
        :title="$helpers.getFileUrl(data.uuid_filename, 'medium')"
        @click="
          $helpers.openUrlInNewWindow(
            $helpers.getFileUrl(data.uuid_filename, 'medium')
          )
        "
        alt="Image preview..."
        class="img-thumbnail image"
        :style="imageStyle"
      />

      <!-- IF ABOVE FAILS THEN SHOW FILE ICON -->
      <i
        v-else
        class="far fa-5x link"
        @click="
          $helpers.openUrlInNewWindow($helpers.getFileUrl(data.uuid_filename))
        "
        :title="$helpers.getFileUrl(data.uuid_filename)"
        :class="getAttachmentIcon(data)"
      ></i>
    </div>

    <div
      class="d-flex align-self-center justify-space-between px-2"
      style="width: 100%"
      v-if="isAudioFile || isVideoFile || isImageFile"
    >
      <div class="d-flex">
        <v-icon small>fas fa-external-link-alt</v-icon>
        <v-btn
          v-for="size in buttons"
          :key="size"
          small
          text
          link
          class="ma-1 text-capitalize blue--text text--darken-2"
          @click="
            $helpers.openUrlInNewWindow(
              $helpers.getFileUrl(data.uuid_filename, size)
            )
          "
          :title="$helpers.getFileUrl(data.uuid_filename, size)"
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
            tag="a"
            :href="$helpers.getFileUrl(data.uuid_filename, size)"
            :download="downloadFileName(data.original_filename, size)"
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
        tag="a"
        :href="$helpers.getFileUrl(data.uuid_filename, size)"
        :download="downloadFileName(data.original_filename, size)"
        :title="$t('common.downloadFile')"
        :color="bodyActiveColor"
        :dark="bodyActiveColorDark"
      >
        <v-icon color="" small>fas fa-download</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
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
      if (this.data.attachment_format__value) {
        return !!this.data.attachment_format__value.includes("image");
      } else {
        let fileType = this.data.uuid_filename.split(".")[1];
        // As of 18.09.2019 total of 1508 attachments are without attachment_format__value which 859 are jpg and 2 png
        return !!(fileType.includes("jpg") || fileType.includes("png"));
      }
    },

    buttons() {
      let buttons = ["small", "medium", "large", "original"];
      return buttons.filter((btn) =>
        btn === "original" ? true : this.isImageFile
      );
    },

    imageStyle() {
      let style = `transform:rotate(${this.rotationDegrees}deg);`;

      const height = document?.querySelector("img")?.offsetHeight;
      const width = document?.querySelector("img")?.offsetWidth;

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
    getAttachmentIcon(attachment) {
      if (attachment.attachment_format__value) {
        let fileType = attachment.attachment_format__value;
        if (fileType.includes("application")) {
          if (fileType.includes("docx")) return "fa-file-word";
          else if (fileType.includes("pdf")) return "fa-file-pdf";
          else if (fileType.includes("xlsx") || fileType.includes("ods"))
            return "fa-file-excel";
          else if (fileType.includes("zip")) return "fa-file-archive";
          else return "fa-file";
        } else if (fileType.includes("audio")) return "fa-file-audio";
        else if (fileType.includes("image")) return "fa-file-image";
        else if (fileType.includes("text")) return "fa-file-alt";
        else if (fileType.includes("video")) return "fa-file-video";
        else return "fa-file";
      } else {
        let fileType = attachment.uuid_filename.split(".")[1];
        // As of 18.09.2019 total of 1508 attachments are without attachment_format__value
        if (fileType.includes("jpg") || fileType.includes("png"))
          return "fa-file-image";
        // 859 jpg and 2 png
        else if (fileType.includes("pdf")) return "fa-file-pdf";
        // 635 pdf
        else if (fileType.includes("xls") || fileType.includes("ods"))
          return "fa-file-excel";
        // 4 xls and 2 ods
        else if (fileType.includes("txt")) return "fa-file-alt";
        // 1 txt
        else if (fileType.includes("webm")) return "fa-file-video";
        // 1 webm
        else return "fa-file"; // 4 hz1
      }
    },
    downloadFileName(filename, size) {
      if (size === "original") return filename;
      return `${size}_${filename}`;
    },

    rotateImage(deg) {
      this.$emit("rotate", this.rotationDegrees + deg);
    },
  },
};
</script>

<style scoped>
video {
  max-width: 100%;
  vertical-align: middle;
}

.link:hover {
  cursor: pointer;
}

img {
  opacity: 1;
  transition: opacity 200ms ease-out;
}

img:hover {
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 200ms ease-in;
}

.img-thumbnail {
  padding: 0.25rem;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  max-width: 100%;
  max-height: 400px;
  height: auto;
  transition: 0.2s ease-in-out;
  transition-property: transform, margin;
}
</style>
