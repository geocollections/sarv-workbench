<template>
  <div class="sample-import mt-2">

    <SpinnerWrapper />

    <div class="h2 mb-3">{{ $t("header.sample_import") }}</div>
    <v-card elevation="4" :color="bodyColor.split('n-')[0] + 'n-5'" :loading="isLoading" loader-height="15">
      <div class="pa-1">
        <v-row no-gutters>
          <v-col cols="12" class="pa-1">
            <file-input
              show-new-files-immediately
              v-on:file-uploaded="addFiles"
              v-on:files-cleared="clearFiles"
              acceptable-format="*/*"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" class="pa-1 font-weight-bold">Request info:</v-col>

          <v-col cols="12" class="pa-1 ml-4"
            ><b>url</b>: {{ sample_import.url }}</v-col
          >

          <v-col cols="12" class="pa-1 ml-4" v-if="isFileAdded">
            <span>{{ $t("sample.sample_import1") }}</span>
            <span class="font-weight-bold ml-2"
              >'{{ sample_import.file[0].name }}'</span
            >
            <span class="ml-1 mr-2"
              >({{ getSizeAsMB(sample_import.file[0].size) }})</span
            >
            <span>{{ $t("sample.sample_import2") }}</span>
          </v-col>

          <v-col cols="12" class="pa-1" v-if="requestResponse"
            ><b>{{ $t("messages.response") }}</b
            >: {{ requestResponse }}</v-col
          >
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" class="pa-1">
            <v-btn
              @click="importFile"
              :color="bodyActiveColor"
              class="white--text"
              :disabled="!isFileAdded || isSuccess"
              :loading="isLoading"
            >
              {{ $t("buttons.send_request") }}
              <v-icon right>fas fa-cloud-upload-alt</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <!-- Todo: After successful upload (card): Attachment created -->

    <!-- Todo: After successful upload (card): Samples uploaded -->
  </div>
</template>

<script>
import FileInput from "@/components/partial/inputs/FileInput";
import {mapActions, mapState} from "vuex";
import { postRequest } from "@/assets/js/api/apiCalls";
import toastMixin from "@/mixins/toastMixin";
import SpinnerWrapper from "@/components/partial/SpinnerWrapper";

export default {
  name: "SampleImport",
  components: {SpinnerWrapper, FileInput },
  mixins: [toastMixin],
  data: () => ({
    sample_import: {
      url: "https://rwapi.geocollections.info/import/sample",
      file: []
    },
    fileData: null,
    requestResponse: null,
    isSuccess: false,
    isLoading: false
  }),
  computed: {
    ...mapState("settings", ["bodyColor", "bodyActiveColor"]),
    ...mapState("search", ["loadingState"]),

    isFileAdded() {
      return this.sample_import.file && this.sample_import.file.length === 1;
    }
  },
  methods: {
    ...mapActions("search", ["setLoadingState", "setLoadingType"]),

    addFiles(files) {
      this.sample_import.file = files;

      console.log(this.sample_import.file);
    },

    clearFiles() {
      this.sample_import.file = [];
    },

    async importFile() {
      this.setLoadingState(true);
      this.setLoadingType("add");

      let fileUploadResponse = await this.uploadFile();

      console.log(fileUploadResponse.status);

      await new Promise(r => setTimeout(r, 2000));

      if (fileUploadResponse) {
        this.isSuccess = fileUploadResponse.status.toString().startsWith("2");

        if (this.isSuccess) {
          this.toastSuccess({ text: "File successfully imported!" });

          //  Todo: Add imported file as attachment

          //  Todo: Get list of samples which were added using the imported file
        } else {
          this.toastError({ text: "File import failed!" });
        }

        this.setLoadingState(false)
      }
    },

    async uploadFile() {
      let formData = new FormData();

      if (this.sample_import.file && this.sample_import.file.length > 0) {
        this.sample_import.file.forEach((file, index) => {
          formData.append("file" + [index], file);
        });
      }

      try {
        let response = await postRequest(
          "",
          formData,
          this.sample_import.url,
          true
        );
        this.isSuccess = true;
        return response;
      } catch (err) {
        console.log(err);
        this.isSuccess = false;
        return false;
      }
    },

    getSizeAsMB(size) {
      if (size) return (size / 1000000).toFixed(2) + " MB";
    }
  }
};
</script>

<style scoped></style>
