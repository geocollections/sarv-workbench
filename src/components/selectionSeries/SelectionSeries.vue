<template>
  <div class="selectionSeries">
    <v-overlay :value="sendingData">
      <v-progress-circular
        indeterminate
        size="64"
        :color="bodyActiveColor"
      ></v-progress-circular>
    </v-overlay>

    <v-card class="mt-3" id="block-info">
      <v-card-title>
        <span>{{ $t("selectionSeries.generalInfo") }}</span>
        <v-icon right>fas fa-project-diagram</v-icon>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.info = !block.info" :color="bodyActiveColor">
          <v-icon>{{
            block.info ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition enter-active-class="animated zoomIn faster">
        <div v-show="block.info" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <v-text-field
                v-model="selection_series.name"
                outlined
                dense
                hide-details
                :append-icon="
                  !isNotEmpty(selection_series.name) ? 'fas fa-exclamation' : ''
                "
                :error="!isNotEmpty(selection_series.name)"
                :color="bodyActiveColor"
                :label="$t('selectionSeries.name')"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <v-text-field
                v-model="selection_series.remarks"
                outlined
                dense
                hide-details
                :color="bodyActiveColor"
                :label="$t('selectionSeries.remarks')"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { fetchSelectionSerie } from "../../assets/js/api/apiCalls";

export default {
  name: "SelectionSeries",

  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true
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
        searchHistory: "selectionSeriesSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_SELECTION_SERIES",
        title: "header.selectionSeries",
        object: "selection_series",
        field: "name",
        block: this.block
      });
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler() {
        this.setInitialData();
        this.reloadData();
      },
      deep: true
    }
  },

  methods: {
    setInitialData() {
      return {
        searchHistory: "selectionSeriesSearchHistory",
        copyFields: ["id", "name", "remarks"],
        requiredFields: ["name"],
        selection_series: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: { info: true }
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        this.$emit("set-object", "selection_series");
        fetchSelectionSerie(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.selection_series = this.handleResponse(response)[0];

            this.removeUnnecessaryFields(
              this.selection_series,
              this.copyFields
            );
            this.$emit("data-loaded", this.selection_series);
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
        id: null,
        name: null,
        remarks: null,
        user_added: null,
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
