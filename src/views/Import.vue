<template>
  <div class="import">
    <SpinnerWrapper />

    <div class="h2 mb-3">{{ $t(`header.${$route.meta.object}_import`) }}</div>

    <v-card elevation="4" :color="bodyColor.split('n-')[0] + 'n-5'">
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
              >'{{ fileImport.file[0].name }}'</span
            >
            <span class="ml-1 mr-2"
              >({{ getSizeAsMB(fileImport.file[0].size) }})</span
            >
            <span>{{ $t("messages.file_import2") }}</span>
          </v-col>

          <v-col cols="12" class="pa-1" v-if="fileImportResponse"
            ><b>{{ $t("messages.response") }}</b
            >: {{ fileImportResponse }}</v-col
          >
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" class="pa-1">
            <v-btn
              @click="importFile"
              :color="bodyActiveColor"
              class="white--text"
              :disabled="!isFileAdded || isFileImportSuccess"
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

    <!-- ATTACHMENT CARD -->
    <v-card
      class="mt-2"
      v-show="!loadingState && attachmentResponse"
      elevation="4"
      :color="bodyColor.split('n-')[0] + 'n-5'"
    >
      <v-card-title>{{ $t("header.attachment") }}</v-card-title>

      <v-card-text>
        <v-alert v-if="attachment" type="success" text border="right">
          {{ $t("messages.attachment_upload_success") }}
          <span class="font-weight-bold"
            >ID:
            <router-link :to="`/attachment/${attachment[0].id}`">{{
              attachment[0].id
            }}</router-link></span
          >
        </v-alert>

        <v-alert v-else type="error" text border="right">
          <span class="mr-2">
            {{ $t("messages.attachment_upload_error") }}
          </span>

          <v-btn
            v-if="
              isFileAdded &&
                isFileImportSuccess &&
                !attachment &&
                !isAttachmentSuccess
            "
            small
            @click="retryUploadImportedFileAsNewAttachment"
            :color="bodyActiveColor"
            class="white--text"
            :loading="loadingState"
          >
            {{ $t("buttons.try_again") }}
            <v-icon right small>fas fa-undo-alt</v-icon>
          </v-btn>
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- TODO: Records card (samples and analyses) -->
    <!-- RECORDS CARD -->
    <v-card
      class="mt-2"
      v-show="!loadingState && recordsResponse"
      elevation="4"
      :color="bodyColor.split('n-')[0] + 'n-5'"
    >
      <v-card-title>{{ $t(`header.${$route.meta.object}`) }}</v-card-title>

      <div>
        Todo: Records here
      </div>
    </v-card>
  </div>
</template>

<script>
import SpinnerWrapper from "@/components/partial/SpinnerWrapper";
import FileInput from "@/components/partial/inputs/FileInput";
import toastMixin from "@/mixins/toastMixin";
import { mapActions, mapGetters, mapState } from "vuex";
import { postRequest } from "@/assets/js/api/apiCalls";
export default {
  name: "Import",

  components: { SpinnerWrapper, FileInput },

  mixins: [toastMixin],

  data: () => ({
    fileImport: {
      url: "https://rwapi.geocollections.info/import/",
      file: []
    },
    fileImportResponse: null,
    isFileImportSuccess: false,
    attachmentResponse: null,
    isAttachmentSuccess: false,
    isAttachmentRetrying: false,
    attachment: null,
    recordsResponse: null,
    isRecordsSuccess: false,
    records: {
      count: 0,
      results: []
    }
  }),

  computed: {
    ...mapState("settings", ["bodyColor", "bodyActiveColor"]),
    ...mapState("search", ["loadingState"]),
    ...mapGetters("user", ["getCurrentUser"]),

    isFileAdded() {
      return this.fileImport.file && this.fileImport.file.length === 1;
    },

    fileImportUrl() {
      return this.fileImport.url + this.$route.meta.object;
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
      this.fileImport.file = files;
    },

    clearFiles() {
      this.fileImport.file = [];
      this.isFileImportSuccess = false;
      this.fileImportResponse = null;
      this.attachmentResponse = null;
      this.attachment = null;
      this.recordsResponse = null;
      this.isRecordsSuccess = false;
      this.records = {
        count: 0,
        results: []
      };
    },

    async importFile() {
      this.setLoadingState(true);
      this.setLoadingType("add");

      let fileUploadResponse = await this.uploadFile();

      if (fileUploadResponse) {
        this.isFileImportSuccess = fileUploadResponse.status
          .toString()
          .startsWith("2");

        if (this.isFileImportSuccess) {
          if (fileUploadResponse?.data?.message) {
            let message = fileUploadResponse.data.message;

            if (message.includes("skipped rows"))
              this.toastInfo({
                text: "File partially imported! (skipped rows)"
              });
            else this.toastSuccess({ text: "File successfully imported!" });

            this.fileImportResponse = message;

            await this.uploadImportedFileAsNewAttachment();
            await this.getNewlyAddedRecords();
          } else if (fileUploadResponse?.data?.error)
            this.toastError({ text: fileUploadResponse.data.error });
        } else {
          this.toastError({ text: "File import failed!" });
          this.fileImportResponse = fileUploadResponse?.data;
        }

        this.setLoadingState(false);
      }
    },

    async uploadFile() {
      let formData = new FormData();

      if (this.fileImport.file && this.fileImport.file.length > 0) {
        this.fileImport.file.forEach((file, index) => {
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
        this.isFileImportSuccess = true;
        return response;
      } catch (err) {
        console.log(err);
        this.isFileImportSuccess = false;
        return false;
      }
    },

    async uploadImportedFileAsNewAttachment() {
      console.log(this.getCurrentUser.id);
      let data = {
        description: `See fail loodi kasutades faili importi. Failinimi: ${
          this.fileImport.file[0].name
        }, Kuupäev: ${new Date().toISOString().split("T")[0]}`,
        description_en: `This attachment was created using file import. Filename: ${
          this.fileImport.file[0].name
        }, Date: ${new Date().toISOString().split("T")[0]}`,
        is_private: true,
        author: this.getCurrentUser.id
      };

      let formData = new FormData();
      formData.append("data", JSON.stringify(data));
      formData.append("file0", this.fileImport.file[0]);

      await postRequest("add/attachment/", formData, "", true).then(
        response => {
          if (response && response.status === 200) {
            this.toastSuccess({
              text: this.$t("messages.attachment_upload_success")
            });
            this.attachmentResponse = response.data;
            this.attachment = response.data.results;
            this.isAttachmentSuccess = true;
          } else {
            this.toastError({
              text: this.$t("messages.attachment_upload_error")
            });
            this.attachmentResponse = response.data;
            this.attachment = null;
            this.isAttachmentSuccess = false;
          }
        },
        errResponse => {
          this.toastError({
            text: this.$t("messages.attachment_upload_error")
          });
          this.attachmentResponse = errResponse;
          this.attachment = null;
          this.isAttachmentSuccess = false;
        }
      );
    },

    async retryUploadImportedFileAsNewAttachment() {
      this.setLoadingState(true);
      this.setLoadingType("add");
      await this.uploadImportedFileAsNewAttachment();
      this.setLoadingState(false);
    },

    async getNewlyAddedRecords() {
      // Todo: Get newly added records
      if (this.showSamplesCard) {
        console.log("Todo: fetch new samples");
      } else if (this.showAnalysesCard) {
        console.log("Todo: fetch new analyses");
      }
    },

    getSizeAsMB(size) {
      if (size) return (size / 1000000).toFixed(2) + " MB";
    }
  }
};
</script>

<style scoped>
.link:hover {
  opacity: 0.7;
}
</style>
