<template>
  <div class="analysis">

    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- GENERAL INFO -->
    <fieldset class="border p-2 mb-2" ref="info" id="block-info">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.info }" @click="block.info = !block.info">
        {{ $t('analysis.generalInfo') }}
        <font-awesome-icon icon="project-diagram"/>
      </legend>

      <transition name="fade">
        <div v-if="block.info">

          <!-- SAMPLE and SPECIMEN -->
          <div class="row">
            <div class="col-md-6">
              <label class="p-0" :for="`agent`">{{ $t('analysis.sample') }}:</label>
              <vue-multiselect id="sample" class="align-middle"
                               v-model="analysis.sample"
                               deselect-label="Can't remove this value"
                               label="number"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.sample"
                               :options="autocomplete.sample"
                               @search-change="autcompleteSampleSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :allow-empty="false"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.number }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label class="p-0" :for="`agent`">{{ $t('analysis.specimen') }}:</label>
              <vue-multiselect class="align-middle" v-model="analysis.specimen" deselect-label="Can't remove this value"
                               label="specimen_id" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.specimen"
                               :options="autocomplete.specimen" :searchable="true" @search-change="autcompleteSpecimenSearch"
                               :allow-empty="true"  :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.specimen_id}}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

          <!-- ANALYSIS_METHOD and MASS -->
          <div class="row">
            <div class="col-md-6">
              <label class="p-0" :for="`agent`">{{ $t('analysis.method') }}:</label>
              <vue-multiselect v-model="analysis.analysis_method"
                               :options="autocomplete.analysis_methods"
                               track-by="id"
                               :label="analysisMethodLabel"  select-label=""
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label class="p-0" :for="`mass`">{{ $t('analysis.mass') }}:</label>
              <b-form-input id="mass" v-model="analysis.mass" type="number"></b-form-input>
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
              <label class="p-0" :for="`labor`">{{ $t('analysis.labor') }}:</label>
              <vue-multiselect v-model="analysis.lab"
                               :options="autocomplete.labs"
                               track-by="id"
                               :label="labLabel"  select-label=""
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
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
                               :options="autocomplete.instruments"
                               track-by="id"
                               :label="instrumentLabel"  select-label=""
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
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
              <vue-multiselect id="agent" class="align-middle"
                               v-model="analysis.agent"
                               deselect-label="Can't remove this value"
                               label="agent"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.agent"
                               :options="autocomplete.agent"
                               @search-change="autcompleteAgentSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :allow-empty="false"
                               :open-direction="'bottom'">
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
                               :multiple="false"
                               label="name"
                               track-by="id"
                               :options="autocomplete.dataset"
                               :internal-search="false"
                               :preserve-search="true"
                               :close-on-select="true"
                               @search-change="autcompleteDatasetSearch"
                               :custom-label="customLabelForDataset"
                               :loading="autocomplete.loaders.dataset"
                               :placeholder="$t('add.inputs.autocomplete')"
                               placeholder="dataset search..."
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.id }} - (</strong>
                  <strong v-translate="{ et: option.name, en: option.name_en }"></strong>
                  <strong>) </strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
            <div class="col-md-4">
              <label class="p-0" :for="`reference`">{{ $t('analysis.publication') }}:</label>
              <vue-multiselect class="align-middle" v-model="analysis.reference" deselect-label="Can't remove this value"
                               label="reference" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.reference"  select-label=""
                               :options="autocomplete.reference" :searchable="true" @search-change="autcompleteReferenceSearch"
                               :allow-empty="true"  :show-no-results="false"
                               :open-direction="'top'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.reference }}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
            <div class="col-md-4">
              <label class="p-0" :for="`analyzer`">{{ $t('analysis.owner') }}:</label>
              <vue-multiselect id="owner" class="align-middle"
                               v-model="analysis.owner"
                               deselect-label="Can't remove this value"
                               label="agent"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.owner"
                               :options="autocomplete.agent"
                               @search-change="autcompleteOwnerSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :allow-empty="false"
                               :open-direction="'bottom'">
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
              <vue-multiselect class="align-middle" v-model="analysis.storage" deselect-label="Can't remove this value"
                               :loading="autocomplete.loaders.storage" id="storage"
                               label="location" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :options="autocomplete.storage" :searchable="true" @search-change="autcompleteStorageSearch"
                               :allow-empty="true"  :show-no-results="false" :max-height="600"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{option.location}}</strong> </template>
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
        <font-awesome-icon icon="pen-fancy"/>
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
    <div class="row mb-2" v-if="$route.meta.isEdit">
      <div class="col mt-2">
        <ul class="nav nav-tabs nav-fill mb-3">
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('analysis_results')" class="nav-link"
               :class="{ active: activeTab === 'analysis_results' }">
              {{ $t('analysis.relatedTables.analysis_results') }}
              <!--<font-awesome-icon icon="file-contract"/>-->
            </a>
          </li>

          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('attachment_link')" class="nav-link"
               :class="{ active: activeTab === 'attachment_link' }">
              {{ $t('analysis.relatedTables.attachment_link') }} <font-awesome-icon icon="folder-open"/>
            </a>
          </li>
        </ul>

        <div class="row" v-if="activeTab !== 'attachment_link'">
          <div class="col-sm-6 col-md-3 pl-3 pr-3  t-paginate-by-center">
            <b-form-select v-model="relatedData.paginateBy[activeTab]" class="mb-3" size="sm">
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

          <!--<div class="col-sm-12 col-md-6 pagination-center"-->
               <!--v-if="relatedData[activeTab] !== null && relatedData[activeTab].length > 0">-->
            <!--<b-pagination-->
              <!--size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="relatedData.count[activeTab]"-->
              <!--v-model="relatedData.page[activeTab]" :per-page="relatedData.paginateBy[activeTab]">-->
            <!--</b-pagination>-->
          <!--</div>-->
        </div>
        <analysis-results :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab" />
        <analysis-files :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab" />

      </div>
    </div>

    <!-- IS PRIVATE -->
    <div class="row mt-3">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="analysis.is_private" :value="true || 1" :unchecked-value="false || 0">
          {{ $t('doi.private') }}?
        </b-form-checkbox>
      </div>
    </div>

    <div class="row mt-3 mb-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false, 'analysis', true)"
                :title="$t('edit.buttons.saveAndLeave') ">
          <font-awesome-icon icon="door-open"/>
          {{ $t('edit.buttons.saveAndLeave') }}
        </button>

        <button class="btn btn-success mr-2 mb-2 pr-5 pl-5" :disabled="sendingData" @click="add(true, 'analysis', true)"
                :title="$t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') ">
          <font-awesome-icon icon="save"/>
          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}
        </button>

        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="reset('analysis', $route.meta.isEdit)"
                :title="$t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') ">
          <font-awesome-icon icon="ban"/>
          {{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}
        </button>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import Datepicker from 'vue2-datepicker'
  import formManipulation from "../mixins/formManipulation";
  import autocompleteFieldManipulation from "../mixins/autocompleFormManipulation";
  import cloneDeep from 'lodash/cloneDeep'
  import {
    fetchAnalyses,
    fetchAnalysis,
    fetchLabs,
    fetchInstruments,
    fetchAnalysisAttachment,
    fetchAnalysisResults,
    fetchAnalysisMethod,
  } from "../../assets/js/api/apiCalls";
  import FileInputComponent from "../partial/MultimediaComponent";
  import AnalysisFiles from "./relatedTables/AnalysisFiles";
  import AnalysisResults from "./relatedTables/AnalysisResults";
  import localStorageMixin from "../mixins/localStorageMixin";
  import permissionsMixin from "../mixins/permissionsMixin";

  export default {
    components: {
      AnalysisResults,
      AnalysisFiles,
      Datepicker,
      VueMultiselect,
      Spinner,
      FileInputComponent,
    },

    mixins: [formManipulation, autocompleteFieldManipulation, localStorageMixin, permissionsMixin],

    name: "Analysis",

    data() {
      return this.setInitialData()
    },

    created() {
      // USED BY SIDEBAR
      const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
      let params = this.isDefinedAndNotNull(searchHistory) && searchHistory.hasOwnProperty('id') && searchHistory !== 'fallbackValue' && searchHistory !== '[object Object]' ? searchHistory : this.searchParameters;
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

      this.loadFullInfo()
    },

    watch: {
      '$route.params.id': {
        handler: function (newval, oldval) {
          this.reloadData()
        },
        deep: true
      },
      'relatedData.paginateBy': {
        handler: function (newVal, oldVal) {
          this.loadRelatedData(this.activeTab)
        },
        deep: true
      },
      'relatedData.page': {
        handler: function (newVal, oldVal) {
          this.loadRelatedData(this.activeTab)
        },
        deep: true
      },
    },

    methods: {
      setTab(type) {
        this.activeTab = type
      },

      setInitialData() {
        return {
          tabs:[ 'analysis_results','attachment_link'],
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
          previousRecord: {},
          nextRecord: {},
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
        // fetching autocompletes

        fetchLabs().then(response => {
          this.autocomplete.labs = this.handleResponse(response);
        });

        fetchInstruments().then(response => {
          this.autocomplete.instruments = this.handleResponse(response);
        });

        fetchAnalysisMethod().then(response => {
          this.autocomplete.analysis_methods = this.handleResponse(response)
        })

        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          fetchAnalysis(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);

            if (handledResponse.length > 0) {
              this.analysis = this.handleResponse(response)[0];

              this.fillAutocompleteFields(this.analysis)

              // Loading RESULTS and ATTACHMENTS here because they don't need api request
              // this.loadRelatedData('analysis_results', this.analysis)
              // this.loadRelatedData('attachment_link', this.analysis)

              this.removeUnnecessaryFields(this.analysis, this.copyFields);
              this.analysis.related_data = {};

              // this.forceRerender(); if needed
              this.$emit('data-loaded', this.analysis)
              this.$emit('set-object', 'analysis')
              this.sendingData = false;
              this.getListRecords('analysis')
            } else {
              this.sendingData = false;
            }
          });

          // Load Related Data which is in tabs
          this.tabs.forEach(entity => {
            this.loadRelatedData(entity);
          });

          this.$on('tab-changed', this.setTab);

          this.$on('related-data-modified', this.editRelatedData);
          this.$on('related-data-added', this.addRelatedData);
          this.$on('edit-row', this.editRow);
          this.$on('allow-remove-row', this.allowRemove);

          this.$emit('related-data-info', this.tabs);

          this.setActiveTab('analysis_results')
        }
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
            analysis_results: ['analysis_id', 'name'],
          },
          insert: {
            attachment_link: {},analysis_results: {},
          },
          page: {
            attachment_link: 1, analysis_results: 1,
          },
          paginateBy: {
            attachment_link: 10,  analysis_results: 10,
          },
          count: {
            attachment_link: 0, analysis_results: 0,
          }
        }
      },

      formatDataForUpload(objectToUpload, saveRelatedData = false) {
        let uploadableObject = cloneDeep(objectToUpload)
        if (this.isDefinedAndNotNull(objectToUpload.is_private)) uploadableObject.is_private = objectToUpload.is_private === 1 ? '1' : '0';
        if (this.isDefinedAndNotNull(objectToUpload.date)) uploadableObject.date = this.formatDateForUpload(objectToUpload.date);
        if (this.isDefinedAndNotNull(objectToUpload.date_end)) uploadableObject.date_end = this.formatDateForUpload(objectToUpload.date_end);

        // Autocomplete fields
        if (this.isDefinedAndNotNull(objectToUpload.sample)) uploadableObject.sample = objectToUpload.sample.id
        if (this.isDefinedAndNotNull(objectToUpload.specimen)) uploadableObject.specimen = objectToUpload.specimen.id
        if (this.isDefinedAndNotNull(objectToUpload.lab)) uploadableObject.lab = objectToUpload.lab.id
        if (this.isDefinedAndNotNull(objectToUpload.instrument)) uploadableObject.instrument = objectToUpload.instrument.id
        if (this.isDefinedAndNotNull(objectToUpload.agent)) uploadableObject.agent = objectToUpload.agent.id
        if (this.isDefinedAndNotNull(objectToUpload.owner)) uploadableObject.owner = objectToUpload.owner.id

        if (this.isDefinedAndNotNull(objectToUpload.reference)) uploadableObject.reference = objectToUpload.reference.id
        if (this.isDefinedAndNotNull(objectToUpload.dataset)) uploadableObject.dataset = objectToUpload.dataset.id

        if (typeof this.databaseId !== 'undefined' && this.databaseId !== null) {
          uploadableObject.database_id = this.databaseId
        }

        // Adding related data
        if (saveRelatedData) {
          uploadableObject.related_data = {}
          uploadableObject.related_data.attachment = this.relatedData.attachment_link
          uploadableObject.related_data.analysis_results = this.relatedData.analysis_results
        }

        console.log('This object is sent in string format:')
        console.log(uploadableObject)
        return JSON.stringify(uploadableObject)
      },

      fillAutocompleteFields(obj) {
         this.analysis.sample = { id: obj.sample, number: obj.sample__number }
         this.analysis.agent = { id: obj.agent, agent: obj.agent__agent}
         this.analysis.owner = { id: obj.owner, agent: obj.owner__agent}
         this.analysis.analysis_method = { id: obj.analysis_method, analysis_method: obj.analysis_method__analysis_method}
         if (typeof obj.dataset !== 'undefined' && obj.dataset !== null) {
           this.analysis.dataset = { id: obj.dataset, name: obj.dataset__name,name_en: obj.dataset__name_en,}
         }
         this.analysis.lab = { id: obj.lab, lab: obj.lab__lab,lab_en: obj.lab__lab_en,}
         this.analysis.instrument = { id: obj.instrument, instrument: obj.instrument__instrument,instrument_en: obj.instrument__instrumenten,}
         this.analysis.specimen = { id: obj.specimen, specimen_id: obj.specimen__specimen_id}
         this.analysis.reference = { id: obj.reference, reference: obj.reference__reference}
         this.analysis.storage = {location:obj.storage__location,id:obj.storage}

      },

      fillRelatedDataAutocompleteFields(obj, type) {
        if (obj === undefined) return;
        // console.log(obj)
        // console.log(type)

        // This goes for related data in tabs
        if (type === undefined) {
          console.log(obj)

          if (this.isDefinedAndNotNull(obj.attachment)) obj.attachment = { id: obj.attachment, original_filename: obj.attachment__original_filename }


          return obj;
        }

        let relatedData = cloneDeep(obj)
        obj = [];
        relatedData.forEach(entity => {
          if (type === 'attachment_link') obj.push(entity)
        });
        return obj
      },

      loadRelatedData(object, analysis = null) {
        let query;

        if (object === 'attachment_link') {
          query = fetchAnalysisAttachment(this.$route.params.id, this.relatedData.page.attachment_link)
        } else if (object === 'analysis_results') {
          query = fetchAnalysisResults(this.$route.params.id, this.relatedData.page.analysis_results)
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
        console.log(uploadableObject.analysis)

        return JSON.stringify(uploadableObject)
      },

      fetchList(localStorageData) {
        let params = this.isDefinedAndNotNull(localStorageData) && localStorageData !== 'fallbackValue' && localStorageData !== '[object Object]' ? localStorageData : this.searchParameters;
        return new Promise((resolve) => {
          resolve(fetchAnalyses(params, this.currentUser, this.databaseId))
        });
      },

      setDefaultSearchParameters() {
        return {
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
        }
      },

      customLabelForDataset(option) {
        if (this.$i18n.locale === 'ee') return `${option.id} - (${option.name})`
        return `${option.id} - (${option.name_en})`
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
