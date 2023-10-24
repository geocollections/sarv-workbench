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
      </div>
    </v-card>
    <v-row no-gutters class="my-2">
      <v-col>
        <object-permissions-create
          v-if="!$route.meta.isEdit"
          title="permissions.title_import"
          message="permissions.import_permissions_message"
          @change="handlePermissionsChange"
        />
      </v-col>
    </v-row>
    <v-card
      ><div>
        <v-row no-gutters>
          <v-col cols="12" class="pa-1 font-weight-bold">Request info:</v-col>

          <v-col cols="12" class="pa-1 ml-4"><b>url</b>: {{ importUrl }}</v-col>

          <v-col cols="12" class="pa-1 ml-4" v-if="isFileAdded">
            <span>{{ $t("messages.file_import1") }}</span>
            <span class="font-weight-bold ml-2">'{{ file[0].name }}'</span>
            <span class="ml-1 mr-2">({{ getSizeAsMB(file[0].size) }})</span>
            <span>{{ $t("messages.file_import2") }}</span>
          </v-col>

          <v-col cols="12" class="pa-1" v-if="importResponse"
            ><b>{{ $t("messages.response") }}</b
            >: {{ importResponse }}</v-col
          >
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" class="pa-1">
            <v-btn
              @click="importFile"
              :color="bodyActiveColor"
              class="white--text"
              :disabled="!isFileAdded"
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
    <v-card v-if="loadingState && !attachment" class="mt-2" elevation="4">
      <div class="pa-4 d-flex justify-center">
        <v-skeleton-loader
          style="height: 100px; width: 100px"
          type="image"
        ></v-skeleton-loader>
      </div>
    </v-card>

    <!-- ATTACHMENT CARD -->
    <v-card
      class="mt-2"
      v-if="!loadingState && attachment"
      elevation="4"
      :color="bodyColor.split('n-')[0] + 'n-5'"
    >
      <v-card-title>{{ $t("header.attachment") }}</v-card-title>

      <v-card-text>
        <v-alert type="success" text border="right">
          {{ $t("messages.attachment_upload_success") }}
          <span class="font-weight-bold"
            >ID:
            <router-link :to="`/attachment/${attachment.attachment_id}`">{{
              attachment.attachment_id
            }}</router-link></span
          >
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- RECORDS ADDED SKELETON LOADER -->
    <v-card
      v-if="loadingState && (showSamplesCard || showAnalysesCard)"
      class="mt-2"
      elevation="4"
    >
      <v-skeleton-loader type="table"></v-skeleton-loader>
    </v-card>

    <!-- TODO: Records card (samples and analyses) -->
    <!-- RECORDS CARD -->
    <v-card
      class="mt-2"
      v-if="!loadingState && records.count > 0"
      elevation="4"
      :color="bodyColor.split('n-')[0] + 'n-5'"
    >
      <v-card-title>{{ $t(`header.${$route.meta.object}`) }}</v-card-title>

      <div>Todo: Records here</div>
    </v-card>
  </div>
</template>

<script>
import SpinnerWrapper from "@/components/partial/SpinnerWrapper.vue";
import FileInput from "@/components/partial/inputs/FileInput.vue";
import toastMixin from "@/mixins/toastMixin";
import { mapActions, mapGetters, mapState } from "vuex";
import { postRequest } from "@/assets/js/api/apiCalls";
import ObjectPermissionsCreate from "../components/partial/ObjectPermissionsCreate.vue";

export default {
  name: "Import",

  components: { SpinnerWrapper, FileInput, ObjectPermissionsCreate },

  mixins: [toastMixin],

  data: () => ({
    url: `${import.meta.env.VITE_API_URL}/api/v0/private/import/`,
    importResponse: null,
    initialPermissions: {
      groups_view: [],
      groups_change: [],
      users_view: [],
      users_change: [],
    },
    file: null,
    attachment: null,
    records: {
      count: 0,
      results: [],
    },
  }),

  computed: {
    ...mapState("settings", ["bodyColor", "bodyActiveColor"]),
    ...mapState("search", ["loadingState"]),
    ...mapGetters("user", ["getCurrentUser"]),

    isFileAdded() {
      return this?.file?.length === 1;
    },

    importUrl() {
      return this.url + this.$route.meta.object;
    },

    showSamplesCard() {
      return this.$route.meta.object === "sample";
    },

    showAnalysesCard() {
      return this.$route.meta.object === "analysis";
    },
  },

  methods: {
    ...mapActions("search", ["setLoadingState", "setLoadingType"]),

    addFiles(files) {
      this.file = files;
    },

    clearFiles() {
      this.file = null;
      this.importResponse = null;
      this.attachment = null;
      this.records = {
        count: 0,
        results: [],
      };
    },

    async importFile() {
      this.setLoadingState(true);
      this.setLoadingType("add");

      let fileUploadResponse = await this.uploadFile();

      if (fileUploadResponse?.data?.message) {
        const message = fileUploadResponse.data.message;

        this.toastSuccess({ text: message });

        this.importResponse = message;

        await this.uploadImportedFileAsNewAttachment();
        await this.getNewlyAddedRecords();
      } else if (fileUploadResponse?.data?.error) {
        // Todo: Handle different errors
        // invalid_column_names
        // cant_insert_in
        // wrong_data_type
        // missing_records_database
        // missing_columns
        // missing_values
        // non_unique_values_file
        // non_unique_values_database
        const error = JSON.stringify(fileUploadResponse.data.error);
        this.toastError({ text: error });
        this.importResponse = error;
      } else {
        this.toastError({ text: "File import failed!" });
        this.importResponse = fileUploadResponse?.data;
      }
      this.setLoadingState(false);
    },

    async uploadFile() {
      let formData = new FormData();

      if (this?.file?.length > 0) {
        this.file.forEach((file, index) => {
          formData.append("file" + [index], file);
        });
      }
      formData.append(
        "initial_permissions",
        JSON.stringify(this.initialPermissions)
      );

      try {
        return await postRequest("", formData, this.importUrl);
      } catch (err) {
        console.log(err);
        return false;
      }
    },

    async uploadImportedFileAsNewAttachment() {
      console.log(this.getCurrentUser.id);
      let data = {
        description: `See fail loodi kasutades faili importi. Failinimi: ${
          this?.file?.[0]?.name
        }, Kuupäev: ${new Date().toISOString().split("T")[0]}`,
        description_en: `This attachment was created using file import. Filename: ${
          this?.file?.[0]?.name
        }, Date: ${new Date().toISOString().split("T")[0]}`,
        is_private: true,
        author: this?.getCurrentUser?.id,
        initial_permissions: this.initialPermissions,
      };

      let formData = new FormData();
      formData.append("data", JSON.stringify(data));
      formData.append("file0", this.file[0]);

      await postRequest("add/attachment/", formData, "").then(
        (response) => {
          if (response && response.status === 200) {
            this.toastSuccess({
              text: this.$t("messages.attachment_upload_success"),
            });
            this.attachment = response.data;
          } else {
            this.toastError({
              text: this.$t("messages.attachment_upload_error"),
            });
            this.attachment = null;
          }
        },
        (errResponse) => {
          this.toastError({
            text: this.$t("messages.attachment_upload_error"),
          });
          this.attachment = null;
        }
      );
    },
    handlePermissionsChange(perms) {
      this.initialPermissions = perms;
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
    },
  },
};
</script>

<style scoped>
.link:hover {
  opacity: 0.7;
}
</style>
