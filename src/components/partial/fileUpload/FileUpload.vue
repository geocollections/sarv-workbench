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
          v-model="files"
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
      </div>

      <div class="ma-1" v-if="recordOptions && recordVideo">
        <v-btn
          :icon="$vuetify.breakpoint.mdAndDown"
          class="text-none"
          :color="appSettings.bodyActiveColor"
          :dark="appSettings.bodyActiveColorDark"
          :title="$t('add.inputs.videoInput')"
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
      </div>

      <div class="ma-1" v-if="recordOptions && recordAudio">
        <v-btn
          :icon="$vuetify.breakpoint.mdAndDown"
          class="text-none"
          :color="appSettings.bodyActiveColor"
          :dark="appSettings.bodyActiveColorDark"
          :title="$t('add.inputs.audioInput')"
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
    <v-row no-gutters v-if="existingFiles">
      <v-col cols="12" class="pa-1">
        <image-view-wrapper
          :data="existingFiles"
          :body-color="appSettings.bodyColor"
          :body-active-color="appSettings.bodyActiveColor"
          clear-item-background
        />
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

export default {
  name: "FileUpload",
  mixins: [autocompleteMixin],
  components: {ImageViewWrapper, CheckboxWrapper, AutocompleteWrapper },
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
    }
  }),
  watch: {
    "$route.path"() {
      this.resetData();
      this.$emit("files-cleared");
    }
  },
  methods: {
    dropFile(event) {
      console.log(event);
    },

    addFile(file) {
      console.log(file);
    },

    clearFile() {
      this.files = null;
      this.existingFiles = null;
      this.$emit("files-cleared");
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
