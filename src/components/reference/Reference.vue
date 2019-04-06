<template>
  <div class="reference">
    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- REFERENCE and YEAR -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`reference`">{{ $t('reference.reference') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="reference" v-model="reference.reference" :state="isDefinedAndNotNull(reference.reference)" type="text"></b-form-input>
      </div>


      <div class="col-sm-2 lbl-right">
        <label :for="`year`">{{ $t('reference.year') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="year" v-model="reference.year" :state="isDefinedAndNotNull(reference.year)" type="number"></b-form-input>
      </div>
    </div>

    <!-- AUTHOR -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`author`">{{ $t('reference.author') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-input id="author" v-model="reference.author" :state="isDefinedAndNotNull(reference.author)" type="text"></b-form-input>
      </div>
    </div>


    <!-- TITLE -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`title`">{{ $t('reference.title') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea id="title" v-model="reference.title" :state="isDefinedAndNotNull(reference.title)" type="text"
                         :rows="1" :max-rows="4"></b-form-textarea>
      </div>
    </div>

    <!-- TITLE ORIGINAL -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`title_original`">{{ $t('reference.titleOriginal') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea id="title_original" v-model="reference.title_original" type="text"
                         :rows="1" :max-rows="4"></b-form-textarea>
      </div>
    </div>

    <!-- TYPE, LANGUAGE -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`type`">{{ $t('reference.type') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="reference.type"
                         id="type"
                         :options="autocomplete.types"
                         track-by="id"
                         :label="commonLabel"
                         :loading="autocomplete.loaders.agent"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2 lbl-right">
        <label :for="`language`">{{ $t('reference.language') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="reference.language"
                         id="language"
                         :options="autocomplete.languages"
                         track-by="id"
                         :label="commonLabel"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- JOURNAL -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`journal`">{{ $t('reference.journal') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="reference.journal"
                         id="journal"
                         :options="autocomplete.journals"
                         :internal-search="false"
                         :preserve-search="true"
                         @search-change="autcompleteJournalSearch"
                         label="journal_name"
                         :loading="autocomplete.loaders.journals"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2 lbl-right">
        <label :for="`journal_additional`">{{ $t('reference.journalAdditional') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="journal_additional" v-model="reference.journal_additional" type="text"></b-form-input>
      </div>

    </div>

    <!-- VOLUME and NUMBER -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`volume`">{{ $t('reference.volume') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="volume" v-model="reference.volume" type="text"></b-form-input>
      </div>


      <div class="col-sm-2 lbl-right">
        <label :for="`number`">{{ $t('reference.number') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="number" v-model="reference.number" type="text"></b-form-input>
      </div>
    </div>

    <!-- PAGES and BOOK EDITOR -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`pages`">{{ $t('reference.pages') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="pages" v-model="reference.pages" type="text"></b-form-input>
      </div>


      <div class="col-sm-2 lbl-right">
        <label :for="`book_editor`">{{ $t('reference.book_editor') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="book_editor" v-model="reference.book_editor" type="text"></b-form-input>
      </div>
    </div>

    <!-- BOOK and BOOK ORIGINAL -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`book`">{{ $t('reference.book') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="book" v-model="reference.book" type="text"></b-form-input>
      </div>


      <div class="col-sm-2 lbl-right">
        <label :for="`book_original`">{{ $t('reference.bookOriginal') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="book_original" v-model="reference.book_original" type="text"></b-form-input>
      </div>
    </div>

    <!-- PUBLISHER and PUBLISHER PLACE -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`publisher`">{{ $t('reference.publisher') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="publisher" v-model="reference.publisher" type="text"></b-form-input>
      </div>


      <div class="col-sm-2 lbl-right">
        <label :for="`publisher_place`">{{ $t('reference.publisherPlace') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="publisher_place" v-model="reference.publisher_place" type="text"></b-form-input>
      </div>
    </div>

    <!-- DOI and URL-->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`doi`">DOI:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="doi" v-model="reference.doi" type="text"></b-form-input>
      </div>

      <div class="col-sm-2 mb-2 text-center">
        <b-button variant="info" :disabled="!isDefinedAndNotNull(reference.doi)" @click="checkDoi">{{ $t('reference.checkDoi') }}</b-button>
      </div>


      <div class="col-sm-1 lbl-right">
        <label :for="`url`">URL:</label>
      </div>

      <div class="col-sm-3 mb-2">
        <b-form-input id="url" v-model="reference.url" type="text"></b-form-input>
      </div>
    </div>

    <!-- ISBN and ISSN -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`isbn`">ISBN:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="isbn" v-model="reference.isbn" type="text"></b-form-input>
      </div>


      <div class="col-sm-2 lbl-right">
        <label :for="`issn`">ISSN:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="issn" v-model="reference.issn" type="text"></b-form-input>
      </div>
    </div>

    <!-- ABSTRACT -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`abstract`">{{ $t('reference.abstract') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea id="abstract" v-model="reference.abstract" type="text" size="sm"
                         :rows="1" :max-rows="20"></b-form-textarea>
      </div>
    </div>

    <!-- AUTHOR KEYWORDS -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`author_keywords`">{{ $t('reference.authorKeywords') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-input id="author_keywords" v-model="reference.author_keywords" type="text"></b-form-input>
      </div>
    </div>

    <!-- REMARKS -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`remarks`">{{ $t('reference.remarks') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea id="remarks" v-model="reference.remarks" type="text" size="sm"
                         :rows="1" :max-rows="20"></b-form-textarea>
      </div>
    </div>

    <!-- ALLOW TEMPORARILY USER TAGS -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`tags`">Kasutaja märksõnad (ajutine lahendus):</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-input id="tags" v-model="reference.tags" type="text"></b-form-input>
      </div>
    </div>

    <!-- REFERENCE KEYWORDS -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`keyword`">{{ $t('reference.referenceKeyword') }}:</label>
      </div>

      <div class="col-9 mb-2">
        <vue-multiselect v-model="reference.keyword"
                         id="keyword"
                         :options="autocomplete.keyword"
                         :multiple="true"
                         :close-on-select="false"
                         track-by="id"
                         label="keyword"
                         :tag-placeholder="$t('add.inputs.keywordsAdd')"
                         :placeholder="$t('add.inputs.keywords')"></vue-multiselect>
      </div>

      <div class="col-1 mb-2">
        <button class="btn btn-outline-danger" :title="$t('add.inputs.keywordsRemove')" :disabled="!isDefinedAndNotNull(autocomplete.keyword)"
                @click="autocomplete.keyword = null">
          <font-awesome-icon icon="trash-alt"></font-awesome-icon>
        </button>
      </div>
    </div>

    <!-- CHECKBOXES -->
    <div class="row">
      <div class="col">
        <b-form-checkbox id="is_oa" v-model="reference.is_oa" value="1" unchecked-value="0">
          {{ $t('reference.is_oa') }}
        </b-form-checkbox>

        <b-form-checkbox id="is_private" v-model="reference.is_private" value="1" unchecked-value="0">
          {{ $t('otherFiles.private') }}
        </b-form-checkbox>

        <b-form-checkbox id="is_locked" v-model="reference.is_locked" value="1" unchecked-value="0">
          {{ $t('otherFiles.locked') }}
        </b-form-checkbox>
      </div>
    </div>

    <!-- SHOWING RELATED_DATA -->
    <div class="row" v-if="$route.meta.isEdit">
      <div class="col mt-4">
        <ul class="nav nav-tabs tab-links mb-3" style="flex-wrap: nowrap !important">
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('locality_reference')" class="nav-link" :class="{ active: activeTab === 'locality_reference' }">
              {{ $t('library.relatedTables.libraryReference') }}
            </a>
          </li>
        </ul>
        <locality-reference :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"/>
        <div class="row mb-4 pt-1">
          <!--<div class="col">-->
          <!--<button class="btn float-left btn-sm btn-outline-success mr-2 mb-2 pl-4 pr-4"-->
          <!--:disabled="sendingData" @click="addRelatedData(activeTab)">{{$t('add.newRelation')}}</button>-->
          <!--</div>-->
          <div class="col pagination-center" v-if="relatedData[activeTab] !== null && relatedData[activeTab].length > 0">
            <b-pagination
              size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="relatedData.count[activeTab]" v-model="relatedData.page[activeTab]" :per-page="10">
            </b-pagination>
          </div>
        </div>
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
  import {
    fetchReference,
    fetchReferences,
    fetchLocalityReference,
    fetchListReferenceTypes,
    fetchListLanguages,
    fetchListKeywords,
  } from "../../assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'
  import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";
  import formManipulation  from './../mixins/formManipulation'
  import autocompleteFieldManipulation  from './../mixins/autocompleFormManipulation'
  import copyForm  from './../mixins/copyForm'
  import LocalityReference from "./relatedTables/LocalityReference"

  export default {
    name: "Reference",
    components: {
      FontAwesomeIcon,
      VueMultiselect,
      Spinner,
      LocalityReference
    },
    mixins: [formManipulation, copyForm, autocompleteFieldManipulation],

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
          tabs: ['locality_reference'],
          searchHistory: 'referenceSearchHistory',
          activeTab: 'locality_reference',
          relatedData: this.setDefaultRelatedData(),
          copyFields: ['reference', 'year', 'author', 'title', 'title_original', 'type', 'language', 'journal', 'journal_additional',
            'volume', 'number', 'pages', 'book_editor', 'book', 'book_original', 'publisher', 'publisher_place', 'doi', 'url',
            'isbn', 'issn', 'abstract', 'author_keywords', 'remarks', 'tags'],
          autocomplete: {
            loaders: {
              types: false,
              languages: false,
              journals: false,
              keyword: false,
            },
            types: [],
            languages: [],
            journals: [],
            keyword: [],
          },
          requiredFields: ['reference', 'year', 'author', 'title'],
          reference: {},
          previousRecord: {},
          nextRecord: {},
          searchParameters: this.setDefaultSearchParameters()
        }
      },

      reloadData() {
        Object.assign(this.$data, this.setInitialData());
        this.loadFullInfo()
      },

      loadFullInfo() {
        fetchListReferenceTypes().then(response => {
          this.autocomplete.types = this.handleResponse(response);
        });
        fetchListLanguages().then(response => {
          this.autocomplete.languages = this.handleResponse(response);
        });
        fetchListKeywords().then(response => {
          this.autocomplete.keyword = this.handleResponse(response);
        });

        if(this.$route.meta.isEdit) {
          this.sendingData = true;
          fetchReference(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);
            if(handledResponse.length > 0) {
              this.reference = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.reference)
              this.removeUnnecessaryFields(this.reference, this.copyFields);
              this.$emit('data-loaded',this.reference)
              this.$emit('set-object','reference')
              this.sendingData = false;
              this.getListRecords('reference')
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

          this.setActiveTab('locality_reference')
        }

      },

      setDefaultRelatedData(){
        return {
          locality_reference:[],
          copyFields: {
            locality_reference: ['locality', 'type', 'pages', 'figures', 'remarks'],
          },
          insert: {
            locality_reference: {}
          },
          page : {
            locality_reference: 1
          },
          count: {
            locality_reference: 0
          }
        }
      },

      formatDataForUpload(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload)
        // if (this.isDefinedAndNotNull(objectToUpload.author)) uploadableObject.author = objectToUpload.author.id

        console.log('This object is sent in string format:')
        console.log(uploadableObject)
        return JSON.stringify(uploadableObject)
      },

      fillAutocompleteFields(obj){
        // this.locality.author = { agent: obj.author__agent, id: obj.author }
      },

      fillRelatedDataAutocompleteFields(obj){
        obj.locality = { locality: obj.locality__locality, locality_en: locality__locality_en, id: obj.locality }
        return obj
      },

      loadRelatedData(object){
        let query;

        if(object === 'locality_reference') {
          query = fetchLocalityReference(this.$route.params.id, this.relatedData.page.locality_reference)
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
        // uploadableObject.library = this.library.id;

        // if (this.isDefinedAndNotNull(uploadableObject.reference)) {
        //   uploadableObject.reference = uploadableObject.reference.id ? uploadableObject.reference.id : uploadableObject.reference;
        // }

        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
      },


      fetchList(localStorageData) {
        let params = this.isDefinedAndNotNull(localStorageData) && localStorageData !== 'fallbackValue' ? localStorageData : this.searchParameters;
        console.log(localStorageData)
        return new Promise((resolve) => {
          resolve(fetchReferences(params))
        });
      },

      setDefaultSearchParameters() {
        return {
          author: null,
          year: null,
          title: null,
          bookJournal: null,
          abstractKeywordsRemarks: null,
          id: null,
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
        }
      },
    }

  }
</script>

<style scoped>

</style>
