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
    <v-row no-gutters class="mt-2">
      <v-col class="d-flex">
        <autocomplete-wrapper
          class="ml-auto"
          v-model="loan.database"
          :color="bodyActiveColor"
          :items="autocomplete.database"
          :loading="autocomplete.loaders.database"
          :item-text="nameLabel"
          :label="$t('common.institution')"
        />
      </v-col>
    </v-row>
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
          <div v-show="activeTab === 'attachment_link'">
            <file-input
              show-existing
              :files-from-object="relatedData.attachment_link.results"
              v-on:update:existing-files="addExistingFiles"
              v-on:file-uploaded="addFiles"
              accept-multiple
              :record-options="$route.meta.isEdit"
              :is-draggable="$route.meta.isEdit"
              show-attachment-link
            />
          </div>
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
    <v-row no-gutters class="mt-2">
      <v-col>
        <object-permissions-create
          v-if="!$route.meta.isEdit"
          @change="handlePermissionsChange"
        />
      </v-col>
    </v-row>
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
  fetchLoanAttachment,
  fetchLoanSamples,
  fetchLoanSpecimens,
  fetchSelectedSpecimens,
  fetchDatabase,
  fetchObjectPermissions,
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";

import DateWrapper from "../partial/inputs/DateWrapper.vue";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import { mapActions, mapGetters, mapState } from "vuex";
import LoanSampleTable from "./relatedTables/LoanSampleTable";
import LoanSpecimenTable from "./relatedTables/LoanSpecimenTable";
import requestsMixin from "../../mixins/requestsMixin";
import {
  fetchIdsUsingSelection,
  fetchMultiAddLoanLists,
} from "@/assets/js/api/apiCalls";
import Pagination from "@/components/partial/Pagination";
import ObjectPermissionsCreate from "../partial/ObjectPermissionsCreate.vue";
import FileInput from "../partial/inputs/FileInput";

