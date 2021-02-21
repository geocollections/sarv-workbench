<template>
  <div class="imageset">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('imageset') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('imageset') ? 'green--text' : 'red--text'"
            >fas fa-project-diagram</v-icon
          >
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.info = !block.info" :color="bodyActiveColor">
          <v-icon>{{
            block.info ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.info" class="pa-1">
          <!-- NUMBER and AUTHOR -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1" v-if="$route.meta.isEdit">
              <input-wrapper
                v-model="imageset.imageset_number"
                :color="bodyActiveColor"
                :label="$t('imageset.imagesetNumber')"
                :readonly="$route.meta.isEdit"
                :disabled="$route.meta.isEdit"
              />
            </v-col>
            <v-col cols="12" md="6" class="pa-1" v-else>
              <input-wrapper
                v-model="imageset.imageset_number"
                :color="bodyActiveColor"
                :label="$t('imageset.imagesetNumber')"
                use-custom-state
                :error="
                  !(
                    isNotEmpty(imageset.imageset_number) &&
                    !imagesetNumberExists
                  )
                "
                :success="
                  isNotEmpty(imageset.imageset_number) && !imagesetNumberExists
                "
                name="imageset_number"
              />
              <div
                class="m-0 caption"
                v-if="
                  !(
                    isNotEmpty(imageset.imageset_number) &&
                    !imagesetNumberExists
                  )
                "
              >
                <div v-if="imagesetNumberExists">
                  {{ $t("add.errors.imagesetNumberExists") }}.
                </div>
                <div v-else>{{ $t("add.errors.imagesetNumber") }}.</div>
              </div>
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="imageset.author"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('common.author')"
                use-state
                is-link
                route-object="agent"
                is-searchable
                :disabled="$route.meta.isEdit"
                :readonly="$route.meta.isEdit"
                v-on:search:items="autocompleteAgentSearch"
                name="author"
              />
            </v-col>
          </v-row>

          <!-- DESCRIPTION -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="imageset.description"
                :color="bodyActiveColor"
                :label="$t('common.description')"
                name="description"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- CLEAR LOCAL STORAGE -->
    <v-row no-gutters class="mt-3" v-if="!$route.meta.isEdit">
      <v-col cols="12">
        <v-btn color="yellow" @click="clearLocalStorage">
          {{ $t("buttons.clearLocalStorage") }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";
import { fetchIsImagesetNumberInImageset } from "@/assets/js/api/apiCalls";
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import { fetchImageset } from "@/assets/js/api/apiCalls";

export default {
  name: "Imageset",

  components: {
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper
  },

  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4"
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    }
  },

  mixins: [formManipulation, autocompleteMixin, formSectionsMixin],

  data() {
    return this.setInitialData();
  },

  computed: {
    ...mapState("search", ["imagesetSearchParameters"]),
    ...mapState("detail", ["imagesetDetail"])
  },

  created() {
    if (this.imagesetDetail) this.imageset = cloneDeep(this.imagesetDetail);

    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.imagesetSearchParameters,
        request: "FETCH_IMAGESETS",
        title: "header.imageset",
        object: "imageset",
        field: "imageset_number"
      });
    }

    this.loadFullInfo();

    if (!this.$route.meta.isEdit) {
      this.imageset.author = {
        id: this.getCurrentUser.id,
        agent: this.getCurrentUser.agent,
        forename: this.getCurrentUser.forename,
        surename: this.getCurrentUser.surename
      };
      this.autocomplete.agent.push(this.imageset.author);
    }
  },

  watch: {
    "$route.params.id": {
      handler: function() {
        this.reloadData();
      },
      deep: true
    },

    "imageset.imageset_number": function(newVal) {
      if (newVal && newVal.trim().length > 0) {
        this.isInImagesetTable(newVal);
      }
    }
  },

  methods: {
    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    setInitialData() {
      return {
        copyFields: ["id", "imageset_number", "author", "description"],
        autocomplete: {
          loaders: {
            agent: false
          },
          agent: []
        },
        requiredFields: ["imageset_number", "author"],
        imageset: {},
        imagesetNumberExists: false,
        block: { info: true }
      };
    },

    loadFullInfo() {
      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);
        this.setLoadingType("fetch");
        fetchImageset(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "imageset", this.handleResponse(response)[0]);
            this.fillAutocompleteFields(this.imageset);
            this.removeUnnecessaryFields(this.imageset, this.copyFields);

            this.$emit("data-loaded", this.imageset);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (!this.$route.meta.isEdit)
        this.saveFields({ key: "imagesetDetail", value: objectToUpload });

      Object.keys(uploadableObject).forEach(key => {
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

      if (this.getDatabaseId) uploadableObject.database = this.getDatabaseId;

      console.log("This object is sent in string format:");
      console.log(uploadableObject);

      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.author)) {
        this.imageset.author = {
          id: obj.author,
          agent: obj.author__agent
        };
        this.autocomplete.agent.push(this.imageset.author);
      }
    },

    isInImagesetTable(query) {
      fetchIsImagesetNumberInImageset(query).then(response => {
        if (response.status === 200) {
          this.imagesetNumberExists = response.data.count > 0;
        }
      });
    },

    clearLocalStorage() {
      this.resetFields("imagesetDetail");
      this.toastInfo({ text: this.$t("messages.defaultsRemoved") });
    }
  }
};
</script>

<style scoped></style>
