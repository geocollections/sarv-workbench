<template>
  <div class="doi">
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- GENERAL INFO -->
    <fieldset class="border p-2" ref="info">
      <legend class="w-auto" @click="block.info = !block.info"
              :style="!block.info ? {'color':'blue'} : ''">
        {{ $t('doi.generalInfo') }}
        <font-awesome-icon icon="project-diagram"/>
      </legend>
      <transition name="fade">
        <div v-if="block.info">

          <!-- DOI, YEAR and RESOURCE TYPE -->
          <div class="row">
            <div class="col-md-4">
              <label class="p-0" :for="`identifier`">{{ $t('doi.identifier') }}:</label>
              <b-form-input id="identifier" v-model="doi.identifier" type="text"></b-form-input>
            </div>

            <div class="col-md-4">
              <label class="p-0" :for="`publication_year`">{{ $t('doi.year') }}:</label>
              <b-form-input id="publication_year" v-model="doi.publication_year" type="number"></b-form-input>
            </div>


            <div class="col-md-4">
              <label class="p-0" :for="`resource_type`">{{ $t('doi.resourceTypeGeneral') }}:</label>
              <vue-multiselect v-model="doi.resource_type"
                               id="resource_type"
                               :options="autocomplete.resource_type"
                               track-by="id"
                               label="value"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.value }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

          <!-- RESOURCE -->
          <div class="row">
            <div class="col-sm-12">
              <label class="p-0" :for="`resource`">{{ $t('doi.resource') }}:</label>
              <b-form-input id="resource" v-model="doi.resource" type="text"></b-form-input>
            </div>
          </div>

          <!-- TITLE -->
          <div class="row">
            <div class="col-sm-12">
              <label class="p-0" :for="`title`">{{ $t('doi.title') }}:</label>
              <b-form-input id="title" v-model="doi.title" type="text"></b-form-input>
            </div>
          </div>

          <!-- CREATORS -->
          <div class="row">
            <div class="col-sm-12">
              <label class="p-0" :for="`creators`">{{ $t('doi.creators') }}:</label>
              <b-form-input id="creators" v-model="doi.creators" type="text"></b-form-input>
            </div>
          </div>

          <!-- PUBLISHER and OWNER (agent) -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`publisher`">{{ $t('doi.publisher') }}:</label>
              <b-form-input id="publisher" v-model="doi.publisher" type="text"></b-form-input>
            </div>


            <div class="col-md-6">
              <label :for="`agent`">{{ $t('doi.copyright_agent') }}:</label>
              <vue-multiselect id="agent" class="align-middle"
                               v-model="doi.owner"
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
          </div>

          <!-- LANGUAGE, VERSION, FORMATS and SIZES -->
          <div class="row">
            <div class="col-md-3 mb-2">
              <label class="p-0" :for="`language`">{{ $t('doi.language') }}:</label>
              <vue-multiselect v-model="doi.language"
                               id="language"
                               :options="autocomplete.language"
                               track-by="id"
                               :label="commonLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ $i18n.locale=== 'ee' ? option.value : option.value_en }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-3 mb-2">
              <label class="p-0" :for="`version`">{{ $t('doi.version') }}:</label>
              <b-form-input id="version" v-model="doi.version" type="text"></b-form-input>
            </div>

            <div class="col-md-3 mb-2">
              <label class="p-0" :for="`formats`">{{ $t('doi.formats') }}:</label>
              <b-form-input id="formats" v-model="doi.formats" type="text"></b-form-input>
            </div>

            <div class="col-md-3 mb-2">
              <label class="p-0" :for="`sizes`">{{ $t('doi.sizes') }}:</label>
              <b-form-input id="sizes" v-model="doi.sizes" type="text"></b-form-input>
            </div>
          </div>

          <!-- SUBJECTS -->
          <div class="row">
            <div class="col-sm-12 mb-2">
              <label class="p-0" :for="`subjects`">{{ $t('doi.subjects') }}:</label>
              <b-form-input id="subjects" v-model="doi.subjects" type="text"></b-form-input>
            </div>
          </div>

          <!-- ABSTRACT -->
          <div class="row">
            <div class="col-sm-12 mb-2">
              <label class="p-0" :for="`abstract`">{{ $t('doi.abstract') }}:</label>
              <b-form-textarea id="abstract" v-model="doi.abstract" type="text" :rows="1" :max-rows="20"></b-form-textarea>
            </div>
          </div>

          <!-- METHODS -->
          <div class="row">
            <div class="col-sm-12 mb-2">
              <label class="p-0" :for="`methods`">{{ $t('doi.methods') }}:</label>
              <b-form-textarea id="methods" v-model="doi.methods" type="text" :rows="1" :max-rows="20"></b-form-textarea>
            </div>
          </div>

          <!-- COPYRIGHT_AGENT (copyright) and LICENCE -->
          <div class="row">
            <div class="col-md-6">
              <label class="p-0" :for="`copyright_agent`">{{ $t('doi.copyright') }}:</label>
              <vue-multiselect id="copyright_agent" class="align-middle"
                               v-model="doi.copyright_agent"
                               deselect-label="Can't remove this value"
                               label="agent"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.copyright_agent"
                               :options="autocomplete.copyright_agent"
                               @search-change="autcompleteAgentSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :allow-empty="false"
                               :open-direction="'bottom'">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label class="p-0" :for="`licence`">{{ $t('doi.licence') }}:</label>
              <vue-multiselect v-model="doi.licence"
                               id="licence"
                               :options="autocomplete.licence"
                               track-by="id"
                               :label="commonLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ $i18n.locale=== 'ee' ? option.value : option.value_en }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- TODO: PRIMARY REFERENCE -->
    <fieldset>
      <legend>

      </legend>

      <transition name="fade">
        <div>

        </div>
      </transition>
    </fieldset>

    <!-- TODO: PRIMARY DATASET -->
    <fieldset>
      <legend>

      </legend>

      <transition name="fade">
        <div>

        </div>
      </transition>
    </fieldset>

    <!-- REMARKS -->
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" @click="block.description = !block.description"
              :style="!block.description ? {'color':'blue'} : ''">
        {{ $t('doi.remarks') }}
        <font-awesome-icon icon="pen-fancy"/>
      </legend>

      <transition name="fade">
        <div v-if="block.description">

          <div class="row">
            <div class="col-sm-12 mb-2">
              <label :for="`remarks`">{{ $t('doi.remarks') }}:</label>
              <b-form-textarea id="remarks" v-model="doi.remarks" type="text" :rows="1" :max-rows="20"></b-form-textarea>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- TODO: DATACITE CREATED and UPDATED -->
    <fieldset>
      <legend></legend>

      <transition name="fade">
        <div>

        </div>
      </transition>
    </fieldset>

    <!-- IS PRIVATE -->
    <div class="row mt-3">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="doi.is_private" :value="1" :unchecked-value="0">
          {{ $t('doi.private') }}?
        </b-form-checkbox>
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
  import {fetchDoi, fetchDoiResourceType} from "../../assets/js/api/apiCalls";

  export default {
    components: {
      Datepicker,
      VueMultiselect,
      Spinner,
    },

    mixins: [formManipulation, autocompleteFieldManipulation],

    name: "Doi",

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
    },

    methods: {
      setTab(type) {
        this.activeTab = type
      },

      setInitialData() {
        return {
          tabs: [],
          searchHistory: 'doiSearchHistory',
          relatedData: this.setDefaultRelatedData(),
          copyFields: ['id', 'identifier', 'creators', 'publisher', 'publication_year', 'title', 'abstract',
            'resource_type', 'resource', 'methods', 'version', 'sizes', 'formats', 'language', 'subjects',
            'copyright_agent', 'licence', 'date_added', 'date_changed', 'remarks', 'owner'],
          autocomplete: {
            loaders: {
              resource_type: false,
              agent: false,
              language: false,
              copyright_agent: false,
              licence: false,
            },
            resource_type: [],
            agent: [],
            language: [],
            copyright_agent: [],
            licence: [],
          },
          requiredFields: ['identifier'],
          doi: {},
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

        // TODO: Fetch autocompletes?
        fetchDoiResourceType().then(response => {
          this.autocomplete.resource_type = this.handleResponse(response);
        })

        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          fetchDoi(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);

            if (handledResponse.length > 0) {
              this.doi = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.doi)
              this.removeUnnecessaryFields(this.doi, this.copyFields);
              this.doi.related_data = {};

              // this.forceRerender(); if needed
              this.$emit('data-loaded', this.doi)
              this.$emit('set-object', 'doi')
              this.sendingData = false;
              this.getListRecords('doi')
            } else {
              this.sendingData = false;
            }
          });
          // TODO
          // this.loadRelatedData('projectagent');
          // this.loadRelatedData('attachment_link');
          // this.loadRelatedData('site');
        }
      },

      setDefaultRelatedData() {
        return {}
      },

      formatDataForUpload(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload)
        // if (this.isDefinedAndNotNull(objectToUpload.author)) uploadableObject.author = objectToUpload.author.id
        if (this.isDefinedAndNotNull(objectToUpload.is_private)) uploadableObject.is_private = objectToUpload.is_private === 1 ? '1' : '0';

        // Autocomplete fields
        if (this.isDefinedAndNotNull(objectToUpload.resource_type)) uploadableObject.resource_type = objectToUpload.resource_type.id
        if (this.isDefinedAndNotNull(objectToUpload.owner)) uploadableObject.owner = objectToUpload.owner.id
        if (this.isDefinedAndNotNull(objectToUpload.language)) uploadableObject.language = objectToUpload.language.id
        if (this.isDefinedAndNotNull(objectToUpload.copyright_agent)) uploadableObject.copyright_agent = objectToUpload.copyright_agent.id
        if (this.isDefinedAndNotNull(objectToUpload.licence)) uploadableObject.licence = objectToUpload.licence.id

        // Adding related data
        uploadableObject.related_data = {}
        // uploadableObject.related_data.agent = this.relatedData.library_agent

        console.log('This object is sent in string format:')
        console.log(uploadableObject)
        return JSON.stringify(uploadableObject)
      },

      fillAutocompleteFields(obj) {
        this.doi.resource_type = { id: obj.resource_type, value: obj.resource_type__value }
        this.doi.owner = { id: obj.owner, agent: obj.owner__agent }
        this.doi.language = { id: obj.language, value: obj.language__value, value_en: obj.language__value_en}
        this.doi.copyright_agent = { id: obj.copyright_agent, agent: obj.copyright_agent__agent }
        this.doi.licence = { id: obj.licence, value: obj.licence__value, value_en: obj.licence__value_en}
      },

      // TODO
      fillRelatedDataAutocompleteFields(obj, type) {
        let relatedData = cloneDeep(obj)
        obj = [];
        relatedData.forEach(entity => {
          if (type === 'projectagent') obj.push({
            agent: entity.projectagent__agent__agent,
            id: entity.projectagent__agent
          })
          else obj.push(entity)
        });
        return obj
      },

      // TODO
      loadRelatedData(object) {
        let query;
        if (object === 'projectagent') {
          query = fetchProjectAgent(this.$route.params.id, this.relatedData.page.projectagent)
        } else if (object === 'attachment_link') {
          query = fetchProjectAttachment(this.$route.params.id, this.relatedData.page.attachment_link)
        } else if (object === 'site') {
          query = fetchLinkedSite(this.$route.params.id, this.relatedData.page.site)
        }
        return new Promise(resolve => {
          query.then(response => {
            if (response.status === 200) this.relatedData[object] = response.body.results ? response.body.results : []

            this.relatedData.count[object] = response.body.count;
            this.relatedData[object] = this.fillRelatedDataAutocompleteFields(this.relatedData[object], object);
            this.setBlockVisibility(object, this.relatedData[object].length)
          });
        });
      },

      // TODO
      setBlockVisibility(object,count){
        if(object === 'projectagent') this.block.members = count > 0
        if(object === 'attachment_link') this.block.files = count > 0
        if(object === 'site') this.block.sites = count > 0
      },

      //check required fields for related data
      checkRequiredFields(type) {},

      formatRelatedData(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload);
        uploadableObject.doi = this.doi.id;

        // if (this.isDefinedAndNotNull(uploadableObject.reference)) {
        //   uploadableObject.reference = uploadableObject.reference.id ? uploadableObject.reference.id : uploadableObject.reference;
        // }

        console.log('This object is sent in string format (related_data):')
        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
      },

      fetchList(localStorageData) {
        let params = this.isDefinedAndNotNull(localStorageData) && localStorageData !== 'fallbackValue' && localStorageData !== '[object Object]' ? localStorageData : this.searchParameters;
        return new Promise((resolve) => {
          resolve(fetchProjects(params))
        });
      },

      setDefaultSearchParameters() {
        return {
          identifier: null,
          creators: null,
          publication_year: null,
          title: null,
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
</style>
