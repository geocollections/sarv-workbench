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
        <b-form-textarea :key="componentKey" id="title" v-model="reference.title" :state="isDefinedAndNotNull(reference.title)" type="text"
                         :rows="1" :max-rows="4"></b-form-textarea>
      </div>
    </div>

    <!-- TITLE ORIGINAL -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`title_original`">{{ $t('reference.titleOriginal') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea :key="componentKey" id="title_original" v-model="reference.title_original" type="text"
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
          <template slot="singleLabel" slot-scope="{ option }">
            <strong>{{ $i18n.locale=== 'ee' ? option.value : option.value_en }}</strong>
          </template>
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
          <template slot="singleLabel" slot-scope="{ option }">
            <strong>{{ $i18n.locale=== 'ee' ? option.value : option.value_en }}</strong>
          </template>
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
                         track-by="id"
                         :options="autocomplete.journals"
                         :internal-search="false"
                         :preserve-search="true"
                         @search-change="autcompleteJournalSearch"
                         label="journal_name"
                         :loading="autocomplete.loaders.journals"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.journal_name }}</strong></template>
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
        <b-form-textarea :key="componentKey" id="abstract" v-model="reference.abstract" type="text" size="sm"
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
        <b-form-textarea :key="componentKey" id="remarks" v-model="reference.remarks" type="text" size="sm"
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
        <vue-multiselect v-model="relatedData.keyword"
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
        <button class="btn btn-outline-danger" :title="$t('add.inputs.keywordsRemove')" :disabled="!isDefinedAndNotEmpty(relatedData.keyword)"
                @click="relatedData.keyword = null">
          <font-awesome-icon icon="trash-alt"></font-awesome-icon>
        </button>
      </div>
    </div>

    <!-- DIGITAL VERSION (PDF) -->
    <fieldset class="border p-2 mb-2" v-if="this.attachment.length > 0">
      <legend class="w-auto" style="font-size: large;">
        {{ $t('reference.relatedTables.attachmentDigital') }}
        <font-awesome-icon icon="file-pdf"/>
      </legend>

      <file-table :attachments="attachment" object="reference" v-if="attachment.length > 0"/>
    </fieldset>

    <!-- RELATED FILES -->
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">
        {{ $t('reference.relatedTables.attachment') }}
        <font-awesome-icon icon="folder-open"/>
      </legend>

      <div class="row">
        <div class="col">
          <vue-multiselect v-model="relatedData.attachment"
                           id="attachment"
                           :multiple="true"
                           track-by="id"
                           :options="autocomplete.attachment"
                           :internal-search="false"
                           :preserve-search="true"
                           :close-on-select="false"
                           @search-change="autcompleteAttachmentSearch2"
                           :custom-label="customLabelForAttachment"
                           :loading="autocomplete.loaders.attachment"
                           :placeholder="$t('add.inputs.autocomplete')"
                           :show-labels="false">
            <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
          </vue-multiselect>
        </div>
      </div>

      <file-table :attachments="relatedData.attachment" object="reference" v-if="relatedData.attachment.length > 0"/>
    </fieldset>

    <!-- RELATED LOCALITIES -->
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">
        {{ $t('reference.relatedTables.locality') }}
        <font-awesome-icon icon="map-marked"/>
      </legend>

      <div class="row">
        <div class="col">
          <vue-multiselect v-model="relatedData.locality"
                           id="locality"
                           :multiple="true"
                           track-by="id"
                           :options="autocomplete.locality"
                           :internal-search="false"
                           :preserve-search="true"
                           :close-on-select="false"
                           @search-change="autcompleteLocalitySearch2"
                           :custom-label="customLabelForLocality"
                           :loading="autocomplete.loaders.locality"
                           :placeholder="$t('add.inputs.autocomplete')"
                           :show-labels="false">
            <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
          </vue-multiselect>
        </div>
      </div>

      <div class="row mt-2" v-if="relatedData.locality.length > 0">
        <div class="table-responsive-sm col-12">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('reference.relatedTables.locality') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="entity in relatedData.locality">
              <td @click="windowOpenNewTab('locality', '/locality/' + entity.id)" class="link">
                <font-awesome-icon size="1x" icon="eye" color="blue"/>
                {{ entity.id }}
              </td>

              <td v-translate="{et:entity.locality,en:entity.localit_en}"></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

    </fieldset>

    <!-- SHOWING RELATED_DATA -->
    <div class="row">
      <div class="col mt-4">
        <ul class="nav nav-tabs tab-links mb-3" style="flex-wrap: nowrap !important">
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('locality_reference')" class="nav-link" :class="{ active: activeTab === 'locality_reference' }">
              {{ $t('reference.relatedTables.localityReference') }}
            </a>
          </li>
        </ul>
        <locality-reference :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"/>
        <div class="row mb-4 pt-1">
          <div class="col pagination-center" v-if="relatedData[activeTab] !== null && relatedData[activeTab].length > 0">
            <b-pagination
              size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="relatedData.count[activeTab]" v-model="relatedData.page[activeTab]" :per-page="10">
            </b-pagination>
          </div>
        </div>
      </div>
    </div>

    <!-- CHECKBOXES -->
    <div class="row">
      <div class="col">
        <b-form-checkbox id="is_oa" v-model="reference.is_oa" :value="true" :unchecked-value="false">
          {{ $t('reference.is_oa') }}
        </b-form-checkbox>

        <b-form-checkbox id="is_private" v-model="reference.is_private" :value="true" :unchecked-value="false">
          {{ $t('otherFiles.private') }}
        </b-form-checkbox>

        <b-form-checkbox id="is_locked" v-model="reference.is_locked" :value="true" :unchecked-value="false">
          {{ $t('otherFiles.locked') }}
        </b-form-checkbox>
      </div>
    </div>

    <div class="row mt-3 mb-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false, 'reference', true)">
          {{ $t($route.meta.isEdit ? 'edit.buttons.save' : 'add.buttons.add') }}</button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(true, 'reference', true)">
          {{ $t($route.meta.isEdit ? 'edit.buttons.saveAndContinue' : 'add.buttons.addAnother') }}</button>
        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="$route.meta.isEdit ? leaveFromEditView('reference') : reset('reference')">
          {{ $t($route.meta.isEdit ? 'edit.buttons.cancelWithoutSaving' : 'add.buttons.clearFields') }}</button>
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
    fetchListReferenceTypes,
    fetchListLanguages,
    fetchListKeywords,
    fetchDoiCheck,
    fetchReferenceKeyword,
    fetchAttachmentLink,
    fetchLocalityReferenceForReference,
    fetchAttachmentForReference,
  } from "../../assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'
  import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";
  import formManipulation  from './../mixins/formManipulation'
  import autocompleteFieldManipulation  from './../mixins/autocompleFormManipulation'
  import copyForm  from './../mixins/copyForm'
  import LocalityReference from "./relatedTables/LocalityReference"
  import FileTable from "../partial/FileTable";
  import LocalityTable from "../locality/LocalityTable";

  export default {
    name: "Reference",
    components: {
      LocalityTable,
      FontAwesomeIcon,
      VueMultiselect,
      Spinner,
      LocalityReference,
      FileTable
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
          copyFields: ['id', 'reference', 'year', 'author', 'title', 'title_original', 'type', 'language', 'journal', 'journal_additional',
            'volume', 'number', 'pages', 'book_editor', 'book', 'book_original', 'publisher', 'publisher_place', 'doi', 'url', 'isbn',
            'issn', 'abstract', 'author_keywords', 'remarks', 'tags', 'book_editor', 'figures', 'is_locked',
            'is_oa', 'is_private', 'language'],
          autocomplete: {
            loaders: {
              types: false,
              languages: false,
              journals: false,
              keyword: false,
              locality: false,
              attachment: false,
            },
            types: [],
            languages: [],
            journals: [],
            keyword: [],
            locality: [],
            attachment: [],
          },
          requiredFields: ['reference', 'year', 'author', 'title'],
          reference: {},
          previousRecord: {},
          nextRecord: {},
          searchParameters: this.setDefaultSearchParameters(),
          attachment: {},
          componentKey: 0,
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
              this.forceRerender()
              this.$emit('data-loaded',this.reference)
              this.$emit('set-object','reference')
              this.sendingData = false;
              this.getListRecords('reference')
            } else {
              this.sendingData = false;
            }
          });

          fetchReferenceKeyword(this.$route.params.id).then(response => {
            let referenceKeyword = this.handleResponse(response);
            this.relatedData.keyword = referenceKeyword.map(entity => {
              return {
                keyword: entity.keyword__keyword,
                id: entity.keyword
              }
            })
          })

          fetchAttachmentLink(this.$route.params.id).then(response => {
            let attachment = this.handleResponse(response);

            this.relatedData.attachment = attachment.map(entity => {
              return {
                id: entity.attachment,
                description: entity.attachment__description,
                description_en: entity.attachment__description_en,
                author__agent: entity.attachment__author__agent,
                uuid_filename: entity.attachment__uuid_filename,
                remarks: entity.attachment__remarks,
                original_filename:entity.attachment__original_filename,
              }
            })
          })

          fetchLocalityReferenceForReference(this.$route.params.id).then(response => {
            let localityReference = this.handleResponse(response)

            this.relatedData.locality = localityReference.map(entity => {
              return {
                id: entity.locality,
                locality: entity.locality__locality,
                locality_en: entity.locality__locality_en,
              }
            })
          })

          fetchAttachmentForReference(this.$route.params.id).then(response => {
            this.attachment = this.handleResponse(response)
          })

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

      forceRerender() {
        this.componentKey += 1;
      },

      setDefaultRelatedData(){
        return {
          locality_reference:[],
          attachment: [],
          keyword: [],
          locality: [],
          copyFields: {
            locality_reference: ['locality', 'type', 'pages', 'figures', 'remarks'],
          },
          insert: {
            locality_reference: {},
          },
          page : {
            locality_reference: 1,
            attachment: 1,
            keyword: 1,
            locality: 1,
          },
          count: {
            locality_reference: 0,
            attachment: 0,
            keyword: 0,
            locality: 0,
          }
        }
      },

      formatDataForUpload(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload)

        if (this.isDefinedAndNotNull(objectToUpload.type)) uploadableObject.type = objectToUpload.type.id
        if (this.isDefinedAndNotNull(objectToUpload.language)) uploadableObject.language = objectToUpload.language.id
        if (this.isDefinedAndNotNull(objectToUpload.journal)) uploadableObject.journal = objectToUpload.journal.id
        if (objectToUpload.is_private !== null) uploadableObject.is_private = objectToUpload.is_private === true ? '1' : '0';
        if (objectToUpload.is_oa !== null) uploadableObject.is_oa = objectToUpload.is_oa === true ? '1' : '0';
        if (objectToUpload.is_locked !== null) uploadableObject.is_locked = objectToUpload.is_locked === true ? '1' : '0';

        // Adding related data
        uploadableObject.related_data = {}
        uploadableObject.related_data.keyword = this.relatedData.keyword
        uploadableObject.related_data.attachment = this.relatedData.attachment
        uploadableObject.related_data.locality = this.relatedData.locality

        console.log('This object is sent in string format:')
        console.log(uploadableObject)
        return JSON.stringify(uploadableObject)
      },

      fillAutocompleteFields(obj){
        this.reference.type = { id: obj.type__id, value: obj.type__value, value_en: obj.type__value_en }
        this.reference.language = { id: obj.language__id, value: obj.language__value, value_en: obj.language__value_en }
        this.reference.journal = { id: obj.journal__id, journal_name: obj.journal__journal_name }
      },

      fillRelatedDataAutocompleteFields(obj){
        obj.locality = { locality: obj.locality__locality, locality_en: obj.locality__locality_en, id: obj.locality }
        return obj
      },

      loadRelatedData(object){
        let query;

        if(object === 'locality_reference') {
          query = fetchLocalityReferenceForReference(this.$route.params.id, this.relatedData.page.locality_reference)
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
        uploadableObject.reference = this.reference.id

        if (this.isDefinedAndNotNull(uploadableObject.locality)) {
          uploadableObject.locality = uploadableObject.locality.id ? uploadableObject.locality.id : uploadableObject.locality;
          // uploadableObject.reference = parseInt(this.$route.params.id)
        }

        console.log('This object is sent in string format (related data):')
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
          libraryAuthor: null,
          libraryIdTitle: null,
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
        }
      },

      customLabelForAttachment(option) {
        if (this.$i18n.locale === 'ee') return `${option.id} - (${option.description}) (${option.author__agent})`
        return `${option.id} - (${option.description_en}) (${option.author__agent})`
      },

      customLabelForLocality(option) {
        if (this.$i18n.locale === 'ee') return `${option.id} - (${option.locality})`
        return `${option.id} - (${option.locality_en})`
      },

      checkDoi() {
        fetchDoiCheck(this.reference.doi).then(response => {
          if (response.status === 200) {
            if (response.body.status === 'ok') {
              this.updateFieldsUsingDoi(response.body.message)
            }
          }
        }, errResponse => {})
      },

      updateFieldsUsingDoi(data) {
        if (data['published-print']) {
          if (data['published-print']['date-parts'].length > 0) {
            this.reference.year = data['published-print']['date-parts'][0][0] + ''
          }
        } else if (data.issued) {
          if (data.issued['date-parts'].length > 0) {
            this.reference.year = data.issued['date-parts'][0][0] + ''
          }
        }

        if (data.author && data.author.length > 0) {
          let author = ''
          for (let item in data.author) {
            author += data.author[item].family + ', ' + data.author[item].given.charAt(0) + '., '
          }
          this.reference.author = author.trim().slice(0, -1)
        }

        if (data['container-title'] && data['container-title'].length > 0) {
          let journalAdditional = '';
          for (let item in data['container-title']) {
            journalAdditional += data['container-title'][item] + ', '
          }
          this.reference.journal_additional = journalAdditional.trim().slice(0, -1);
        }

        if (data.title && data.title.length > 0) this.reference.title = data.title[0]
        if (data.volume) this.reference.volume = data.volume
        if (data.issue) this.reference.number = data.issue
        if (data.page) this.reference.pages = data.page
        if (data.url) this.reference.url = data.url
        if (data.publisher) this.reference.publisher = data.publisher
      },

    },
  }
</script>

<style scoped>
  .link:hover {
    cursor: pointer;
  }
</style>
