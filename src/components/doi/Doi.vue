<template>
  <div class="doi">
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- REQUIRED INFO -->
    <fieldset class="border p-2 mb-2" :style="!validate('doi') ? 'border-color: #dc3545!important;' : ''"
              id="block-requiredFields">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.requiredFields, 'text-danger': !validate('doi') }"
              @click="block.requiredFields = !block.requiredFields">
        {{ $t('doi.requiredFields') }}
        <i v-if="validate('doi')" class="fas fa-check text-success"></i>
        <i v-if="!validate('doi')" class="fas fa-exclamation-triangle text-danger"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.requiredFields">

          <!-- DOI, RESOURCE TYPE and RESOURCE -->
          <div class="row">
            <div class="col-md-4">
              <label :for="`identifier`">{{ $t('doi.identifier') }}:</label>
              <b-form-input id="identifier" v-model="doi.identifier" type="text"
                            :placeholder="$route.meta.isEdit ? '' : $t('doi.identifierPlaceholder')"
                            :disabled="true"></b-form-input>
            </div>

            <!-- TODO: Find a way to change vue-multiselect size like b-form-input size -->
            <div class="col-md-4">
              <label :for="`resource_type`">{{ $t('doi.resourceTypeGeneral') }}:</label>
              <vue-multiselect v-model="doi.resource_type"
                               id="resource_type"
                               :options="autocomplete.resource_type"
                               track-by="id"
                               label="value"
                               :class="isNotEmpty(doi.resource_type) ? 'valid' : 'invalid'"
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
              <b-form-input id="resource" :state="isNotEmpty(doi.resource)" v-model="doi.resource"
                            type="text"></b-form-input>
            </div>
          </div>

          <!-- CREATORS, YEAR and PUBLISHER -->
          <div class="row">
            <div class="col-md-4">
              <div class="d-flex">
                <div class="flex-fill">
                  <label :for="`creators`">{{ $t('doi.creators') }}:</label>
                  <b-form-input id="creators" :state="isNotEmpty(doi.creators)" v-model="doi.creators"
                                type="text"></b-form-input>
                </div>

                <div class="align-self-end pl-2" v-if="!this.$route.meta.isEdit && isNotEmpty(doi.creators)">
                  <vs-button radius @click="addCreatorsToRelatedData"
                             :title="$t('doi.addCreators')"
                             color="primary" type="line" icon="fa-user-plus" icon-pack="fas">
                  </vs-button>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <label :for="`publication_year`">{{ $t('doi.year') }}:</label>
              <b-form-input id="publication_year" :state="isNotEmpty(doi.publication_year)"
                            v-model="doi.publication_year" type="number"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`publisher`">{{ $t('doi.publisher') }}:</label>
              <b-form-input id="publisher" :state="isNotEmpty(doi.publisher)" v-model="doi.publisher"
                            type="text"></b-form-input>
            </div>
          </div>

          <!-- TITLE -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`title`">{{ $t('doi.title') }}:</label>
              <b-form-input id="title" :state="isNotEmpty(doi.title)" v-model="doi.title" type="text"></b-form-input>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- GENERAL INFO -->
    <fieldset class="border p-2 mb-2" ref="info" id="block-info">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.info }" @click="block.info = !block.info">
        {{ $t('doi.generalInfo') }}
        <i class="fas fa-project-diagram"></i>
      </legend>
      <transition name="fade">
        <div v-show="block.info">

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
                  <strong>{{ option[commonLabel] }}</strong>
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
              <vue-multiselect id="agent"
                               v-model="doi.owner"
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
          </div>

          <!-- ABSTRACT -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`abstract`">{{ $t('doi.abstract') }}:</label>
              <b-form-textarea id="abstract" v-model="doi.abstract" type="text" :rows="1"
                               :max-rows="20"></b-form-textarea>
            </div>
          </div>

          <!-- METHODS -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`methods`">{{ $t('doi.methods') }}:</label>
              <b-form-textarea id="methods" v-model="doi.methods" type="text" :rows="1"
                               :max-rows="20"></b-form-textarea>
            </div>
          </div>

          <!-- COPYRIGHT_AGENT (copyright) and LICENCE -->
          <div class="row">
            <div class="col-md-6">
              <!-- Todo: Use this TEMPLATE for search filled autocomplete -->
              <label :for="`copyright_agent`">{{ $t('doi.copyright') }}:</label>
              <vue-multiselect id="copyright_agent"
                               v-model="doi.copyright_agent"
                               label="agent"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.copyright_agent"
                               :options="autocomplete.copyright_agent"
                               @search-change="autocompleteCopyrightAgentSearch"
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

            <!-- Todo: Use this TEMPLATE for prefilled autocomplete -->
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
                  <strong>{{ option[licenceLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- REFERENCE and DATASET -->
    <fieldset class="border p-2 mb-2" id="block-referenceAndDataset">
      <legend class="w-auto" :class="{ 'text-primary': !block.referenceAndDataset }"
              @click="block.referenceAndDataset = !block.referenceAndDataset">
        {{ $t('doi.primaryRefAndDat') }}
        <i class="fas fa-book"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.referenceAndDataset">

          <div class="row">
            <!-- REFERENCE -->
            <div class="col-sm-10 col-md-4 mb-2">
              <vue-multiselect v-model="relatedData.reference"
                               id="reference"
                               track-by="id"
                               :options="autocomplete.reference"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :close-on-select="true"
                               @search-change="autocompleteDoiReferenceSearch"
                               :custom-label="customLabelForReference"
                               :loading="autocomplete.loaders.reference"
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
              <vs-button v-if="relatedData.reference !== null" radius
                         @click="windowOpenNewTab('reference', '/reference/' + relatedData.reference.id)"
                         color="primary" type="line" icon="link"></vs-button>
            </div>

            <!-- DATASET -->
            <div class="col-sm-10 col-md-4 mb-2">
              <!--              <label :for="`dataset`">{{ $t('doi.dataset') }}:</label>-->
              <vue-multiselect v-model="relatedData.dataset"
                               id="dataset"
                               track-by="id"
                               :options="autocomplete.dataset"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :close-on-select="true"
                               @search-change="autocompleteDatasetSearch"
                               :custom-label="customLabelForDataset"
                               :loading="autocomplete.loaders.dataset"
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
              <vs-button v-if="relatedData.dataset !== null" radius
                         @click="openGeoInNewWindow({object: 'dataset', id: relatedData.dataset.id})"
                         color="primary" type="line" icon="remove_red_eye"></vs-button>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- REMARKS -->
    <fieldset class="border p-2 mb-2" id="block-description">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.description }"
              @click="block.description = !block.description">
        {{ $t('doi.remarks') }}
        <i class="fas fa-pen-fancy"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.description">

          <div class="row">
            <div class="col-sm-12">
              <label :for="`remarks`">{{ $t('doi.remarks') }}:</label>
              <b-form-textarea id="remarks" v-model="doi.remarks" type="text" :rows="1"
                               :max-rows="20"></b-form-textarea>
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
              <span>{{ $t('doi.relatedTables.' + tab.name) }}</span>

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
              v-model="relatedData.searchParameters[activeTab].page"
              :per-page="relatedData.searchParameters[activeTab].paginateBy">
            </b-pagination>
          </div>
        </div>

        <doi-files :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                   v-on:add-related-data="addRelatedData"
                   v-on:set-default="setDefault"
                   v-on:edit-row="editRow"
                   v-on:remove-row="removeRow"/>

        <doi-related-identifier :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                                v-on:add-related-data="addRelatedData"
                                v-on:set-default="setDefault"
                                v-on:edit-row="editRow"
                                v-on:remove-row="removeRow"/>

        <doi-geolocation :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                         v-on:add-related-data="addRelatedData"
                         v-on:set-default="setDefault"
                         v-on:edit-row="editRow"
                         v-on:remove-row="removeRow"/>

        <doi-agent :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                   v-on:add-related-data="addRelatedData"
                   v-on:set-default="setDefault"
                   v-on:edit-row="editRow"
                   v-on:remove-row="removeRow"/>

        <doi-date :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                  v-on:add-related-data="addRelatedData"
                  v-on:set-default="setDefault"
                  v-on:edit-row="editRow"
                  v-on:remove-row="removeRow"/>

      </div>
    </div>

    <!-- DATACITE CREATED and UPDATED -->
    <fieldset class="border p-2 mb-2" v-if="$route.meta.isEdit" id="block-datacite">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.datacite }"
              @click="block.datacite = !block.datacite">
        {{ $t('doi.datacite') }}
        <i class="fas fa-sitemap"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.datacite">

          <div class="row">
            <div class="col-md-6 mb-2">
              <label class="mt-0" :for="`datacite_created`">{{ $t('doi.dataciteCreated') }}:</label>
              <b-form-input v-if="doi.datacite_created" size="sm" id="datacite_created"
                            :value="doi.datacite_created | moment('ddd, MMM Do YYYY, HH:mm:ss')" type="text"
                            disabled></b-form-input>
              <b-form-input v-else size="sm" v-model="doi.datacite_created" type="text" disabled></b-form-input>
            </div>

            <div class="col-md-6 mb-2">
              <label class="mt-0" :for="`datacite_updated`">{{ $t('doi.dataciteUpdated') }}:</label>
              <b-form-input v-if="doi.datacite_updated" size="sm" id="datacite_updated"
                            :value="doi.datacite_updated | moment('ddd, MMM Do YYYY, HH:mm:ss')" type="text"
                            disabled></b-form-input>
              <b-form-input v-else size="sm" v-model="doi.datacite_updated" type="text" disabled></b-form-input>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- IS PRIVATE -->
    <div class="row mt-3">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="doi.is_private">
          {{ $t('doi.private') }}?
        </b-form-checkbox>
      </div>
    </div>

    <!-- DOI METADATA REGISTER and UPDATE BUTTONS -->
    <div class="row mt-3">
      <div class="col">
        <button v-if="$route.meta.isEdit && showMetadataButton && validate('doi')" class="btn btn-primary mr-2 mb-2"
                :disabled="sendingData" @click="registerMetadata"
                :title="showMetadataUpdateMessage ? $t('edit.buttons.updateMetadata') : $t('edit.buttons.registerMetadata')">
          <i class="fas fa-server"></i>
          {{ showMetadataUpdateMessage ? $t('edit.buttons.updateMetadata') : $t('edit.buttons.registerMetadata') }}
        </button>

        <button v-if="$route.meta.isEdit && showDoiUrlButton && validate('doi')" class="btn btn-primary mr-2 mb-2"
                :disabled="sendingData" @click="registerDoiUrl"
                :title="showDoiUrlUpdateMessage ? $t('edit.buttons.updateUrl') : $t('edit.buttons.registerUrl')">
          <i class="fas fa-server"></i>
          {{ showDoiUrlUpdateMessage ? $t('edit.buttons.updateUrl') : $t('edit.buttons.registerUrl') }}
        </button>
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
    fetchDoiDateType,
    fetchCheckMetadataInDataCite,
    fetchCheckDoiUrlInDataCite,
    fetchRegisterMetadataToDataCite, fetchRegisterDoiUrlToDataCite, fetchDoiUsingEGF, fetchAgentUsingName
  } from "../../assets/js/api/apiCalls";
  import DoiAgent from "./relatedTables/DoiAgent";
  import DoiFiles from "./relatedTables/DoiFiles";
  import DoiRelatedIdentifier from "./relatedTables/DoiRelatedIdentifier";
  import DoiGeolocation from "./relatedTables/DoiGeolocation";
  import DoiDate from "./relatedTables/DoiDate";
  import {toastSuccess, toastError, toastInfo} from "../../assets/js/iziToast/iziToast";
  import formSectionsMixin from "../../mixins/formSectionsMixin";
  import {mapState} from "vuex";

  export default {
    components: {
      DoiDate,
      DoiGeolocation,
      DoiRelatedIdentifier,
      DoiFiles,
      DoiAgent,
      Datepicker,
      Spinner,
    },

    mixins: [formManipulation, autocompleteMixin, formSectionsMixin],

    name: "Doi",

    data() {
      return this.setInitialData()
    },

    created() {
      // USED BY SIDEBAR
      if (this.$route.meta.isEdit) {
        const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
        let params = this.isNotEmpty(searchHistory) && searchHistory !== 'fallbackValue' ? searchHistory : this.searchParameters;
        this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', {
          searchHistory: 'doiSearchHistory',
          defaultSearch: this.setDefaultSearchParameters(),
          search: params,
          request: 'FETCH_DOIS',
          title: 'header.dois',
          object: 'doi',
          field: 'title',
          block: this.block
        });
      }

      this.loadFullInfo()
    },

    watch: {
      '$route.params.id': {
        handler: function (newVal, oldVal) {
          this.reloadData()
        },
      },
      'relatedData.searchParameters': {
        handler: function (newVal, oldVal) {
          this.loadRelatedData(this.activeTab)
        },
        deep: true
      },
    },

    computed: {
      ...mapState(["databaseId"])
    },

    methods: {
      setTab(type) {
        this.activeTab = type
      },

      setInitialData() {
        return {
          relatedTabs: [
            {name: 'doi_agent', iconClass: 'fas fa-user-friends'},
            {name: 'attachment_link', iconClass: 'fas fa-folder-open'},
            {name: 'doi_geolocation', iconClass: 'fas fa-globe-americas'},
            {name: 'doi_related_identifier', iconClass: 'fas fa-project-diagram'},
            {name: 'doi_date', iconClass: 'far fa-calendar-alt'},
          ],
          searchHistory: 'doiSearchHistory',
          activeTab: 'doi_agent',
          relatedData: this.setDefaultRelatedData(),
          copyFields: ['id', 'identifier', 'creators', 'publisher', 'publication_year', 'title', 'title_alternative', 'title_translated',
            'title_translated_language', 'abstract', 'resource_type', 'resource', 'methods', 'version', 'sizes', 'formats', 'language',
            'subjects', 'copyright_agent', 'licence', 'remarks', 'owner', 'is_private', 'datacite_created', 'datacite_updated'],
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
          searchParameters: this.setDefaultSearchParameters(),
          block: {requiredFields: true, info: true, referenceAndDataset: false, description: true, datacite: true},
          showMetadataButton: false,
          showDoiUrlButton: false,
          showMetadataUpdateMessage: false,
          showDoiUrlUpdateMessage: false,
          sarvXML: null,
          dataciteXML: null,
          doiURL: null,
          dataciteURL: null,
        }
      },

      reloadData() {
        Object.assign(this.$data, this.setInitialData());
        this.loadFullInfo()
      },

      loadFullInfo() {
        this.loadAutocompleteFields(true, true);

        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          this.$emit('set-object', 'doi');

          fetchDoi(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);

            if (handledResponse.length > 0) {
              this.$emit('object-exists', true);
              this.doi = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.doi);

              // Loading REFERENCE and DATASET here because they don't need api request
              this.loadRelatedData('reference', this.doi);
              this.loadRelatedData('dataset', this.doi);

              this.removeUnnecessaryFields(this.doi, this.copyFields);
              this.$emit('data-loaded', this.doi);
              this.sendingData = false;
            } else {
              this.sendingData = false;
              this.$emit('object-exists', false);
            }
          });

          this.checkMetadata();
          this.checkDoiUrl();

          // Load Related Data which is in tabs
          this.relatedTabs.forEach(tab => {
            this.loadRelatedData(tab.name);
          });

          this.$emit('related-data-info', this.relatedTabs.map(tab => tab.name));

        } else if (this.$route.meta.isEGF && !this.$route.meta.isEdit) {
          fetchDoiUsingEGF(this.$route.params.id).then(response => {
            // Todo: Handle response
            console.log(response)
          });

          this.assignEgfFieldsToDoiObject(JSON.parse("{\"identifier\":2,\"creator\":\"N. Pogrebov\",\"title\":\"Lühiülevaade Eesti Vabariigi geoloogilisest ehitusest ja mineraalsetest rikkustest\",\"title_orig\":\"Kratkii otsherk geologitsheskogo strojenija i mineralnõh bogatstv Estonskoi Respubliki\",\"date\":1923,\"tags\":\"aluspõhi, kvaliteet, kvaternaar, varu\",\"field\":\"kaardistamine, maavara\",\"deposit\":\"Sinimäed\",\"description\":\"12-leheküljelises 1944.a koostatud venekeelses aruandes on lühidalt iseloomustatud Eesti Vabariigi territooriumi geoloogilist ehitust ja olulisemaid maavarasid. Kirjanduse loetelus on ca pooled tööd pärit saksakeelsetelt autoritelt,\",\"performer\":\"Loode GV\",\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[59.053385,24.50002],[58.215376,25.10329],[58.453046,23.062895],[59.053385,24.50002]]]},\"geoLocations\":[{\"geoLocationPolygon\":[{\"polygonPoint\":{\"pointLatitude\":59.053385,\"pointLongitude\":24.50002}},{\"polygonPoint\":{\"pointLatitude\":58.215376,\"pointLongitude\":25.10329}},{\"polygonPoint\":{\"pointLatitude\":58.453046,\"pointLongitude\":23.062895}},{\"polygonPoint\":{\"pointLatitude\":59.053385,\"pointLongitude\":24.50002}}]}]}"));
          // this.assignEgfFieldsToDoiObject(JSON.parse("{\"identifier\":4556,\"creator\":\"H. Kink, E. Lust, T. Metslang\",\"title\":\"Vee seisundi kompleksne ökoloogiline hinnang kaitsealadel\",\"title_orig\":\"Vee seisundi kompleksne ökoloogiline hinnang kaitsealadel\",\"date\":1990,\"tags\":\"reostus, ökoloogia\",\"field\":\"hüdrogeoloogia, keskkond\",\"deposit\":\" \",\"description\":\"Veeressursside kompleksse jälgimissüsteemi väljaarendamisel on peetud oluliseks, et lisaks tüüpmaastikule oleksid haaratud kõik levinumad mõjurid. Komplekssuse põhimõttel jälgitakse kogu veeringet - sademeid, pinna- ja pinnasevett. Sügavate põhjavee reþiimivaatluskaevude olemasolul kasutatakse ka neid andmeid.\\r\\n\\r\\nSüsteemi põhieesmärgid:\\r\\n\\r\\n- veeressursside, mõjurite ja seisundi jälgimine ning selle parandamine kaitsealadel;\\r\\n\\r\\n- koostatud andmepanga töötluse tulemuste alusel veeressursside tehiskoormuse optimeerimine Eestimaal                  tüüptingimustes. Loodusliku kaitstuse parameetrite täpsustamine; \\r\\n\\r\\n- veesäilitusalade võrgu loomise vajaduse ja paigutuse selgitamine;\\r\\n\\r\\n- majandamiskriteeriumite väljatöötamine, lähtudes veeressursside seisundist ja ohustatusest, arvestades nii punkt- kui ka hajareostust.\\r\\n\\r\\nKokku oli 1990.a. lõpus 126 jälgimispunkti, neist põhjavee vaatluspunkte 73. Kultuurmaastikul jälgitakse põhjavett 69 punktis, analoogsel loodusmaastikul 57 punktis, sellest soodes 19 punktis. Kultuurmaastikul jälgitakse punktreostusallikaid 44 ja hajareostust 21 punktis. Mõjuriteks on põllumajandus, kommunaalmajandus, kohalik tööstus, maavarade kaevandamine ja puhkemajandus.\\r\\n\\r\\nSeni on tehtud välivaatlusi 4-6 korda aastas. Iga kord määratakse tehiskoormus, vooluhulgad või tasemed ning võetakse veeproovid keemiliseks analüüsiks.\\r\\n\\r\\nKõigil kaitsealadel on ka oma spetsiifilised veeprobleemid.\\r\\n\\r\\nVaatlusväljakute skeemid on mõõtkavas 1:25 000 ja 1:5 000.\\r\\n\\r\\nMärksõnad: vee seisund, ökoloogiline hinnang, veeressurss, vaatlusväljak, põhjavesi, pinnavesi, pinnasevesi, sademed, tehiskoormus, veeproov, vooluhulk, tase, veesäilitusala, punktreostus, hajareostus, loodusliku kaitstuse parameetrid, Lahemaa Rahvuspark, Matsalu RLKA, Viidumäe RLKA, Nigula RLKA, Meenikunno SKA, Viru raba.\",\"performer\":\"TA Geoloogia Instituut\",\"geometry\":{\"type\":\"MultiPolygon\",\"coordinates\":[[[[59.497055,25.454043],[59.658338,25.483386],[59.65749,25.498873],[59.582671,25.675113],[59.595847,25.689718],[59.711666,25.616132],[59.692203,25.800821],[59.655202,26.013632],[59.626676,26.090037],[59.594837,26.099753],[59.597512,26.252812],[59.584683,26.265803],[59.574823,26.267696],[59.564124,26.238673],[59.541048,26.235777],[59.552646,26.012984],[59.538409,25.991432],[59.517007,26.015655],[59.485015,26.095683],[59.472308,26.080592],[59.478291,26.060282],[59.463609,26.041909],[59.451013,26.071348],[59.392664,26.102715],[59.380861,26.056001],[59.331647,26.098178],[59.296315,26.029577],[59.289465,25.947722],[59.355228,25.932448],[59.404815,25.88844],[59.420175,25.889289],[59.438062,25.88313],[59.445113,25.842214],[59.460891,25.841205],[59.465325,25.754137],[59.462215,25.638649],[59.490322,25.633882],[59.474729,25.539188],[59.473267,25.496963],[59.497055,25.454043]]],[[[58.759669,23.433012],[58.832591,23.476735],[58.80766,23.546732],[58.82121,23.763022],[58.816412,23.792219],[58.806627,23.822473],[58.80606,23.835365],[58.80549,23.845662],[58.803251,23.851296],[58.791107,23.870632],[58.78596,23.886819],[58.783726,23.900228],[58.774493,23.920133],[58.76736,23.928102],[58.761558,23.938501],[58.759061,23.948955],[58.7588,23.960604],[58.759745,23.964921],[58.765179,23.979174],[58.765944,23.988161],[58.739907,23.997236],[58.735738,23.993524],[58.733263,23.987223],[58.726207,23.951232],[58.724215,23.916969],[58.73599,23.837853],[58.721884,23.829634],[58.705211,23.816258],[58.694315,23.574334],[58.674811,23.490121],[58.759669,23.433012]]],[[[58.313562,22.13143],[58.310855,22.111802],[58.306136,22.114759],[58.301007,22.117631],[58.289898,22.114482],[58.281083,22.119931],[58.274862,22.123507],[58.278758,22.147299],[58.254499,22.15936],[58.245465,22.103037],[58.277529,22.066722],[58.286172,22.025779],[58.316837,22.024063],[58.312746,22.068638],[58.325152,22.076126],[58.333788,22.083071],[58.33723,22.11743],[58.313562,22.13143]]],[[[58.054529,24.743983],[58.027367,24.739093],[58.024623,24.7263],[57.994972,24.712629],[57.991404,24.720101],[57.978811,24.713757],[57.962411,24.699692],[57.967004,24.626478],[57.980859,24.622578],[57.99006,24.614238],[57.997565,24.620161],[58.019394,24.613501],[58.026209,24.650785],[58.038974,24.646569],[58.049237,24.643513],[58.051281,24.680384],[58.055491,24.721027],[58.057071,24.726806],[58.054529,24.743983]]],[[[57.970966,27.291521],[57.955846,27.333338],[57.947939,27.36125],[57.93477,27.368749],[57.927891,27.368829],[57.927931,27.359724],[57.920677,27.35946],[57.920146,27.353595],[57.918446,27.353113],[57.914807,27.311575],[57.916458,27.309659],[57.916444,27.300164],[57.919306,27.30023],[57.919746,27.286028],[57.922533,27.276172],[57.928146,27.259779],[57.937564,27.250078],[57.940626,27.25012],[57.953192,27.257753],[57.956396,27.264497],[57.965916,27.274],[57.971463,27.283288],[57.970966,27.291521]]],[[[59.482213,25.670067],[59.478208,25.673011],[59.473998,25.673172],[59.469885,25.672229],[59.469643,25.672173],[59.464941,25.664878],[59.463574,25.652881],[59.466254,25.643068],[59.470212,25.646245],[59.474164,25.649416],[59.481409,25.66207],[59.482213,25.670067]]]]},\"geoLocations\":[{\"geoLocationPolygon\":[{\"polygonPoint\":{\"pointLatitude\":59.497055,\"pointLongitude\":25.454043}},{\"polygonPoint\":{\"pointLatitude\":59.658338,\"pointLongitude\":25.483386}},{\"polygonPoint\":{\"pointLatitude\":59.65749,\"pointLongitude\":25.498873}},{\"polygonPoint\":{\"pointLatitude\":59.582671,\"pointLongitude\":25.675113}},{\"polygonPoint\":{\"pointLatitude\":59.595847,\"pointLongitude\":25.689718}},{\"polygonPoint\":{\"pointLatitude\":59.711666,\"pointLongitude\":25.616132}},{\"polygonPoint\":{\"pointLatitude\":59.692203,\"pointLongitude\":25.800821}},{\"polygonPoint\":{\"pointLatitude\":59.655202,\"pointLongitude\":26.013632}},{\"polygonPoint\":{\"pointLatitude\":59.626676,\"pointLongitude\":26.090037}},{\"polygonPoint\":{\"pointLatitude\":59.594837,\"pointLongitude\":26.099753}},{\"polygonPoint\":{\"pointLatitude\":59.597512,\"pointLongitude\":26.252812}},{\"polygonPoint\":{\"pointLatitude\":59.584683,\"pointLongitude\":26.265803}},{\"polygonPoint\":{\"pointLatitude\":59.574823,\"pointLongitude\":26.267696}},{\"polygonPoint\":{\"pointLatitude\":59.564124,\"pointLongitude\":26.238673}},{\"polygonPoint\":{\"pointLatitude\":59.541048,\"pointLongitude\":26.235777}},{\"polygonPoint\":{\"pointLatitude\":59.552646,\"pointLongitude\":26.012984}},{\"polygonPoint\":{\"pointLatitude\":59.538409,\"pointLongitude\":25.991432}},{\"polygonPoint\":{\"pointLatitude\":59.517007,\"pointLongitude\":26.015655}},{\"polygonPoint\":{\"pointLatitude\":59.485015,\"pointLongitude\":26.095683}},{\"polygonPoint\":{\"pointLatitude\":59.472308,\"pointLongitude\":26.080592}},{\"polygonPoint\":{\"pointLatitude\":59.478291,\"pointLongitude\":26.060282}},{\"polygonPoint\":{\"pointLatitude\":59.463609,\"pointLongitude\":26.041909}},{\"polygonPoint\":{\"pointLatitude\":59.451013,\"pointLongitude\":26.071348}},{\"polygonPoint\":{\"pointLatitude\":59.392664,\"pointLongitude\":26.102715}},{\"polygonPoint\":{\"pointLatitude\":59.380861,\"pointLongitude\":26.056001}},{\"polygonPoint\":{\"pointLatitude\":59.331647,\"pointLongitude\":26.098178}},{\"polygonPoint\":{\"pointLatitude\":59.296315,\"pointLongitude\":26.029577}},{\"polygonPoint\":{\"pointLatitude\":59.289465,\"pointLongitude\":25.947722}},{\"polygonPoint\":{\"pointLatitude\":59.355228,\"pointLongitude\":25.932448}},{\"polygonPoint\":{\"pointLatitude\":59.404815,\"pointLongitude\":25.88844}},{\"polygonPoint\":{\"pointLatitude\":59.420175,\"pointLongitude\":25.889289}},{\"polygonPoint\":{\"pointLatitude\":59.438062,\"pointLongitude\":25.88313}},{\"polygonPoint\":{\"pointLatitude\":59.445113,\"pointLongitude\":25.842214}},{\"polygonPoint\":{\"pointLatitude\":59.460891,\"pointLongitude\":25.841205}},{\"polygonPoint\":{\"pointLatitude\":59.465325,\"pointLongitude\":25.754137}},{\"polygonPoint\":{\"pointLatitude\":59.462215,\"pointLongitude\":25.638649}},{\"polygonPoint\":{\"pointLatitude\":59.490322,\"pointLongitude\":25.633882}},{\"polygonPoint\":{\"pointLatitude\":59.474729,\"pointLongitude\":25.539188}},{\"polygonPoint\":{\"pointLatitude\":59.473267,\"pointLongitude\":25.496963}},{\"polygonPoint\":{\"pointLatitude\":59.497055,\"pointLongitude\":25.454043}}]},{\"geoLocationPolygon\":[{\"polygonPoint\":{\"pointLatitude\":58.759669,\"pointLongitude\":23.433012}},{\"polygonPoint\":{\"pointLatitude\":58.832591,\"pointLongitude\":23.476735}},{\"polygonPoint\":{\"pointLatitude\":58.80766,\"pointLongitude\":23.546732}},{\"polygonPoint\":{\"pointLatitude\":58.82121,\"pointLongitude\":23.763022}},{\"polygonPoint\":{\"pointLatitude\":58.816412,\"pointLongitude\":23.792219}},{\"polygonPoint\":{\"pointLatitude\":58.806627,\"pointLongitude\":23.822473}},{\"polygonPoint\":{\"pointLatitude\":58.80606,\"pointLongitude\":23.835365}},{\"polygonPoint\":{\"pointLatitude\":58.80549,\"pointLongitude\":23.845662}},{\"polygonPoint\":{\"pointLatitude\":58.803251,\"pointLongitude\":23.851296}},{\"polygonPoint\":{\"pointLatitude\":58.791107,\"pointLongitude\":23.870632}},{\"polygonPoint\":{\"pointLatitude\":58.78596,\"pointLongitude\":23.886819}},{\"polygonPoint\":{\"pointLatitude\":58.783726,\"pointLongitude\":23.900228}},{\"polygonPoint\":{\"pointLatitude\":58.774493,\"pointLongitude\":23.920133}},{\"polygonPoint\":{\"pointLatitude\":58.76736,\"pointLongitude\":23.928102}},{\"polygonPoint\":{\"pointLatitude\":58.761558,\"pointLongitude\":23.938501}},{\"polygonPoint\":{\"pointLatitude\":58.759061,\"pointLongitude\":23.948955}},{\"polygonPoint\":{\"pointLatitude\":58.7588,\"pointLongitude\":23.960604}},{\"polygonPoint\":{\"pointLatitude\":58.759745,\"pointLongitude\":23.964921}},{\"polygonPoint\":{\"pointLatitude\":58.765179,\"pointLongitude\":23.979174}},{\"polygonPoint\":{\"pointLatitude\":58.765944,\"pointLongitude\":23.988161}},{\"polygonPoint\":{\"pointLatitude\":58.739907,\"pointLongitude\":23.997236}},{\"polygonPoint\":{\"pointLatitude\":58.735738,\"pointLongitude\":23.993524}},{\"polygonPoint\":{\"pointLatitude\":58.733263,\"pointLongitude\":23.987223}},{\"polygonPoint\":{\"pointLatitude\":58.726207,\"pointLongitude\":23.951232}},{\"polygonPoint\":{\"pointLatitude\":58.724215,\"pointLongitude\":23.916969}},{\"polygonPoint\":{\"pointLatitude\":58.73599,\"pointLongitude\":23.837853}},{\"polygonPoint\":{\"pointLatitude\":58.721884,\"pointLongitude\":23.829634}},{\"polygonPoint\":{\"pointLatitude\":58.705211,\"pointLongitude\":23.816258}},{\"polygonPoint\":{\"pointLatitude\":58.694315,\"pointLongitude\":23.574334}},{\"polygonPoint\":{\"pointLatitude\":58.674811,\"pointLongitude\":23.490121}},{\"polygonPoint\":{\"pointLatitude\":58.759669,\"pointLongitude\":23.433012}}]},{\"geoLocationPolygon\":[{\"polygonPoint\":{\"pointLatitude\":58.313562,\"pointLongitude\":22.13143}},{\"polygonPoint\":{\"pointLatitude\":58.310855,\"pointLongitude\":22.111802}},{\"polygonPoint\":{\"pointLatitude\":58.306136,\"pointLongitude\":22.114759}},{\"polygonPoint\":{\"pointLatitude\":58.301007,\"pointLongitude\":22.117631}},{\"polygonPoint\":{\"pointLatitude\":58.289898,\"pointLongitude\":22.114482}},{\"polygonPoint\":{\"pointLatitude\":58.281083,\"pointLongitude\":22.119931}},{\"polygonPoint\":{\"pointLatitude\":58.274862,\"pointLongitude\":22.123507}},{\"polygonPoint\":{\"pointLatitude\":58.278758,\"pointLongitude\":22.147299}},{\"polygonPoint\":{\"pointLatitude\":58.254499,\"pointLongitude\":22.15936}},{\"polygonPoint\":{\"pointLatitude\":58.245465,\"pointLongitude\":22.103037}},{\"polygonPoint\":{\"pointLatitude\":58.277529,\"pointLongitude\":22.066722}},{\"polygonPoint\":{\"pointLatitude\":58.286172,\"pointLongitude\":22.025779}},{\"polygonPoint\":{\"pointLatitude\":58.316837,\"pointLongitude\":22.024063}},{\"polygonPoint\":{\"pointLatitude\":58.312746,\"pointLongitude\":22.068638}},{\"polygonPoint\":{\"pointLatitude\":58.325152,\"pointLongitude\":22.076126}},{\"polygonPoint\":{\"pointLatitude\":58.333788,\"pointLongitude\":22.083071}},{\"polygonPoint\":{\"pointLatitude\":58.33723,\"pointLongitude\":22.11743}},{\"polygonPoint\":{\"pointLatitude\":58.313562,\"pointLongitude\":22.13143}}]},{\"geoLocationPolygon\":[{\"polygonPoint\":{\"pointLatitude\":58.054529,\"pointLongitude\":24.743983}},{\"polygonPoint\":{\"pointLatitude\":58.027367,\"pointLongitude\":24.739093}},{\"polygonPoint\":{\"pointLatitude\":58.024623,\"pointLongitude\":24.7263}},{\"polygonPoint\":{\"pointLatitude\":57.994972,\"pointLongitude\":24.712629}},{\"polygonPoint\":{\"pointLatitude\":57.991404,\"pointLongitude\":24.720101}},{\"polygonPoint\":{\"pointLatitude\":57.978811,\"pointLongitude\":24.713757}},{\"polygonPoint\":{\"pointLatitude\":57.962411,\"pointLongitude\":24.699692}},{\"polygonPoint\":{\"pointLatitude\":57.967004,\"pointLongitude\":24.626478}},{\"polygonPoint\":{\"pointLatitude\":57.980859,\"pointLongitude\":24.622578}},{\"polygonPoint\":{\"pointLatitude\":57.99006,\"pointLongitude\":24.614238}},{\"polygonPoint\":{\"pointLatitude\":57.997565,\"pointLongitude\":24.620161}},{\"polygonPoint\":{\"pointLatitude\":58.019394,\"pointLongitude\":24.613501}},{\"polygonPoint\":{\"pointLatitude\":58.026209,\"pointLongitude\":24.650785}},{\"polygonPoint\":{\"pointLatitude\":58.038974,\"pointLongitude\":24.646569}},{\"polygonPoint\":{\"pointLatitude\":58.049237,\"pointLongitude\":24.643513}},{\"polygonPoint\":{\"pointLatitude\":58.051281,\"pointLongitude\":24.680384}},{\"polygonPoint\":{\"pointLatitude\":58.055491,\"pointLongitude\":24.721027}},{\"polygonPoint\":{\"pointLatitude\":58.057071,\"pointLongitude\":24.726806}},{\"polygonPoint\":{\"pointLatitude\":58.054529,\"pointLongitude\":24.743983}}]},{\"geoLocationPolygon\":[{\"polygonPoint\":{\"pointLatitude\":57.970966,\"pointLongitude\":27.291521}},{\"polygonPoint\":{\"pointLatitude\":57.955846,\"pointLongitude\":27.333338}},{\"polygonPoint\":{\"pointLatitude\":57.947939,\"pointLongitude\":27.36125}},{\"polygonPoint\":{\"pointLatitude\":57.93477,\"pointLongitude\":27.368749}},{\"polygonPoint\":{\"pointLatitude\":57.927891,\"pointLongitude\":27.368829}},{\"polygonPoint\":{\"pointLatitude\":57.927931,\"pointLongitude\":27.359724}},{\"polygonPoint\":{\"pointLatitude\":57.920677,\"pointLongitude\":27.35946}},{\"polygonPoint\":{\"pointLatitude\":57.920146,\"pointLongitude\":27.353595}},{\"polygonPoint\":{\"pointLatitude\":57.918446,\"pointLongitude\":27.353113}},{\"polygonPoint\":{\"pointLatitude\":57.914807,\"pointLongitude\":27.311575}},{\"polygonPoint\":{\"pointLatitude\":57.916458,\"pointLongitude\":27.309659}},{\"polygonPoint\":{\"pointLatitude\":57.916444,\"pointLongitude\":27.300164}},{\"polygonPoint\":{\"pointLatitude\":57.919306,\"pointLongitude\":27.30023}},{\"polygonPoint\":{\"pointLatitude\":57.919746,\"pointLongitude\":27.286028}},{\"polygonPoint\":{\"pointLatitude\":57.922533,\"pointLongitude\":27.276172}},{\"polygonPoint\":{\"pointLatitude\":57.928146,\"pointLongitude\":27.259779}},{\"polygonPoint\":{\"pointLatitude\":57.937564,\"pointLongitude\":27.250078}},{\"polygonPoint\":{\"pointLatitude\":57.940626,\"pointLongitude\":27.25012}},{\"polygonPoint\":{\"pointLatitude\":57.953192,\"pointLongitude\":27.257753}},{\"polygonPoint\":{\"pointLatitude\":57.956396,\"pointLongitude\":27.264497}},{\"polygonPoint\":{\"pointLatitude\":57.965916,\"pointLongitude\":27.274}},{\"polygonPoint\":{\"pointLatitude\":57.971463,\"pointLongitude\":27.283288}},{\"polygonPoint\":{\"pointLatitude\":57.970966,\"pointLongitude\":27.291521}}]},{\"geoLocationPolygon\":[{\"polygonPoint\":{\"pointLatitude\":59.482213,\"pointLongitude\":25.670067}},{\"polygonPoint\":{\"pointLatitude\":59.478208,\"pointLongitude\":25.673011}},{\"polygonPoint\":{\"pointLatitude\":59.473998,\"pointLongitude\":25.673172}},{\"polygonPoint\":{\"pointLatitude\":59.469885,\"pointLongitude\":25.672229}},{\"polygonPoint\":{\"pointLatitude\":59.469643,\"pointLongitude\":25.672173}},{\"polygonPoint\":{\"pointLatitude\":59.464941,\"pointLongitude\":25.664878}},{\"polygonPoint\":{\"pointLatitude\":59.463574,\"pointLongitude\":25.652881}},{\"polygonPoint\":{\"pointLatitude\":59.466254,\"pointLongitude\":25.643068}},{\"polygonPoint\":{\"pointLatitude\":59.470212,\"pointLongitude\":25.646245}},{\"polygonPoint\":{\"pointLatitude\":59.474164,\"pointLongitude\":25.649416}},{\"polygonPoint\":{\"pointLatitude\":59.481409,\"pointLongitude\":25.66207}},{\"polygonPoint\":{\"pointLatitude\":59.482213,\"pointLongitude\":25.670067}}]}]}\n"))
        }

        this.setTab('doi_agent')
      },

      // TODO: Optimization possible, i.e., fetch requests only if user has clicked certain related data TAB.
      loadAutocompleteFields(regularAutocompleteFields = true, relatedDataAutocompleteFields = false) {
        if (regularAutocompleteFields) {
          fetchDoiResourceType().then(response => this.autocomplete.resource_type = this.handleResponse(response));
          fetchListLanguages().then(response => this.autocomplete.language = this.handleResponse(response));
          fetchListLicences().then(response => this.autocomplete.licence = this.handleResponse(response));
        }

        if (relatedDataAutocompleteFields) {
          fetchDoiAgentType().then(response => this.autocomplete.doi_agent_type = this.handleResponse(response));
          fetchDoiRelatedIdentifierType().then(response => this.autocomplete.doi_related_identifier_type = this.handleResponse(response));
          fetchDoiRelationType().then(response => this.autocomplete.doi_relation_type = this.handleResponse(response));
          fetchDoiDateType().then(response => this.autocomplete.doi_date_type = this.handleResponse(response));
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
            doi_geolocation: ['locality', 'place', 'point_longitude', 'point_latitude', 'polygon'],
            doi_agent: ['name', 'affiliation', 'agent_type', 'orcid', 'agent'],
            doi_date: ['date', 'date_type', 'remarks']
          },
          insert: this.setDefaultInsertRelatedData(),
          searchParameters: {
            attachment_link: {
              page: 1,
              paginateBy: 10,
              orderBy: 'id'
            },
            doi_related_identifier: {
              page: 1,
              paginateBy: 10,
              orderBy: 'id'
            },
            doi_geolocation: {
              page: 1,
              paginateBy: 10,
              orderBy: 'id'
            },
            doi_agent: {
              page: 1,
              paginateBy: 10,
              orderBy: 'id'
            },
            doi_date: {
              page: 1,
              paginateBy: 10,
              orderBy: 'id'
            },
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

      setDefaultInsertRelatedData() {
        return {
          attachment_link: {},
          doi_related_identifier: {},
          doi_geolocation: {},
          doi_agent: {
            agent_type: {
              id: 1,
              value: 'Creator'
            }
          },
          doi_date: {}
        }
      },

      formatDataForUpload(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload);

        // Autocomplete fields
        if (this.isNotEmpty(objectToUpload.resource_type)) uploadableObject.resource_type = objectToUpload.resource_type.id;
        if (this.isNotEmpty(objectToUpload.title_translated_language)) uploadableObject.title_translated_language = objectToUpload.title_translated_language.id
        if (this.isNotEmpty(objectToUpload.owner)) uploadableObject.owner = objectToUpload.owner.id;
        if (this.isNotEmpty(objectToUpload.language)) uploadableObject.language = objectToUpload.language.id;
        if (this.isNotEmpty(objectToUpload.copyright_agent)) uploadableObject.copyright_agent = objectToUpload.copyright_agent.id;
        if (this.isNotEmpty(objectToUpload.licence)) uploadableObject.licence = objectToUpload.licence.id;
        if (this.isNotEmpty(this.relatedData.reference)) uploadableObject.reference = this.relatedData.reference.id;
        if (this.isNotEmpty(this.relatedData.dataset)) uploadableObject.dataset = this.relatedData.dataset.id;

        if (this.databaseId) uploadableObject.database = this.databaseId;

        if (this.$route.meta.isEGF) uploadableObject.egf = this.$route.params.id;

        // Adding related data only on add view
        if (!this.$route.meta.isEdit) {
          uploadableObject.related_data = {};

          if (this.isNotEmpty(this.relatedData.doi_agent)) {
            let clonedData = cloneDeep(this.relatedData.doi_agent);
            uploadableObject.related_data.doi_agent = clonedData
              .filter(entity => this.isNotEmpty(entity.name))
              .map((entity) => {
                return {
                  affiliation: entity.affiliation ? entity.affiliation : null,
                  agent: entity.agent ? entity.agent : null,
                  agent_type: entity.agent_type ? entity.agent_type : null,
                  name: entity.name,
                  orcid: entity.orcid ? entity.orcid : null,
                };
              });
            if (uploadableObject.related_data.doi_agent.length === 0) uploadableObject.related_data.doi_agent = null;
          } else uploadableObject.related_data.doi_agent = null;

          if (this.isNotEmpty(this.relatedData.attachment_link)) {
            let clonedData = cloneDeep(this.relatedData.attachment_link);
            uploadableObject.related_data.attachment = clonedData
              .filter(entity => this.isNotEmpty(entity.attachment))
              .map((entity) => {
                return {
                  id: entity.attachment,
                  remarks: entity.remarks ? entity.remarks : null,
                };
              });
            if (uploadableObject.related_data.attachment.length === 0) uploadableObject.related_data.attachment = null;
          } else uploadableObject.related_data.attachment = null;

          if (this.isNotEmpty(this.relatedData.doi_geolocation)) {
            let clonedData = cloneDeep(this.relatedData.doi_geolocation);
            uploadableObject.related_data.doi_geolocation = clonedData
            // .filter(entity => this.isNotEmpty(entity.locality))
              .map((entity) => {
                return {
                  polygon: entity.polygon ? entity.polygon : null,
                  locality: entity.locality ? entity.locality : null,
                  place: entity.place ? entity.place : null,
                  point_latitude: entity.point_latitude ? entity.point_latitude : null,
                  point_longitude: entity.point_longitude ? entity.point_longitude : null
                };
              });
            if (uploadableObject.related_data.doi_geolocation.length === 0) uploadableObject.related_data.doi_geolocation = null;
          } else uploadableObject.related_data.doi_geolocation = null;

          if (this.isNotEmpty(this.relatedData.doi_related_identifier)) {
            let clonedData = cloneDeep(this.relatedData.doi_related_identifier);
            uploadableObject.related_data.doi_related_identifier = clonedData
              .filter(entity => this.isNotEmpty(entity.identifier_type))
              .map((entity) => {
                return {
                  identifier_type: entity.identifier_type,
                  relation_type: entity.relation_type ? entity.relation_type : null,
                  remarks: entity.remarks ? entity.remarks : null,
                  value: entity.value ? entity.value : null
                };
              });
            if (uploadableObject.related_data.doi_related_identifier.length === 0) uploadableObject.related_data.doi_related_identifier = null;
          } else uploadableObject.related_data.doi_related_identifier = null;

          if (this.isNotEmpty(this.relatedData.doi_date)) {
            let clonedData = cloneDeep(this.relatedData.doi_date);
            uploadableObject.related_data.doi_date = clonedData
            // .filter(entity => this.isNotEmpty(entity.date))
              .map((entity) => {
                return {
                  date: entity.date,
                  date_type: entity.date_type ? entity.date_type : null,
                  remarks: entity.remarks ? entity.remarks : null,
                };
              });
            if (uploadableObject.related_data.doi_date.length === 0) uploadableObject.related_data.doi_date = null;
          } else uploadableObject.related_data.doi_date = null;
        }

        console.log('This object is sent in string format:');
        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
      },

      fillAutocompleteFields(obj) {
        this.doi.resource_type = {id: obj.resource_type, value: obj.resource_type__value}
        this.doi.title_translated_language = {
          id: obj.title_translated_language,
          value: obj.title_translated_language__value,
          value_en: obj.title_translated_language__value_en
        }
        this.doi.owner = {id: obj.owner, agent: obj.owner__agent}
        this.doi.language = {id: obj.language, value: obj.language__value, value_en: obj.language__value_en}
        this.doi.copyright_agent = {id: obj.copyright_agent, agent: obj.copyright_agent__agent}
        this.doi.licence = {id: obj.licence, licence: obj.licence__licence, licence_en: obj.licence__licence_en}

        // Filling related data, doing it here because there is only 1 reference and 1 dataset
        // Reference and Dataset are direct links and should be added without relatedData object.
        this.doi.reference = {id: obj.reference, reference: obj.reference__reference}
        this.doi.dataset = {id: obj.dataset, name: obj.dataset__name, name_en: obj.dataset__name_en}
      },

      fillRelatedDataAutocompleteFields(obj) {
        if (this.isNotEmpty(obj.attachment)) obj.attachment = {
          id: obj.attachment,
          original_filename: obj.attachment__original_filename
        };
        if (this.isNotEmpty(obj.agent_type)) obj.agent_type = {id: obj.agent_type, value: obj.agent_type__value};
        if (this.isNotEmpty(obj.agent)) obj.agent = {id: obj.agent, agent: obj.agent__agent};
        if (this.isNotEmpty(obj.identifier_type)) obj.identifier_type = {
          id: obj.identifier_type,
          value: obj.identifier_type__value
        };
        if (this.isNotEmpty(obj.relation_type)) obj.relation_type = {
          id: obj.relation_type,
          value: obj.relation_type__value
        };
        if (this.isNotEmpty(obj.locality)) obj.locality = {
          id: obj.locality,
          locality: obj.locality__locality,
          locality_en: obj.locality__locality_en
        };
        if (this.isNotEmpty(obj.date_type)) obj.date_type = {id: obj.date_type, value: obj.date_type__value};

        return obj;
      },

      unformatRelatedDataAutocompleteFields(obj, objectID) {
        let newObject = cloneDeep(obj);

        if (objectID) newObject.id = objectID;

        if (this.isNotEmpty(obj.attachment)) {
          newObject.attachment = obj.attachment.id;
          newObject.attachment__original_filename = obj.attachment.original_filename;
        }

        if (this.isNotEmpty(obj.agent_type)) {
          newObject.agent_type = obj.agent_type.id;
          newObject.agent_type__value = obj.agent_type.value;
        }

        if (this.isNotEmpty(obj.agent)) {
          newObject.agent = obj.agent.id;
          newObject.agent__agent = obj.agent.agent;
        }
        if (this.isNotEmpty(obj.identifier_type)) {
          newObject.identifier_type = obj.identifier_type.id;
          newObject.identifier_type__value = obj.identifier_type.value;
        }
        if (this.isNotEmpty(obj.relation_type)) {
          newObject.relation_type = obj.relation_type.id;
          newObject.relation_type__value = obj.relation_type.value;
        }
        if (this.isNotEmpty(obj.locality)) {
          newObject.locality = obj.locality.id;
          newObject.locality__locality = obj.locality.locality;
          newObject.locality__locality_en = obj.locality.locality_en;
        }
        if (this.isNotEmpty(obj.date_type)) {
          newObject.date_type = obj.date_type.id;
          newObject.date_type__value = obj.date_type.value;
        }

        return newObject
      },

      loadRelatedData(object, doi = null) {
        let query;

        if (object === 'reference' && doi !== null && doi.reference !== null && doi.reference.id !== null) {
          this.relatedData.count[object] = 1;
          this.relatedData[object] = {
            id: doi.reference__id,
            reference: doi.reference__reference
          };
          this.setBlockVisibility(object, this.relatedData.count[object]);
          return;
        } else if (object === 'dataset' && doi !== null && doi.dataset !== null && doi.dataset.id !== null) {
          this.relatedData.count[object] = 1;
          this.relatedData[object] = {
            id: doi.dataset__id,
            name: doi.dataset__name,
            name_en: doi.dataset__name_en
          };
          this.setBlockVisibility(object, this.relatedData.count[object]);
          return;
        } else if (object === 'attachment_link') {
          query = fetchDoiAttachment(this.$route.params.id, this.relatedData.searchParameters.attachment_link)
        } else if (object === 'doi_related_identifier') {
          query = fetchDoiRelatedIdentifier(this.$route.params.id, this.relatedData.searchParameters.doi_related_identifier)
        } else if (object === 'doi_geolocation') {
          query = fetchDoiGeolocation(this.$route.params.id, this.relatedData.searchParameters.doi_geolocation)
        } else if (object === 'doi_agent') {
          query = fetchDoiAgent(this.$route.params.id, this.relatedData.searchParameters.doi_agent)
        } else if (object === 'doi_date') {
          query = fetchDoiDate(this.$route.params.id, this.relatedData.searchParameters.doi_date)
        }

        // Dataset and Reference are direct links and do not need extra request.
        if (object !== 'dataset' && object !== 'reference') {
          return new Promise(resolve => {
            query.then(response => {
              this.relatedData.count[object] = response.body.count;
              this.relatedData[object] = this.handleResponse(response)
              resolve(true)
            });
          });
        }
      },

      setBlockVisibility(object, count) {
        if (object === 'reference' || object === 'dataset') this.block.referenceAndDataset = count > 0
      },

      //check required fields for related data
      checkRequiredFields(tab, tabData) {
        if (tab === 'doi_agent') {
          return !this.isNotEmpty(tabData.name)
        }
      },

      formatRelatedData(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload);
        uploadableObject.doi = this.doi.id;

        if (this.isNotEmpty(uploadableObject.attachment)) {
          uploadableObject.attachment = uploadableObject.attachment.id ? uploadableObject.attachment.id : uploadableObject.attachment;
        }
        if (this.isNotEmpty(uploadableObject.agent_type)) {
          uploadableObject.agent_type = uploadableObject.agent_type.id ? uploadableObject.agent_type.id : uploadableObject.agent_type;
        }
        if (this.isNotEmpty(uploadableObject.agent)) {
          uploadableObject.agent = uploadableObject.agent.id ? uploadableObject.agent.id : uploadableObject.agent;
        }
        if (this.isNotEmpty(uploadableObject.identifier_type)) {
          uploadableObject.identifier_type = uploadableObject.identifier_type.id ? uploadableObject.identifier_type.id : uploadableObject.identifier_type;
        }
        if (this.isNotEmpty(uploadableObject.relation_type)) {
          uploadableObject.relation_type = uploadableObject.relation_type.id ? uploadableObject.relation_type.id : uploadableObject.relation_type;
        }
        if (this.isNotEmpty(uploadableObject.locality)) {
          uploadableObject.locality = uploadableObject.locality.id ? uploadableObject.locality.id : uploadableObject.locality;
        }
        if (this.isNotEmpty(uploadableObject.date_type)) {
          uploadableObject.date_type = uploadableObject.date_type.id ? uploadableObject.date_type.id : uploadableObject.date_type;
        }
        if (this.isNotEmpty(uploadableObject.datacite_updated)) uploadableObject.datacite_updated = this.formatDateForUpload(objectToUpload.datacite_updated, false);

        if (this.isNotEmpty(uploadableObject.datacite_created)) uploadableObject.datacite_created = this.formatDateForUpload(objectToUpload.datacite_created, false);

        console.log('This object is sent in string format (related_data):');
        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
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
              if (typeof agent.agent !== 'undefined' && agent.agent !== null) {
                creators += agent.agent__surename + ', ' + agent.agent__forename + '; '
              }
            }
          })

          if (creators.length > 0) {
            creators = creators.trim().slice(0, -1)
            this.doi.creators = creators;
          }
        }
      },

      /**
       *
       */
      handleCheckDoiResponse(response) {
        if (response.status === 200) {
          let dataCiteResponse = response.body.results

          if (typeof dataCiteResponse !== 'undefined' && dataCiteResponse.length > 0) {

            // SUCCESSFUL RESPONSE
            if (dataCiteResponse[0].success) {

              // Checking if metadata needs an update
              if (typeof dataCiteResponse[0].update_datacite_metadata !== 'undefined') {
                if (dataCiteResponse[0].update_datacite_metadata) {
                  this.showDataCiteButton = true
                  this.showUpdateMessage = true
                  toastInfo({text: this.$t('doi.dataCiteNeedsUpdate'), timeout: 7000})
                }
              }

              // Checking if url needs an update
              if (typeof dataCiteResponse[0].update_datacite_url !== 'undefined') {
                if (dataCiteResponse[0].update_datacite_url) {
                  this.showDataCiteUrlButton = true
                  toastInfo({text: this.$t('doi.dataCiteUrlNeedsUpdate'), timeout: 7000})
                }
              }
              // UNSUCCESSFUL RESPONSE, but DOI is in SARV database
            } else if (dataCiteResponse[0].is_in_sarv) {

              // Checking if DOI is not in DataCite database (can be registered)
              if (!dataCiteResponse[0].is_in_datacite) {
                this.showDataCiteButton = true
                this.showUpdateMessage = false
                if (this.$i18n.locale === 'ee') toastInfo({text: dataCiteResponse[0].error_et, timeout: 7000})
                else toastInfo({text: dataCiteResponse[0].error, timeout: 7000})
              }
            } else {
              // Unsuccessful response and doi doesn't exist in sarv database (if not in sarv then it can't be in datacite)
              if (this.$i18n.locale === 'ee') toastInfo({text: dataCiteResponse[0].error_et, timeout: 7000})
              else toastInfo({text: dataCiteResponse[0].error, timeout: 7000})
            }

          }

        }
      },


      /* DOI METADATA START */

      setCurrentTimeToDataCiteDateFields() {
        let UTCString = (new Date()).toUTCString();
        if (!this.doi.datacite_created) this.doi.datacite_created = UTCString;
        this.doi.datacite_updated = UTCString;
      },

      /**
       * Register/Update metadata to/in DataCite server. Basically just send 'register' function to API and then API updates or registers DOI
       */
      registerMetadata() {
        if (this.validate('doi')) {
          if (confirm(this.showUpdateMessage ? this.$t('doi.doiDataCiteUpdateConfirmation') : this.$t('doi.doiDataCiteRegisterConfirmation'))) {
            this.sendingData = true

            fetchRegisterMetadataToDataCite(this.$route.params.id).then(response => {
              if (response.status === 200) {
                if (typeof response.body.results !== 'undefined' && response.body.results.length > 0) {
                  if (response.body.results[0].success) {
                    toastSuccess({
                      text: this.$t('doi.dataciteMetadataUpdated') + ' DataCite response: ' + response.body.results[0].content,
                      timeout: 5000
                    })
                    this.setCurrentTimeToDataCiteDateFields();
                    this.showMetadataButton = false
                    this.showMetadataUpdateMessage = false
                    this.checkDoiUrl()
                  } else {
                    toastError({text: this.$t('doi.dataciteMetadataUpdateFailed')})
                  }
                }
              }
              this.sendingData = false
            })

          } else toastInfo({text: this.$t('messages.userCancelled')})
        } else toastError({text: this.$t('messages.checkForm')})
      },

      registerDoiUrl() {
        if (this.validate('doi')) {
          if (confirm(this.showUpdateMessage ? this.$t('doi.doiDataCiteUpdateConfirmation') : this.$t('doi.doiDataCiteRegisterConfirmation'))) {
            this.sendingData = true

            fetchRegisterDoiUrlToDataCite(this.$route.params.id).then(response => {
              if (response.status === 200) {
                if (typeof response.body.results !== 'undefined' && response.body.results.length > 0) {
                  if (response.body.results[0].success) {
                    toastSuccess({
                      text: this.$t('doi.dataciteUrlUpdated') + ' DataCite response: ' + response.body.results[0].content,
                      timeout: 5000
                    })
                    this.showDoiUrlButton = false
                    this.showDoiUrlUpdateMessage = false
                  } else {
                    toastError({text: this.$t('doi.dataciteUrlUpdateFailed')})
                  }
                }
              }
              this.sendingData = false
            })

          } else toastInfo({text: this.$t('messages.userCancelled')})
        } else toastError({text: this.$t('messages.checkForm')})
      },

      // Checks metadata from DataCite
      checkMetadata() {
        fetchCheckMetadataInDataCite(this.$route.params.id).then(response => {
          if (response.status === 200) {
            if (typeof response.body.results !== 'undefined' && response.body.results.length > 0) {
              if (response.body.results[0].success) {
                if (response.body.results[0].doi_metadata_needs_update) {
                  this.showMetadataButton = true
                  this.showMetadataUpdateMessage = true
                  this.sarvXML = response.body.results[0].sarv_xml
                  this.dataciteXML = response.body.results[0].datacite_xml
                  toastInfo({text: this.$t('doi.dataciteMetadataNeedsUpdate')})
                } else {
                  this.showMetadataButton = false
                  this.showMetadataUpdateMessage = false
                  this.sarvXML = response.body.results[0].sarv_xml
                  this.dataciteXML = response.body.results[0].datacite_xml
                  if (typeof response.body.results[0].error !== 'undefined' && response.body.results[0].error_et !== 'undefined') {
                    if (this.$i18n.locale === 'ee') toastInfo({text: response.body.results[0].error_et})
                    else toastInfo({text: response.body.results[0].error})
                  }

                }
              } else if (response.body.results[0].error_code === 404) {
                this.showMetadataButton = true
                this.showMetadataUpdateMessage = false
              } else {
                this.showMetadataButton = false
                this.showMetadataUpdateMessage = false
              }
            }
          }
        });
      },

      // Checks DOI url from DataCite
      checkDoiUrl() {
        fetchCheckDoiUrlInDataCite(this.$route.params.id).then(response => {
          if (response.status === 200) {
            if (typeof response.body.results !== 'undefined' && response.body.results.length > 0) {
              if (response.body.results[0].success) {
                if (response.body.results[0].doi_url_needs_update) {
                  this.showDoiUrlButton = true
                  this.showDoiUrlUpdateMessage = true
                  this.doiURL = response.body.results[0].doi_url
                  this.dataciteURL = response.body.results[0].datacite_url
                }
              } else if (response.body.results[0].error_code === 204) {
                this.showDoiUrlButton = true
                this.showDoiUrlUpdateMessage = false
              } else {
                this.showDoiUrlButton = false
                this.showDoiUrlUpdateMessage = false
              }
            }
          }
        });
      },

      /* DOI METADATA END */


      assignEgfFieldsToDoiObject(egfDoiObject) {
        if (this.isNotEmpty(egfDoiObject)) {
          this.doi.resource_type = { id: 12, value: 'Text' };
          this.doi.resource = 'Report';
          this.doi.publisher = 'Geoloogiafond';
          this.doi.version = '1.0';
          this.doi.licence = {
            id: 4,
            licence: 'CC BY-SA',
            licence_en: 'CC BY-SA'
          };
          this.doi.subjects = ''; // Needed because otherwise undefined will be written also.

          if (egfDoiObject.creator) {
            let creatorsList = [];
            if (egfDoiObject.creator.includes(',')) {
              // this.doi.creators = egfDoiObject.creator.replace(/,/g, ';');
              creatorsList = egfDoiObject.creator.split(',');
            } else {
              // this.doi.creators = egfDoiObject.creator;
              creatorsList.push(egfDoiObject.creator);
            }

            let formattedCreatorsList = [];
            creatorsList.forEach(creator => {
              let firstName = creator.substring(0, creator.lastIndexOf('.') + 1);
              let lastName = creator.substring(creator.lastIndexOf('.') + 1);
              let formattedName = `${lastName.trim()}, ${firstName.trim()}`;
              formattedCreatorsList.push(formattedName);

              this.relatedData.doi_agent.push({
                name: formattedName,
                agent_type: 1,
                agent_type__value: 'Creator',
              })
            });

            this.doi.creators = formattedCreatorsList.join('; ')
          }
          if (egfDoiObject.title) {
            this.doi.title_translated = egfDoiObject.title;
            this.doi.title_translated_language = {
              id: 4,
              value: 'eesti',
              value_en: 'Estonian'
            }
          }
          if (egfDoiObject.title_orig) this.doi.title = egfDoiObject.title_orig;
          if (egfDoiObject.date) this.doi.publication_year = egfDoiObject.date;
          if (egfDoiObject.tags) this.doi.subjects += egfDoiObject.tags;
          if (egfDoiObject.field) this.doi.subjects += this.doi.subjects.length > 0 ? (', ' + egfDoiObject.field) : egfDoiObject.field;
          if (egfDoiObject.deposit) this.doi.subjects += this.doi.subjects.length > 0 ? (', ' + egfDoiObject.deposit) : egfDoiObject.deposit;
          if (egfDoiObject.description) this.doi.abstract = egfDoiObject.description;
          if (egfDoiObject.funder) {
            let funderList = [];
            if (egfDoiObject.funder.includes(',')) funderList = egfDoiObject.funder.split(',');
            else funderList.push(egfDoiObject.funder);

            funderList.forEach(funder => {
              this.relatedData.doi_agent.push({
                name: funder,
                agent_type: 10,
                agent_type__value: 'Funder',
              })
            })
          }
          if (egfDoiObject.performer) {
            let performerList = [];
            if (egfDoiObject.performer.includes(',')) performerList = egfDoiObject.performer.split(',');
            else performerList.push(egfDoiObject.performer);

            performerList.forEach(performer => {
              this.relatedData.doi_agent.push({
                name: performer,
                agent_type: 11,
                agent_type__value: 'HostingInstitution',
              })
            })
          }
          if (egfDoiObject.emk_protocol) this.doi.subjects += this.doi.subjects.length > 0 ? (', ' + egfDoiObject.emk_protocol) : egfDoiObject.emk_protocol;
          if (egfDoiObject.geometry) {
            if (egfDoiObject.geometry.coordinates && egfDoiObject.geometry.coordinates.length > 0) {
              if (egfDoiObject.geometry.type === 'Polygon') {
                let coordinates = JSON.stringify(egfDoiObject.geometry.coordinates[0]);
                this.relatedData.doi_geolocation.push({
                  polygon: coordinates
                });
              } else if (egfDoiObject.geometry.type === 'MultiPolygon') {
                egfDoiObject.geometry.coordinates.forEach(coordinates => {
                  this.relatedData.doi_geolocation.push({
                    polygon: JSON.stringify(coordinates[0])
                  })
                });
              }
            }
          }
        }
      },

      addCreatorsToRelatedData() {
        let creators = this.doi.creators;
        let listOfCreators = [];

        if (creators && creators.trim().length > 0) {
          if (creators.includes(';')) listOfCreators = creators.split(';');
          else listOfCreators.push(creators)
        }

        if (listOfCreators.length > 0) {
          listOfCreators.forEach(creator => {
            let doiAgentObject = {};
            if (creator.trim().length > 0) {
              fetchAgentUsingName(creator.trim()).then(response => {
                let agentObject = this.handleResponse(response)[0];

                if (this.isNotEmpty(agentObject)) {
                  doiAgentObject.name = agentObject.agent;
                  doiAgentObject.orcid = agentObject.orcid;
                  doiAgentObject.affiliation = agentObject.institution__institution_name_en;
                  doiAgentObject.agent = agentObject.id;
                  doiAgentObject.agent__agent = agentObject.agent
                } else {
                  doiAgentObject.name = creator.trim()
                }

                this.relatedData['doi_agent'].push(doiAgentObject)
              }, errResponse => {
                doiAgentObject.name = creator.trim();
                this.relatedData['doi_agent'].push(doiAgentObject)
              });
            }
          });
        } else {
          this.relatedData['doi_agent'] = []
        }

      }
    },
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

  @media (min-width: 768px) {
    .px-15px {
      padding-left: 30px;
      padding-right: 30px;
    }
  }
</style>
