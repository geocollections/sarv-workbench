<template>
  <div class="analysis">
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- REMARKS -->
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.description }" @click="block.description = !block.description">
        {{ $t('doi.remarks') }}
        <font-awesome-icon icon="pen-fancy"/>
      </legend>

      <transition name="fade">
        <div v-if="block.description">

          <div class="row">
            <div class="col-sm-12">
              <label class="mt-0" :for="`remarks`">{{ $t('doi.remarks') }}:</label>
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
          <!--<li class="nav-item">-->
            <!--<a href="#" v-on:click.prevent="setActiveTab('analysis_result')" class="nav-link"-->
               <!--:class="{ active: activeTab === 'analysis_result' }">-->
              <!--{{ $t('analysis.relatedTables.analysis_result') }} <font-awesome-icon icon="user-friends"/>-->
            <!--</a>-->
          <!--</li>-->

          <!--<li class="nav-item">-->
            <!--<a href="#" v-on:click.prevent="setActiveTab('attachment_link')" class="nav-link"-->
               <!--:class="{ active: activeTab === 'attachment_link' }">-->
              <!--{{ $t('doi.relatedTables.files') }} <font-awesome-icon icon="folder-open"/>-->
            <!--</a>-->
          <!--</li>-->
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

          <div class="col-sm-12 col-md-6 pagination-center"
               v-if="relatedData[activeTab] !== null && relatedData[activeTab].length > 0">
            <b-pagination
              size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="relatedData.count[activeTab]"
              v-model="relatedData.page[activeTab]" :per-page="relatedData.paginateBy[activeTab]">
            </b-pagination>
          </div>
        </div>

        <!--<doi-files :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab" />-->

      </div>
    </div>

    <!-- IS PRIVATE -->
    <div class="row mt-3">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="analysis.is_private" :value="1" :unchecked-value="0">
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
          copyFields: ['id', 'is_private'],
          autocomplete: {
            loaders: {
              analysis_methods: false,
            },
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

        // Autocomplete fields
        if (this.isDefinedAndNotNull(objectToUpload.sample)) uploadableObject.sample = objectToUpload.sample.id

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
        // this.doi.resource_type = { id: obj.resource_type, value: obj.resource_type__value }
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
