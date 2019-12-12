<template>
  <div class="mt-2">
    <v-row no-gutters>
      <v-col cols="12" class="pa-1">
        <label
          :for="`file-input`"
          :class="isDragging ? 'dragging upload-icon py-3' : 'py-5'"
          v-on:dragover.stop.prevent="isDragging = true"
          v-on:dragleave.stop.prevent="isDragging = false"
          v-on:drop.stop.prevent="dropFile"
          class="d-flex justify-content-center align-items-center file-upload mb-0"
        >
          <span :class="{ 'd-none': isDragging }">
            {{ $t("add.inputs.fileInput") }}
          </span>
        </label>

        <v-file-input
          id="file-input"
          class="d-none"
          :multiple="acceptMultiple"
          :accept="acceptableFormat"
          @change="addFile"
        />

        <div class="grey--text mt-1" style="font-size: 0.8rem">
          <div v-if="acceptMultiple">{{ $t("add.errors.files") }}.</div>
          <div v-else>{{ $t("add.errors.files2") }}.</div>
        </div>
      </v-col>
    </v-row>

    <!-- BUTTONS -->
    <div class="d-flex">
      <div class="ma-1" v-if="recordOptions && recordImage">
        <v-btn
          :icon="$vuetify.breakpoint.mdAndDown"
          class="text-none"
          :color="appSettings.bodyActiveColor"
          :dark="appSettings.bodyActiveColorDark"
          :title="$t('add.inputs.photoInput')"
          @click="trigger('photoUpload')"
        >
          <v-icon
            :left="$vuetify.breakpoint.lgAndUp"
            :small="$vuetify.breakpoint.lgAndUp"
            >fas fa-camera-retro</v-icon
          >
          <span v-show="$vuetify.breakpoint.lgAndUp">{{
            $t("add.inputs.photoInput")
          }}</span>
        </v-btn>

        <v-file-input
          ref="photoUpload"
          class="d-none"
          :multiple="acceptMultiple"
          accept="image/*;capture=camera"
          @change="addFile"
        />
      </div>

      <div class="ma-1" v-if="recordOptions && recordVideo">
        <v-btn
          :icon="$vuetify.breakpoint.mdAndDown"
          class="text-none"
          :color="appSettings.bodyActiveColor"
          :dark="appSettings.bodyActiveColorDark"
          :title="$t('add.inputs.videoInput')"
          @click="trigger('videoUpload')"
        >
          <v-icon
            :left="$vuetify.breakpoint.lgAndUp"
            :small="$vuetify.breakpoint.lgAndUp"
            >fas fa-video</v-icon
          >
          <span v-show="$vuetify.breakpoint.lgAndUp">{{
            $t("add.inputs.videoInput")
          }}</span>
        </v-btn>

        <v-file-input
          ref="videoUpload"
          class="d-none"
          :multiple="acceptMultiple"
          accept="video/*;capture=camcorder"
          @change="addFile"
        />
      </div>

      <div class="ma-1" v-if="recordOptions && recordAudio">
        <v-btn
          :icon="$vuetify.breakpoint.mdAndDown"
          class="text-none"
          :color="appSettings.bodyActiveColor"
          :dark="appSettings.bodyActiveColorDark"
          :title="$t('add.inputs.audioInput')"
          @click="trigger('audioUpload')"
        >
          <v-icon
            :left="$vuetify.breakpoint.lgAndUp"
            :small="$vuetify.breakpoint.lgAndUp"
            >fas fa-microphone</v-icon
          >
          <span v-show="$vuetify.breakpoint.lgAndUp">{{
            $t("add.inputs.audioInput")
          }}</span>
        </v-btn>

        <v-file-input
          ref="audioUpload"
          class="d-none"
          :multiple="acceptMultiple"
          accept="audio/*;capture=microphone"
          @change="addFile"
        />
      </div>

      <div class="ma-1" v-if="showExisting">
        <checkbox-wrapper
          v-model="useExisting"
          color="amber"
          :label="$t('add.inputs.existingFile')"
          @change="useExisting = !useExisting"
        />
      </div>

      <div class="flex-grow-1"></div>

      <div class="ma-1" v-if="userHasInsertedFiles">
        <v-btn
          :icon="$vuetify.breakpoint.mdAndDown"
          class="text-none"
          color="red"
          :dark="appSettings.bodyActiveColorDark"
          :title="$t('buttons.clear')"
          @click="clearFile"
        >
          <v-icon
            :left="$vuetify.breakpoint.lgAndUp"
            :small="$vuetify.breakpoint.lgAndUp"
            >far fa-trash-alt</v-icon
          >
          <span v-show="$vuetify.breakpoint.lgAndUp">
            {{ $t("buttons.clear") }}
          </span>
        </v-btn>
      </div>
    </div>

    <!-- EXISTING OPTIONS AUTOCOMPLETE -->
    <v-row no-gutters v-if="useExisting" class="mt-1">
      <v-col cols="12" class="pa-1">
        <autocomplete-wrapper
          v-model="existingFiles"
          :color="appSettings.bodyActiveColor"
          :items="autocomplete.attachment"
          :loading="autocomplete.loaders.attachment"
          item-text="original_filename"
          :label="$t('reference.attachments')"
          is-link
          route-object="attachment"
          is-searchable
          v-on:search:items="autocompleteAttachmentSearch"
          :multiple="true"
          v-on:chip:close="
            existingFiles.splice(existingFiles.indexOf($event), 1)
          "
        />
      </v-col>
    </v-row>

    <!-- EXISTING FILES -->
    <v-row no-gutters v-if="existingFiles && existingFiles.length > 0">
      <v-col cols="12" class="pa-1">
        <div class="title">{{ $t("messages.existingFiles") }}: <b>{{ existingFiles.length }}</b></div>
      </v-col>

      <v-col cols="12" class="pa-1">
        <image-view-wrapper
          :data="existingFiles"
          :body-color="appSettings.bodyColor"
          :body-active-color="appSettings.bodyActiveColor"
          clear-item-background
        />
      </v-col>
    </v-row>

    <!-- NEW FILES -->
    <v-row no-gutters v-if="files && files.length > 0">
      <v-col cols="12" class="pa-1" v-if="showExisting">
        <div class="title">{{ $t("messages.newFiles") }}: <b>{{ files.length }}</b></div>
      </v-col>

      <v-col cols="12" class="pa-1">
        <div class="image-view-wrapper mx-3">
          <v-row class="mx-0">
            <v-col
              v-for="(file, key) in files"
              :key="key"
              class="d-flex child-flex my-3"
              cols="6"
              sm="4"
              md="3"
              lg="2"
            >
              <v-tooltip
                bottom
                :color="appSettings.bodyActiveColor"
                z-index="51000"
              >
                <template v-slot:activator="{ on }">
                  <v-card
                    flat
                    class="d-flex"
                    v-on="on"
                    :class="appSettings.bodyColor.split('n-')[0] + 'n-5'"
                    hover
                  >
                    <!-- IMAGE -->
                    <v-img
                      v-if="file.type.includes('image')"
                      max-height="400"
                      aspect-ratio="1"
                      :ref="'file' + parseInt(key)"
                      class="grey lighten-2"
                      :src="sourceList[key]"
                      :lazy-src="sourceList[key]"
                    >
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="grey lighten-5"
                          />
                        </v-row>
                      </template>
                    </v-img>

                    <!-- ICON -->
                    <v-row align="center" v-else>
                      <v-col class="text-center">
                        <div class="py-3">
                          <v-icon
                            style="font-size: 6rem"
                            :class="appSettings.bodyActiveColor + '--text'"
                            >far {{ getAttachmentIcon(file) }}</v-icon
                          >
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </template>

                <span>
                  <b>Name:</b> {{ file.name }}<br />
                  <b>Size:</b> {{ getSizeAsMB(file.size) }}<br />
                  <b>Type:</b> {{ file.type }}<br />
                  <b>Last modified:</b> {{ getFormattedDate(file.lastModifiedDate) }}<br />
                </span>
              </v-tooltip>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AutocompleteWrapper from "../inputs/AutocompleteWrapper";
