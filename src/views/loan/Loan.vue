<template>
  <div class="loan">
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
                use-state
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
                :items="autocomplete.borrower"
                :loading="autocomplete.loaders.borrower"
                item-text="agent"
                :label="$t('loan.borrower')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch($event, 'borrower')"
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
                :items="autocomplete.borrower_institution"
                :loading="autocomplete.loaders.borrower_institution"
                item-text="agent"
                :label="$t('loan.borrower_institution')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="
                  autocompleteAgentSearch($event, 'borrower_institution')
                "
              />
            </v-col>
          </v-row>

          <!-- LOANER -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="loan.loaner"
                :color="bodyActiveColor"
                :items="autocomplete.loaner"
                :loading="autocomplete.loaders.loaner"
                item-text="agent"
                :label="$t('loan.loaner')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch($event, 'loaner')"
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
                :items="autocomplete.deliverer"
                :loading="autocomplete.loaders.deliverer"
                item-text="agent"
                :label="$t('loan.deliverer')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch($event, 'deliverer')"
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
          <pagination
            v-if="$route.meta.isEdit && relatedData[activeTab].count > 10"
            class="pa-1"
            :body-active-color="bodyActiveColor"
            :count="relatedData[activeTab].count"
            :paginate-by="relatedData.searchParameters[activeTab].paginateBy"
            :options="paginateByOptionsTranslated"
            :page="relatedData.searchParameters[activeTab].page"
            v-on:update:page="
              relatedData.searchParameters[activeTab].page = $event
            "
            v-on:update:paginateBy="
              relatedData.searchParameters[activeTab].paginateBy = $event
            "
          />
        </v-card>
      </v-tabs-items>
    </v-card>

    <!-- FILL SPECIMENS AND SAMPLES USING SELECTION_SERIES -->
    <v-card
      v-if="$route.meta.isEdit"
      class="mt-2"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <span>{{ $t("loan.fill_using_selection") }}</span>
        <v-icon right>fas fa-clipboard-list</v-icon>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.selection_series = !block.selection_series"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.selection_series ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.selection_series" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="selection_series"
                :color="bodyActiveColor"
                :items="autocomplete.selection_series"
                :loading="autocomplete.loaders.selection_series"
                :item-text="customSelectionSeriesLabel"
                :label="$t('loan.selection_series')"
                is-link
                route-object="selection_series"
                is-searchable
                v-on:search:items="autocompleteSelectionSeriesSearch"
                use-state
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1 text-center text-sm-right">
              <v-dialog
                v-model="selectionSeriesDialog"
                max-width="500"
                style="z-index: 50000"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    @click="selectionSeriesDialog = true"
                    :disabled="!selection_series"
                    color="red darken-1"
                    class="white--text"
                    >{{ $t("loan.fill_list") }}
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="headline">{{
                    $t("loan.fill_list")
                  }}</v-card-title>
                  <v-card-text>{{ $t("loan.confirm_list_fill") }}</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="green darken-1"
                      small
                      class="white--text"
                      @click="selectionSeriesDialog = false"
                      >{{ $t("buttons.cancel") }}</v-btn
                    >
                    <v-btn
                      small
                      color="red darken-1"
                      @click="fillUsingSelectionSeries"
                      class="white--text"
                    >
                      {{ $t("loan.fill_list_yes") }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";

import DateWrapper from "@/components/partial/inputs/DateWrapper";
import CheckboxWrapper from "@/components/partial/inputs/CheckboxWrapper";
import { mapActions, mapGetters } from "vuex";
import LoanSampleTable from "@/components/loan/relatedTables/LoanSampleTable";
import LoanSpecimenTable from "@/components/loan/relatedTables/LoanSpecimenTable";
import { fetchMultiAddLoanLists } from "@/assets/js/api/apiCalls";
import Pagination from "@/components/partial/Pagination";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  name: "Loan",

  components: {
    Pagination,
    LoanSpecimenTable,
    LoanSampleTable,
    CheckboxWrapper,
    DateWrapper,
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
  },

  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true,
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
  },

  mixins: [
    formManipulation,
    autocompleteMixin,
    detailViewUtilsMixin,
    globalUtilsMixin,
  ],

  data() {
    return this.setInitialData();
  },

  created() {
    this.loadFullInfo();
  },

  watch: {
    "relatedData.searchParameters": {
      handler: function () {
        this.loadRelatedData(
          [this.activeTab],
          "specimen",
          this.$route.params.id
        );
      },
      deep: true,
    },
  },

  computed: {
    ...mapGetters("user", ["getDatabaseId"]),
  },

  methods: {
    ...mapActions("search", ["updateActiveTab"]),

    setTab(type) {
      if (type) {
        this.updateActiveTab({
          tab: type,
          object: this.$route.meta.object,
        });
        this.activeTab = type;
      }
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "loan_specimen", iconClass: "fas fa-fish" },
          { name: "loan_sample", iconClass: "fas fa-vial" },
        ],
        activeTab: "loan_specimen",
        relatedData: this.setDefaultRelatedData(),
        listOfAutocompleteTables: [
          "list_loan_type",
          "list_loan_delivery_method",
        ],
        autocomplete: {
          loaders: {
            agent: false,
            list_loan_type: false,
            list_loan_delivery_method: false,
            selection_series: false,
            borrower: false,
            borrower_institution: false,
            loaner: false,
            deliverer: false,
          },
          agent: [],
          list_loan_type: [],
          list_loan_delivery_method: [],
          selection_series: [],
          borrower: [],
          borrower_institution: [],
          loaner: [],
          deliverer: [],
        },
        loan: {
          id: null,
          loan_number: null,
          date_start: null,
          date_end: null,
          type: null,
          project: null,
          borrower: null,
          returned: null,
          borrower_institution: null,
          loaner: null,
          delivery_method: null,
          deliverer: null,
          delivery_remarks: null,
          special: null,
          date_signed: null,
          date_returned: null,
          remarks: null,
        },
        requiredFields: ["loan_number", "date_start"],
        block: {
          info: true,
          selection_series: true,
        },
        selection_series: null,
        selectionSeriesDialog: false,
      };
    },

    setDefaultRelatedData() {
      return {
        loan_specimen: { count: 0, results: [] },
        loan_sample: { count: 0, results: [] },
        searchParameters: {
          loan_specimen: {
            page: 1,
            paginateBy: 10,
            sortBy: ["specimen"],
            sortDesc: [true],
          },
          loan_sample: {
            page: 1,
            paginateBy: 10,
            sortBy: ["sample"],
            sortDesc: [true],
          },
        },
      };
    },

    // Fill Specimens and Samples using selection_series
    async fillUsingSelectionSeries() {
      if (this.selection_series?.id) {
        this.setLoadingState(true);
        await this.fillLists("specimen");
        await this.fillLists("sample");
      }

      this.selectionSeriesDialog = false;
      this.setLoadingState(false);
    },

    async fillLists(table) {
      let response = await this.$api.rw.get("selection", {
        defaultParams: {
          selection: this.selection_series.id,
          fields: table,
          or_search: `${table}__isnull:false`,
        },
      });

      console.log(response);

      if (response?.results) {
        let listOfObjects = response.results.map((item) => {
          return {
            [table]: item[table],
            loan: this.$route.params.id,
            database: this.getDatabaseId,
          };
        });

        console.log(listOfObjects);

        let formData = new FormData();
        formData.append(
          "data",
          JSON.stringify({
            add: listOfObjects,
          })
        );

        let multiAddResponse = await fetchMultiAddLoanLists(
          `loan_${table}`,
          formData
        ).then(
          (response) => response,
          (errResponse) => errResponse
        );

        if (multiAddResponse) {
          this.handleResponseMessages(
            multiAddResponse,
            multiAddResponse.status === 200,
            true
          );

          if (multiAddResponse.status === 200)
            this.relatedTabs.forEach((tab) => this.loadRelatedData(tab.name));
        }
      }
    },

    customSelectionSeriesLabel(option) {
      if (option.name) return `${option.id} - ${option.name}`;
      else return `${option.id}`;
    },
  },
};
</script>

<style scoped></style>
