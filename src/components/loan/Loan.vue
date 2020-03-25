<template>
  <div class="loan">
    <spinner
      v-show="sendingData"
      class="loading-overlay"
      size="massive"
      :message="
        $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
      "
    />

    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('loan') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon right :class="validate('loan') ? 'green--text' : 'red--text'"
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
          <!-- LOAN_NUMBER, DATE_START and DATE_END -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="loan.loan_number"
                :color="bodyActiveColor"
                :label="$t('loan.loan_number')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <date-wrapper
                v-model="loan.date_start"
                :color="bodyActiveColor"
                :label="$t('loan.date_start')"
                v-on:date:clear="loan.date_start = null"
                v-on:date:update="updateUserInputtedDate('date_start', $event)"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <date-wrapper
                v-model="loan.date_end"
                :color="bodyActiveColor"
                :label="$t('loan.date_end')"
                v-on:date:clear="loan.date_end = null"
                v-on:date:update="updateUserInputtedDate('date_end', $event)"
              />
            </v-col>
          </v-row>

          <!-- TYPE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="loan.type"
                :color="bodyActiveColor"
                :items="autocomplete.list_loan_type"
                :loading="autocomplete.loaders.list_loan_type"
                :item-text="commonLabel"
                :label="$t('loan.type')"
              />
            </v-col>
          </v-row>

          <!-- PROJECT -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="loan.project"
                :color="bodyActiveColor"
                :label="$t('loan.project')"
              />
            </v-col>
          </v-row>

          <!-- BORROWER -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="loan.borrower"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('loan.borrower')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>
          </v-row>

          <!-- RETURNED -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <checkbox-wrapper
                v-model="loan.returned"
                :color="bodyActiveColor"
                :label="$t('loan.returned')"
                @change="loan.returned = !loan.returned"
              />
            </v-col>
          </v-row>

          <!-- BORROWER_INSTITUTION -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="loan.borrower_institution"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('loan.borrower_institution')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>
          </v-row>

          <!-- LOANER -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="loan.loaner"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('loan.loaner')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>
          </v-row>

          <!-- DELIVERY_METHOD -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="loan.delivery_method"
                :color="bodyActiveColor"
                :items="autocomplete.list_loan_delivery_method"
                :loading="autocomplete.loaders.list_loan_delivery_method"
                :item-text="commonLabel"
                :label="$t('loan.delivery_method')"
              />
            </v-col>
          </v-row>

          <!-- DELIVERER -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="loan.deliverer"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('loan.deliverer')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>
          </v-row>

          <!-- DELIVERY_REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="loan.delivery_remarks"
                :color="bodyActiveColor"
                :label="$t('loan.delivery_remarks')"
              />
            </v-col>
          </v-row>

          <!-- SPECIAL -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="loan.special"
                :color="bodyActiveColor"
                :label="$t('loan.special')"
              />
            </v-col>
          </v-row>

          <!-- DATE_SIGNED and DATE_RETURNED -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <date-wrapper
                v-model="loan.date_signed"
                :color="bodyActiveColor"
                :label="$t('loan.date_signed')"
                v-on:date:clear="loan.date_signed = null"
                v-on:date:update="updateUserInputtedDate('date_signed', $event)"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <date-wrapper
                v-model="loan.date_returned"
                :color="bodyActiveColor"
                :label="$t('loan.date_returned')"
                v-on:date:clear="loan.date_returned = null"
                v-on:date:update="
                  updateUserInputtedDate('date_returned', $event)
                "
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="loan.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED DATA TABS -->
    <v-card
      v-if="$route.meta.isEdit"
      class="related-tabs mt-2"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-tabs
        :background-color="bodyColor.split('n-')[0] + 'n-3'"
        show-arrows
        grow
        prev-icon="fas fa-angle-left"
        next-icon="fas fa-angle-right"
        :active-class="bodyColor.split('n-')[0] + 'n-5 black--text'"
        hide-slider
      >
        <v-tab
          v-for="tab in relatedTabs"
          :key="tab.name"
          @click.prevent="setTab(tab.name)"
        >
          <span>{{ $t("loan.relatedTables." + tab.name) }}</span>
          <span class="ml-1">
            <v-icon small>{{ tab.iconClass }}</v-icon>
          </span>
          <span
            v-if="relatedData[tab.name].count > 0"
            class="font-weight-bold ml-2"
            :class="`${bodyActiveColor}--text`"
          >
            {{ relatedData[tab.name].count }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items>
        <v-card
          class="pt-3 px-1"
          flat
          :color="bodyColor.split('n-')[0] + 'n-5'"
        >
          <loan-specimen-table
            v-show="activeTab === 'loan_specimen'"
            :response="relatedData.loan_specimen"
            :search-parameters="relatedData.searchParameters.loan_specimen"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <loan-sample-table
            v-show="activeTab === 'loan_sample'"
            :response="relatedData.loan_sample"
            :search-parameters="relatedData.searchParameters.loan_sample"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <!-- PAGINATION -->
          <div
            v-if="$route.meta.isEdit && relatedData[activeTab].count > 10"
            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between d-print-none pa-1 mt-2"
          >
            <div class="mr-3 mb-3">
              <v-select
                v-model="relatedData.searchParameters[activeTab].paginateBy"
                :color="bodyActiveColor"
                dense
                :items="paginateByOptionsTranslated"
                :item-color="bodyActiveColor"
                label="Paginate by"
                hide-details
              />
            </div>

            <div>
              <v-pagination
                v-model="relatedData.searchParameters[activeTab].page"
                :color="bodyActiveColor"
                circle
                prev-icon="fas fa-angle-left"
                next-icon="fas fa-angle-right"
                :length="
                  Math.ceil(
                    relatedData[activeTab].count /
                      relatedData.searchParameters[activeTab].paginateBy
                  )
                "
                :total-visible="5"
              />
            </div>
          </div>
        </v-card>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import {
  fetchListLoanDeliveryMethod,
  fetchListLoanType,
  fetchLoan,
  fetchLoanSamples,
  fetchLoanSpecimens
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import Spinner from "vue-simple-spinner";
import DateWrapper from "../partial/inputs/DateWrapper";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import { mapState } from "vuex";
import LoanSampleTable from "./relatedTables/LoanSampleTable";
import LoanSpecimenTable from "./relatedTables/LoanSpecimenTable";
import requestsMixin from "../../mixins/requestsMixin";

export default {
  name: "Loan",

  components: {
    LoanSpecimenTable,
    LoanSampleTable,
    CheckboxWrapper,
    DateWrapper,
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

  mixins: [formManipulation, autocompleteMixin, requestsMixin],

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
        searchHistory && searchHistory !== "fallbackValue"
          ? searchHistory
          : this.searchParameters;
      // let params = this.isNotEmpty(searchHistory) && searchHistory.hasOwnProperty('id') && searchHistory !== 'fallbackValue' && searchHistory !== '[object Object]' ? searchHistory : this.searchParameters;
      this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", {
        searchHistory: "loanSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_LOANS",
        title: "header.loans",
        object: "loan",
        field: "loan_number",
        databaseId: this.databaseId,
        block: this.block
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
    },
    "relatedData.searchParameters": {
      handler: function() {
        this.loadRelatedData(this.activeTab);
      },
      deep: true
    }
  },

  computed: {
    ...mapState(["databaseId"]),

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map(item => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value })
        };
      });
    }
  },

  methods: {
    setTab(type) {
      if (type) {
        this.$store.dispatch("updateActiveTab", {
          tab: type,
          object: this.$route.meta.object
        });
        this.activeTab = type;
      }
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "loan_specimen", iconClass: "fas fa-fish" },
          { name: "loan_sample", iconClass: "fas fa-vial" }
        ],
        activeTab: "loan_specimen",
        relatedData: this.setDefaultRelatedData(),
        searchHistory: "loanSearchHistory",
        copyFields: [
          "id",
          "loan_number",
          "date_start",
          "date_end",
          "type",
          "project",
          "borrower",
          "returned",
          "borrower_institution",
          "loaner",
          "delivery_method",
          "deliverer",
          "delivery_remarks",
          "special",
          "date_signed",
          "date_returned",
          "remarks"
        ],
        autocomplete: {
          loaders: {
            agent: false,
            list_loan_type: false,
            list_loan_delivery_method: false
          },
          agent: [],
          list_loan_type: [],
          list_loan_delivery_method: []
        },
        loan: {},
        requiredFields: ["loan_number"],
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          info: true
        },
        paginateByOptions: [
          { text: "main.pagination", value: 10 },
          { text: "main.pagination", value: 25 },
          { text: "main.pagination", value: 50 },
          { text: "main.pagination", value: 100 },
          { text: "main.pagination", value: 250 },
          { text: "main.pagination", value: 500 },
          { text: "main.pagination", value: 1000 }
        ]
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      this.loadAutocompleteFields();

      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        fetchLoan(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "loan", this.handleResponse(response)[0]);
            this.fillAutocompleteFields(this.loan);
            this.removeUnnecessaryFields(this.loan, this.copyFields);

            this.$emit("data-loaded", this.loan);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });

        // Load Related Data which is in tabs
        this.relatedTabs.forEach(tab => this.loadRelatedData(tab.name));
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }
    },

    setDefaultRelatedData() {
      return {
        loan_specimen: { count: 0, results: [] },
        loan_sample: { count: 0, results: [] },
        searchParameters: {
          loan_specimen: {
            page: 1,
            paginateBy: 10,
            sortBy: ["specimen_id"],
            sortDesc: [true]
          },
          loan_sample: {
            page: 1,
            paginateBy: 10,
            sortBy: ["sample"],
            sortDesc: [true]
          }
        }
      };
    },

    loadAutocompleteFields() {
      fetchListLoanType().then(
        response =>
          (this.autocomplete.list_loan_type = this.handleResponse(response))
      );

      fetchListLoanDeliveryMethod().then(
        response =>
          (this.autocomplete.list_loan_delivery_method = this.handleResponse(
            response
          ))
      );
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
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.borrower)) {
        this.loan.borrower = {
          id: obj.borrower,
          agent: obj.borrower__agent
        };
        this.autocomplete.agent.push(this.loan.borrower);
      }
      if (this.isNotEmpty(obj.borrower_institution)) {
        this.loan.borrower_institution = {
          id: obj.borrower_institution,
          agent: obj.borrower_institution__agent
        };
        this.autocomplete.agent.push(this.loan.borrower_institution);
      }
      if (this.isNotEmpty(obj.loaner)) {
        this.loan.loaner = {
          id: obj.loaner,
          agent: obj.loaner__agent
        };
        this.autocomplete.agent.push(this.loan.loaner);
      }
      if (this.isNotEmpty(obj.deliverer)) {
        this.loan.deliverer = {
          id: obj.deliverer,
          agent: obj.deliverer__agent
        };
        this.autocomplete.agent.push(this.loan.deliverer);
      }
      this.loan.delivery_method = {
        id: obj.delivery_method,
        value: obj.delivery_method__value,
        value_en: obj.delivery_method__value_en
      };
      this.loan.type = {
        id: obj.type,
        value: obj.type__value,
        value_en: obj.type__value_en
      };
    },

    loadRelatedData(object) {
      let query;

      if (object === "loan_specimen") {
        query = fetchLoanSpecimens(
          this.$route.params.id,
          this.relatedData.searchParameters.loan_specimen
        );
      } else if (object === "loan_sample") {
        query = fetchLoanSamples(
          this.$route.params.id,
          this.relatedData.searchParameters.loan_sample
        );
      }

      query.then(response => {
        this.relatedData[object].count = response.data.count;
        this.relatedData[object].results = this.handleResponse(response);
      });
    },

    setDefaultSearchParameters() {
      return {
        loan_number: null,
        project: null,
        borrower: null,
        date_start: null,
        date_end: null,
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
