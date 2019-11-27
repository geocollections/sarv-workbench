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
          <span :class="validate('imageset') ? 'green--text' : 'red--text'">{{ $t("imageset.generalInfo") }}</span>
          <v-icon right :class="validate('imageset') ? 'green--text' : 'red--text'">fas fa-project-diagram</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.info = !block.info" :color="bodyActiveColor">
          <v-icon>{{
            block.info ? "fas fa-angle-up" : "fas fa-angle-down"
            }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.info" class="px-1 pt-1 pb-2">
          <!-- NUMBER and AUTHOR -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`imageset`"
              >{{ $t("imageset.imagesetNumber") }}:</label
              >
              <b-form-input
                size="sm"
                id="imageset"
                v-model="imageset.imageset_number"
                :state="
                  isNotEmpty(imageset.imageset_number) && !imagesetNumberExists
                "
                type="text"
              ></b-form-input>
              <b-form-text
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
              </b-form-text>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`author`">{{ $t("imageset.author") }}:</label>
              <vue-multiselect
                v-model="imageset.author"
                id="author"
                label="agent"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.agent"
                :options="autocomplete.agent"
                @search-change="autocompleteAgentSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                v-bind:class="{
                  valid: isNotEmpty(imageset.author),
                  invalid: !isNotEmpty(imageset.author)
                }"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"
                ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
              <b-form-text v-if="!isNotEmpty(imageset.author)"
              >{{ $t("add.errors.author") }}.</b-form-text
              >
            </v-col>
          </v-row>

          <!-- DESCRIPTION -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`description`"
              >{{ $t("imageset.description") }}:</label
              >
              <b-form-textarea
                size="sm"
                id="image_description"
                v-model="imageset.description"
                :no-resize="true"
                :rows="3"
                :max-rows="3"
                type="text"
              ></b-form-textarea>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- CLEAR LOCAL STORAGE -->
    <v-row no-gutters class="mt-3">
      <v-col cols="12">
        <v-btn color="yellow" @click="clearLocalStorage">
          {{ $t("add.buttons.clearLocalStorage") }}
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

export default {
  name: "Imageset",

  components: {
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
        uploadableObject.author = uploadableObject.author.id
          ? uploadableObject.author.id
          : uploadableObject.author;

      if (this.databaseId) uploadableObject.database = this.databaseId;

      console.log("This object is sent in string format:");
      console.log(uploadableObject);

      return JSON.stringify(uploadableObject);
    },

    isInImagesetTable(query) {
      fetchIsImagesetNumberInImageset(query).then(response => {
        if (response.status === 200) {
          console.log(response.body.count > 0);
          this.imagesetNumberExists = response.body.count > 0;
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
