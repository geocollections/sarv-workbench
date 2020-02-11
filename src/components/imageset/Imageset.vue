<template>
  <div class="imageset">
    <spinner
      v-show="sendingData"
      class="loading-overlay"
      size="massive"
      :message="
        $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
      "
    ></spinner>

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
            <v-col cols="12" md="6" class="pa-1">
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
                v-on:search:items="autocompleteAgentSearch"
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
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- CLEAR LOCAL STORAGE -->
    <v-row no-gutters class="mt-3">
      <v-col cols="12">
        <v-btn color="yellow" @click="clearLocalStorage">
          {{ $t("buttons.clearLocalStorage") }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";
import cloneDeep from "lodash/cloneDeep";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";
import { toastInfo } from "../../assets/js/iziToast/iziToast";
import { fetchIsImagesetNumberInImageset } from "../../assets/js/api/apiCalls";
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";

export default {
  name: "Imageset",

  components: {
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
    Spinner
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
    ...mapState(["currentUser", "databaseId"])
  },

  created() {
    // Gets saved form values from local storage
    const imageset = this.$localStorage.get("imageset", "fallbackValue");
    if (this.isNotEmpty(imageset) && imageset !== "fallbackValue")
      this.imageset = imageset;

    this.imageset.author = {
      id: this.currentUser.id,
      agent: this.currentUser.agent,
      forename: this.currentUser.forename,
      surename: this.currentUser.surename
    };
  },

  watch: {
    "imageset.imageset_number": function(newVal) {
      if (newVal && newVal.trim().length > 0) {
        this.isInImagesetTable(newVal);
      }
    }
  },

  methods: {
    setInitialData() {
      return {
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

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (!this.$route.meta.isEdit)
        this.$localStorage.set("imageset", uploadableObject);

      if (this.isNotEmpty(uploadableObject.author))
        uploadableObject.author = uploadableObject.author.id;
      else uploadableObject.author = null;

      if (this.databaseId) uploadableObject.database = this.databaseId;

      console.log("This object is sent in string format:");
      console.log(uploadableObject);

      return JSON.stringify(uploadableObject);
    },

    isInImagesetTable(query) {
      fetchIsImagesetNumberInImageset(query).then(response => {
        if (response.status === 200) {
          this.imagesetNumberExists = response.data.count > 0;
        }
      });
    },

    clearLocalStorage() {
      this.$localStorage.remove("imageset");
      toastInfo({ text: this.$t("messages.defaultsRemoved") });
    }
  }
};
</script>

<style scoped>
label {
  margin: 5px 0 0 0;
  color: #999;
  font-size: 0.8rem;
}
</style>