export default {
  name: "Loan",

  components: {
    FileInput,
    Pagination,
    LoanSpecimenTable,
    LoanSampleTable,
    CheckboxWrapper,
    DateWrapper,
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
    ObjectPermissionsCreate,
  },

  props: {
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

  mixins: [formManipulation, autocompleteMixin, requestsMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.loanSearchParameters,
        request: "FETCH_LOANS",
        title: "header.loans",
        object: "loan",
        field: "loan_number",
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
    "relatedData.searchParameters": {
      handler: function () {
        this.loadRelatedData(this.activeTab);
      },
      deep: true,
    },
  },

  computed: {
    ...mapGetters("user", ["getDatabaseId"]),
    ...mapState("search", ["loanSearchParameters"]),

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map((item) => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value }),
        };
      });
    },
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
    handlePermissionsChange(perms) {
      this.initialPermissions = perms;
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "attachment_link", iconClass: "fas fa-folder-open" },
          { name: "loan_specimen", iconClass: "fas fa-fish" },
          { name: "loan_sample", iconClass: "fas fa-vial" },
        ],
        activeTab: "attachment_link",
        relatedData: this.setDefaultRelatedData(),
        initialPermissions: {
          groups_view: [],
          groups_change: [],
          users_view: [],
          users_change: [],
        },
        currentPermissions: {
          groups_view: [],
          groups_change: [],
          users_view: [],
          users_change: [],
        },
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
          "remarks",
          "database",
        ],
        autocomplete: {
          loaders: {
            agent: false,
            list_loan_type: false,
            list_loan_delivery_method: false,
            selection_series: false,
            database: false,
          },
          agent: [],
          list_loan_type: [],
          list_loan_delivery_method: [],
          selection_series: [],
          database: [],
        },
        loan: {},
        requiredFields: ["loan_number", "date_start"],
        block: {
          info: true,
          selection_series: true,
        },
        selection_series: null,
        selectionSeriesDialog: false,
        paginateByOptions: [
          { text: "main.pagination", value: 10 },
          { text: "main.pagination", value: 25 },
          { text: "main.pagination", value: 50 },
          { text: "main.pagination", value: 100 },
          { text: "main.pagination", value: 250 },
          { text: "main.pagination", value: 500 },
          { text: "main.pagination", value: 1000 },
        ],
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
        this.setLoadingType("fetch");
        fetchLoan(this.$route.params.id).then((response) => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "loan", this.handleResponse(response)[0]);
            this.fillAutocompleteFields(this.loan);
            this.removeUnnecessaryFields(this.loan, this.copyFields);

            this.$emit("data-loaded", this.loan);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
          fetchObjectPermissions(this.loan.id, "loan").then((res) => {
            this.currentPermissions.groups_change =
              res.data.group
                ?.filter((perm) => perm.permission__codename === "change_loan")
                .map((perm) => perm.group_id) ?? [];
            this.currentPermissions.groups_view =
              res.data.group
                ?.filter((perm) => perm.permission__codename === "view_loan")
                .map((perm) => perm.group_id) ?? [];
            this.currentPermissions.users_change =
              res.data.user
                ?.filter((perm) => perm.permission__codename === "change_loan")
                .map((perm) => perm.user_id) ?? [];
            this.currentPermissions.users_view =
              res.data.user
                ?.filter((perm) => perm.permission__codename === "view_loan")
                .map((perm) => perm.user_id) ?? [];
          });
        });

        // Load Related Data which is in tabs
        this.relatedTabs.forEach((tab) => this.loadRelatedData(tab.name));
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
        if (this.getDatabaseId !== null) {
          this.loan.database = {
            id: this.getDatabaseId,
          };
        }
      }
    },

    setDefaultRelatedData() {
      return {
        loan_specimen: { count: 0, results: [] },
        loan_sample: { count: 0, results: [] },
        attachment_link: { count: 0, results: [] },
        searchParameters: {
          attachment_link: {
            page: 1,
            paginateBy: 100,
            sortBy: ["id"],
            sortDesc: [true],
          },
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

    loadAutocompleteFields() {
      fetchListLoanType().then(
        (response) =>
          (this.autocomplete.list_loan_type = this.handleResponse(response))
      );

      fetchListLoanDeliveryMethod().then(
        (response) =>
          (this.autocomplete.list_loan_delivery_method =
            this.handleResponse(response))
      );
      fetchDatabase().then(
        (response) =>
          (this.autocomplete.database = this.handleResponse(response))
      );
    },

    formatDataForUpload(objectToUpload, saveAsNew = false) {
      let uploadableObject = cloneDeep(objectToUpload);

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

      if (!this.$route.meta.isEdit) {
        this.relatedTabs.forEach((tab) => {
          if (this.relatedData[tab.name].count > 0)
            if (tab.name === "attachment_link") {
              uploadableObject.related_data.attachment =
                this.relatedData.attachment_link.results.map((item) => {
                  return { id: item.id };
                });
            } else {
              uploadableObject.related_data[tab.name] =
                this.relatedData[tab.name].results;

              uploadableObject.related_data[tab.name].forEach((item) => {
                Object.keys(item).forEach((key) => {
                  if (typeof item[key] === "object" && item[key] !== null) {
                    item[key] = item[key].id ? item[key].id : null;
                  }
                });
              });
            }
        });
        uploadableObject.initial_permissions = this.initialPermissions;
      } else {
        uploadableObject.related_data = {};
        if (this.relatedData.attachment_link.results.length > 0) {
          uploadableObject.related_data.attachment =
            this.relatedData.attachment_link.results.map((item) => {
              return { id: item.id };
            });
        } else {
          uploadableObject.related_data.attachment = null;
        }
      }
      if (saveAsNew) {
        uploadableObject.initial_permissions = this.currentPermissions;
      }

      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.borrower)) {
        this.loan.borrower = {
          id: obj.borrower,
          agent: obj.borrower__agent,
        };
        this.autocomplete.agent.push(this.loan.borrower);
      }
      if (this.isNotEmpty(obj.borrower_institution)) {
        this.loan.borrower_institution = {
          id: obj.borrower_institution,
          agent: obj.borrower_institution__agent,
        };
        this.autocomplete.agent.push(this.loan.borrower_institution);
      }
      if (this.isNotEmpty(obj.loaner)) {
        this.loan.loaner = {
          id: obj.loaner,
          agent: obj.loaner__agent,
        };
        this.autocomplete.agent.push(this.loan.loaner);
      }
      if (this.isNotEmpty(obj.deliverer)) {
        this.loan.deliverer = {
          id: obj.deliverer,
          agent: obj.deliverer__agent,
        };
        this.autocomplete.agent.push(this.loan.deliverer);
      }
      this.loan.delivery_method = {
        id: obj.delivery_method,
        value: obj.delivery_method__value,
        value_en: obj.delivery_method__value_en,
      };
      this.loan.type = {
        id: obj.type,
        value: obj.type__value,
        value_en: obj.type__value_en,
      };
      this.loan.database = {
        id: obj.database,
        value: obj.database__name,
        value_en: obj.database__name_en,
      };
    },

    loadRelatedData(object) {
      let query;

      if (object === "attachment_link") {
        query = fetchLoanAttachment(
          this.$route.params.id,
          this.relatedData.searchParameters.attachment_link
        );
      } else if (object === "loan_specimen") {
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

      if (query) {
        query.then((response) => {
          this.relatedData[object].count = response.data.count;
          this.relatedData[object].results = this.handleResponse(response);
        });
      }
    },

    // Fill Specimens and Samples using selection_series
    async fillUsingSelectionSeries() {
      if (this.selection_series?.id) {
        this.setLoadingState(true);
        this.setLoadingType("add");
        await this.fillLists("specimen");
        await this.fillLists("sample");
      }

      this.selectionSeriesDialog = false;
      this.setLoadingState(false);
    },

    async fillLists(table) {
      let response = await fetchIdsUsingSelection(
        this.selection_series.id,
        table
      );

      if (response?.data?.results) {
        let listOfObjects = response.data.results.map((item) => {
          return {
            [table]: item[table],
            loan: this.$route.params.id,
            database: this.getDatabaseId,
          };
        });

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

    addFiles(files, singleFileMetadata) {
      this.addFileAsRelatedDataNew(files, "loan", singleFileMetadata);
    },

    addExistingFiles(files) {
      // this.relatedData.attachment_link.count = files.length;
      this.relatedData.attachment_link.results = files;
    },
  },
};
</script>

<style scoped></style>
