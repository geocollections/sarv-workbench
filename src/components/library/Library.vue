<template>
  <div class="library">
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <fieldset class="border p-2 mb-2" id="block-info">
      <legend class="w-auto" :class="{ 'text-primary': !block.info }" @click="block.info = !block.info">
        {{ $t('library.generalInfo') }}
        <font-awesome-icon icon="project-diagram"/>
      </legend>

      <transition name="fade">
        <div v-if="block.info">

          <!-- AUTHOR AND YEAR -->
          <div class="row">
            <div class="col-sm-2">
              <label :for="`author`">{{ $t('library.author') }}:</label>
            </div>

            <div class="col-sm-4 mb-2">
              <vue-multiselect id="author" class="align-middle"
                               v-model="library.author"
                               deselect-label="Can't remove this value"
                               label="agent"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.agent"
                               :options="autocomplete.agent"
                               @search-change="$_autocompleteAgentSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :allow-empty="false"
                               :open-direction="'bottom'">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>


            <div class="col-sm-2">
              <label :for="`year`">{{ $t('library.year') }}:</label>
            </div>

            <div class="col-sm-4 mb-2">
              <b-form-input id="year" v-model="library.year" type="number"></b-form-input>
            </div>
          </div>

          <!-- AUTHORS -->
          <div class="row">
            <div class="col-sm-2">
              <label :for="`author_txt`">{{ $t('library.author_txt') }}:</label>
            </div>

            <div class="col-sm-10 mb-2">
              <b-form-input id="author_txt" v-model="library.author_txt" type="text"></b-form-input>
            </div>
          </div>

          <!-- TITLE -->
          <div class="row">
            <div class="col-sm-2">
              <label :for="`title`">{{ $t('library.title') }}:</label>
            </div>

            <div class="col-sm-10 mb-2">
              <b-form-input id="title" v-model="library.title" type="text"></b-form-input>
            </div>
          </div>

          <!-- TITLE_EN -->
          <div class="row">
            <div class="col-sm-2">
              <label :for="`title_en`">{{ $t('library.title_en') }}:</label>
            </div>

            <div class="col-sm-10 mb-2">
              <b-form-input id="title_en" v-model="library.title_en" type="text"></b-form-input>
            </div>
          </div>

          <!-- KEYWORDS -->
          <div class="row">
            <div class="col-sm-2">
              <label :for="`keywords`">{{ $t('library.keywords') }}:</label>
            </div>

            <div class="col-sm-10 mb-2">
              <b-form-input id="keywords" v-model="library.keywords" type="text"></b-form-input>
            </div>
          </div>

          <!-- ABSTRACT -->
          <div class="row">
            <div class="col-sm-2">
              <label :for="`abstract`">{{ $t('library.abstract') }}:</label>
            </div>

            <div class="col-sm-10 mb-2">
              <editor :data.sync="library.abstract"></editor>
            </div>
          </div>

          <!-- ABSTRACT_EN -->
          <div class="row">
            <div class="col-sm-2">
              <label :for="`abstract_en`">{{ $t('library.abstract_en') }}:</label>
            </div>

            <div class="col-sm-10 mb-2">
              <editor :data.sync="library.abstract_en"></editor>
            </div>
          </div>

        </div>
      </transition>

    </fieldset>

    <!-- LIBRARY MEMBERS -->
    <fieldset class="border p-2 mb-2" id="block-members">
      <legend class="w-auto" :class="{'text-primary': !block.members}" @click="block.members = !block.members">
        {{ $t('library.libraryAgent') }}
        <font-awesome-icon icon="user-friends"/>
      </legend>

      <transition name="fade">
        <div v-if="block.members">

          <div class="row">

            <!-- Prop: internal-search must be false otherwise it also filters by label -->
            <div class="col-10 col-md-11">
              <vue-multiselect v-model="relatedData.library_agent"
                               id="library_agent"
                               @search-change="$_autocompleteLibraryAgentSearch"
                               :options="autocomplete.library_agent"
                               :loading="autocomplete.loaders.library_agent"
                               :multiple="true"
                               track-by="id"
                               label="agent"
                               :internal-search="false"
                               :preserve-search="true"
                               :open-direction="'bottom'"
                               :placeholder="$t('add.inputs.autocomplete')">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-2 col-md-1 pl-0">
              <button class="btn btn-outline-danger" :title="$t('add.inputs.keywordsRemove')"
                      :disabled="!isDefinedAndNotEmpty(relatedData.library_agent)"
                      @click="relatedData.library_agent = []">
                <font-awesome-icon icon="trash-alt"></font-awesome-icon>
              </button>
            </div>
          </div>

        </div>
      </transition>

    </fieldset>

    <!-- SHOWING RELATED_DATA -->
    <div class="row" v-if="$route.meta.isEdit">
      <div class="col mt-4">
        <ul class="nav nav-tabs tab-links mb-3" style="flex-wrap: nowrap !important">

          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('library_reference')" class="nav-link"
               :class="{ active: activeTab === 'library_reference' }">
              {{ $t('library.relatedTables.libraryReference') }}
            </a>
          </li>

          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('library_reference_list')" class="nav-link"
               :class="{ active: activeTab === 'library_reference_list' }">
              {{ $t('library.relatedTables.libraryReferenceList') }}
              <font-awesome-icon icon="list-ol"/>
            </a>
          </li>

        </ul>

        <library-reference-list-view :data="relatedData.library_reference_list"
                                     :active-tab="activeTab"></library-reference-list-view>

        <div class="row" v-if="activeTab !== 'library_reference_list'">
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

        <library-reference :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                           v-on:related-data-added="addRelatedData"
                           v-on:related-data-modified="editRelatedData"
                           v-on:edit-row="editRow"
                           v-on:allow-remove-row="allowRemove"/>
      </div>
    </div>

    <!-- CHECKBOXES -->
    <div class="row mt-3">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="library.is_private" :value="1" :unchecked-value="0">
          {{ $t('library.private') }}
        </b-form-checkbox>
      </div>
    </div>

