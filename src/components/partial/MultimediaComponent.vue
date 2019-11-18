<template>
  <!-- FILE -->
  <div class="row">
    <div class="col-sm-12 mb-2">
      <label
        :for="`files`"
        v-bind:class="isDragging ? 'dragging upload-icon py-3' : 'py-4'"
        v-on:dragover.stop.prevent="isDragging = true"
        v-on:dragleave.stop.prevent="isDragging = false"
        v-on:drop.stop.prevent="dropFile"
        class="d-flex justify-content-center align-items-center file-upload"
      >
        <span :class="{ 'hide-text': isDragging }">
          {{ $t("add.inputs.fileInput") }}
        </span>
      </label>

      <div
        class="mt-2 mb-0 alert alert-warning"
        v-if="files !== null && files.length >= 10"
      >
        {{ $t("add.inputs.fileInputMaxError", { num: files.length }) }}
      </div>

      <!-- TODO: https://github.com/bootstrap-vue/bootstrap-vue/issues/1526, If multiple then accept does not take multiple formats. BUG -->
      <!-- TODO: BUG: If too many files or long filenames then breaks the input design -->
      <b-form-file
        v-model="files"
        id="files"
        :state="filesState"
        :multiple="acceptMultiple"
        plain
        style="display: none"
        ref="fileinput"
        :accept="acceptableFormat"
        :placeholder="$t('add.inputs.fileInput')"
      >
      </b-form-file>

      <b-form-text v-if="!filesState">
        <div v-if="acceptMultiple">{{ $t("add.errors.files") }}.</div>
        <div v-else>{{ $t("add.errors.files2") }}.</div>
      </b-form-text>
    </div>

    <div
      class="col-sm-12 mb-2 record-options"
      v-if="filesState || recordOptions"
    >
      <div class="d-flex flex-wrap justify-content-start">
        <div
          v-if="recordImage && recordOptions"
          :class="{ 'flex-grow-1': !recordVideo && !recordAudio }"
        >
          <label :for="`photo-upload`" class="btn btn-outline-primary p-2 mr-2">
            <i class="fas fa-camera-retro"></i>
            {{ $t("add.inputs.photoInput") }}
          </label>

          <b-form-file
            v-model="recordedFile"
            accept="image/*;capture=camera"
            id="photo-upload"
            plain
            style="display: none"
            ref="fileinput"
            :placeholder="$t('add.inputs.fileInput')"
          >
          </b-form-file>
        </div>

        <div
          v-if="recordVideo && recordOptions"
          :class="{ 'flex-grow-1': !recordAudio }"
        >
          <label :for="`video-upload`" class="btn btn-outline-primary p-2 mr-2">
            <i class="fas fa-video"></i>
            {{ $t("add.inputs.videoInput") }}
          </label>

          <b-form-file
            v-model="recordedFile"
            accept="video/*;capture=camcorder"
            id="video-upload"
            plain
            style="display: none"
            ref="fileinput"
            :placeholder="$t('add.inputs.fileInput')"
          >
          </b-form-file>
        </div>

        <div v-if="recordAudio && recordOptions" class="flex-grow-1">
          <label :for="`audio-upload`" class="btn btn-outline-primary p-2 mr-2">
            <i class="fas fa-microphone"></i>
            {{ $t("add.inputs.audioInput") }}
          </label>
          <b-form-file
            v-model="recordedFile"
            accept="audio/*;capture=microphone"
            id="audio-upload"
            plain
            style="display: none"
            ref="fileinput"
            :placeholder="$t('add.inputs.fileInput')"
          >
          </b-form-file>
        </div>

        <div v-if="filesState">
          <button
            class="btn btn-outline-danger p-2"
            :disabled="sendingData"
            @click="clearFile"
            :title="
              arrayOfFiles.length > 1
                ? $tc('add.buttons.resetFile', 2)
                : $tc('add.buttons.resetFile', 1)
            "
          >
            <!--<font-awesome-icon icon="trash-alt"/>-->
            <span v-show="arrayOfFiles.length === 1">{{
              $tc("add.buttons.resetFile", 1)
            }}</span>
            <span v-show="arrayOfFiles.length > 1">{{
              $tc("add.buttons.resetFile", 2)
            }}</span>
          </button>
        </div>

        <div v-if="filesState && showTryAgainButton" class="ml-2">
          <button
            class="btn btn-outline-warning p-2"
            :disabled="sendingData"
            @click="
              $emit(
                'file-uploaded',
                recordedFile.length > 0 ? recordedFile : arrayOfFiles
              )
            "
            :title="$t('add.buttons.tryAgain')"
          >
            {{ $t("add.buttons.tryAgain") }}
          </button>
        </div>
      </div>
    </div>

    <div
      class="d-flex flex-wrap align-items-center col"
      v-if="files && arrayOfFiles.length > 0"
    >
      <div
        class="align-self-center my-2 mx-5"
        v-for="(file, key) in arrayOfFiles"
        :key="file.name"
      >
        <!-- FILES -->
        <div class="file-container" :title="file.name">
          <!-- AUDIO -->
          <audio
            v-if="file.type.includes('audio')"
            :ref="'image' + parseInt(key)"
            controls
          >
            Your browser does not support the audio element.
            <i class="far fa-file-audio fa-5x"></i>
          </audio>

          <!-- VIDEO -->
          <video
            v-else-if="file.type.includes('video')"
            :ref="'image' + parseInt(key)"
            type="video"
            style="max-height: 12rem"
            controls
          >
            Your browser does not support the video element.
            <i class="far fa-file-video fa-5x"></i>
          </video>

          <!-- IMAGE -->
          <img
            v-else-if="file.type.includes('image')"
            :ref="'image' + parseInt(key)"
            alt="Image preview..."
            class="img-thumbnail image"
          />

          <!-- IF ABOVE FAILS THEN SHOW FILE ICON -->
          <i
            v-else-if="file.type.includes('pdf')"
            class="far fa-file-pdf fa-5x"
          ></i>
          <i v-else class="far fa-file fa-5x"></i>

          <div class="middle">
            <div class="hover-text-box">
              <div>{{ file.name }}</div>
            </div>
          </div>

          <!--          <div class="my-1">-->
          <!--            <div class="text-box">-->
          <!--              <div>{{truncateFileInfo(file)}}</div>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EXIF from "exif-js";
