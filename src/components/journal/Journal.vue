<template>
  <div class="journal">
    <spinner
      v-show="sendingData"
      class="loading-overlay"
      size="massive"
      :message="
        $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
      "
    ></spinner>

    <!-- REQUIRED INFO -->
    <v-card
      class="mt-2"
      id="block-requiredFields"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.requiredFields = !block.requiredFields"
        >
          <span :class="validate('journal') ? 'green--text' : 'red--text'">{{
            $t("journal.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('journal') ? 'green--text' : 'red--text'"
            >fas fa-project-diagram</v-icon
          >
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.requiredFields = !block.requiredFields"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.requiredFields ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.requiredFields" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="journal.journal_name"
                :color="bodyActiveColor"
                :label="$t('journal.journalName')"
                use-state
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-generalInfo"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span>{{ $t("journal.generalInfo") }}</span>
          <v-icon right>fas fa-project-diagram</v-icon>
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
          <!-- JOURNAL SHORT and PUBLISHER -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="journal.journal_short"
                :color="bodyActiveColor"
                :label="$t('journal.journalShort')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="journal.publisher"
                :color="bodyActiveColor"
                :label="$t('journal.publisher')"
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="journal.remarks"
                :color="bodyActiveColor"
                :label="$t('journal.remarks')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";
import formManipulation from "../../mixins/formManipulation";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";
import { fetchJournal } from "../../assets/js/api/apiCalls";
import InputWrapper from "../partial/inputs/InputWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";

export default {
  name: "Journal",

  components: {
    TextareaWrapper,
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

  mixins: [formManipulation, formSectionsMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      const searchHistory = this.$localStorage.get(
        this.searchHistory,
        "fallbackValue"
      );
      let params =
        this.isNotEmpty(searchHistory) && searchHistory !== "fallbackValue"
          ? searchHistory
          : this.searchParameters;
      this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", {
        searchHistory: "journalSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_JOURNALS",
        title: "header.journals",
        object: "journal",
        field: "journal_name",
        block: this.block,
        agent: this.currentUser
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
    ...mapState(["currentUser"])
  },

  methods: {
    setInitialData() {
      return {
        searchHistory: "journalSearchHistory",
        copyFields: [
          "id",
          "journal_name",
          "journal_short",
          "publisher",
          "remarks"
        ],
        requiredFields: ["journal_name"],
        journal: {},
        block: { requiredFields: true, info: true }
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        this.$emit("set-object", "journal");

        fetchJournal(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.journal = this.handleResponse(response)[0];

            this.removeUnnecessaryFields(this.journal, this.copyFields);
            this.$emit("data-loaded", this.journal);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });
      }
    },

    formatDataForUpload(objectToUpload) {
      console.log("This object is sent in string format:");
      console.log(objectToUpload);
      return JSON.stringify(objectToUpload);
    },

    setDefaultSearchParameters() {
      return {
        journal: null,
        publisher: null,
        remarks: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    }
  }
};
</script>

<style scoped></style>
