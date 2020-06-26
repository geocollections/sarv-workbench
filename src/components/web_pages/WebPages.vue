<template>
  <div class="web-pages">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('web_pages') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('web_pages') ? 'green--text' : 'red--text'"
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
          <!-- SITE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="web_pages.site"
                :color="bodyActiveColor"
                :label="$t('web_pages.site')"
              />
            </v-col>
          </v-row>

          <!-- TITLE_ET -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="web_pages.title_et"
                :color="bodyActiveColor"
                :label="$t('web_pages.title_et')"
              />
            </v-col>
          </v-row>

          <!-- TITLE_EN -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="web_pages.title_en"
                :color="bodyActiveColor"
                :label="$t('web_pages.title_en')"
              />
            </v-col>
          </v-row>

          <!-- CONTENT_ET -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-model="web_pages.content_et"
                :label="$t('web_pages.content_et')"
              />
            </v-col>
          </v-row>

          <!-- CONTENT_EN -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-model="web_pages.content_en"
                :label="$t('web_pages.content_en')"
              />
            </v-col>
          </v-row>

          <!-- PUBLIC -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <checkbox-wrapper
                v-model="web_pages.public"
                :color="bodyActiveColor"
                :label="$t('web_pages.public')"
                @change="web_pages.public = !web_pages.public"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import InputWrapper from "../partial/inputs/InputWrapper";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import { fetchWebPagesDetail } from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";

import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import Editor from "../partial/inputs/Editor";
import { mapState } from "vuex";

export default {
  name: "WebPages",

  components: {
    Editor,
    CheckboxWrapper,
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

  mixins: [formManipulation, autocompleteMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.web_pagesSearchParameters,
        request: "FETCH_WEB_PAGES",
        title: "header.web_pages",
        object: "web_pages",
        field: "title_en"
      });
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler: function() {
        this.reloadData();
      },
      deep: true
    }
  },

  computed: {
    ...mapState("search", ["web_pagesSearchParameters"])
  },

  methods: {
    setInitialData() {
      return {
        searchHistory: "webPagesSearchHistory",
        copyFields: [
          "id",
          "site",
          "title_et",
          "title_en",
          "content_en",
          "content_et",
          "public"
        ],
        web_pages: {},
        requiredFields: [],
        block: {
          info: true
        }
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);
        this.setLoadingType("fetch");
        fetchWebPagesDetail(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "web_pages", this.handleResponse(response)[0]);
            this.removeUnnecessaryFields(this.web_pages, this.copyFields);

            this.$emit("data-loaded", this.web_pages);
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

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    }
  }
};
</script>

<style scoped></style>
