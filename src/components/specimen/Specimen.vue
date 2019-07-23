<template>
  <div class="specimen">
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- REQUIRED INFO -->
    <fieldset class="border p-2 mb-2" :style="!validate('specimen') ? 'border-color: #dc3545!important;' : ''" id="block-requiredFields">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.requiredFields, 'text-danger': !validate('specimen') }"
              @click="block.requiredFields = !block.requiredFields">
        {{ $t('specimen.requiredFields') }}
        <font-awesome-icon v-if="validate('specimen')" color="#28a745" icon="check"/>
        <font-awesome-icon v-if="!validate('specimen')" color="#dc3545" icon="exclamation-triangle"/>
      </legend>

      <transition name="fade">
        <div v-if="block.requiredFields">

          <!-- SPECIMEN_ID and COLLECTION -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`specimen_id`">{{ $t('specimen.specimen_id') }}:</label>
              <b-form-input id="specimen_id" v-model="specimen.specimen_id" type="text" :state="isDefinedAndNotNull(specimen.specimen_id)"></b-form-input>
            </div>

            <div class="col-md-6">
              <label :for="`coll`">{{ $t('specimen.coll') }}:</label>
              <vue-multiselect id="copyright_agent" class="align-middle"
                               v-model="specimen.coll"
                               deselect-label="Can't remove this value"
                               label="number"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.coll"
                               :options="autocomplete.coll"
                               @search-change="autcompleteCollSearch"
                               :class="isDefinedAndNotNull(specimen.coll) ? 'valid' : 'invalid'"
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

        </div>
      </transition>
    </fieldset>

    <!-- GENERAL INFO -->
    <fieldset class="border p-2 mb-2" id="block-info">
      <legend class="w-auto" :class="{ 'text-primary': !block.info }" @click="block.info = !block.info">
        {{ $t('specimen.generalInfo') }}
        <font-awesome-icon icon="project-diagram"/>
      </legend>

      <transition name="fade">
        <div v-if="block.info">

          <!-- SPECIMEN_NR and välinumber??? -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`specimen_nr`">{{ $t('specimen.specimen_nr') }}:</label>
              <b-form-input id="specimen_nr" v-model="specimen.specimen_nr" type="text"></b-form-input>
            </div>

            <div class="col-md-6">
              TODO: välinumber
            </div>
          </div>

          <!-- FOSSIL?, TYPE, PART and FOSSIL?  -->
          <div class="row">
            <div class="col-md-3"></div>

            <div class="col-md-3"></div>

            <div class="col-md-3">
              <label :for="`part`">{{ $t('specimen.part') }}:</label>
              <b-form-input id="part" v-model="specimen.part" type="text"></b-form-input>
            </div>

            <div class="col-md-3"></div>
          </div>

          <!-- LOCALITY, DEPTH and DEPTH_INTERVAL -->
          <div class="row">
            <!-- TODO: LOCALITY -->
            <div class="col-md-4">

            </div>

            <div class="col-md-4">
              <label :for="`depth`">{{ $t('specimen.depth') }}:</label>
              <b-form-input id="depth" v-model="specimen.depth" type="number" step="0.01"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`depth_interval`">{{ $t('specimen.depth_interval') }}:</label>
              <b-form-input id="depth_interval" v-model="specimen.depth_interval" type="number" step="0.01"></b-form-input>
            </div>
          </div>

          <!-- loc txt, loc text en -->
          <div class="row"></div>

          <!-- SAMPLE, SAMPLE_NUMBER, seotud eksemplar?, loc private checkbox -->
          <div class="row">
            <div class="col-md-3">
              <!-- Todo: sample -->
            </div>

            <div class="col-md-3">
              <label :for="`sample_number`">{{ $t('specimen.sample_number') }}:</label>
              <b-form-input id="sample_number" v-model="specimen.sample_number" type="number"></b-form-input>
            </div>

            <div class="col-md-3">
              <!-- Todo: seotud eksemplar -->
            </div>

            <div class="col-md-3">
              <!-- Todo: loc private checkbox -->
            </div>
          </div>

          <!-- location remarks? -->
          <div class="row"></div>

          <!-- STRATIGRAPHY, LITHOSTRATIGRAPHY and STRATIGRAPHY_FREE -->
          <div class="row">
            <div class="col-md-4">
              <!-- Todo: stratigraphy -->
            </div>

            <div class="col-md-4">
              <!-- Todo: lithostratigraphy -->
            </div>

            <div class="col-md-4">
              <label :for="`stratigraphy_free`">{{ $t('specimen.stratigraphy_free') }}:</label>
              <b-form-input id="stratigraphy_free" v-model="specimen.stratigraphy_free" type="text"></b-form-input>
            </div>

          </div>

          <!-- AGENT_COLLECTED, AGNET_COLLECTED_FREE, DATE_COLLECTED, DATE_COLLECTED_FREE -->
          <div class="row">
            <div class="col-md-3">
              <!-- Todo: agent collected -->
            </div>

            <div class="col-md-3">
              <label :for="`agent_collected_free`">{{ $t('specimen.agent_collected_free') }}:</label>
              <b-form-input id="agent_collected_free" v-model="specimen.agent_collected_free" type="text"></b-form-input>
            </div>

            <div class="col-md-3">
              <!-- Todo: date collected -->
            </div>

            <div class="col-md-3">
              <label :for="`date_collected_free`">{{ $t('specimen.date_collected_free') }}:</label>
              <b-form-input id="date_collected_free" v-model="specimen.date_collected_free" type="text"></b-form-input>
            </div>
          </div>

          <!-- asukoha tüüp, STORAGE and peidetud? -->
          <div class="row"></div>

          <!-- ACCESSION, DEACCESSION, STATUS and ORIGINAL_STATUS -->
          <div class="row"></div>



        </div>
      </transition>
    </fieldset>

    <!-- REMARKS -->
    <fieldset class="border p-2 mb-2" id="block-description">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.description }" @click="block.description = !block.description">
        {{ $t('specimen.remarks') }}
        <font-awesome-icon icon="pen-fancy"/>
      </legend>

      <transition name="fade">
        <div v-if="block.description">

          <!-- REMARKS -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`remarks`">{{ $t('specimen.remarks') }}:</label>
              <editor :data.sync="specimen.remarks" />
            </div>
          </div>

          <!-- REMARKS_INTERNAL -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`remarks_internal`">{{ $t('specimen.remarks_internal') }}:</label>
              <editor :data.sync="specimen.remarks_internal" />
            </div>
          </div>

          <!-- TAGS -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`tags`">{{ $t('specimen.tags') }}:</label>
              <b-form-input id="tags" v-model="specimen.tags" type="text"></b-form-input>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import Editor from "../partial/editor/Editor";
  import cloneDeep from 'lodash/cloneDeep'
  import formManipulation from "../../mixins/formManipulation";
  import autocompleteFieldManipulation from "../../mixins/autocompleFormManipulation";
  import localStorageMixin from "../../mixins/localStorageMixin";
  import {fetchSpecimen, fetchSpecimens} from "../../assets/js/api/apiCalls";

  export default {
    name: "Specimen",

    components: {
      Editor,
      Spinner
    },

    mixins: [formManipulation, autocompleteFieldManipulation, localStorageMixin],

    data() {
      return this.setInitialData()
    },

    created() {
      // USED BY SIDEBAR
      if (this.$route.meta.isEdit) {
        const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
        let params = this.isDefinedAndNotNull(searchHistory) && searchHistory.hasOwnProperty('id') && searchHistory !== 'fallbackValue' && searchHistory !== '[object Object]' ? searchHistory : this.searchParameters;
        this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', {
          searchHistory: 'specimenSearchHistory',
          defaultSearch: this.setDefaultSearchParameters(),
          search: params,
          request: 'FETCH_SPECIMENS',
          title: 'header.specimens',
          object: 'specimen',
          field: 'specimen_id',
          block: this.block
        });
      }

      this.loadFullInfo()
    },

    watch: {
      '$route.params.id': {
        handler: function (newval, oldval) {
          this.setInitialData()
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
          tabs:[],
          searchHistory: 'specimenSearchHistory',
          activeTab: '',
          relatedData: this.setDefaultRelatedData(),
          copyFields: ['id', 'specimen_id', 'coll__number', 'specimen_nr'],
          autocomplete: {
            loaders: {
              coll: false,
            },
            coll: []
          },
          requiredFields: ['specimen_id', 'coll'],
          specimen: {},
          previousRecord: {},
          nextRecord: {},
          searchParameters: this.setDefaultSearchParameters(),
          componentKey: 0,
          block: {requiredFields: true, info: true, description: true},
        }
      },

      reloadData() {
        Object.assign(this.$data, this.setInitialData());
        this.loadFullInfo()
      },

      loadFullInfo() {
        // fetching autocompletes
        // fetchListLicences().then(response => {
        //   this.autocomplete.licence = this.handleResponse(response)
        // });

        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          fetchSpecimen(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);

            if (handledResponse.length > 0) {
              this.doi = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.specimen)

              // this.removeUnnecessaryFields(this.specimen, this.copyFields);
              this.specimen.related_data = {};

              // this.forceRerender(); if needed
              this.$emit('data-loaded', this.specimen)
              this.$emit('set-object', 'specimen')
              this.sendingData = false;
              this.getListRecords('specimen')
            } else {
              this.sendingData = false;
            }
          });

          // Fetching autocomplete fields for related data
          // fetchDoiAgentType().then(response => {
          //   this.autocomplete.doi_agent_type = this.handleResponse(response)
          // });
          // fetchDoiRelatedIdentifierType().then(response => {
          //   this.autocomplete.doi_related_identifier_type = this.handleResponse(response)
          // });
          // fetchDoiRelationType().then(response => {
          //   this.autocomplete.doi_relation_type = this.handleResponse(response)
          // });
          // fetchDoiDateType().then(response => {
          //   this.autocomplete.doi_date_type = this.handleResponse(response)
          // });

          // Load Related Data which is in tabs
          this.tabs.forEach(entity => {
            this.loadRelatedData(entity);
          });

          this.$on('tab-changed', this.setTab);

          this.$emit('related-data-info', this.tabs);

          // this.setActiveTab('doi_agent')
        }
      },

      setDefaultRelatedData() {
        return {
          // doi_date: [],
          // new: {
          //   date_type: []
          // },
          // copyFields: {
          //   doi_date: ['date', 'date_type', 'remarks']
          // },
          // insert: {
          //   doi_date: {}
          // },
          // page: {
          //   doi_date: 1
          // },
          // paginateBy: {
          //   doi_date: 10
          // },
          // count: {
          //   doi_date: 0
          // }
        }
      },

      formatDataForUpload(objectToUpload, saveRelatedData = false) {
        let uploadableObject = cloneDeep(objectToUpload)

        if (this.isDefinedAndNotNull(objectToUpload.is_private)) uploadableObject.is_private = objectToUpload.is_private === 1 ? '1' : '0';

        // Autocomplete fields
        if (this.isDefinedAndNotNull(objectToUpload.coll)) uploadableObject.coll = objectToUpload.coll.id
        // if (this.isDefinedAndNotNull(objectToUpload.title_translated_language)) uploadableObject.title_translated_language = objectToUpload.title_translated_language.id
        // if (this.isDefinedAndNotNull(objectToUpload.owner)) uploadableObject.owner = objectToUpload.owner.id
        // if (this.isDefinedAndNotNull(objectToUpload.language)) uploadableObject.language = objectToUpload.language.id
        // if (this.isDefinedAndNotNull(objectToUpload.copyright_agent)) uploadableObject.copyright_agent = objectToUpload.copyright_agent.id
        // if (this.isDefinedAndNotNull(objectToUpload.licence)) uploadableObject.licence = objectToUpload.licence.id
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
        // this.doi.title_translated_language = { id: obj.title_translated_language, value: obj.title_translated_language__value, value_en: obj.title_translated_language__value_en }
        // this.doi.owner = { id: obj.owner, agent: obj.owner__agent }
        // this.doi.language = { id: obj.language, value: obj.language__value, value_en: obj.language__value_en}
        // this.doi.copyright_agent = { id: obj.copyright_agent, agent: obj.copyright_agent__agent }
        // this.doi.licence = { id: obj.licence, licence: obj.licence__licence, licence_en: obj.licence__licence_en}
      },

      fillRelatedDataAutocompleteFields(obj, type) {
        if (obj === undefined) return;
        // console.log(obj)
        // console.log(type)

        // This goes for related data in tabs
        if (type === undefined) {
          console.log(obj)

          // if (this.isDefinedAndNotNull(obj.attachment)) obj.attachment = { id: obj.attachment, original_filename: obj.attachment__original_filename }
          // if (this.isDefinedAndNotNull(obj.agent_type)) obj.agent_type = { id: obj.agent_type, value: obj.agent_type__value }
          // if (this.isDefinedAndNotNull(obj.agent)) obj.agent = { id: obj.agent, agent: obj.agent__agent }
          // if (this.isDefinedAndNotNull(obj.identifier_type)) obj.identifier_type = { id: obj.identifier_type, value: obj.identifier_type__value }
          // if (this.isDefinedAndNotNull(obj.relation_type)) obj.relation_type = { id: obj.relation_type, value: obj.relation_type__value }
          // if (this.isDefinedAndNotNull(obj.locality)) obj.locality = { id: obj.locality, locality: obj.locality__locality, locality_en: obj.locality__locality_en }
          // if (this.isDefinedAndNotNull(obj.date_type)) obj.date_type = { id: obj.date_type, value: obj.date_type__value }

          return obj;
        }

        let relatedData = cloneDeep(obj)
        obj = [];
        relatedData.forEach(entity => obj.push(entity));
        return obj
      },

      loadRelatedData(object, doi = null) {
        let query;

        if (object === 'attachment_link') {
          // query = fetchDoiAttachment(this.$route.params.id, this.relatedData.page.attachment_link, this.relatedData.paginateBy.attachment_link)
          // Todo: Fossiili määrangud
        } else if (object === '') {
          // Todo: kivimi/mineraali nimed
        } else if (object === '') {
          // Todo: kirjandusviited
        } else if (object === '') {
          // Todo: kirjeldused
        } else if (object === '') {
          // Todo: pildid
        } else if (object === '') {
          // Todo: manused
        } else if (object === '') {
          // Todo: osised ja asukohad
        } else if (object === '') {
          // Todo: ajalugu ja protseduurid
        } else if (object === '') {
          // Todo: analüüsid
        }

        return new Promise(resolve => {
          query.then(response => {
            if (response.status === 200) this.relatedData[object] = response.body.results ? response.body.results : [];

            this.relatedData.count[object] = response.body.count;
            this.relatedData[object] = this.fillRelatedDataAutocompleteFields(this.relatedData[object], object);

            resolve(true)
          });
        });
      },

      //check required fields for related data
      checkRequiredFields(type) {},

      formatRelatedData(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload);
        uploadableObject.specimen = this.specimen.id;

        if (this.isDefinedAndNotNull(uploadableObject.attachment)) {
          uploadableObject.attachment = uploadableObject.attachment.id ? uploadableObject.attachment.id : uploadableObject.attachment;
        }
        if (this.isDefinedAndNotNull(uploadableObject.agent_type)) {
          uploadableObject.agent_type = uploadableObject.agent_type.id ? uploadableObject.agent_type.id : uploadableObject.agent_type;
        }
        if (this.isDefinedAndNotNull(uploadableObject.agent)) {
          uploadableObject.agent = uploadableObject.agent.id ? uploadableObject.agent.id : uploadableObject.agent;
        }
        if (this.isDefinedAndNotNull(uploadableObject.identifier_type)) {
          uploadableObject.identifier_type = uploadableObject.identifier_type.id ? uploadableObject.identifier_type.id : uploadableObject.identifier_type;
        }
        if (this.isDefinedAndNotNull(uploadableObject.relation_type)) {
          uploadableObject.relation_type = uploadableObject.relation_type.id ? uploadableObject.relation_type.id : uploadableObject.relation_type;
        }
        if (this.isDefinedAndNotNull(uploadableObject.locality)) {
          uploadableObject.locality = uploadableObject.locality.id ? uploadableObject.locality.id : uploadableObject.locality;
        }
        if (this.isDefinedAndNotNull(uploadableObject.date_type)) {
          uploadableObject.date_type = uploadableObject.date_type.id ? uploadableObject.date_type.id : uploadableObject.date_type;
        }

        console.log('This object is sent in string format (related_data):')
        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
      },

      fetchList(localStorageData) {
        let params = this.isDefinedAndNotNull(localStorageData) && localStorageData !== 'fallbackValue' && localStorageData !== '[object Object]' ? localStorageData : this.searchParameters;
        return new Promise((resolve) => {
          resolve(fetchSpecimens(params))
        });
      },

      setDefaultSearchParameters() {
        return {
          idSpecimen: null,
          collNumber: null,
          classification: null,
          fossil: null,
          mineralRock: null,
          locality: null,
          stratigraphy: null,
          agent_collected: null,
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
