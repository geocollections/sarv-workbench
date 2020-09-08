<template>
  <div class="import">
    <SpinnerWrapper />

    <div class="h2 mb-3">{{ $t(`header.${$route.meta.object}_import`) }}</div>

    <v-card
      elevation="4"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      :loading="loadingState"
      loader-height="15"
    >
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
            ><b>url</b>: {{ fileImportUrl }}</v-col
          >

          <v-col cols="12" class="pa-1 ml-4" v-if="isFileAdded">
            <span>{{ $t("messages.file_import1") }}</span>
            <span class="font-weight-bold ml-2"
              >'{{ file_import.file[0].name }}'</span
            >
            <span class="ml-1 mr-2"
              >({{ getSizeAsMB(file_import.file[0].size) }})</span
            >
            <span>{{ $t("messages.file_import2") }}</span>
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
              :loading="loadingState"
            >
              {{ $t("buttons.send_request") }}
              <v-icon right>fas fa-cloud-upload-alt</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <!-- ATTACHMENT SKELETON LOADER -->
    <v-card v-show="loadingState" class="mt-2" elevation="4">
      <div class="pa-4 d-flex justify-center">
        <v-skeleton-loader
          style="height: 100px; width: 100px"
          type="image"
        ></v-skeleton-loader>
      </div>
    </v-card>

    <!-- RECORDS ADDED SKELETON LOADER -->
    <v-card
      v-show="loadingState && (showSamplesCard || showAnalysesCard)"
      class="mt-2"
      elevation="4"
    >
      <v-skeleton-loader type="table"></v-skeleton-loader>
    </v-card>

    
    <!-- TODO: Attachment card -->
    <!-- TODO: Samples card -->
    <!-- TODO: Analyses card -->
  </div>
</template>

<script>
import SpinnerWrapper from "@/components/partial/SpinnerWrapper";
import FileInput from "@/components/partial/inputs/FileInput";
import toastMixin from "@/mixins/toastMixin";
import { mapActions, mapState } from "vuex";
import { postRequest } from "@/assets/js/api/apiCalls";
export default {
  name: "Import",

  components: { SpinnerWrapper, FileInput },

  mixins: [toastMixin],

  data: () => ({
    file_import: {
      url: "https://rwapi.geocollections.info/import/",
      file: []
    },
    fileData: null,
    requestResponse: null,
    isSuccess: false
  }),

  computed: {
    ...mapState("settings", ["bodyColor", "bodyActiveColor"]),
    ...mapState("search", ["loadingState"]),

    isFileAdded() {
      return this.file_import.file && this.file_import.file.length === 1;
    },

    fileImportUrl() {
      return this.file_import.url + this.$route.meta.object;
    },

    showSamplesCard() {
      return this.$route.meta.object === "sample";
    },

    showAnalysesCard() {
      return this.$route.meta.object === "analysis";
    }
  },

  methods: {
    ...mapActions("search", ["setLoadingState", "setLoadingType"]),

    addFiles(files) {
      this.file_import.file = files;
    },

    clearFiles() {
      this.file_import.file = [];
      this.isSuccess = false;
    },

    async importFile() {
      this.setLoadingState(true);
      this.setLoadingType("add");

      let fileUploadResponse = await this.uploadFile();

      // Todo: Delete timeout
      await new Promise(r => setTimeout(r, 2000));

      if (fileUploadResponse) {
        // Todo: Change it back
        this.isSuccess = fileUploadResponse.status.toString().startsWith("4");

        if (this.isSuccess) {
          if (fileUploadResponse?.data?.message) {
            let message = fileUploadResponse.data.message;

            if (message.includes("skipped rows"))
              this.toastInfo({
                text: "File partially imported! (skipped rows)"
              });
            else this.toastSuccess({ text: "File successfully imported!" });

            this.requestResponse = message;
          }

          //  Todo: Add imported file as attachment
          let attachmentUploadResponse = await this.uploadImportedFileAsNewAttachment();

          console.log(attachmentUploadResponse);

          //  Todo: Get list of samples or analyses which were added using the imported file
          let newlyAddedRecordsResponse = await this.getNewlyAddedRecords();

          console.log(newlyAddedRecordsResponse);
        } else {
          this.toastError({ text: "File import failed!" });
          this.requestResponse = fileUploadResponse?.data;
        }

        this.setLoadingState(false);
      }
    },

    async uploadFile() {
      let formData = new FormData();

      if (this.file_import.file && this.file_import.file.length > 0) {
        this.file_import.file.forEach((file, index) => {
          formData.append("file" + [index], file);
        });
      }

      try {
        let response = await postRequest(
          "",
          formData,
          this.fileImportUrl,
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

    async uploadImportedFileAsNewAttachment() {
      console.log("Upload imported file as attachment");

      await new Promise(r => setTimeout(r, 1000));

      return "New file added";
    },

    async getNewlyAddedRecords() {
      console.log("Fetching new records...");
      if (this.showSamplesCard) {
        console.log("Todo: fetch new samples");
      } else if (this.showAnalysesCard) {
        console.log("Todo: fetch new analyses");
      }

      await new Promise(r => setTimeout(r, 1000));

      return "New records received";
    },

    getSizeAsMB(size) {
      if (size) return (size / 1000000).toFixed(2) + " MB";
    }
  }
};
</script>

<style scoped></style>