import { toastError, toastInfo } from "../../assets/js/iziToast/iziToast";

export default {
  name: "multimedia-component",
  props: {
    recordOptions: {
      type: Boolean
    },
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
    acceptableFormat: {
      type: String,
      required: false,
      default: "image/*",
      validator: value => {
        return value.includes("/");
      }
    },
    acceptMultiple: {
      type: Boolean,
      default: true
    },
    showTryAgainButton: {
      type: Boolean,
      default: false
    },
    clearFiles: {
      type: Boolean
    }
  },
  data() {
    return {
      apiUrl: "https://rwapi.geocollections.info/",
      loadingPercent: 0,
      sendingData: false,
      files: [],
      fileMetaData: null,
      isDragging: false,
      upload: {},
      recordedFile: [],
      arrayOfFiles: []
    };
  },
  computed: {
    filesState() {
      return this.files !== null && this.arrayOfFiles.length > 0;
    }
  },
  watch: {
    recordedFile: function(newVal) {
      this.files.push(newVal);
    },
    files: function(newVal) {
      this.arrayOfFiles = [];
      if (Array.isArray(newVal)) {
        this.arrayOfFiles = newVal;
      } else {
        // Adding File object to array
        // because for single file upload only File object is returned
        if (newVal !== null) {
          // null check because 'cancel' returns null for single upload
          this.arrayOfFiles.push(newVal);
        }
      }

      if (this.arrayOfFiles.length > 0) {
        for (let i = 0; i < this.arrayOfFiles.length; i++) {
          console.log(this.arrayOfFiles[i]);
          if (
            this.arrayOfFiles[i].type.includes("image") ||
            this.arrayOfFiles[i].type.includes("video") ||
            this.arrayOfFiles[i].type.includes("audio")
          ) {
            let reader = new FileReader();

            reader.onload = event => {
              this.$emit(
                "file-uploaded",
                this.recordedFile.length > 0
                  ? this.recordedFile
                  : this.arrayOfFiles
              );

              // console.log(event.target.result)
              this.$refs["image" + parseInt(i)][0].src = event.target.result;
            };
            reader.readAsDataURL(this.files[i]);
          } else if (this.arrayOfFiles[i].type.includes("pdf")) {
            this.$emit(
              "file-uploaded",
              this.recordedFile.length > 0
                ? this.recordedFile
                : this.arrayOfFiles
            );
          }
        }
      }

      if (this.arrayOfFiles.length === 1) {
        this.readMetaData(this.arrayOfFiles[0]);
      }
    },
    clearFiles: function(newVal) {
      if (newVal) {
        this.clearFile();
      }
    }
  },
  methods: {
    clearFile() {
      if (this.$refs.fileinput) this.$refs.fileinput.reset();
      this.files = [];
      this.$emit("files-cleared", true);
    },

    dropFile(event) {
      let files = [];
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        console.log(event.dataTransfer.files[i]);

        let fileMimeType = this.getTypeAndSubtype(
          event.dataTransfer.files[i].type
        );
        let acceptableFormatMimeType = this.getTypeAndSubtype(
          this.acceptableFormat
        );

        if (acceptableFormatMimeType[0] === "*") {
          // ['*', '*']
          files.push(event.dataTransfer.files[i]);
        } else if (
          acceptableFormatMimeType[0] === fileMimeType[0] &&
          acceptableFormatMimeType[1] === "*"
        ) {
          // ['image', '*'] && ['image', 'png']
          files.push(event.dataTransfer.files[i]);
        } else if (
          acceptableFormatMimeType[0] === fileMimeType[0] &&
          acceptableFormatMimeType[1] === fileMimeType[1]
        ) {
          // ['image', 'png'] && ['image', 'png']
          files.push(event.dataTransfer.files[i]);
        } else {
          toastError({
            text: this.$t("messages.validFileFormatUniversal", {
              file: event.dataTransfer.files[i].name
            })
          });
          toastInfo({
            text: this.$t("messages.useCorrectFormat", {
              format: this.acceptableFormat
            }),
            timeout: 5000
          });
          break;
        }

        if (!this.acceptMultiple) {
          toastInfo({ text: this.$t("messages.onlyOneFile") });
          break;
        }
      }

      if (files.length > 0) {
        this.files = files;
      }
      this.isDragging = false;
    },

    readMetaData(file) {
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = event => {
        // TODO: Get thumbnail
        this.fileMetaData = EXIF.readFromBinaryFile(event.target.result);
        this.$emit("metadata-loaded", this.fileMetaData);
      };
    },

    /**
     * Methods takes one argument: file's MIME type and returns file's type and subtype in an Array
     * @param mimeType {String}. File's MIME type --> application/pdf etc.
     * @returns {Array} of type and subtype --> [type, subtype]
     */
    getTypeAndSubtype(mimeType) {
      return mimeType.split("/");
    },

    truncateFileInfo(file) {
      // Showing only first 35 characters of filename
      if (file.name && file.name.length > 37)
        return file.name.substring(0, 35) + "...";
      else return file.name;
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

.hide-text {
  display: none;
}

.record-options > label:hover {
  cursor: pointer;
}

.image {
  max-height: 12rem;
  -webkit-transition: 0.2s ease;
  transition: 0.2s ease;
}

.file-container {
  position: relative;
  cursor: pointer;
  text-align: center;
}

.file-container > .icon {
  text-align: center;
}

.file-container:hover .image {
  opacity: 0.7;
}

.file-container:hover .middle {
  opacity: 1;
}

.text-box {
  width: 25vh;
  margin: auto;
  text-align: center;
  font-size: 12px;
  word-wrap: break-word;
}

.reset-button-wrapper {
  margin-left: auto;
}

@media (max-width: 767.98px) {
  .reset-button-wrapper {
    margin-left: unset;
  }
}

.middle {
  opacity: 0;
  -webkit-transition: opacity 0.2s ease;
  transition: opacity 0.2s ease;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}

.hover-text-box {
  background-color: #5e676a;
  color: white;
  width: 20vh;
  margin: auto;
  text-align: center;
  font-size: 12px;
  word-wrap: break-word;
}
</style>
