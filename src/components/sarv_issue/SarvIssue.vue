<template>
  <div class="sarv-issue">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span>{{ $t("common.generalInfo") }}</span>
          <v-icon right>fas fa-project-diagram</v-icon>
        </div>
        <v-spacer />
        <v-btn icon @click="block.info = !block.info" :color="bodyActiveColor">
          <v-icon>{{
            block.info ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.info" class="pa-1">
          <!-- TITLE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="sarv_issue.title"
                :color="bodyActiveColor"
                :label="$t('sarv_issue.title')"
                use-state
                :disabled="$route.meta.isEdit"
              />
            </v-col>
          </v-row>

          <!-- DESCRIPTION -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="sarv_issue.description"
                :color="bodyActiveColor"
                :label="$t('sarv_issue.description')"
                use-state
                :disabled="$route.meta.isEdit"
              />
            </v-col>
          </v-row>

          <!-- URL -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="sarv_issue.url"
                :color="bodyActiveColor"
                :label="$t('sarv_issue.url')"
                :disabled="$route.meta.isEdit"
              />
            </v-col>
          </v-row>

          <!-- TO_USER -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-if="$route.meta.isEdit"
                v-model="sarv_issue.from_user"
                :color="bodyActiveColor"
                :items="autocomplete.users"
                item-text="username"
                :label="$t('sarv_issue.from_user')"
                disabled
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-if="!$route.meta.isEdit"
                v-model="sarv_issue.to_user"
                :color="bodyActiveColor"
                :items="autocomplete.users"
                item-text="username"
                :label="$t('sarv_issue.to_user')"
                use-state
              />
            </v-col>
          </v-row>

          <!-- RESPONSE -->
          <v-row no-gutters v-if="$route.meta.isEdit && canUserWriteAResponse">
            <v-col cols="12" class="pa-1">
              <div
                class="ml-3 mb-1 font-weight-bold success--text"
                v-if="isNotEmpty(initialResponse)"
              >
                {{ $t("sarv_issue.message_answered") }}
              </div>

              <textarea-wrapper
                v-model="sarv_issue.response"
                :color="bodyActiveColor"
                :label="$t('sarv_issue.response')"
                use-state
                :disabled="this.isNotEmpty(initialResponse)"
              />
            </v-col>
          </v-row>

          <!-- VIEW RESPONSE -->
          <div
            v-else-if="$route.meta.isEdit"
            class="d-flex flex-row flex-wrap pa-1"
          >
            <div class="font-weight-bold mr-2">
              {{ $t("sarv_issue.response") }}:
            </div>
            <div v-if="isNotEmpty(sarv_issue.response)">
              {{ sarv_issue.response }}
            </div>
            <v-card flat v-else class="error--text">{{
              $t("sarv_issue.unanswered")
            }}</v-card>
          </div>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import InputWrapper from "../partial/inputs/InputWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import { mapGetters, mapState } from "vuex";
import { fetchSarvIssue, fetchUsers } from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "SarvIssue",

  components: { AutocompleteWrapper, TextareaWrapper, InputWrapper },

  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true,
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
  },

  mixins: [formManipulation, autocompleteMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.sarv_issueSearchParameters,
        request: "FETCH_SARV_ISSUES",
        title: "header.sarv_issues",
        object: "sarv_issue",
        field: "title",
      });
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler: function () {
        this.reloadData();
      },
      deep: true,
    },
  },

  computed: {
    ...mapState("search", ["sarv_issueSearchParameters"]),

    ...mapGetters("user", ["getCurrentAgent", "getUserId"]),

    canUserWriteAResponse() {
      if (this.$route.meta.isEdit && this.sarv_issue) {
        return this.sarv_issue?.to_user?.id === this.getUserId;
      } else return false;
    },
  },

  methods: {
    setInitialData() {
      return {
        copyFields: [
          "id",
          "title",
          "description",
          "url",
          "to_user",
          "from_user",
          "response",
        ],
        sarv_issue: {},
        requiredFields: ["title", "description", "to_user"],
        autocomplete: {
          users: [],
        },
        block: {
          info: true,
        },
        initialResponse: null,
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      this.loadAutocompleteFields();

      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);

        fetchSarvIssue(this.$route.params.id, this.getUserId).then(
          (response) => {
            let handledResponse = this.handleResponse(response);
            if (handledResponse.length > 0) {
              this.$emit("object-exists", true);
              this.$set(this, "sarv_issue", this.handleResponse(response)[0]);
              this.fillAutocompleteFields(this.sarv_issue);
              this.removeUnnecessaryFields(this.sarv_issue, this.copyFields);
              this.setInitialResponse(this.sarv_issue);

              this.$emit("data-loaded", this.sarv_issue);
              this.setLoadingState(false);
            } else {
              this.setLoadingState(false);
              this.$emit("object-exists", false);
            }
          }
        );
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }
    },

    loadAutocompleteFields() {
      fetchUsers().then(
        (response) => (this.autocomplete.users = this.handleResponse(response))
      );
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.to_user)) {
        this.sarv_issue.to_user = {
          id: obj.to_user,
          username: obj.to_user__username,
        };
        this.autocomplete.users.push(this.sarv_issue.to_user);
      }
      if (this.isNotEmpty(obj.from_user)) {
        this.sarv_issue.from_user = {
          id: obj.from_user,
          username: obj.from_user__username,
        };
        this.autocomplete.users.push(this.sarv_issue.from_user);
      }
    },

    setInitialResponse(sarv_issue) {
      this.initialResponse = cloneDeep(sarv_issue.response);
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (this.$route.meta.isEdit) {
        uploadableObject = {
          response: uploadableObject.response || null,
        };
      } else {
        Object.keys(uploadableObject).forEach((key) => {
          if (
            typeof uploadableObject[key] === "object" &&
            uploadableObject[key] !== null
          ) {
            uploadableObject[key] = uploadableObject[key].id
              ? uploadableObject[key].id
              : null;
          } else if (typeof uploadableObject[key] === "undefined") {
            uploadableObject[key] = null;
          }
        });

        uploadableObject.from_user = cloneDeep(this.getUserId);
      }

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },
  },
};
</script>

<style scoped></style>
