<template>
  <div class="test mt-1">
    <v-card elevation="4" :color="bodyColor.split('n-')[0] + 'n-5'">
      <v-card-title class="pt-2 pb-1">Test interface</v-card-title>

      <v-card-text
        >You can find me from
        <code>src/components/partial/test/Test.vue</code></v-card-text
      >

      <div class="pa-1">
        <v-row no-gutters>
          <v-col cols="6" class="pa-1">
            <input-wrapper
              v-model="test.url"
              label="URL"
              :color="bodyActiveColor"
            />
          </v-col>

          <v-col cols="6" class="pa-1">
            <input-wrapper
              v-model="test.table"
              label="TABLE"
              :color="bodyActiveColor"
            />
          </v-col>
        </v-row>

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
          <v-col cols="6" class="pa-1">
            <input-wrapper
              v-model="test.textKey"
              label="KEY"
              :color="bodyActiveColor"
            />
          </v-col>

          <v-col cols="6" class="pa-1">
            <input-wrapper
              v-model="test.textValue"
              label="VALUE"
              :color="bodyActiveColor"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" class="pa-1 font-weight-bold">Request info:</v-col>

          <v-col cols="12" class="pa-1"><b>url</b>: {{ requestUrl }}</v-col>

          <v-col cols="12" class="pa-1"><b>data</b>: {{ requestData }}</v-col>

          <v-col cols="12" class="pa-1" v-if="requestResponse"
            ><b>response</b>: {{ this.requestResponse }}</v-col
          >
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" class="pa-1">
            <v-btn @click="upload" :color="bodyActiveColor" dark>
              Send request
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
import FileInput from "../inputs/FileInput";
import InputWrapper from "../inputs/InputWrapper";
import { mapState } from "vuex";
import { postRequest } from "../../../assets/js/api/apiCalls";
export default {
  name: "Test",
  components: { InputWrapper, FileInput },
  data: () => ({
    test: {
      url: "https://rwapi.geoloogia.info/api/v0/import/",
      table: "area",
      file: [],
      textKey: "text",
      textValue: "test",
    },
    requestResponse: null,
  }),
  computed: {
    ...mapState("settings", ["bodyColor", "bodyActiveColor"]),
    requestUrl() {
      return this.test.url + this.test.table;
    },
    requestData() {
      if (this.test.textKey) {
        return JSON.stringify({ [this.test.textKey]: this.test.textValue });
      } else return null;
    },
  },
  methods: {
    addFiles(files) {
      this.test.file = files;
    },
    clearFiles() {
      this.test.file = [];
    },
    async upload() {
      if (this.test.url && this.test.table) {
        let formData = new FormData();
        if (this.test.textKey) {
          formData.append("data", this.requestData);
        }
        if (this.test.file) {
          this.test.file.forEach((file, index) => {
            formData.append("file" + [index], file);
          });
        }
        try {
          let response = await postRequest(
            this.test.table,
            formData,
            this.test.url,
            true
          );
          this.requestResponse = response;
        } catch (err) {
          console.log(err);
          this.requestResponse = "ERROR: Something went wrong";
        }
      }
    },
  },
};
</script>

<style scoped></style>
