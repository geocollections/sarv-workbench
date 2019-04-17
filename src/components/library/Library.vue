<template>
  <div class="library">
    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- AUTHOR AND YEAR -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`author`">{{ $t('library.author_txt') }}:</label>
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
                         @search-change="autcompleteAgentSearch"
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

    <!-- ABSTRACT AND ABSTRACT_EN -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`abstract`">{{ $t('library.abstract') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="abstract" v-model="library.abstract" type="text" size="sm"
                         :rows="1" :max-rows="20"></b-form-textarea>
      </div>


      <div class="col-sm-2">
        <label :for="`abstract_en`">{{ $t('library.abstract_en') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="abstract_en" v-model="library.abstract_en" type="text" size="sm"
                         :rows="1" :max-rows="20"></b-form-textarea>
      </div>
    </div>

    <!-- LIBRARY MEMBERS -->
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">
        {{ $t('library.libraryAgent') }}
        <font-awesome-icon icon="user-friends"/></legend>
      <div class="row">

        <div class="col-11 mb-2 mr-0">
          <vue-multiselect v-model="relatedData.library_agent"
                           id="library_agent"
                           :searchable="true" @search-change="autcompleteLibraryAgentSearch"
                           :options="autocomplete.library_agent"
                           :loading="autocomplete.loaders.library_agent"
                           :multiple="true"
                           track-by="id"
                           :custom-label="customLabelForLibraryMembers"
                           :open-direction="'bottom'"
                           :placeholder="$t('add.inputs.autocomplete')">
            <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
          </vue-multiselect>
        </div>

        <div class="col-1 mb-2 ml-0 pl-0">
          <button class="btn btn-outline-danger" :title="$t('add.inputs.keywordsRemove')" :disabled="!isDefinedAndNotEmpty(relatedData.library_agent)"
                  @click="relatedData.library_agent = []">
            <font-awesome-icon icon="trash-alt"></font-awesome-icon>
          </button>
        </div>
      </div>
    </fieldset>

    <!-- REFERENCE LIST VIEW -->
    <fieldset class="border p-2 mb-2" v-if="$route.meta.isEdit">
      <legend class="w-auto" style="font-size: large;">
        {{ $t('library.relatedTables.libraryReference') }}
        <font-awesome-icon icon="list-ol" />
      </legend>

      <div class="row">
        <div class="col">
          <b-form-checkbox class="mb-2" v-model="showListView" name="check-button" switch>
            {{ $t('library.showListView') }}
          </b-form-checkbox>
        </div>
      </div>

      <library-reference-list-view v-if="showListView" :data="relatedData.library_reference"></library-reference-list-view>
    </fieldset>

    <!-- SHOWING RELATED_DATA -->
    <div class="row" v-if="$route.meta.isEdit">
      <div class="col mt-4">
        <ul class="nav nav-tabs tab-links mb-3" style="flex-wrap: nowrap !important">
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('library_reference')" class="nav-link" :class="{ active: activeTab === 'library_reference' }">
              {{ $t('library.relatedTables.libraryReference') }}
            </a>
          </li>
        </ul>
        <library-reference :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"/>
        <div class="row mb-4 pt-1">
          <!--<div class="col">-->
          <!--<button class="btn float-left btn-sm btn-outline-success mr-2 mb-2 pl-4 pr-4"-->
          <!--:disabled="sendingData" @click="addRelatedData(activeTab)">{{$t('add.newRelation')}}</button>-->
          <!--</div>-->
          <div class="col pagination-center" v-if="relatedData[activeTab] !== null && relatedData[activeTab].length > 0">
            <b-pagination
              size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="relatedData.count[activeTab]" v-model="relatedData.page[activeTab]" :per-page="100">
            </b-pagination>
          </div>
        </div>
      </div>
    </div>

    <!-- CHECKBOXES -->
    <div class="row">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="library.is_private" :value="1" :unchecked-value="0">
          {{ $t('library.private') }}
        </b-form-checkbox>
      </div>
    </div>

    <div class="row mt-3 mb-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false, 'library')">
          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}</button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(true, 'library')">
          {{ $t($route.meta.isEdit? 'edit.buttons.saveAndContinue':'add.buttons.addAnother') }}</button>
        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="$route.meta.isEdit ? leaveFromEditView('library') : reset('library')">
          {{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}</button>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import VueMultiselect from 'vue-multiselect'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faTimes} from '@fortawesome/free-solid-svg-icons'
  import { fetchLibrary, fetchLibraries, fetchLibraryReference, fetchLibraryAgent } from "../../assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'
  import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";
  import formManipulation  from './../mixins/formManipulation'
  import autocompleteFieldManipulation  from './../mixins/autocompleFormManipulation'
  import copyForm  from './../mixins/copyForm'
  import LibraryReference from "./relatedTables/LibraryReference";
  import LibraryReferenceListView from "./relatedTables/LibraryReferenceListView";

  library.add(faTimes)

  export default {
    name: "Library",
    components: {
      LibraryReferenceListView,
      LibraryReference,
      FontAwesomeIcon,
      VueMultiselect,
      Spinner,
    },
    mixins: [formManipulation,copyForm,autocompleteFieldManipulation],

    data() { return this.setInitialData() },

    created() { this.loadFullInfo() },

    watch: {
      '$route.params.id': {
        handler: function (newval, oldval) {
          this.reloadData()
        },
        deep: true
      },
    },

    methods: {

      setTab(type) { this.activeTab = type },

      setInitialData() {
        return {
          tabs: ['library_reference'],
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
          showListView: false,
        }
      },

      reloadData() {
        Object.assign(this.$data, this.setInitialData());
        this.loadFullInfo()
      },

      loadFullInfo() {
        fetchLibraryAgent(this.$route.params.id).then(response => {
          this.relatedData.library_agent = this.handleResponse(response);
        })

        if(this.$route.meta.isEdit) {
          this.sendingData = true;
          fetchLibrary(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);
            if(handledResponse.length > 0) {
              this.library = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.library)
              this.removeUnnecessaryFields(this.library,this.copyFields);
              this.$emit('data-loaded',this.library)
              this.$emit('set-object','library')
              this.sendingData = false;
              this.getListRecords('library')
            } else {
              this.sendingData = false;
            }
          });

          // FETCH FIRST TAB RELATED DATA
          this.tabs.forEach(entity => {
            this.loadRelatedData(entity);
          });

          this.$on('tab-changed',this.setTab);

          this.$on('related-data-modified',this.editRelatedData);
          this.$on('related-data-added',this.addRelatedData);
          this.$on('edit-row',this.editRow);
          this.$on('allow-remove-row',this.allowRemove);

          this.$emit('related-data-info',this.tabs);

          this.setActiveTab('library_reference')
        }
      },

      setDefaultRelatedData(){
        return {
          library_reference:[],
          library_agent: [],
          copyFields: {
            library_reference: ['reference__reference','keywords','remarks'],
          },
          insert: {
            library_reference: {}
          },
          page : {
            library_reference: 1,
            library_agent: 1,
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
        if (objectToUpload.is_private !== null) uploadableObject.is_private = objectToUpload.is_private === true ? '1' : '0';


        console.log('This object is sent in string format:')
        console.log(uploadableObject)
        return JSON.stringify(uploadableObject)
      },

      fillAutocompleteFields(obj){
        this.library.author = { agent: obj.author__agent, id: obj.author }
      },

      fillRelatedDataAutocompleteFields(obj){
        obj.reference = { reference:obj.reference__reference, id:obj.reference}
        // obj.library_agent = { agent: obj.agent__agent, id: obj.agent }
        return obj
      },

      loadRelatedData(object){
        let query;

        if(object === 'library_reference') {
          query = fetchLibraryReference(this.$route.params.id, this.relatedData.page.library_reference)
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
      checkRequiredFields(type){

      },

      formatRelatedData(objectToUpload)  {
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
        console.log(localStorageData)
        return new Promise((resolve) => {
          resolve(fetchLibraries(params))
        });
      },

      customLabelForLibraryMembers(option) {
        return this.isDefinedAndNotNull(option.agent__agent) ? `${option.agent__agent}` : `${option.agent}`
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

<style scoped>

</style>
