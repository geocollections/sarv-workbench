<template>
  <div class="doi">
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- REQUIRED INFO -->
    <fieldset class="border p-2 mb-2" :style="!validate('doi') ? 'border-color: #dc3545!important;' : ''">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.requiredFields, 'text-danger': !validate('doi') }" @click="block.requiredFields = !block.requiredFields">
        {{ $t('doi.requiredFields') }}
        <font-awesome-icon v-if="validate('doi')" color="#28a745" icon="check"/>
        <font-awesome-icon v-if="!validate('doi')" color="#dc3545" icon="exclamation-triangle"/>
      </legend>

      <transition name="fade">
        <div v-if="block.requiredFields">

          <!-- DOI, RESOURCE TYPE and RESOURCE -->
          <div class="row">
            <div class="col-md-4">
              <label :for="`identifier`">{{ $t('doi.identifier') }}:</label>
              <b-form-input id="identifier" v-model="doi.identifier" type="text" :placeholder="$route.meta.isEdit ? '' : $t('doi.identifierPlaceholder')" :disabled="true"></b-form-input>
            </div>

            <!-- TODO: Find a way to change vue-multiselect size like b-form-input size -->
            <div class="col-md-4">
              <label :for="`resource_type`">{{ $t('doi.resourceTypeGeneral') }}:</label>
              <vue-multiselect v-model="doi.resource_type"
                               input-class="custom"
                               id="resource_type"
                               :options="autocomplete.resource_type"
                               track-by="id"
                               label="value"
                               :class="isDefinedAndNotNull(doi.resource_type) ? 'valid' : 'invalid'"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.value }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-4">
              <label :for="`resource`">{{ $t('doi.resource') }}:</label>
              <b-form-input id="resource" :state="isDefinedAndNotNull(doi.resource)" v-model="doi.resource" type="text"></b-form-input>
            </div>
          </div>

          <!-- CREATORS, YEAR and PUBLISHER -->
          <div class="row">
            <div class="col-md-4">
              <label :for="`creators`">{{ $t('doi.creators') }}:</label>
              <!-- TODO: Connect with related persons -->
              <b-form-input id="creators" :state="isDefinedAndNotNull(doi.creators)" v-model="doi.creators" type="text"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`publication_year`">{{ $t('doi.year') }}:</label>
              <b-form-input id="publication_year" :state="isDefinedAndNotNull(doi.publication_year)" v-model="doi.publication_year" type="number"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`publisher`">{{ $t('doi.publisher') }}:</label>
              <b-form-input id="publisher" :state="isDefinedAndNotNull(doi.publisher)" v-model="doi.publisher" type="text"></b-form-input>
            </div>
          </div>

          <!-- TITLE -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`title`">{{ $t('doi.title') }}:</label>
              <b-form-input id="title" :state="isDefinedAndNotNull(doi.title)" v-model="doi.title" type="text"></b-form-input>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- GENERAL INFO -->
    <fieldset class="border p-2 mb-2" ref="info">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.info }" @click="block.info = !block.info">
        {{ $t('doi.generalInfo') }}
        <font-awesome-icon icon="project-diagram"/>
      </legend>
      <transition name="fade">
        <div v-if="block.info">

          <!-- TITLE ALTERNATIVE -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`title_alternative`">{{ $t('doi.title_alternative') }}:</label>
              <b-form-input id="title_alternative" v-model="doi.title_alternative" type="text"></b-form-input>
            </div>
          </div>

          <!-- TITLE TRANSLATED and TITLE TRANSLATED LANGUAGE -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`title_translated`">{{ $t('doi.title_translated') }}:</label>
              <b-form-input id="title_translated" v-model="doi.title_translated" type="text"></b-form-input>
            </div>

            <div class="col-md-6">
              <label :for="`title_translated_language`">{{ $t('doi.title_translated_language') }}:</label>
              <vue-multiselect v-model="doi.title_translated_language"
                               id="title_translated_language"
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
          </div>

          <!-- LANGUAGE, VERSION, FORMATS and SIZES -->
          <div class="row">
            <div class="col-md-3">
              <label :for="`language`">{{ $t('doi.language') }}:</label>
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

            <div class="col-md-3">
              <label :for="`version`">{{ $t('doi.version') }}:</label>
              <b-form-input id="version" v-model="doi.version" type="text"></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`formats`">{{ $t('doi.formats') }}:</label>
              <b-form-input id="formats" v-model="doi.formats" type="text"></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`sizes`">{{ $t('doi.sizes') }}:</label>
              <b-form-input id="sizes" v-model="doi.sizes" type="text"></b-form-input>
            </div>
          </div>

          <!-- SUBJECTS and OWNER (agent)-->
          <div class="row">
            <div class="col-md-6">
              <label :for="`subjects`">{{ $t('doi.subjects') }}:</label>
              <b-form-input id="subjects" v-model="doi.subjects" type="text"></b-form-input>
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

          <!-- ABSTRACT -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`abstract`">{{ $t('doi.abstract') }}:</label>
              <b-form-textarea id="abstract" v-model="doi.abstract" type="text" :rows="1" :max-rows="20"></b-form-textarea>
            </div>
          </div>

          <!-- METHODS -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`methods`">{{ $t('doi.methods') }}:</label>
              <b-form-textarea id="methods" v-model="doi.methods" type="text" :rows="1" :max-rows="20"></b-form-textarea>
            </div>
          </div>

          <!-- COPYRIGHT_AGENT (copyright) and LICENCE -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`copyright_agent`">{{ $t('doi.copyright') }}:</label>
              <vue-multiselect id="copyright_agent" class="align-middle"
                               v-model="doi.copyright_agent"
                               deselect-label="Can't remove this value"
                               label="agent"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.copyright_agent"
                               :options="autocomplete.copyright_agent"
                               @search-change="autcompleteCopyrightAgentSearch"
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
              <label :for="`licence`">{{ $t('doi.licence') }}:</label>
              <vue-multiselect v-model="doi.licence"
                               id="licence"
                               :options="autocomplete.licence"
                               track-by="id"
                               :label="licenceLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ $i18n.locale=== 'ee' ? option.licence : option.licence_en }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- REFERENCE and DATASET -->
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" :class="{ 'text-primary': !block.referenceAndDataset }" @click="block.referenceAndDataset = !block.referenceAndDataset">
        {{ $t('doi.primaryRefAndDat') }}
        <font-awesome-icon icon="book"/>
      </legend>

      <transition name="fade">
        <div v-if="block.referenceAndDataset">

          <div class="row">
            <!-- REFERENCE -->
            <div class="col-sm-10 col-md-4 mb-2">
