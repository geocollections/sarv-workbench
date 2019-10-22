<template>
  <div class="analysis">

    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- GENERAL INFO -->
    <fieldset class="border p-2 mb-2" ref="info" id="block-info">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.info }" @click="block.info = !block.info">
        {{ $t('analysis.generalInfo') }}
        <i class="fas fa-project-diagram"></i>
      </legend>

      <transition name="fade">
        <div v-if="block.info">

          <!-- SAMPLE and SPECIMEN -->
          <div class="row">
            <div class="col-md-6">
              <label class="p-0" :for="`agent`">{{ $t('analysis.sample') }}:</label>
              <vue-multiselect id="sample"
                               v-model="analysis.sample"
                               label="number"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.sample"
                               :options="autocomplete.sample"
                               @search-change="autocompleteSampleSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.number }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label class="p-0" :for="`specimen`">{{ $t('analysis.specimen') }}:</label>
              <vue-multiselect v-model="analysis.specimen"
                               id="specimen"
                               label="specimen_id"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.specimen"
                               :options="autocomplete.specimen"
                               @search-change="autocompleteSpecimenSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.specimen_id}}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

          <!-- ANALYSIS_METHOD and MASS -->
          <div class="row">
            <div class="col-md-6">
              <label class="p-0" :for="`analysis_method`">{{ $t('analysis.method') }}:</label>
              <vue-multiselect v-model="analysis.analysis_method"
                               id="analysis_method"
                               :options="autocomplete.analysis_methods"
                               track-by="id"
                               :label="analysisMethodLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[analysisMethodLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label class="p-0" :for="`mass`">{{ $t('analysis.mass') }}:</label>
              <b-form-input id="mass" v-model="analysis.mass" type="number" step="0.1"></b-form-input>
            </div>
          </div>

          <!-- MET.DETAILS and MET.ING.K -->
          <div class="row">
            <div class="col-md-6">
              <label class="p-0" :for="`method_specification`">{{ $t('analysis.method_specification') }}:</label>
              <b-form-input v-model="analysis.method_details" type="text"/>
            </div>

            <div class="col-md-6">
              <label class="p-0" :for="`method_in_eng`">{{ $t('analysis.method_in_eng') }}:</label>
              <b-form-input v-model="analysis.method_details_en" type="text"/>
            </div>
          </div>

          <!-- MATERIAL -->
          <div class="row">
            <div class="col-md-12">
              <label class="p-0" :for="`material`">{{ $t('analysis.material') }}:</label>
              <b-form-input v-model="analysis.material" type="text"/>
            </div>
          </div>

          <!-- DATE_START and DATE_END and DATE_FREE-->
          <div class="row">
            <div class="col-sm-4">
              <label :for="`date_start`" class="p-0">{{ $t('analysis.date') }}:</label>
              <datepicker id="date_start"
                          v-model="analysis.date"
                          use-utc="true "
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"
                          input-class="form-control"></datepicker>
            </div>

            <div class="col-sm-4">
              <label :for="`date_end`" class="p-0">{{ $t('analysis.date_end') }}:</label>
              <datepicker id="date_end"
                          v-model="analysis.date_end"
                          use-utc="true "
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"
                          input-class="form-control"></datepicker>
            </div>

            <div class="col-sm-4">
              <label :for="`date_free`" class="p-0">{{ $t('analysis.date_free') }}:</label>
              <b-form-input id="date_free" v-model="analysis.date_free" type="text" maxlength="10"/>
            </div>
          </div>

          <!-- LABOR and LABOR TXT -->
          <div class="row">
            <div class="col-md-6">
              <label class="p-0" :for="`lab`">{{ $t('analysis.labor') }}:</label>
              <vue-multiselect v-model="analysis.lab"
                               id="lab"
                               :options="autocomplete.labs"
                               track-by="id"
                               :label="labLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[labLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label class="p-0" :for="`labor_txt`">{{ $t('analysis.labor_txt') }}:</label>
              <b-form-input id="labor_txt" v-model="analysis.lab_txt" type="text"></b-form-input>
            </div>
          </div>

          <!-- LAB. SAMPLE and LAB.NUMBER -->
          <div class="row">
            <div class="col-md-6">
              <label class="p-0" :for="`labor_sample`">{{ $t('analysis.labor_sample') }}:</label>
              <b-form-input v-model="analysis.lab_sample_number" type="text"/>
            </div>

            <div class="col-md-6">
              <label class="p-0" :for="`labor_number`">{{ $t('analysis.labor_number') }}:</label>
              <b-form-input v-model="analysis.lab_analysis_number" type="text"/>
            </div>
          </div>

          <!-- ANALYSIS_METHOD and MASS -->
          <div class="row">
            <div class="col-md-6">
              <label class="p-0" :for="`instrument`">{{ $t('analysis.tool') }}:</label>
              <vue-multiselect v-model="analysis.instrument"
                               id="instrument"
                               :options="autocomplete.instruments"
                               track-by="id"
                               :label="instrumentLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[instrumentLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label class="p-0" :for="`instrument_txt`">{{ $t('analysis.tool_txt') }}:</label>
              <b-form-input id="tool_txt" v-model="analysis.instrument_txt" type="text"></b-form-input>
            </div>
          </div>

          <!-- ANALYZER and ANALYZER_TXT -->
          <div class="row">

            <div class="col-md-6">
              <label class="p-0" :for="`analyzer`">{{ $t('analysis.analyzer') }}:</label>
              <vue-multiselect id="agent"
                               v-model="analysis.agent"
                               label="agent"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.agent"
                               :options="autocomplete.agent"
                               @search-change="autocompleteAgentSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
            <div class="col-md-6">
              <label class="p-0" :for="`agent_txt`">{{ $t('analysis.analyzer_txt') }}:</label>
              <b-form-input id="analyzer_txt" v-model="analysis.agent_txt" type="text"></b-form-input>
            </div>
          </div>

          <!-- DATASET and ANALYZER_TXT -->
          <div class="row">
            <div class="col-md-4">
              <label class="p-0" :for="`dataset`">{{ $t('analysis.first_dataset') }}:</label>
              <vue-multiselect v-model="analysis.dataset"
                               id="dataset"
                               :label="nameLabel"
                               track-by="id"
                               placeholder="dataset search..."
                               :loading="autocomplete.loaders.dataset"
                               :options="autocomplete.dataset"
                               @search-change="autocompleteDatasetSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[nameLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
            <div class="col-md-4">
              <label class="p-0" :for="`reference`">{{ $t('analysis.publication') }}:</label>
              <vue-multiselect v-model="analysis.reference"
                               id="reference"
                               label="reference"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.reference"
                               :options="autocomplete.reference"
                               @search-change="autocompleteReferenceSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.reference }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
            <div class="col-md-4">
              <label class="p-0" :for="`owner`">{{ $t('analysis.owner') }}:</label>
              <vue-multiselect id="owner"
                               v-model="analysis.owner"
                               label="agent"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.owner"
                               :options="autocomplete.agent"
                               @search-change="autocompleteOwnerSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

          </div>

          <!-- STORAGE and LOCATION -->
          <div class="row">
            <div class="col-md-6">
              <label class="p-0" :for="`labor_sample`">{{ $t('analysis.storage') }}:</label>
              <vue-multiselect v-model="analysis.storage"
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
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{option.location}}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label class="p-0" :for="`labor_number`">{{ $t('analysis.location') }}:</label>
              <b-form-input v-model="analysis.location" type="text"/>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- REMARKS -->
    <fieldset class="border p-2 mb-2" id="block-description">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.description }" @click="block.description = !block.description">
        {{ $t('analysis.remarks') }}
        <i class="fas fa-pen-fancy"></i>
      </legend>

      <transition name="fade">
        <div v-if="block.description">

          <div class="row">
            <div class="col-sm-12">
              <label class="mt-0" :for="`remarks`">{{ $t('analysis.remarks') }}:</label>
              <b-form-textarea id="remarks" v-model="analysis.remarks" type="text" :rows="1" :max-rows="20"></b-form-textarea>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- SHOWING RELATED_DATA -->
    <div class="row mb-2">
      <div class="col mt-2">

        <ul class="nav nav-tabs nav-fill mb-3">

          <li class="nav-item" v-for="tab in relatedTabs" :key="tab.name">
            <a href="#" @click.prevent="setTab(tab.name)" class="nav-link" :class="{ active: activeTab === tab.name }">
              <span>{{ $t('analysis.relatedTables.' + tab.name) }}</span>

              <span>
                <sup>
                  <b-badge pill variant="light">{{ relatedData[tab.name].length }}&nbsp;</b-badge>
                </sup>
              </span>

              <span><i :class="tab.iconClass"></i></span>
            </a>
          </li>
        </ul>

        <div class="row" v-if="$route.meta.isEdit">
          <div class="col-sm-6 col-md-3 pl-3 pr-3  t-paginate-by-center">
            <b-form-select v-model="relatedData.searchParameters[activeTab].paginateBy" class="mb-3" size="sm">
              <option :value="10">{{ this.$t('main.pagination', { num: '10' }) }}</option>
              <option :value="25">{{ this.$t('main.pagination', { num: '25' }) }}</option>
              <option :value="50">{{ this.$t('main.pagination', { num: '50' }) }}</option>
              <option :value="100">{{ this.$t('main.pagination', { num: '100' }) }}</option>
              <option :value="250">{{ this.$t('main.pagination', { num: '250' }) }}</option>
              <option :value="500">{{ this.$t('main.pagination', { num: '500' }) }}</option>
              <option :value="1000">{{ this.$t('main.pagination', { num: '1000' }) }}</option>
            </b-form-select>
          </div>

          <div class="col-sm-12 col-md-3 export-center">
            <!-- EXPORT BUTTON? -->
          </div>

          <div class="col-sm-12 col-md-6 pagination-center"
               v-if="relatedData[activeTab] !== null && relatedData[activeTab].length > 0">
            <b-pagination
              size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="relatedData.count[activeTab]"
              v-model="relatedData.searchParameters[activeTab].page" :per-page="relatedData.searchParameters[activeTab].paginateBy">
            </b-pagination>
          </div>
        </div>

        <analysis-results :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                          v-on:add-related-data="addRelatedData"
                          v-on:set-default="setDefault"
                          v-on:edit-row="editRow"
                          v-on:remove-row="removeRow" />

        <analysis-files :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                        v-on:add-related-data="addRelatedData"
                        v-on:set-default="setDefault"
                        v-on:edit-row="editRow"
                        v-on:remove-row="removeRow" />

      </div>
    </div>

    <!-- IS PRIVATE -->
    <div class="row mt-3">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="analysis.is_private">
          {{ $t('analysis.is_private') }}?
        </b-form-checkbox>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import Datepicker from 'vue2-datepicker'
  import formManipulation from "../../mixins/formManipulation";
  import autocompleteMixin from "../../mixins/autocompleteMixin";
  import cloneDeep from 'lodash/cloneDeep'
  import {
    fetchAnalysis,
    fetchLabs,
    fetchInstruments,
    fetchAnalysisAttachment,
    fetchAnalysisResults,
    fetchAnalysisMethod,
  } from "../../assets/js/api/apiCalls";
  import AnalysisFiles from "./relatedTables/AnalysisFiles";
  import AnalysisResults from "./relatedTables/AnalysisResults";
  import formSectionsMixin from "../../mixins/formSectionsMixin";
  import {mapState} from "vuex";

  export default {
    components: {
      AnalysisResults,
      AnalysisFiles,
      Datepicker,
      Spinner,
    },

    mixins: [formManipulation, autocompleteMixin, formSectionsMixin],

    name: "Analysis",

    data() {
      return this.setInitialData()
    },

    created() {
      // USED BY SIDEBAR
      if (this.$route.meta.isEdit) {
        const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
        let params = this.isNotEmpty(searchHistory) && searchHistory.hasOwnProperty('id') && searchHistory !== 'fallbackValue' && searchHistory !== '[object Object]' ? searchHistory : this.searchParameters;
        this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', {
          searchHistory: 'analysisSearchHistory',
          defaultSearch: this.setDefaultSearchParameters(),
          search: params,
          request: 'FETCH_ANALYSES',
          title: 'header.analyses',
          object: 'analysis',
          field: 'sample__number',
          block: this.block,
          agent: this.currentUser,
          databaseId: this.databaseId
        });
      }

      // Getting sample (only from sample view when user presses 'add analysis button')
      if (typeof this.$route.params.sample !== 'undefined' && this.$route.params.sample !== null) {
        this.analysis.sample = this.$route.params.sample
      }

      this.loadFullInfo()
    },

    watch: {
      '$route.params.id': {
        handler: function (newval, oldval) {
          this.reloadData()
        },
        deep: true
      },
      'relatedData.searchParameters': {
        handler: function (newVal, oldVal) {
          this.loadRelatedData(this.activeTab)
        },
        deep: true
      },
    },

    computed: {
      ...mapState(["currentUser", "databaseId"]),

      activeRelatedDataTab() {
        let tabObject = this.$store.state.activeRelatedDataTab;
        if (tabObject && tabObject[this.$route.meta.object]) {
          return tabObject[this.$route.meta.object];
        } else return null;
      },
    },

    methods: {
      setTab(type) {
        if (type) {
          this.$store.dispatch("updateActiveTab", { tab: type, object: this.$route.meta.object });
          this.activeTab = type
        }
      },

      setInitialData() {
        return {
          relatedTabs: [
            { name: 'analysis_results', iconClass: 'far fa-chart-bar' },
            { name: 'attachment_link', iconClass: 'fas fa-folder-open' },
          ],
          searchHistory: 'analysisSearchHistory',
          activeTab: 'analysis_results',
          relatedData: this.setDefaultRelatedData(),
          copyFields: ['id', 'sample', 'specimen', 'analysis_method', 'mass', 'method_details', 'method_details_en',
            'material','date', 'date_end', 'date_free','lab', 'lab_txt','lab_analysis_number', 'lab_sample_number',
            'instrument','instrument_txt','agent','agent_txt','owner','dataset','reference','storage','location',
            'remarks','is_private'],
          autocomplete: {
            loaders: {
              agent: false,
              owner: false,
              sample: false,
              specimen: false,
              storage: false,
              analysis_methods: false,
              dataset:false,
              labs:false,
              instruments:false,
              reference:false,
              attachment:false,

            },
            agent: [],
            owner: [],
            sample: [],
            specimen: [],
            storage: [],
            dataset: [],
            labs: [],
            instruments: [],
            reference: [],
            analysis_methods: [],
            attachment: []
          },
          requiredFields: [],
          analysis: {},
          searchParameters: this.setDefaultSearchParameters(),
          componentKey: 0,
          block: {info: true, description: true}
        }
      },

      reloadData() {
        Object.assign(this.$data, this.setInitialData());
        this.loadFullInfo()
      },

      loadFullInfo() {
        this.loadAutocompleteFields();

        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          this.$emit('set-object', 'analysis');

          fetchAnalysis(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);

            if (handledResponse.length > 0) {
              this.$emit('object-exists', true);
              this.analysis = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.analysis)

              this.removeUnnecessaryFields(this.analysis, this.copyFields);
              this.$emit('data-loaded', this.analysis)
              this.sendingData = false;
            } else {
              this.sendingData = false;
              this.$emit('object-exists', false);
            }
          });

          // Load Related Data which is in tabs
          this.relatedTabs.forEach(tab => {
            this.loadRelatedData(tab.name);
          });

          this.$on('tab-changed', this.setTab);

          this.$emit('related-data-info', this.relatedTabs.map(tab => tab.name));
        }

        if (this.activeRelatedDataTab) this.setTab(this.activeRelatedDataTab);
        else this.setTab('analysis_results')
      },

      loadAutocompleteFields(regularAutocompleteFields = true, relatedDataAutocompleteFields = false) {
        if (regularAutocompleteFields) {
          fetchLabs().then(response => this.autocomplete.labs = this.handleResponse(response));
          fetchInstruments().then(response => this.autocomplete.instruments = this.handleResponse(response));
          fetchAnalysisMethod().then(response => this.autocomplete.analysis_methods = this.handleResponse(response));
        }
        if (relatedDataAutocompleteFields) {}
      },

      setDefaultRelatedData() {
        return {
          attachment_link: [],
          analysis_results: [],
          new: {
            attachment: [],
            analysis_results: [],
          },
          copyFields: {
            attachment_link: ['attachment', 'remarks'],
            analysis_results: ['name', 'value', 'value_max', 'value_min', 'value_bin', 'value_txt'],
          },
          insert: this.setDefaultInsertRelatedData(),
          searchParameters: {
            attachment_link: {
              page: 1,
              paginateBy: 10,
              orderBy: 'id'
            },
            analysis_results: {
              page: 1,
              paginateBy: 10,
              orderBy: 'id'
            },
          },
          count: {
            attachment_link: 0, analysis_results: 0,
          }
        }
      },

      setDefaultInsertRelatedData() {
        return {
          attachment_link: {},
          analysis_results: {},
        }
      },

      formatDataForUpload(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload);

        if (this.isNotEmpty(objectToUpload.date)) uploadableObject.date = this.formatDateForUpload(objectToUpload.date);
        if (this.isNotEmpty(objectToUpload.date_end)) uploadableObject.date_end = this.formatDateForUpload(objectToUpload.date_end);

        // Autocomplete fields
        if (this.isNotEmpty(objectToUpload.sample)) uploadableObject.sample = objectToUpload.sample.id;
        if (this.isNotEmpty(objectToUpload.analysis_method)) uploadableObject.analysis_method = objectToUpload.analysis_method.id;
        if (this.isNotEmpty(objectToUpload.specimen)) uploadableObject.specimen = objectToUpload.specimen.id;
        if (this.isNotEmpty(objectToUpload.lab)) uploadableObject.lab = objectToUpload.lab.id;
        if (this.isNotEmpty(objectToUpload.instrument)) uploadableObject.instrument = objectToUpload.instrument.id;
        if (this.isNotEmpty(objectToUpload.agent)) uploadableObject.agent = objectToUpload.agent.id;
        if (this.isNotEmpty(objectToUpload.owner)) uploadableObject.owner = objectToUpload.owner.id;
        if (this.isNotEmpty(objectToUpload.storage)) uploadableObject.storage = objectToUpload.storage.id;

        if (this.isNotEmpty(objectToUpload.reference)) uploadableObject.reference = objectToUpload.reference.id;
        if (this.isNotEmpty(objectToUpload.dataset)) uploadableObject.dataset = objectToUpload.dataset.id;

        if (this.databaseId) uploadableObject.database = this.databaseId;


        // Adding related data only on add view
        if (!this.$route.meta.isEdit) {
          uploadableObject.related_data = {};

          this.relatedTabs.forEach(tab => {
            if (this.isNotEmpty(this.relatedData[tab.name])) uploadableObject.related_data[tab.name] = this.relatedData[tab.name]
          });
        }

        console.log('This object is sent in string format:');
        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
      },

      fillAutocompleteFields(obj) {
        console.log(obj)
        this.analysis.sample = { id: obj.sample, number: obj.sample__number }
        this.analysis.agent = { id: obj.agent, agent: obj.agent__agent}
        this.analysis.owner = { id: obj.owner, agent: obj.owner__agent}
        this.analysis.analysis_method = { id: obj.analysis_method, analysis_method: obj.analysis_method__analysis_method}
        this.analysis.dataset = { id: obj.dataset, name: obj.dataset__name,name_en: obj.dataset__name_en,}
        this.analysis.lab = { id: obj.lab, lab: obj.lab__lab,lab_en: obj.lab__lab_en,}
        this.analysis.instrument = { id: obj.instrument, instrument: obj.instrument__instrument, instrument_en: obj.instrument__instrument_en,}
        this.analysis.specimen = { id: obj.specimen, specimen_id: obj.specimen__specimen_id}
        this.analysis.reference = { id: obj.reference, reference: obj.reference__reference}
        this.analysis.storage = {location:obj.storage__location,id:obj.storage}
      },

      fillRelatedDataAutocompleteFields(obj) {
        if (this.isNotEmpty(obj.attachment)) obj.attachment = { id: obj.attachment, original_filename: obj.attachment__original_filename }

        return obj
      },

      unformatRelatedDataAutocompleteFields(obj, objectID) {
        let newObject = cloneDeep(obj);

        if (objectID) newObject.id = objectID;

        if (this.isNotEmpty(obj.attachment)) {
          newObject.attachment = obj.attachment.id;
          newObject.attachment__original_filename = obj.attachment.original_filename;
        }

        return newObject
      },

      loadRelatedData(object) {
        let query;

        if (object === 'attachment_link') {
          query = fetchAnalysisAttachment(this.$route.params.id, this.relatedData.searchParameters.attachment_link)
        } else if (object === 'analysis_results') {
          query = fetchAnalysisResults(this.$route.params.id, this.relatedData.searchParameters.analysis_results)
        }

        return new Promise(resolve => {
          query.then(response => {
            this.relatedData[object] = this.handleResponse(response);
            this.relatedData.count[object] = response.body.count;
            resolve(true)
          });
        });
      },

      //check required fields for related data
      checkRequiredFields(type) {},

      formatRelatedData(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload);
        uploadableObject.analysis = this.analysis.id;

        if (this.isNotEmpty(uploadableObject.attachment)) {
          uploadableObject.attachment = uploadableObject.attachment.id ? uploadableObject.attachment.id : uploadableObject.attachment;
        }

        console.log('This object is sent in string format (related_data):')
        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
      },

      setDefaultSearchParameters() {
        return {
          id: null,
          analysis_method: null,
          agentAndLab: null,
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
        }
      },
    }

  }
</script>

<style scoped>
  label {
    margin: 5px 0 0 0;
    color: #999;
    font-size: 0.8rem;
  }

  .link:hover {
    cursor: pointer;
  }
</style>
