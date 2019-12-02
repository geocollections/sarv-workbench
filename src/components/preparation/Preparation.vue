<template>
  <div class="preparation">
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
          <span
            :class="validate('preparation') ? 'green--text' : 'red--text'"
            >{{ $t("preparation.generalInfo") }}</span
          >
          <v-icon
            right
            :class="validate('preparation') ? 'green--text' : 'red--text'"
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
        <div v-show="block.info" class="px-1 pt-1 pb-2">
          <!-- NAME, SAMPLE, SAMPLE_NUMBER and ANALYSIS -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="px-1">
              <label :for="`preparation_number`"
                >{{ $t("preparation.preparation_number") }}:</label
              >
              <b-form-input
                size="sm"
                id="preparation_number"
                v-model="preparation.preparation_number"
                :state="isNotEmpty(preparation.preparation_number)"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`sample`">{{ $t("preparation.sample") }}:</label>
              <vue-multiselect
                id="sample"
                v-model="preparation.sample"
                label="number"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.sample"
                :options="autocomplete.sample"
                @search-change="autocompleteSampleSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.number }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`sample_number`"
                >{{ $t("preparation.sample_number") }}:</label
              >
              <b-form-input
                size="sm"
                id="sample_number"
                v-model="preparation.sample_number"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`analysis`">{{ $t("preparation.analysis") }}:</label>
              <vue-multiselect
                id="analysis"
                v-model="preparation.analysis"
                label="id"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.analysis"
                :options="autocomplete.analysis"
                @search-change="autocompleteAnalysisSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.id }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- OTHER INFO -->
    <v-card
      class="mt-2"
      id="block-details"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.details = !block.details"
        >
          <span>{{ $t("preparation.details") }}</span>
          <v-icon right>fas fa-info</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.details = !block.details"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.details ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.details" class="px-1 pt-1 pb-2">
          <!-- TAXON -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`taxon`">{{ $t("preparation.taxon") }}:</label>
              <vue-multiselect
                id="taxon"
                v-model="preparation.taxon"
                label="taxon"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.taxon"
                :options="autocomplete.taxon"
                @search-change="autocompleteTaxonSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.taxon }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>

          <!-- AGENT, AGENT_TXT and IDENTIFICATION_AGENT -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`agent`">{{ $t("preparation.agent") }}:</label>
              <vue-multiselect
                id="agent"
                v-model="preparation.agent"
                label="agent"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.agent"
                :options="autocomplete.agent"
                @search-change="autocompleteAgentSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`agent_txt`"
                >{{ $t("preparation.agent_txt") }}:</label
              >
              <b-form-input
                size="sm"
                id="agent_txt"
                v-model="preparation.agent_txt"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`identification_agent`"
                >{{ $t("preparation.identification_agent") }}:</label
              >
              <vue-multiselect
                id="identification_agent"
                v-model="preparation.identification_agent"
                label="agent"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.identification_agent"
                :options="autocomplete.identification_agent"
                @search-change="autocompleteIdentificationAgentSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>

          <!-- DATE_PREPARED and IDENTIFICATION_DATE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`date_prepared`"
                >{{ $t("preparation.date_prepared") }}:</label
              >
              <v-menu
                v-model="menuDatePrepared"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    hide-details
                    v-model="preparation.date_prepared"
                    prepend-inner-icon="far fa-calendar-alt"
                    :color="bodyActiveColor"
                    clearable
                    dense
                    flat
                    solo
                    class="white"
                    style="border: 1px solid #ced4da !important;"
                    clear-icon="fas fa-times"
                    readonly
                    :class="bodyActiveColor + '--text'"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="preparation.date_prepared"
                  @input="menuDatePrepared = false"
                  :color="bodyActiveColor"
                  :header-color="`${bodyActiveColor} darken-3`"
                  scrollable
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`identification_date`"
                >{{ $t("preparation.identification_date") }}:</label
              >
              <v-menu
                v-model="menuIdentificationDate"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    hide-details
                    v-model="preparation.identification_date"
                    prepend-inner-icon="far fa-calendar-alt"
                    :color="bodyActiveColor"
                    clearable
                    dense
                    flat
                    solo
                    class="white"
                    style="border: 1px solid #ced4da !important;"
                    clear-icon="fas fa-times"
                    readonly
                    :class="bodyActiveColor + '--text'"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="preparation.identification_date"
                  @input="menuIdentificationDate = false"
                  :color="bodyActiveColor"
                  :header-color="`${bodyActiveColor} darken-3`"
                  scrollable
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <!-- DATE_PREPARED_TXT and IDENTIFICATION_REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`date_prepared_txt`"
                >{{ $t("preparation.date_prepared_txt") }}:</label
              >
              <b-form-input
                size="sm"
                id="date_prepared_txt"
                v-model="preparation.date_prepared_txt"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`identification_remarks`"
                >{{ $t("preparation.identification_remarks") }}:</label
              >
              <b-form-input
                size="sm"
                id="identification_remarks"
                v-model="preparation.identification_remarks"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- LOCATION, STORAGE and OWNER -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`location`">{{ $t("preparation.location") }}:</label>
              <b-form-input
                size="sm"
                id="location"
                v-model="preparation.location"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`storage`">{{ $t("preparation.storage") }}:</label>
              <vue-multiselect
                v-model="preparation.storage"
                id="storage"
                label="location"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.storage"
                :options="autocomplete.storage"
                @search-change="autocompleteStorageSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }"
                  ><strong>{{ option.location }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`date_prepared_txt`"
                >{{ $t("preparation.owner") }}:</label
              >
              <vue-multiselect
                id="owner"
                v-model="preparation.owner"
                label="agent"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.owner"
                :options="autocomplete.owner"
                @search-change="autocompleteOwner2Search"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- REMARKS -->
    <v-card
      class="mt-2"
      id="block-description"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.description = !block.description"
        >
          <span>{{ $t("preparation.description") }}</span>
          <v-icon right>fas fa-pen-fancy</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.description = !block.description"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.description ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.description" class="px-1 pt-1 pb-2">
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`remarks`">{{ $t("preparation.remarks") }}:</label>
              <editor :data.sync="preparation.remarks" />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- TAXA -->
    <v-card
      class="mt-2"
      id="block-taxa"
      v-if="$route.meta.isEdit && preparation.id"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.taxa = !block.taxa">
          <span>{{ $t("preparation.taxa") }}</span>
          <v-icon right>fas fa-pastafarianism</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.taxa = !block.taxa" :color="bodyActiveColor">
          <v-icon>{{
            block.taxa ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.taxa" class="px-1 pt-1 pb-2">
          <!-- ADD NEW and EXPORT -->
          <v-card
            class="d-flex flex-row justify-content-start mb-3"
            flat
            tile
            :color="bodyColor.split('n-')[0] + 'n-5'"
          >
            <v-card flat tile class="mx-1">
              <v-btn
                :to="{
                  name: 'Taxon add',
                  query: { preparation: JSON.stringify(preparation) }
                }"
                target="newTaxonWindow"
                :color="bodyActiveColor"
                :dark="isBodyActiveColorDark"
                >{{ $t("add.new") }}</v-btn
              >
            </v-card>

            <v-card flat tile class="mx-1" v-if="relatedData.taxa.count > 0">
              <export-buttons
                filename="preparation"
                :table-data="relatedData.taxa.results"
                clipboard-class="taxon-list-table"
                :body-active-color="bodyActiveColor"
              ></export-buttons>
            </v-card>
          </v-card>

          <!-- PAGINATION -->
          <div
            v-if="relatedData.taxa.count > 10"
            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between px-1"
          >
            <div class="mr-3 mb-3">
              <v-select
                v-model="relatedData.searchParameters.taxon.paginateBy"
                color="blue"
                dense
                :items="paginateByOptionsTranslated"
                item-color="blue"
                label="Paginate by"
                hide-details
              />
            </div>

            <div>
              <v-pagination
                v-model="relatedData.searchParameters.taxon.page"
                color="blue"
                circle
                prev-icon="fas fa-angle-left"
                next-icon="fas fa-angle-right"
                :length="
                  Math.ceil(
                    relatedData.taxa.count /
                      relatedData.searchParameters.taxon.paginateBy
                  )
                "
                :total-visible="5"
              />
            </div>
          </div>

          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <taxon-list-table
                ref="table"
                :response="relatedData.taxa"
                :search-parameters="relatedData.searchParameters.taxon"
                v-if="relatedData.taxa.count > 0"
                :body-color="bodyColor"
                :body-active-color="bodyActiveColor"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- IS_PRIVATE -->
    <v-row no-gutters class="mt-2">
      <v-col>
        <v-checkbox
          v-model="preparation.is_private"
          id="is_private"
          :label="$t('preparation.is_private')"
          hide-details
          :color="bodyActiveColor"
          class="mt-0 vuetify-checkbox"
        ></v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import cloneDeep from "lodash/cloneDeep";
import {
  fetchLinkedTaxa,
  fetchPreparation
} from "../../assets/js/api/apiCalls";
import Editor from "../partial/editor/Editor";
import Spinner from "vue-simple-spinner";
import ExportButtons from "../partial/export/ExportButtons";
import debounce from "lodash/debounce";
import TaxonListTable from "../taxon/TaxonListTable";

export default {
  name: "Preparation",
  components: {
    Editor,
    Spinner,
    TaxonListTable,
    ExportButtons
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
        searchHistory: "preparationSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_PREPARATIONS",
        title: "header.preparations",
        object: "preparation",
        field: "preparation_number",
        block: this.block
      });
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler: function() {
        this.setInitialData();
        this.reloadData();
      },
      deep: true
    },
    "relatedData.searchParameters.taxon": {
      handler(newVal) {
        if (this.$route.meta.isEdit) {
          this.searchRelatedData(newVal, this.fetchLinkedTaxaWrapper, "taxa");
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    fetchLinkedTaxaWrapper() {
      return new Promise(resolve => {
        resolve(
          fetchLinkedTaxa(
            this.relatedData.searchParameters.taxon,
            this.$route.params.id
          )
        );
      });
    },

    setInitialData() {
      return {
        searchHistory: "preparationSearchHistory",
        relatedData: this.setDefaultRalatedData(),
        copyFields: [
          "id",
          "preparation_number",
          "sample",
          "sample_number",
          "analysis",
          "taxon",
          "agent",
          "agent_txt",
          "date_prepared",
          "date_prepared_txt",
          "identification_agent",
          "identification_date",
          "identification_remarks",
          "location",
          "is_private",
          "storage",
          "owner",
          "remarks"
        ],
        autocomplete: {
          loaders: {
            sample: false,
            analysis: false,
            taxon: false,
            agent: false,
            identification_agent: false,
            storage: false,
            owner: false
          },
          sample: [],
          analysis: [],
          taxon: [],
          agent: [],
          identification_agent: [],
          storage: [],
          owner: []
        },
        requiredFields: ["preparation_number"],
        preparation: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          info: true,
          details: true,
          description: true,
          taxa: true
        },
        paginateByOptions: [
          { text: "main.pagination", value: 10 },
          { text: "main.pagination", value: 25 },
          { text: "main.pagination", value: 50 },
          { text: "main.pagination", value: 100 },
          { text: "main.pagination", value: 250 },
          { text: "main.pagination", value: 500 },
          { text: "main.pagination", value: 1000 }
        ],
        menuDatePrepared: false,
        menuIdentificationDate: false
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        this.$emit("set-object", "preparation");
        fetchPreparation(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.preparation = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.preparation);

            this.removeUnnecessaryFields(this.preparation, this.copyFields);
            this.$emit("data-loaded", this.preparation);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });
      }
    },

    setDefaultRalatedData() {
      return {
        taxa: {
          count: 0,
          results: []
        },
        count: {
          sample: 0
        },
        searchParameters: {
          taxon: {
            page: 1,
            paginateBy: 25,
            sortBy: ["id"],
            sortDesc: [true]
          }
        }
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (this.isNotEmpty(objectToUpload.sample))
        uploadableObject.sample = objectToUpload.sample.id;
      if (this.isNotEmpty(objectToUpload.analysis))
        uploadableObject.analysis = objectToUpload.analysis.id;
      if (this.isNotEmpty(objectToUpload.taxon))
        uploadableObject.taxon = objectToUpload.taxon.id;
      if (this.isNotEmpty(objectToUpload.agent))
        uploadableObject.agent = objectToUpload.agent.id;
      if (this.isNotEmpty(objectToUpload.identification_agent))
        uploadableObject.identification_agent =
          objectToUpload.identification_agent.id;
      if (this.isNotEmpty(objectToUpload.storage))
        uploadableObject.storage = objectToUpload.storage.id;
      if (this.isNotEmpty(objectToUpload.owner))
        uploadableObject.owner = objectToUpload.owner.id;

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      this.preparation.sample = { id: obj.sample, number: obj.sample__number };
      this.preparation.analysis = { id: obj.analysis };
      this.preparation.taxon = {
        id: obj.taxon,
        taxon: obj.taxon__taxon
      };
      this.preparation.agent = {
        id: obj.agent,
        agent: obj.agent__agent
      };
      this.preparation.identification_agent = {
        id: obj.identification_agent,
        agent: obj.identification_agent__agent
      };
      this.preparation.storage = {
        id: obj.storage,
        location: obj.storage__location
      };
      this.preparation.owner = {
        id: obj.owner,
        agent: obj.owner__agent
      };
    },

    setDefaultSearchParameters() {
      return {
        preparation_number: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    },

    searchRelatedData: debounce(function(
      searchParameters,
      apiCall,
      relatedObject
    ) {
      apiCall().then(response => {
        if (response.status === 200) {
          this.relatedData[relatedObject].count = response.body.count;
          this.relatedData[relatedObject].results = response.body.results;
        }
      });
    },
    500)
  }
};
</script>

<style scoped>
label {
  margin: 0;
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.8rem;
}
</style>