<!--              <label :for="`reference`">{{ $t('doi.reference') }}:</label>-->
              <vue-multiselect v-model="relatedData.reference"
                               id="reference"
                               :multiple="false"
                               track-by="id"
                               :options="autocomplete.reference"
                               :internal-search="false"
                               :preserve-search="true"
                               :close-on-select="true"
                               @search-change="autcompleteDoiReferenceSearch"
                               :custom-label="customLabelForReference"
                               :loading="autocomplete.loaders.reference"
                               :placeholder="$t('add.inputs.autocomplete')"
                               placeholder="reference search..."
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.id + ' - (' + option.reference + ')' }} </strong>
                  <!-- TODO: How can I put links here, so they would work -->
<!--                  <a href="" @click.prevent="windowOpenNewTab('reference', '/reference/' + relatedData.reference.id)">-->
<!--                    <font-awesome-icon icon="link"  style=""/>-->
<!--                  </a>-->
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-sm-2 mb-2">
              <vs-button v-if="relatedData.reference !== null" radius @click="windowOpenNewTab('reference', '/reference/' + relatedData.reference.id)"
                         color="primary" type="line" icon="link"></vs-button>
            </div>

            <!-- DATASET -->
            <div class="col-sm-10 col-md-4 mb-2">
<!--              <label :for="`dataset`">{{ $t('doi.dataset') }}:</label>-->
              <vue-multiselect v-model="relatedData.dataset"
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
                  <!-- TODO: How can I put links here, so they would work -->