import CheckboxWrapper from "../inputs/CheckboxWrapper";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import ImageViewWrapper from "../imageView/ImageViewWrapper";
import EXIF from "exif-js";
// eslint-disable-next-line no-unused-vars
import moment from "moment";

export default {
  name: "FileUpload",
  mixins: [autocompleteMixin],
  components: { ImageViewWrapper, CheckboxWrapper, AutocompleteWrapper },
  props: {
    recordOptions: Boolean,
    recordImage: {
      type: Boolean,
      default: true
    },
    recordVideo: {
      type: Boolean,
      default: true
    },
    recordAudio: {
      type: Boolean,
      default: true
    },
    showExisting: Boolean,
    acceptMultiple: Boolean,
    acceptableFormat: {
      type: String,
      default: "image/*",
      validator: value => {
        return value.includes("/");
      }
    }
  },
  computed: {
    ...mapState(["appSettings"]),

    userHasInsertedFiles() {
      return (
        (this.files && this.files.length > 0) ||
        (this.existingFiles && this.existingFiles.length > 0)
      );
    }
  },
  data: () => ({
    useExisting: false,
    isDragging: false,
    files: null,
    existingFiles: null,
    autocomplete: {
      attachment: [],
      loaders: { attachment: false }
    },
    sourceList: []
  }),
  watch: {
    "$route.path"() {
      this.resetData();
      this.$emit("files-cleared");
    },
    files(newVal) {
      console.log(newVal)
      this.readFile(newVal);
    }
  },
  methods: {
    dropFile(event) {
      if (event.dataTransfer && event.dataTransfer.items) {
        let listOfFiles = [];
        event.dataTransfer.files.forEach(file => listOfFiles.push(file));

        if (this.files) listOfFiles.forEach(item => this.files.push(item));
        else this.files = listOfFiles;
      }
      this.isDragging = false;
    },

    addFile(file) {
      if (this.files) file.forEach(item => this.files.push(item));
      else this.files = file;
    },

    readFile(listOfFiles) {
      if (listOfFiles && listOfFiles.length > 0) {
        listOfFiles.forEach((file, index, object) => {
          if (!file.isAlreadyRead) {
            if (this.isValidFormat(file)) this.readFileSrc(file);
            else object.splice(index, 1);
          }
        });
        this.$emit("file-uploaded", listOfFiles);

        if (listOfFiles.length === 1) this.readFileMetaData(listOfFiles[0]);
      }
    },

    readFileSrc(file) {
      if (
        file.type.includes("image") ||
        file.type.includes("video") ||
        file.type.includes("audio")
      ) {
        let reader = new FileReader();
        reader.onload = event => {
          file.src = event.target.result;
          this.sourceList.push(event.target.result);
        };
        reader.readAsDataURL(file);
      }
      file.isAlreadyRead = true;
    },

    readFileMetaData(file) {
      let reader = new FileReader();
      reader.onload = event => {
        let fileMetaData = EXIF.readFromBinaryFile(event.target.result);
        this.$emit("metadata-loaded", fileMetaData);
      };
      reader.readAsArrayBuffer(file);
    },

    clearFile() {
      this.files = null;
      this.existingFiles = null;
      this.sourceList = [];
      this.$emit("files-cleared");
    },

    trigger(fileInputRef) {
      // Getting file icon and clicking it
      this.$refs[fileInputRef].$el.children[0].children[0].children[0].click();
    },

    resetData() {
      this.useExisting = false;
      this.isDragging = false;
      this.files = null;
      this.existingFiles = null;
      this.autocomplete = {
        attachment: [],
        loaders: { attachment: false }
      };
      this.sourceList = [];
    },

    getAttachmentIcon(file) {
      if (file.type) {
        let fileType = file.type;
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
      } else return "fa-file";
    },

    getSizeAsMB(size) {
      if (size) return (size / 1000000).toFixed(2) + " MB";
    },

    getFormattedDate(date) {
      if (date) return moment(date).format("YYYY-MM-DD HH:mm");
      else return "";
    },

    /**
     * Methods takes one argument: file's MIME type and returns file's type and subtype in an Array
     * @param mimeType {String}. File's MIME type --> application/pdf etc.
     * @returns {Array} of type and subtype --> [type, subtype]
     */
    getTypeAndSubtype(mimeType) {
      return mimeType.split("/");
    },

    isValidFormat(file) {
      console.log(file);
      console.log("File type: " + file.type);
      console.log("Acceptable type: " + this.acceptableFormat);
      return true;
    }
  }
};
</script>

<style scoped>
.file-upload {
  padding: 1.5rem 1rem;
  white-space: nowrap;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 2px;
  outline: dashed 2px rgba(0, 123, 255, 0.8);
  color: #007bff;
  -webkit-transition: outline-offset 0.15s ease-in-out,
    background-color 0.15s linear;
  transition: outline-offset 0.15s ease-in-out, background-color 0.15s linear;
}

.file-upload:hover {
  cursor: pointer;
  color: #fff;
  outline: dashed 2px #fff;
  outline-offset: -10px;
  background-color: rgba(0, 123, 255, 0.5);
  -webkit-transition: outline-offset 0.15s ease-in-out,
    background-color 0.15s linear;
  transition: outline-offset 0.15s ease-in-out, background-color 0.15s linear;
}

.dragging {
  color: #fff;
  outline: dashed 2px #fff;
  outline-offset: -10px;
  background-color: rgba(0, 123, 255, 0.5);
  -webkit-transition: outline-offset 0.15s ease-in-out,
    background-color 0.15s linear;
  transition: outline-offset 0.15s ease-in-out, background-color 0.15s linear;
}

.upload-icon::before {
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  font-size: 1.7rem;
  content: "\f093";
  padding: unset;
}
</style>
