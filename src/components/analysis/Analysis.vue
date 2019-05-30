<template>
  <div class="analysis">
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>
    <!-- GENERAL INFO -->
    <fieldset class="border p-2 mb-2" ref="info">
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
              <vue-multiselect id="specimen" class="align-middle" :disabled="true"
                               v-model="analysis.specimen"
                               deselect-label="Can't remove this value"
                               label="number"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.specimen"
                               :options="autocomplete.specimen"
                               @search-change="autcompleteSpecimenSearch"
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
          </div>

          <!-- ANALYSIS_METHOD and MASS -->
          <div class="row">
            <div class="col-md-6">
              <label class="p-0" :for="`agent`">{{ $t('analysis.method') }}:</label>
              <vue-multiselect v-model="analysis.analysis_method"
                               :options="analysisMethods"
                               track-by="id"
                               :label="analysisMethodLabel"  select-label=""
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label class="p-0" :for="`agent`">{{ $t('analysis.mass') }}:</label>
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
              <b-form-input v-model="analysis.material" type="text" :disabled="true"/>
            </div>
          </div>

          <!-- DATE_START and DATE_END and DATE_FREE-->
          <div class="row">
            <div class="col-sm-4">
              <label :for="`date_start`" class="p-0">{{ $t('analysis.date') }}:</label>
              <datepicker id="date_start"
                          v-model="analysis.date_start"
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
              <vue-multiselect v-model="analysis.lab" :disabled="true"
                               :options="analysisMethods"
                               track-by="id"
                               :label="analysisMethodLabel"  select-label=""
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
              <b-form-input v-model="analysis.labor_sample" type="text" :disabled="true"/>
            </div>

            <div class="col-md-6">
              <label class="p-0" :for="`labor_number`">{{ $t('analysis.labor_number') }}:</label>
              <b-form-input v-model="analysis.labor_number" type="text" :disabled="true"/>
            </div>
          </div>

          <!-- ANALYSIS_METHOD and MASS -->
          <div class="row">
            <div class="col-md-6">
              <label class="p-0" :for="`tool`">{{ $t('analysis.tool') }}:</label>
              <vue-multiselect v-model="analysis.instrument" :disabled="true"
                               :options="analysisMethods"
                               track-by="id"
                               :label="analysisMethodLabel"  select-label=""
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label class="p-0" :for="`agent`">{{ $t('analysis.tool_txt') }}:</label>
              <b-form-input id="tool_txt" v-model="analysis.instrument_txt" type="text"></b-form-input>
            </div>
          </div>

          <!-- SAMPLE and OWNER (agent) -->
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
              <label class="p-0" :for="`analyzer_txt`">{{ $t('analysis.analyzer_txt') }}:</label>
              <b-form-input id="analyzer_txt" v-model="analysis.analyzer_txt" type="text"></b-form-input>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- REMARKS -->
    <fieldset class="border p-2 mb-2">
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

    <!--&lt;!&ndash; SHOWING RELATED_DATA &ndash;&gt;-->
    <!--<div class="row mb-2">-->
      <!--<div class="col mt-2">-->
        <!--<ul class="nav nav-tabs nav-fill mb-3">-->
          <!--&lt;!&ndash;<li class="nav-item">&ndash;&gt;-->
            <!--&lt;!&ndash;<a href="#" v-on:click.prevent="setActiveTab('analysis_result')" class="nav-link"&ndash;&gt;-->
               <!--&lt;!&ndash;:class="{ active: activeTab === 'analysis_result' }">&ndash;&gt;-->
              <!--&lt;!&ndash;{{ $t('analysis.relatedTables.analysis_result') }} <font-awesome-icon icon="user-friends"/>&ndash;&gt;-->
            <!--&lt;!&ndash;</a>&ndash;&gt;-->
          <!--&lt;!&ndash;</li>&ndash;&gt;-->

          <!--&lt;!&ndash;<li class="nav-item">&ndash;&gt;-->
            <!--&lt;!&ndash;<a href="#" v-on:click.prevent="setActiveTab('attachment_link')" class="nav-link"&ndash;&gt;-->
               <!--&lt;!&ndash;:class="{ active: activeTab === 'attachment_link' }">&ndash;&gt;-->
              <!--&lt;!&ndash;{{ $t('doi.relatedTables.files') }} <font-awesome-icon icon="folder-open"/>&ndash;&gt;-->
            <!--&lt;!&ndash;</a>&ndash;&gt;-->
          <!--&lt;!&ndash;</li>&ndash;&gt;-->
        <!--</ul>-->

        <!--<div class="row" v-if="activeTab !== 'attachment_link'">-->
          <!--<div class="col-sm-6 col-md-3 pl-3 pr-3  t-paginate-by-center">-->
            <!--<b-form-select v-model="relatedData.paginateBy[activeTab]" class="mb-3" size="sm">-->
              <!--<option :value="10">{{ this.$t('main.pagination', { num: '10' }) }}</option>-->
              <!--<option :value="25">{{ this.$t('main.pagination', { num: '25' }) }}</option>-->
              <!--<option :value="50">{{ this.$t('main.pagination', { num: '50' }) }}</option>-->
              <!--<option :value="100">{{ this.$t('main.pagination', { num: '100' }) }}</option>-->
              <!--<option :value="250">{{ this.$t('main.pagination', { num: '250' }) }}</option>-->
              <!--<option :value="500">{{ this.$t('main.pagination', { num: '500' }) }}</option>-->
              <!--<option :value="1000">{{ this.$t('main.pagination', { num: '1000' }) }}</option>-->
            <!--</b-form-select>-->
          <!--</div>-->

          <!--<div class="col-sm-12 col-md-3 export-center">-->
            <!--&lt;!&ndash; EXPORT BUTTON? &ndash;&gt;-->
          <!--</div>-->

          <!--<div class="col-sm-12 col-md-6 pagination-center"-->
               <!--v-if="relatedData[activeTab] !== null && relatedData[activeTab].length > 0">-->
            <!--<b-pagination-->
              <!--size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="relatedData.count[activeTab]"-->
              <!--v-model="relatedData.page[activeTab]" :per-page="relatedData.paginateBy[activeTab]">-->
            <!--</b-pagination>-->
          <!--</div>-->
        <!--</div>-->

        <!--&lt;!&ndash;<doi-files :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab" />&ndash;&gt;-->

      <!--</div>-->
    <!--</div>-->

    <!-- IS PRIVATE -->
    <div class="row mt-3">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="analysis.is_private" :value="1" :unchecked-value="0">
          {{ $t('doi.private') }}?
        </b-form-checkbox>
      </div>
    </div>

    <!--<div class="row mt-3 mb-3">-->
      <!--<div class="col">-->
        <!--<button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false, 'analysis', true)"-->
                <!--:title="$t('edit.buttons.saveAndLeave') ">-->
          <!--<font-awesome-icon icon="door-open"/>-->
          <!--{{ $t('edit.buttons.saveAndLeave') }}-->
        <!--</button>-->

        <!--<button class="btn btn-success mr-2 mb-2 pr-5 pl-5" :disabled="sendingData" @click="add(true, 'analysis', true)"-->
                <!--:title="$t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') ">-->
          <!--<font-awesome-icon icon="save"/>-->
          <!--{{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}-->
        <!--</button>-->

        <!--<button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="reset('analysis', $route.meta.isEdit)"-->
                <!--:title="$t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') ">-->
          <!--<font-awesome-icon icon="ban"/>-->
          <!--{{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}-->
        <!--</button>-->
      <!--</div>-->
    <!--</div>-->

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
    fetchAnalysisMethod,
    fetchAnalyses,
    fetchAnalysis,

  } from "../../assets/js/api/apiCalls";
  import FileInputComponent from "../partial/MultimediaComponent";

  export default {
    components: {
      Datepicker,
      VueMultiselect,
      Spinner,
      FileInputComponent,
    },

    mixins: [formManipulation, autocompleteFieldManipulation],

    name: "Analysis",

    data() {
      return this.setInitialData()
    },

    created() {
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

    computed: {
      analysisMethods() { return this.$store.state['analysisMethods']}
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
            'meterial', 'date', 'date_end', 'date_free', 'lab', 'lab_txt', 'agent', 'is_private'],
          autocomplete: {
            loaders: {
              agent: false,
              sample:false,
              specimen:false,
              analysis_methods: false,
            },
            agent: [],
            sample: [],
            specimen: [],
            analysis_methods: []
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
        fetchAnalysisMethod().then(response => {
          this.autocomplete.analysis_methods = this.handleResponse(response);
        });

        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          fetchAnalysis(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);

            if (handledResponse.length > 0) {
              this.analysis = this.handleResponse(response)[0];
              console.log(this.analysis )
              this.fillAutocompleteFields(this.analysis)

              // Loading RESULTS and ATTACHMENTS here because they don't need api request
              // this.loadRelatedData('analysis_results', this.analysis)
              // this.loadRelatedData('attachment_ling', this.analysis)

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

          this.setActiveTab('analysis_result')
        }
      },

      setDefaultRelatedData() {
        return {
          attachment_link: [],
          new: {
            attachment: [],
          },
          copyFields: {
            attachment_link: ['attachment', 'remarks'],
          },
          insert: {
            attachment_link: {},
          },
          page: {
            attachment_link: 1,
          },
          paginateBy: {
            attachment_link: 10,
          },
          count: {
            attachment_link: 0,
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
        if (this.isDefinedAndNotNull(objectToUpload.agent)) uploadableObject.agent = objectToUpload.agent.id

        // if (this.isDefinedAndNotNull(this.relatedData.reference)) uploadableObject.reference = this.relatedData.reference.id
        // if (this.isDefinedAndNotNull(this.relatedData.dataset)) uploadableObject.dataset = this.relatedData.dataset.id

        // Adding related data
        if (saveRelatedData) {
          uploadableObject.related_data = {}
          // uploadableObject.related_data.attachment = this.relatedData.attachment_link
        }

        console.log('This object is sent in string format:')
        console.log(uploadableObject)
        return JSON.stringify(uploadableObject)
      },

      fillAutocompleteFields(obj) {
         this.analysis.sample = { id: obj.sample, number: obj.sample__number }
         this.analysis.agent = { id: obj.agent, agent: obj.agent__agent}
         this.analysis.analysis_method = { id: obj.analysis_method, analysis_method: obj.analysis_method__analysis_method}
      },

      fillRelatedDataAutocompleteFields(obj, type) {
        if (obj === undefined) return;
        // console.log(obj)
        // console.log(type)

        // This goes for related data in tabs
        if (type === undefined) {
          console.log(obj)

          if (this.isDefinedAndNotNull(obj.attachment)) obj.attachment = { id: obj.attachment, original_filename: obj.attachment__original_filename }
          if (this.isDefinedAndNotNull(obj.agent)) obj.agent = { id: obj.agent, agent: obj.agent__agent }
          if (this.isDefinedAndNotNull(obj.sample)) obj.sample = { id: obj.id, sample: obj.number }
          if (this.isDefinedAndNotNull(obj.specimen)) obj.specimen = { id: obj.id, specimen: obj.number }

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

        // if (object === 'reference' && doi !== null && doi.reference !== null && doi.reference.id !== null) {
        //   this.relatedData.count[object] = 1;
        //   this.relatedData[object] = {
        //     id: doi.reference__id,
        //     reference: doi.reference__reference
        //   }
        //   this.setBlockVisibility(object, this.relatedData.count[object])
        //   return;
        // }

        // Dataset and Reference are direct links and do not need extra request.
        // if (object !== 'dataset' && object !== 'reference') {
        //   return new Promise(resolve => {
        //     query.then(response => {
        //       if (response.status === 200) this.relatedData[object] = response.body.results ? response.body.results : [];
        //
        //       this.relatedData.count[object] = response.body.count;
        //       this.relatedData[object] = this.fillRelatedDataAutocompleteFields(this.relatedData[object], object);
        //
        //       resolve(true)
        //     });
        //   });
        // }
      },

      setBlockVisibility(object,count){

      },

      //check required fields for related data
      checkRequiredFields(type) {},

      formatRelatedData(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload);
        uploadableObject.analysis = this.analysis.id;
        console.log(uploadableObject.analysis)

        if (this.isDefinedAndNotNull(uploadableObject.agent)) {
          uploadableObject.agent = uploadableObject.agent.id ? uploadableObject.agent.id : uploadableObject.agent;
        }

        console.log('This object is sent in string format (related_data):')
        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
      },

      fetchList(localStorageData) {
        let params = this.isDefinedAndNotNull(localStorageData) && localStorageData !== 'fallbackValue' && localStorageData !== '[object Object]' ? localStorageData : this.searchParameters;
        return new Promise((resolve) => {
          resolve(fetchAnalyses(params))
        });
      },

      setDefaultSearchParameters() {
        return {
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