<!--    <div class="row mt-3 mb-3">-->
<!--      <div class="col">-->
<!--        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false, 'library', true)"-->
<!--                :title="$t('edit.buttons.saveAndLeave') ">-->
<!--          <font-awesome-icon icon="door-open"/>-->
<!--          {{ $t('edit.buttons.saveAndLeave') }}-->
<!--        </button>-->

<!--        <button class="btn btn-success mr-2 mb-2 pr-5 pl-5" :disabled="sendingData" @click="add(true, 'library', true)"-->
<!--                :title="$t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') ">-->
<!--          <font-awesome-icon icon="save"/>-->
<!--          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}-->
<!--        </button>-->

<!--        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="reset('library', $route.meta.isEdit)"-->
<!--                :title="$t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') ">-->
<!--          <font-awesome-icon icon="ban"/>-->
<!--          {{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}-->
<!--        </button>-->
<!--      </div>-->
<!--    </div>-->

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import {library} from '@fortawesome/fontawesome-svg-core'
  import VueMultiselect from 'vue-multiselect'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
  import {faTimes} from '@fortawesome/free-solid-svg-icons'
  import {
    fetchLibrary,
    fetchLibraryReference,
    fetchLibraryAgent,
    fetchLibrariesFromLibraryAgent
  } from "../../assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'
  import formManipulation from '../../mixins/formManipulation'
  import autocompleteMixin from '../../mixins/autocompleteMixin'
  import copyForm from '../../mixins/copyForm'
  import LibraryReference from "./relatedTables/LibraryReference";
  import LibraryReferenceListView from "./relatedTables/LibraryReferenceListView";
  import formSectionsMixin from "../../mixins/formSectionsMixin";
  import Editor from "../partial/editor/Editor";
  import {mapState} from "vuex";

  library.add(faTimes);

  export default {
    name: "Library",
    components: {
      Editor,
      LibraryReferenceListView,
      LibraryReference,
      FontAwesomeIcon,
      VueMultiselect,
      Spinner,
    },
    mixins: [formManipulation, copyForm, autocompleteMixin, formSectionsMixin],

    data() {
      return this.setInitialData()
    },

    created() {
      // USED BY SIDEBAR
      if (this.$route.meta.isEdit) {
        const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
        let params = this.isDefinedAndNotNull(searchHistory) && searchHistory.hasOwnProperty('id') && searchHistory !== 'fallbackValue' && searchHistory !== '[object Object]' ? searchHistory : this.searchParameters;
        this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', {
          searchHistory: 'librarySearchHistory',
          defaultSearch: this.setDefaultSearchParameters(),
          search: params,
          request: 'FETCH_LIBRARIES',
          title: 'header.libraries',
          object: 'library',
          field: 'library__title_en',
          block: this.block,
          agent: this.currentUser
        });
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
      ...mapState(["currentUser"])
    },

    methods: {

      setTab(type) {
        this.activeTab = type
      },

      setInitialData() {
        return {
          tabs: ['library_reference', 'library_reference_list'],
          searchHistory: 'librarySearchHistory',
          activeTab: 'library_reference',
          relatedData: this.setDefaultRelatedData(),
          copyFields: ['id', 'author', 'author_txt', 'year', 'title', 'title_en', 'keywords', 'abstract', 'abstract_en', 'is_private'],
          autocomplete: {
            loaders: {
              agent: false,
              reference: false,
              library_agent: false,
            },
            agent: [],
            reference: [],
            library_agent: [],
          },
          requiredFields: [],
          library: {},
          previousRecord: {},
          nextRecord: {},
          searchParameters: this.setDefaultSearchParameters(),
          block: {info: true, members: true},
          // editor: BalloonEditor,
          // editorConfig: {}
        }
      },

      reloadData() {
        Object.assign(this.$data, this.setInitialData());
        this.loadFullInfo()
      },

      loadFullInfo() {
        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          fetchLibrary(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);
            if (handledResponse.length > 0) {
              this.library = this.handleResponse(response)[0];
              if (this.library.abstract === null || typeof this.library.abstract === 'undefined') this.library.abstract = '';
              if (this.library.abstract_en === null || typeof this.library.abstract_en === 'undefined') this.library.abstract_en = '';
              this.fillAutocompleteFields(this.library)
              this.removeUnnecessaryFields(this.library, this.copyFields);
              this.$emit('data-loaded', this.library)
              this.$emit('set-object', 'library')
              this.sendingData = false;
              this.getListRecords('library')
            } else {
              this.sendingData = false;
            }
          });

          fetchLibraryAgent(this.$route.params.id).then(response => {
            let libraryAgent = this.handleResponse(response);
            this.relatedData.library_agent = libraryAgent.map(entity => {
              return {
                agent: entity.agent__agent,
                id: entity.agent
              }
            })
          });

          // FETCH FIRST TAB RELATED DATA
          this.tabs.forEach(entity => {
            // Skips library_reference_list because it is static view
            if (entity !== 'library_reference_list') {
              this.loadRelatedData(entity);
            }
          });

          this.$on('tab-changed', this.setTab);

          this.$emit('related-data-info', this.tabs);

          this.setActiveTab('library_reference')
        }
      },

      setDefaultRelatedData() {
        return {
          library_reference: [],
          library_reference_list: [],
          library_agent: [],
          copyFields: {
            library_reference: ['reference', 'keywords', 'remarks', 'sort'],
          },
          insert: {
            library_reference: {},
          },
          page: {
            library_reference: 1,
            library_agent: 1,
          },
          paginateBy: {
            library_reference: 25,
          },
          count: {
            library_reference: 0,
            library_agent: 0,
          }
        }
      },

      formatDataForUpload(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload)
        if (this.isDefinedAndNotNull(objectToUpload.author)) uploadableObject.author = objectToUpload.author.id
        if (this.isDefinedAndNotNull(objectToUpload.is_private)) uploadableObject.is_private = objectToUpload.is_private === 1 ? '1' : '0';

        // Adding related data
        uploadableObject.related_data = {}
        uploadableObject.related_data.agent = this.relatedData.library_agent

        console.log('This object is sent in string format:')
        console.log(uploadableObject)
        return JSON.stringify(uploadableObject)
      },

      fillAutocompleteFields(obj) {
        this.library.author = {agent: obj.author__agent, id: obj.author}
      },

      fillRelatedDataAutocompleteFields(obj) {
        console.log(obj)
        obj.reference = {reference: obj.reference__reference, id: obj.reference}
        // obj.library_agent = { agent: obj.agent__agent, id: obj.agent }
        return obj
      },

      loadRelatedData(object) {
        let query;

        if (object === 'library_reference') {
          query = fetchLibraryReference(this.$route.params.id, this.relatedData.page.library_reference, this.relatedData.paginateBy.library_reference)
        }
        if (object === 'library_reference_list') {
          if (this.relatedData.library_reference_list.length === 0) {
            // Get all records, maybe in the future add pagination and stuff
            query = fetchLibraryReference(this.$route.params.id, this.relatedData.page.library_reference, 1000)
          } else {
            // Do nothing
            return
          }
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
      checkRequiredFields(type) {

      },

      formatRelatedData(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload);
        uploadableObject.library = this.library.id;

        if (this.isDefinedAndNotNull(uploadableObject.reference)) {
          uploadableObject.reference = uploadableObject.reference.id ? uploadableObject.reference.id : uploadableObject.reference;
        }

        console.log('This object is sent in string format (related_data):')
        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
      },


      fetchList(localStorageData) {
        let params = this.isDefinedAndNotNull(localStorageData) && localStorageData !== 'fallbackValue' ? localStorageData : this.searchParameters;
        return new Promise((resolve) => {
          resolve(fetchLibrariesFromLibraryAgent(params, this.$parent.agent))
        });
      },

      setDefaultSearchParameters() {
        return {
          author_txt: null,
          year: null,
          title: null,
          reference: null,
          id: null,
          page: 1,
          paginateBy: 100,
          orderBy: '-id',
        }
      },
    }
  }
</script>

<style>
  label {
    margin: 5px 0 0 0;
    color: #999;
    font-size: 0.8rem;
  }
</style>