<!--                  <a href="" @click.prevent="openGeoInNewWindow({object: 'dataset', id: relatedData.dataset.id})">-->
<!--                    <font-awesome-icon icon="eye"  style="" class="link"/>-->
<!--                  </a>-->
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-sm-2 mb-2">
              <vs-button v-if="relatedData.dataset !== null" radius @click="openGeoInNewWindow({object: 'dataset', id: relatedData.dataset.id})"
                         color="primary" type="line" icon="remove_red_eye"></vs-button>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

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
              <label :for="`remarks`">{{ $t('doi.remarks') }}:</label>
              <b-form-textarea id="remarks" v-model="doi.remarks" type="text" :rows="1" :max-rows="20"></b-form-textarea>
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
            <a href="#" v-on:click.prevent="setActiveTab('doi_agent')" class="nav-link"
               :class="{ active: activeTab === 'doi_agent' }">
              {{ $t('doi.relatedTables.doi_agent') }} <font-awesome-icon icon="user-friends"/>
            </a>
          </li>

          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('attachment_link')" class="nav-link"
               :class="{ active: activeTab === 'attachment_link' }">
              {{ $t('doi.relatedTables.files') }} <font-awesome-icon icon="folder-open"/>
            </a>
          </li>

          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('doi_geolocation')" class="nav-link"
               :class="{ active: activeTab === 'doi_geolocation' }">
              {{ $t('doi.relatedTables.doi_geolocation') }} <font-awesome-icon icon="globe-americas"/>
            </a>
          </li>

          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('doi_related_identifier')" class="nav-link"
               :class="{ active: activeTab === 'doi_related_identifier' }">
              {{ $t('doi.relatedTables.doi_related_identifier') }} <font-awesome-icon icon="project-diagram"/>
            </a>
          </li>

          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('doi_date')" class="nav-link"
               :class="{ active: activeTab === 'doi_date' }">
              {{ $t('doi.relatedTables.doi_date') }} <font-awesome-icon icon="calendar-alt"/>
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

          <div class="col-sm-12 col-md-6 pagination-center"
               v-if="relatedData[activeTab] !== null && relatedData[activeTab].length > 0">
            <b-pagination
              size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="relatedData.count[activeTab]"
              v-model="relatedData.page[activeTab]" :per-page="relatedData.paginateBy[activeTab]">
            </b-pagination>
          </div>
        </div>

        <doi-files :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab" />

        <doi-related-identifier :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"/>

        <doi-geolocation :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"/>

        <doi-agent :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"/>

        <doi-date :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"/>

      </div>
    </div>

    <!-- DATACITE CREATED and UPDATED -->
    <fieldset class="border p-2 mb-2" v-if="$route.meta.isEdit">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.datacite }" @click="block.datacite = !block.datacite">
        {{ $t('doi.datacite') }}
        <font-awesome-icon icon="sitemap"/>
      </legend>

      <transition name="fade">
        <div v-if="block.datacite">

          <div class="row">
            <div class="col-md-6 mb-2">
              <label class="mt-0" :for="`dataset_created`">{{ $t('doi.dataciteCreated') }}:</label>
              <b-form-input size="sm" id="dataset_created" v-model="doi.dataset_created" type="text" disabled></b-form-input>
            </div>

            <div class="col-md-6 mb-2">
              <label class="mt-0" :for="`dataset_updated`">{{ $t('doi.dataciteUpdated') }}:</label>
              <b-form-input size="sm" id="dataset_updated" v-model="doi.dataset_updated" type="text" disabled></b-form-input>
            </div>
          </div>

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

    <div class="row mt-3 mb-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false, 'doi', true)"
                :title="$t('edit.buttons.saveAndLeave') ">
          <font-awesome-icon icon="door-open"/>
          {{ $t('edit.buttons.saveAndLeave') }}
        </button>

        <button class="btn btn-success mr-2 mb-2 pr-5 pl-5" :disabled="sendingData" @click="add(true, 'doi', true)"
                :title="$t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') ">
          <font-awesome-icon icon="save"/>
          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}
        </button>

        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="reset('doi', $route.meta.isEdit)"
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
    fetchDois,
    fetchDoi,
    fetchDoiResourceType,
    fetchListLanguages,
    fetchListLicences,
    fetchDoiAttachment,
    fetchDoiAgent,
    fetchDoiAgentType,
    fetchDoiRelatedIdentifier,
    fetchDoiGeolocation,
    fetchDoiDate,
    fetchDoiRelatedIdentifierType,
    fetchDoiRelationType,
    fetchDoiDateType
  } from "../../assets/js/api/apiCalls";
  import FileInputComponent from "../partial/MultimediaComponent";
  import DoiAgent from "./relatedTables/DoiAgent";
  import DoiFiles from "./relatedTables/DoiFiles";
  import DoiRelatedIdentifier from "./relatedTables/DoiRelatedIdentifier";
  import DoiGeolocation from "./relatedTables/DoiGeolocation";
  import DoiDate from "./relatedTables/DoiDate";

  export default {
    components: {
      DoiDate,
      DoiGeolocation,
      DoiRelatedIdentifier,
      DoiFiles,
      DoiAgent,
      Datepicker,
      VueMultiselect,
      Spinner,
      FileInputComponent,
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
      // Watching creators because sometimes fetchDoi takes more time than fetchDoiAgent
      // and overwrites updated doi. Basically this here is fallback just in case.
      'doi.creators': {
        handler: function (newVal, oldVal) {
          this.updateDoiCreatorsField(this.relatedData.doi_agent)
        }
      }
    },

    methods: {
      setTab(type) {
        this.activeTab = type
      },

      setInitialData() {
        return {
          tabs:['attachment_link', 'doi_related_identifier', 'doi_geolocation', 'doi_agent', 'doi_date'],
          searchHistory: 'doiSearchHistory',
          activeTab: 'doi_agent',
          relatedData: this.setDefaultRelatedData(),
          copyFields: ['id', 'identifier', 'creators', 'publisher', 'publication_year', 'title', 'title_alternative',
            'title_translated', 'title_translated_language', 'abstract', 'resource_type', 'resource', 'methods',
            'version', 'sizes', 'formats', 'language', 'subjects', 'copyright_agent', 'licence', 'remarks', 'owner', 'is_private'],
          autocomplete: {
            loaders: {
              resource_type: false,
              agent: false,
              language: false,
              copyright_agent: false,
              licence: false,
              reference: false,
              dataset: false,
              doi_agent_type: false,
              doi_related_identifier_type: false,
              doi_relation_type: false,
              doi_agent: false,
              locality: false,
              doi_date_type: false,
              attachment_public: false,
            },
            resource_type: [],
            agent: [],
            language: [],
            copyright_agent: [],
            licence: [],
            reference: [],
            dataset: [],
            doi_agent_type: [],
            doi_related_identifier_type: [],
            doi_relation_type: [],
            doi_agent: [],
            locality: [],
            doi_date_type: [],
            attachment: []
          },
          requiredFields: ['resource_type', 'resource', 'creators', 'publication_year', 'publisher', 'title'],
          doi: {},
          previousRecord: {},
          nextRecord: {},
          searchParameters: this.setDefaultSearchParameters(),
          componentKey: 0,
          block: {requiredFields: true, info: true, description: true, referenceAndDataset: false, datacite: true}
        }
      },

      reloadData() {
        Object.assign(this.$data, this.setInitialData());
        this.loadFullInfo()
      },

      loadFullInfo() {
        // fetching autocompletes
        fetchDoiResourceType().then(response => {
          this.autocomplete.resource_type = this.handleResponse(response);
        });

        fetchListLanguages().then(response => {
          this.autocomplete.language = this.handleResponse(response)
        });

        fetchListLicences().then(response => {
          this.autocomplete.licence = this.handleResponse(response)
        });

        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          fetchDoi(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);

            if (handledResponse.length > 0) {
              this.doi = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.doi)

              // Loading REFERENCE and DATASET here because they don't need api request
              this.loadRelatedData('reference', this.doi)
              this.loadRelatedData('dataset', this.doi)

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

          // TODO: Optimization possible, i.e., fetch requests only if user has clicked certain related data TAB.
          // Fetching autocomplete fields for related data
          fetchDoiAgentType().then(response => {
            this.autocomplete.doi_agent_type = this.handleResponse(response)
          });
          fetchDoiRelatedIdentifierType().then(response => {
            this.autocomplete.doi_related_identifier_type = this.handleResponse(response)
          });
          fetchDoiRelationType().then(response => {
            this.autocomplete.doi_relation_type = this.handleResponse(response)
          });
          fetchDoiDateType().then(response => {
            this.autocomplete.doi_date_type = this.handleResponse(response)
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

          this.setActiveTab('doi_agent')
        }
      },

      setDefaultRelatedData() {
        return {
          reference: null,
          dataset: null,
          attachment_link: [],
          doi_agent: [],
          doi_related_identifier: [],
          doi_geolocation: [],
          doi_date: [],
          new: {
            attachment: [],
            agent_type: [],
            identifier_type: [],
            relation_type: [],
            locality: [],
            date_type: []
          },
          copyFields: {
            attachment_link: ['attachment', 'remarks'],
            doi_related_identifier: ['identifier_type', 'relation_type', 'value', 'remarks'],
            // doi_geolocation: ['point', 'box', 'place', 'locality', 'remarks'],
            doi_geolocation: ['locality', 'place', 'point_longitude', 'point_latitude', 'box_w_longitude','box_e_longitude', 'box_s_latitude', 'box_n_latitude'],
            doi_agent: ['name', 'affiliation', 'agent_type', 'orcid', 'agent'],
            doi_date: ['date', 'date_type', 'remarks']
          },
          insert: {
            attachment_link: {},
            doi_related_identifier: {},
            doi_geolocation: {},
            doi_agent: {},
            doi_date: {}
          },
          page: {
            attachment_link: 1,
            doi_related_identifier: 1,
            doi_geolocation: 1,
            doi_agent: 1,
            doi_date: 1
          },
          paginateBy: {
            attachment_link: 10,
            doi_related_identifier: 10,
            doi_geolocation: 10,
            doi_agent: 10,
            doi_date: 10
          },
          count: {
            reference: 0,
            dataset: 0,
            attachment_link: 0,
            doi_related_identifier: 0,
            doi_geolocation: 0,
            doi_agent: 0,
            doi_date: 0
          }
        }
      },

      formatDataForUpload(objectToUpload, saveRelatedData = false) {
        let uploadableObject = cloneDeep(objectToUpload)
        // if (this.isDefinedAndNotNull(objectToUpload.author)) uploadableObject.author = objectToUpload.author.id
        if (this.isDefinedAndNotNull(objectToUpload.is_private)) uploadableObject.is_private = objectToUpload.is_private === 1 ? '1' : '0';

        // Autocomplete fields
        if (this.isDefinedAndNotNull(objectToUpload.resource_type)) uploadableObject.resource_type = objectToUpload.resource_type.id
        if (this.isDefinedAndNotNull(objectToUpload.title_translated_language)) uploadableObject.title_translated_language = objectToUpload.title_translated_language.id
        if (this.isDefinedAndNotNull(objectToUpload.owner)) uploadableObject.owner = objectToUpload.owner.id
        if (this.isDefinedAndNotNull(objectToUpload.language)) uploadableObject.language = objectToUpload.language.id
        if (this.isDefinedAndNotNull(objectToUpload.copyright_agent)) uploadableObject.copyright_agent = objectToUpload.copyright_agent.id
        if (this.isDefinedAndNotNull(objectToUpload.licence)) uploadableObject.licence = objectToUpload.licence.id
        if (this.isDefinedAndNotNull(this.relatedData.reference)) uploadableObject.reference = this.relatedData.reference.id
        if (this.isDefinedAndNotNull(this.relatedData.dataset)) uploadableObject.dataset = this.relatedData.dataset.id

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
        this.doi.resource_type = { id: obj.resource_type, value: obj.resource_type__value }
        this.doi.title_translated_language = { id: obj.title_translated_language, value: obj.title_translated_language__value, value_en: obj.title_translated_language__value_en }
        this.doi.owner = { id: obj.owner, agent: obj.owner__agent }
        this.doi.language = { id: obj.language, value: obj.language__value, value_en: obj.language__value_en}
        this.doi.copyright_agent = { id: obj.copyright_agent, agent: obj.copyright_agent__agent }
        this.doi.licence = { id: obj.licence, licence: obj.licence__licence, licence_en: obj.licence__licence_en}

        // Filling related data, doing it here because there is only 1 reference and 1 dataset
        // Reference and Dataset are direct links and should be added without relatedData object.
        this.doi.reference = { id: obj.reference, reference: obj.reference__reference }
        this.doi.dataset = { id: obj.dataset, name: obj.dataset__name, name_en: obj.dataset__name_en}
      },

      fillRelatedDataAutocompleteFields(obj, type) {
        if (obj === undefined) return;
        // console.log(obj)
        // console.log(type)

        // This goes for related data in tabs
        if (type === undefined) {
          console.log(obj)

          if (this.isDefinedAndNotNull(obj.attachment)) obj.attachment = { id: obj.attachment, original_filename: obj.attachment__original_filename }
          if (this.isDefinedAndNotNull(obj.agent_type)) obj.agent_type = { id: obj.agent_type, value: obj.agent_type__value }
          if (this.isDefinedAndNotNull(obj.agent)) obj.agent = { id: obj.agent, agent: obj.agent__agent }
          if (this.isDefinedAndNotNull(obj.identifier_type)) obj.identifier_type = { id: obj.identifier_type, value: obj.identifier_type__value }
          if (this.isDefinedAndNotNull(obj.relation_type)) obj.relation_type = { id: obj.relation_type, value: obj.relation_type__value }
          if (this.isDefinedAndNotNull(obj.locality)) obj.locality = { id: obj.locality, locality: obj.locality__locality, locality_en: obj.locality__locality_en }
          if (this.isDefinedAndNotNull(obj.date_type)) obj.date_type = { id: obj.date_type, value: obj.date_type__value }

          return obj;
        }

        let relatedData = cloneDeep(obj)
        obj = [];
        relatedData.forEach(entity => {
          if (type === 'attachment_link' || type === 'doi_agent' || type === 'doi_related_identifier' || type === 'doi_geolocation' || type === 'doi_date') obj.push(entity)
        });
        return obj
      },

      loadRelatedData(object, doi = null) {
        let query;

        if (object === 'reference' && doi !== null && doi.reference !== null && doi.reference.id !== null) {
          this.relatedData.count[object] = 1;
          this.relatedData[object] = {
            id: doi.reference__id,
            reference: doi.reference__reference
          }
          this.setBlockVisibility(object, this.relatedData.count[object])
          return;
        } else if (object === 'dataset' && doi !== null && doi.dataset !== null && doi.dataset.id !== null) {
          this.relatedData.count[object] = 1;
          this.relatedData[object] = {
            id: doi.dataset__id,
            name: doi.dataset__name,
            name_en: doi.dataset__name_en
          }
          this.setBlockVisibility(object, this.relatedData.count[object])
          return;
        } else if (object === 'attachment_link') {
          query = fetchDoiAttachment(this.$route.params.id, this.relatedData.page.attachment_link, this.relatedData.paginateBy.attachment_link)
        } else if (object === 'doi_related_identifier') {
          query = fetchDoiRelatedIdentifier(this.$route.params.id, this.relatedData.page.doi_related_identifier, this.relatedData.paginateBy.doi_related_identifier)
        } else if (object === 'doi_geolocation') {
          query = fetchDoiGeolocation(this.$route.params.id, this.relatedData.page.doi_geolocation, this.relatedData.paginateBy.doi_geolocation)
        } else if (object === 'doi_agent') {
          query = fetchDoiAgent(this.$route.params.id, this.relatedData.page.doi_agent, this.relatedData.paginateBy.doi_agent)
        } else if (object === 'doi_date') {
          query = fetchDoiDate(this.$route.params.id, this.relatedData.page.doi_date, this.relatedData.paginateBy.doi_date)
        }

        // Dataset and Reference are direct links and do not need extra request.
        if (object !== 'dataset' && object !== 'reference') {
          return new Promise(resolve => {
            query.then(response => {
              if (response.status === 200) this.relatedData[object] = response.body.results ? response.body.results : [];

              this.relatedData.count[object] = response.body.count;
              this.relatedData[object] = this.fillRelatedDataAutocompleteFields(this.relatedData[object], object);

              if (object === 'doi_agent') {
                this.updateDoiCreatorsField(this.relatedData.doi_agent)
              }

              resolve(true)
            });
          });
        }
      },

      setBlockVisibility(object,count){
        if(object === 'reference') this.block.reference = count > 0
        if(object === 'dataset') this.block.dataset = count > 0
      },

      //check required fields for related data
      checkRequiredFields(type) {},

      formatRelatedData(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload);
        uploadableObject.doi = this.doi.id;
        console.log(uploadableObject.attachment)

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
          resolve(fetchDois(params))
        });
      },

      customLabelForReference(option) {
        return `${option.id} - (${option.reference})`
      },

      customLabelForDataset(option) {
        if (this.$i18n.locale === 'ee') return `${option.id} - (${option.name})`
        return `${option.id} - (${option.name_en})`
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

      /**
       * Updates DOI creators field using persons (Creators) in doi_agent
       * Always overwrites creators field, because doi_agent is more reliable than user entered creators field!
       * @param doiAgent
       */
      updateDoiCreatorsField(doiAgent) {
        if (doiAgent.length > 0) {
          let creators = '';

          doiAgent.forEach(agent => {
            // Only Creators are added (agent_type 1 === Creator)
            if (agent.agent_type === 1) {
              creators += agent.agent__surename + ', ' + agent.agent__forename + '; '
            }
          })

          creators = creators.trim().slice(0, -1)
          this.doi.creators = creators;
        }

      }
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
