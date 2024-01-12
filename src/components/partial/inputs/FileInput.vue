<template>
  <div>
    <v-row no-gutters v-if="isDraggable">
      <v-col cols="12" class="pa-1">
        <label
          :for="`${id}`"
          :class="isDragging ? 'dragging upload-icon py-3' : 'py-5'"
          v-on:dragover.stop.prevent="isDragging = true"
          v-on:dragleave.stop.prevent="isDragging = false"
          v-on:drop.stop.prevent="dropFile"
          class="d-flex justify-center align-center file-upload mb-0"
        >
          <span :class="{ 'd-none': isDragging }">
            {{ $t("add.file") }}
          </span>
        </label>

        <v-file-input
          :id="`${id}`"
          class="d-none"
          :multiple="acceptMultiple"
          :accept="acceptableFormat"
          @change="addFile"
          :disabled="isDisabled"
        />
      </v-col>
    </v-row>

    <!-- This is special use case for reference digital version (pdf). -->
    <div
      class="ma-2"
      v-if="
        showResetFilesButton &&
        $route.meta.object === 'reference' &&
        !acceptMultiple &&
        userHasInsertedFiles &&
        !isExistingFilesValid
      "
    >
      <v-alert
        class="mb-3"
        border="left"
        :color="bodyColor.split('n-')[0] + 'n-2'"
        elevation="3"
        icon="fas fa-info"
        >{{ $t("messages.reference_file_upload_failed") }}</v-alert
      >
      <v-btn
        @click="files = null"
        :dark="bodyActiveColorDark"
        :color="bodyActiveColor"
        >{{ $t("buttons.reset_files") }}
        <v-icon right>far fa-trash-alt</v-icon></v-btn
      >
    </div>

    <!-- BUTTONS -->
    <div class="d-flex flex-wrap">
      <div class="ma-1" v-if="recordOptions && recordImage">
        <v-btn
          :icon="$vuetify.breakpoint.mdAndDown"
          class="text-none"
          :color="bodyActiveColor"
          :dark="bodyActiveColorDark"
          :title="$t('add.photo')"
          @click="trigger('photoUpload')"
        >
          <v-icon
            :left="$vuetify.breakpoint.lgAndUp"
            :small="$vuetify.breakpoint.lgAndUp"
            >fas fa-camera-retro</v-icon
          >
          <span v-show="$vuetify.breakpoint.lgAndUp">{{
            $t("add.photo")
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
          :color="bodyActiveColor"
          :dark="bodyActiveColorDark"
          :title="$t('add.video')"
          @click="trigger('videoUpload')"
        >
          <v-icon
            :left="$vuetify.breakpoint.lgAndUp"
            :small="$vuetify.breakpoint.lgAndUp"
            >fas fa-video</v-icon
          >
          <span v-show="$vuetify.breakpoint.lgAndUp">{{
            $t("add.video")
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
          :color="bodyActiveColor"
          :dark="bodyActiveColorDark"
          :title="$t('add.audio')"
          @click="trigger('audioUpload')"
        >
          <v-icon
            :left="$vuetify.breakpoint.lgAndUp"
            :small="$vuetify.breakpoint.lgAndUp"
            >fas fa-microphone</v-icon
          >
          <span v-show="$vuetify.breakpoint.lgAndUp">{{
            $t("add.audio")
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

      <div class="ma-1" v-if="showExisting && isDraggable">
        <checkbox-wrapper
          v-model="useExisting"
          color="amber"
          :label="$t('add.existingFile')"
          @change="useExisting = !useExisting"
        />
      </div>

      <div class="flex-grow-1"></div>

      <div class="ma-1" v-if="userHasInsertedFiles && isClearable">
        <v-btn
          :icon="$vuetify.breakpoint.mdAndDown"
          class="text-none"
          color="red"
          :dark="bodyActiveColorDark"
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
          :color="bodyActiveColor"
          :items="autocomplete.attachment"
          :loading="autocomplete.loaders.attachment"
          item-text="original_filename"
          :label="$t('reference.attachments')"
          :is-link="!isDisabled"
          route-object="attachment"
          is-searchable
          v-on:search:items="autocompleteAttachmentSearch"
          :multiple="acceptMultiple"
          v-on:chip:close="
            existingFiles.splice(existingFiles.indexOf($event), 1)
          "
          :disabled="isDisabled"
        />
      </v-col>
    </v-row>

    <!-- EXISTING FILES -->
    <v-row no-gutters v-if="isExistingFilesValid && showExistingPreviews">
      <v-col
        cols="12"
        class="pa-1"
        v-if="showExisting && existingFiles.length > 0"
      >
        <div class="title">
          {{ $t("messages.existingFiles") }}: <b>{{ existingFiles.length }}</b>
        </div>
      </v-col>

      <v-col cols="12" class="pa-1">
        <image-view-wrapper
          :data="Array.isArray(existingFiles) ? existingFiles : [existingFiles]"
          :body-color="bodyColor"
          :body-active-color="bodyActiveColor"
          clear-item-background
          :open-file="openFile"
          :show-attachment-link="showAttachmentLink"
        />
      </v-col>
    </v-row>

    <!-- NEW FILES -->
    <!-- Todo: Can be removed because now reloading related_data after file upload #546 -->
    <v-row no-gutters v-if="isFilesValid && showNewFilesImmediately">
      <v-col cols="12" class="pa-1" v-if="showExisting">
        <div class="title">
          {{ $t("messages.newFiles") }}: <b>{{ files.length }}</b>
        </div>
      </v-col>

      <v-col cols="12" class="pa-1">
        <div class="image-view-wrapper mx-3">
          <v-row class="mx-0">
            <v-col
              v-for="(file, key) in files"
              :key="key"
              class="d-flex child-flex my-3"
              :cols="realSize ? 12 : 6"
              :sm="realSize ? 12 : 4"
              :md="realSize ? 12 : 3"
              :lg="realSize ? 12 : 2"
            >
              <v-tooltip bottom :color="bodyActiveColor" z-index="51000">
                <template v-slot:activator="{ on }">
                  <v-card
                    flat
                    class="d-flex"
                    v-on="on"
                    :class="bodyColor.split('n-')[0] + 'n-5'"
                    hover
                  >
                    <!-- IMAGE -->
                    <v-img
                      v-if="file.type.includes('image')"
                      :aspect-ratio="realSize ? '' : 1"
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
                            :class="bodyActiveColor + '--text'"
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
                  <b>Last modified:</b>
                  {{ getFormattedDate(file.lastModifiedDate) }}<br />
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
import ExifReader from "exifreader";
import AutocompleteWrapper from "./AutocompleteWrapper";
import CheckboxWrapper from "./CheckboxWrapper";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import ImageViewWrapper from "../image_view/ImageViewWrapper";
import toastMixin from "@/mixins/toastMixin";

export default {
  name: "FileInput",
  mixins: [autocompleteMixin, toastMixin],
  components: { ImageViewWrapper, CheckboxWrapper, AutocompleteWrapper },
  props: {
    recordOptions: Boolean,
    recordImage: {
      type: Boolean,
      default: true,
    },
    recordVideo: {
      type: Boolean,
      default: true,
    },
    recordAudio: {
      type: Boolean,
      default: true,
    },
    showExisting: Boolean,
    showExistingPreviews: {
      type: Boolean,
      default: true,
    },
    showNewFilesImmediately: Boolean,
    showResetFilesButton: Boolean,
    acceptMultiple: Boolean,
    acceptableFormat: {
      type: String,
      default: "image/*",
      validator: (value) => {
        return value.includes("/");
      },
    },
    realSize: Boolean,
    filesFromObject: {
      type: Array,
    },
    isClearable: {
      type: Boolean,
      default: true,
    },
    isDraggable: {
      type: Boolean,
      default: true,
    },
    openFile: Boolean,
    showAttachmentLink: Boolean,
  },
  computed: {
    ...mapState("settings", [
      "bodyColor",
      "bodyActiveColor",
      "bodyActiveColorDark",
    ]),

    isFilesValid() {
      return this.files && this.files.length > 0;
    },

    isExistingFilesValid() {
      return !!this.existingFiles;
    },

    userHasInsertedFiles() {
      return this.isFilesValid || this.isExistingFilesValid;
    },

    isDisabled() {
      return !this.acceptMultiple && this.userHasInsertedFiles;
    },
  },
  data: () => ({
    useExisting: false,
    isDragging: false,
    files: null,
    existingFiles: null,
    autocomplete: {
      attachment: [],
      loaders: { attachment: false },
    },
    sourceList: [],
    id: null,
    singleFileMetadata: null,
  }),
  mounted() {
    this.id = this._uid;
  },
  watch: {
    "$route.path"() {
      this.resetData();
      this.$emit("files-cleared");
    },
    files(newVal) {
      this.readFile(newVal);
    },
    filesFromObject: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.existingFiles = newVal;
          this.autocomplete.attachment = newVal;
          if (this.showExisting) this.useExisting = true;
        }
      },
      deep: true,
    },
    existingFiles(newVal) {
      if (newVal) {
        if (this.acceptMultiple) this.$emit("update:existing-files", newVal);
        else this.$emit("update:existing-files", [newVal]);
      } else this.$emit("update:existing-files", []);
    },
    isDraggable: {
      handler() {
        if (this.isDraggable === false) this.useExisting = true;
      },
      immediate: true,
    },
  },
  methods: {
    dropFile(event) {
      if (!this.isDisabled) {
        if (event.dataTransfer && event.dataTransfer.files) {
          let listOfFiles = [];
          const filesArr = Array.from(event.dataTransfer.files);
          filesArr.forEach((file) => listOfFiles.push(file));

          if (!this.acceptMultiple && listOfFiles.length > 1) {
            listOfFiles.splice(1);
          }

          if (this.files) listOfFiles.forEach((item) => this.files.push(item));
          else this.files = listOfFiles;
        }
      } else this.showDisabledError();
      this.isDragging = false;
    },

    addFile(file) {
      if (!Array.isArray(file)) file = [file];
      if (this.acceptMultiple) {
        if (this.files) file.forEach((item) => this.files.push(item));
        else this.files = file;
      } else if (this.userHasInsertedFiles) {
        this.showDisabledError();
      } else this.files = file;
    },

    async readFile(listOfFiles) {
      if (listOfFiles && listOfFiles.length > 0) {
        listOfFiles.forEach((file, index, object) => {
          if (!file.isAlreadyRead) {
            if (this.isValidFormat(file)) this.readFileSrc(file);
            else {
              object.splice(index, 1);
              this.toastError({
                text: this.$t("messages.validFileFormat", {
                  file: file.name,
                }),
              });
            }
          }
        });

        if (listOfFiles.length > 0) {
          if (listOfFiles.length === 1) {
            const fileMetadata = await this.readFileMetaData(listOfFiles[0]);
            if (fileMetadata) this.$emit("metadata-loaded", fileMetadata);
            this.updateSingleFileMetadata(fileMetadata);
            this.$emit("file-uploaded", listOfFiles, this.singleFileMetadata);
          } else this.$emit("file-uploaded", listOfFiles);
        }
      }
    },

    readFileSrc(file) {
      if (
        file.type.includes("image") ||
        file.type.includes("video") ||
        file.type.includes("audio")
      ) {
        let reader = new FileReader();
        reader.onload = (event) => {
          file.src = event.target.result;
          this.sourceList.push(event.target.result);
        };
        reader.readAsDataURL(file);
      }
      file.isAlreadyRead = true;
    },

    readFileMetaData(file) {
      if (
        !this.$helpers.isImageFile({
          ...file,
          attachment_format__value: file.type,
        })
      ) {
        return null;
      }
      return new Promise((resolve, reject) => {
        try {
          let reader = new FileReader();
          reader.onload = (event) => {
            let fileMetaData = ExifReader.load(event.target.result);
            resolve(fileMetaData);
          };
          reader.readAsArrayBuffer(file);
        } catch (error) {
          reject(error);
        }
      });
    },

    updateSingleFileMetadata(metadata) {
      this.singleFileMetadata = {};
      if (metadata) {
        // GPS DATA
        if (metadata.GPSLatitude) {
          const degrees =
            metadata.GPSLatitude[0].numerator /
            metadata.GPSLatitude[0].denominator;
          const minutes =
            metadata.GPSLatitude[1].numerator /
            metadata.GPSLatitude[1].denominator;
          const seconds =
            metadata.GPSLatitude[2].numerator /
            metadata.GPSLatitude[2].denominator;
          const latitude = this.convertExifGPSToDecimal(
            degrees,
            minutes,
            seconds,
            metadata.GPSLatitudeRef
          );
          this.singleFileMetadata.image_latitude = latitude.toFixed(6);
        }
        if (metadata.GPSLongitude) {
          const degrees =
            metadata.GPSLongitude[0].numerator /
            metadata.GPSLongitude[0].denominator;
          const minutes =
            metadata.GPSLongitude[1].numerator /
            metadata.GPSLongitude[1].denominator;
          const seconds =
            metadata.GPSLongitude[2].numerator /
            metadata.GPSLongitude[2].denominator;
          const longitude = this.convertExifGPSToDecimal(
            degrees,
            minutes,
            seconds,
            metadata.GPSLatitudeRef
          );

          this.singleFileMetadata.image_longitude = longitude.toFixed(6);
        }
      }
    },

    convertExifGPSToDecimal(degrees, minutes, seconds, direction) {
      // Formula from https://en.wikipedia.org/wiki/Geographic_coordinate_conversion#Coordinate_format_conversion
      let decimalDegrees = degrees + minutes / 60 + seconds / 3600;
      if (direction === "S" || direction === "W") {
        decimalDegrees = decimalDegrees * -1;
      }
      return decimalDegrees;
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
        loaders: { attachment: false },
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
      if (date) return this.$dayjs(date).format("YYYY-MM-DD HH:mm");
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
      let fileMimeType = file.type.split("/");
      let acceptableMimeType = this.acceptableFormat.split("/");

      if (acceptableMimeType[0] === "*") return true;
      else if (
        acceptableMimeType[0] === fileMimeType[0] &&
        acceptableMimeType[1] === "*"
      )
        return true;
      else return file.type === this.acceptableFormat;
    },

    showDisabledError() {
      if (this.isFilesValid) {
        this.toastInfo({ text: "You have already uploaded one file." });
      } else if (this.isExistingFilesValid) {
        this.toastInfo({ text: "You have already added one existing file." });
      } else this.toastInfo({ text: "You have already uploaded one file." });
    },
  },
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
