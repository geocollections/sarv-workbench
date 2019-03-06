<template>
  <div class="reference">

    <!-- REFERENCE and AUTHOR -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`reference`">{{ $t('reference.reference') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="reference" v-model="edit.reference" :state="referenceState" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`year`">{{ $t('reference.year') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="year" v-model="edit.year" :state="yearState" type="number"></b-form-input>
      </div>
    </div>

    <!-- AUTHOR and YEAR -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`author`">{{ $t('reference.author') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-input id="author" v-model="edit.author" :state="authorState" type="text"></b-form-input>
      </div>
    </div>


    <!-- TITLE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`title`">{{ $t('reference.title') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea id="title" v-model="edit.title" :state="titleState" type="text"
                         :rows="1" :max-rows="4"></b-form-textarea>
      </div>
    </div>

    <!-- TITLE ORIGINAL -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`title_original`">{{ $t('reference.titleOriginal') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea id="title_original" v-model="edit.title_original" type="text"
                         :rows="1" :max-rows="4"></b-form-textarea>
      </div>
    </div>

    <!-- TYPE, LANGUAGE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`type`">{{ $t('reference.type') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.type"
                         id="type"
                         :options="autocomplete.types"
                         @open="maybeGetTypes"
                         track-by="id"
                         :label="typeLabel"
                         :loading="searchingTypes"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>


      <div class="col-sm-2">
        <label :for="`language`">{{ $t('reference.language') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.language"
                         id="language"
                         :options="autocomplete.languages"
                         @open="maybeGetLanguages"
                         track-by="id"
                         :label="languageLabel"
                         :loading="searchingLanguages"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- JOURNAL -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`journal`">{{ $t('reference.journal') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="edit.journal"
                         id="journal"
                         :options="autocomplete.journals"
                         :internal-search="false"
                         :preserve-search="true"
                         @search-change="getJournals"
                         label="journal_name"
                         :loading="searchingJournals"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>

      <!--
      <div class="col-sm-1 mb-2">
        <a href="javascript:void(0)" @click="openInNewWindow({object: 'journal', height: 500})" class="btn btn-outline-info" :title="$t('add.inputs.newJournal')">
          <font-awesome-icon icon="plus"></font-awesome-icon>
        </a>
      </div>
      -->

      <div class="col-sm-2">
        <label :for="`journal_additional`">{{ $t('reference.journalAdditional') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="journal_additional" v-model="edit.journal_additional" type="text"></b-form-input>
      </div>

    </div>

    <!-- VOLUME and NUMBER -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`volume`">{{ $t('reference.volume') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="volume" v-model="edit.volume" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`number`">{{ $t('reference.number') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="number" v-model="edit.number" type="text"></b-form-input>
      </div>
    </div>    

    <!-- BOOK and BOOK ORIGINAL -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`book`">{{ $t('reference.book') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="book" v-model="edit.book" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`book_original`">{{ $t('reference.bookOriginal') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="book_original" v-model="edit.book_original" type="text"></b-form-input>
      </div>
    </div>

    <!-- PUBLISHER and PUBLISHER PLACE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`publisher`">{{ $t('reference.publisher') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="publisher" v-model="edit.publisher" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`publisher_place`">{{ $t('reference.publisherPlace') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="publisher_place" v-model="edit.publisher_place" type="text"></b-form-input>
      </div>
    </div>

    <!-- PAGES and FIGURES -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`pages`">{{ $t('reference.pages') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="pages" v-model="edit.pages" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`figures`">{{ $t('reference.figures') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="figures" v-model="edit.figures" type="text"></b-form-input>
      </div>
    </div>

    <!-- DOI and URL -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`doi`">DOI:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="doi" v-model="edit.doi" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`url`">URL:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="url" v-model="edit.url" type="text"></b-form-input>
      </div>
    </div>

    <!-- ISBN and ISSN -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`isbn`">ISBN:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="isbn" v-model="edit.isbn" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`issn`">ISSN:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="issn" v-model="edit.issn" type="text"></b-form-input>
      </div>
    </div>

    <!-- ABSTRACT -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`abstract`">{{ $t('reference.abstract') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea id="abstract" v-model="edit.abstract" type="text" size="sm"
                         :rows="1" :max-rows="20"></b-form-textarea>
      </div>
    </div>
    
    <!-- AUTHOR KEYWORDS -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`author_keywords`">{{ $t('reference.authorKeywords') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-input id="author_keywords" v-model="edit.author_keywords" type="text"></b-form-input>
      </div>
    </div>
    
    <!-- REMARKS -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`remarks`">{{ $t('reference.remarks') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea id="remarks" v-model="edit.remarks" type="text" size="sm"
                         :rows="1" :max-rows="20"></b-form-textarea>
      </div>
    </div>

    <!-- ALLOW TEMPORARILY USER TAGS -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`tags`">Kasutaja märksõnad (ajutine lahendus):</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-input id="tags" v-model="reference.tags" type="text"></b-form-input>
      </div>
    </div>
    
    <!-- REFERENCE KEYWORDS -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`keyword`">{{ $t('reference.referenceKeyword') }}:</label>
      </div>

      <div class="col-9 mb-2">
        <vue-multiselect v-model="edit.related_data.keyword"
                         id="keyword"
                         @open="getReferenceKeywords"
                         :options="autocomplete.keyword"
                         :loading="searchingReferenceKeywords"
                         :multiple="true"
                         :close-on-select="false"
                         track-by="id"
                         label="keyword"
                         :tag-placeholder="$t('add.inputs.keywordsAdd')"
                         :placeholder="$t('add.inputs.keywords')"></vue-multiselect>
      </div>

      <div class="col-1 mb-2">
        <button class="btn btn-outline-danger" :title="$t('add.inputs.keywordsRemove')" :disabled="!removeReferenceKeyword"
                @click="edit.related_data.keyword = null">
          <font-awesome-icon icon="trash-alt"></font-awesome-icon>
        </button>
      </div>
    </div>    

    <!-- RELATED DATA -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`related_data`">{{ $t('otherFiles.relatedData') }}:</label>
      </div>

      <div class="col-sm-4">
        <b-form-select id="related_data" v-model="relatedTable" class="mb-3">
          <option :value="null">{{ this.$t('otherFiles.relatedDataDefault') }}</option>
          <option value="attachment">{{ this.$t('reference.relatedTables.attachment') }}</option>
          <option value="locality">{{ this.$t('reference.relatedTables.locality') }}</option>
        </b-form-select>
      </div>


      <div class="col-sm-2" v-if="relatedTable !== null">
        <label :for="relatedTable">{{ this.$t('reference.relatedTables.' + relatedTable) }}:</label>
      </div>

      <div class="col-sm-4" v-if="relatedTable !== null">
        <vue-multiselect v-model="edit.related_data[relatedTable]"
                         :id="relatedTable"
                         :multiple="true"
                         track-by="id"
                         :options="autocomplete.relatedData[relatedTable]"
                         :internal-search="false"
                         @search-change="getRelatedData"
                         :custom-label="customLabelForRelatedData"
                         :loading="searchingRelatedData[relatedTable]"
                         :placeholder="$t('add.inputs.autocomplete')"
                         :show-labels="false">
          <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
        </vue-multiselect>
      </div>
    </div>

    <!-- SHOWING RELATED_DATA -->
    <div class="row">

      <!-- ATTACHMENT LINK-->
      <div class="col-sm-6" v-if="edit.related_data.attachment !== null && edit.related_data.attachment.length > 0">

        <p class="h4">{{ $t('reference.relatedTables.attachment') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('reference.relatedTables.attachment') }}</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in edit.related_data.attachment">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'file', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td class="text-center">
                <file-preview :data="entity" />
              </td>

              <td class="text-center delete-relation" @click="edit.related_data.attachment.splice(index, 1)">
                <font-awesome-icon icon="times"></font-awesome-icon>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- LOCALITY -->
      <div class="col-sm-6" v-if="edit.related_data.locality !== null && edit.related_data.locality.length > 0">

        <p class="h4">{{ $t('reference.relatedTables.locality') }}</p>

        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t('locality.locality') }}</th>
              <!--<th>Type</th>-->
              <!--<th>Lk.</th>-->
              <!--<th>Joon</th>-->
              <!--<th>Lisainfo</th>-->
              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(entity, index) in edit.related_data.locality">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'locality', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td>{{ $i18n.locale === 'ee' ? entity.locality : entity.locality_en }}</td>
              <!--<td></td>-->
              <!--<td></td>-->
              <!--<td></td>-->
              <!--<td></td>-->

              <td class="text-center delete-relation" @click="edit.related_data.locality.splice(index, 1)">
                <font-awesome-icon icon="times"></font-awesome-icon>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>


    <!-- CHECKBOXES -->
    <div class="row">
      <div class="col">
        <b-form-checkbox id="is_oa" v-model="edit.is_oa" value="1" unchecked-value="0">
          {{ $t('reference.is_oa') }}
        </b-form-checkbox>

        <b-form-checkbox id="is_private" v-model="edit.is_private" value="1" unchecked-value="0">
          {{ $t('otherFiles.private') }}
        </b-form-checkbox>

        <b-form-checkbox id="is_locked" v-model="edit.is_locked" value="1" unchecked-value="0">
          {{ $t('otherFiles.locked') }}
        </b-form-checkbox>
      </div>
    </div>


    <div class="row mt-3 mb-2">
      <div class="col" v-if="!isReferenceLocked">
        <button class="btn btn-success mr-2 mb-2" @click="sendData(false)" >{{ $t('edit.buttons.save') }}</button>
        <button class="btn btn-success mr-2 mb-2" @click="sendData(true)" >{{ $t('edit.buttons.saveAndContinue') }}</button>
        <router-link class="btn btn-danger mr-2 mb-2" :to="{ path: '/reference' }">{{ $t('edit.buttons.cancelWithoutSaving') }}</router-link>
      </div>
      <div class="col-sm-6" v-else>
        <div class="alert alert-info">{{ $t('edit.locked') }}</div>
      </div>
    </div>


  </div>
</template>

<script>
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faPlus} from '@fortawesome/free-solid-svg-icons'
  import {faTrashAlt} from '@fortawesome/free-solid-svg-icons'
  import {faTimes} from '@fortawesome/free-solid-svg-icons'

  import VueMultiselect from 'vue-multiselect'
  import FilePreview from '@/components/partial/FilePreview.vue'
  import cloneDeep from 'lodash/cloneDeep'
  import { toastError } from "@/assets/js/iziToast/iziToast";
  import { fetchReferenceKeywords } from "@/assets/js/api/apiCalls";

  library.add(faPlus, faTrashAlt, faTimes)

  export default {
    components: {
      FontAwesomeIcon,
      VueMultiselect,
      FilePreview,
    },
    props: ['data','attach','loc','keywords', 'attachLink'],
    name: "Reference",

    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/',
        reference: this.data,
        attachment: this.attach,
        locality: this.loc,
        reference_keyword: this.keywords,
        isFileLocked: this.data.is_locked,
        searchingTypes: false,
        searchingLanguages: false,
        searchingJournals: false,
        searchingReferenceKeywords: false,
        autocomplete: {
          types: [],
          languages: [],
          journals: [],
          keyword: [],
          relatedData: {
            locality: [],
            attachment: [],
          }
        },
        searchingRelatedData: {
          locality: false,
          attachment: false,
        },
        relatedTable: null,
        myKeywords: [],
        edit: {
          reference: this.data.reference,
          author: this.data.author,
          type: this.buildType(),
          language: this.buildLanguage(),
          year: this.data.year,
          title: this.data.title,
          title_original: this.data.title_original,
          book: this.data.book,
          book_original: this.data.book_original,
          publisher: this.data.publisher,
          publisher_place: this.data.publisher_place,
          journal: this.buildJournal(),
          journal_additional: this.data.journal_additional,
          volume: this.data.volume,
          number: this.data.number,
          pages: this.data.pages,
          figures: this.data.figures,
          doi: this.data.doi,
          url: this.data.url,
          isbn: this.data.isbn,
          issn: this.data.issn,
          abstract: this.data.abstract,
          author_keywords: this.data.author_keywords,
          remarks: this.data.remarks,
          is_oa: this.data.is_oa ? '1' : '0',
          is_private: this.data.is_private ? '1' : '0',
          is_locked: this.data.is_locked ? '1' : '0',
          related_data: {
            attachment: this.buildRelatedData(this.attachLink, 'attachment'),
            locality: this.buildRelatedData(this.loc, 'locality'),
            keyword: this.buildRelatedData(this.keywords, 'reference_keyword'),
          }
        },
      }
    },

    computed: {
      referenceState() {
        return this.edit.reference !== null
      },

      authorState() {
        return this.edit.author !== null
      },

      yearState() {
        if (this.edit.year !== null) {
          return this.edit.year.length > 0
        }
        return false
      },

      titleState() {
        if (this.edit.title !== null) {
          return this.edit.title.length > 0
        }
        return false
      },

      typeLabel() {
        return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
      },

      languageLabel() {
        return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
      },

      removeReferenceKeyword() {
        return this.edit.related_data.keyword !== null && this.edit.related_data.keyword.length > 0
      },

      isReferenceLocked() {
        return this.isFileLocked
      },
    },

    methods: {



      /******************
       *** SEND START ***
       ******************/

      sendData(continueEditing) {
        if (this.referenceState && this.authorState && this.yearState && this.titleState) {
          const formattedData = this.formatDataForEdit(this.edit)
          this.$emit('edit-data', formattedData, continueEditing)
        } else {
          toastError({text: this.$t('messages.checkForm')})
        }
      },

      formatDataForEdit(unformattedData) {
        let uploadableData = cloneDeep(unformattedData)

        // Building correct fields
        if (unformattedData.type !== null && typeof unformattedData.type !== 'undefined') uploadableData.type = unformattedData.type.id
        if (unformattedData.language !== null && typeof unformattedData.language !== 'undefined') uploadableData.language = unformattedData.language.id
        if (unformattedData.journal !== null && typeof unformattedData.journal !== 'undefined') uploadableData.journal = unformattedData.journal.id



        /**************************
         *** RELATED DATA START ***
         **************************/

        if (unformattedData.locality !== null && typeof unformattedData.locality !== 'undefined') {
          if (unformattedData.locality.length === 0) uploadableData.locality = null
        }
        if (unformattedData.attachment !== null && typeof unformattedData.attachment !== 'undefined') {
          if (unformattedData.attachment.length === 0) uploadableData.attachment = null
        }

        /**************************
         ***  RELATED DATA END  ***
         **************************/



        console.log('This object is sent in string format:')
        console.log(uploadableData)

        return JSON.stringify(uploadableData)
      },

      /******************
       ***  SEND END  ***
       ******************/



      /**************************
       *** AUTOCOMPLETE START ***
       **************************/

      maybeGetTypes() {
        return this.autocomplete.types.length <= 0 ? this.getTypes() : null
      },

      getTypes() {
        this.searchingTypes = true;

        this.$http.get(this.apiUrl + 'list_reference_type/', {
          params: {
            value__isnull: 'false',
            value_en__isnull: 'false',
            format: 'json'
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (response.body.count > 0) {
              this.autocomplete.types = response.body.results;
            } else {
              this.autocomplete.types = []
            }
          }
          this.searchingTypes = false;
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
          this.searchingTypes = false;
        })
      },

      maybeGetLanguages() {
        return this.autocomplete.languages.length <= 0 ? this.getLanguages() : null
      },

      getLanguages() {
        this.searchingLanguages = true;

        this.$http.get(this.apiUrl + 'list_language/', {
          params: {
            value__isnull: 'false',
            value_en__isnull: 'false',
            format: 'json'
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (response.body.count > 0) {
              this.autocomplete.languages = response.body.results;
            } else {
              this.autocomplete.languages = []
            }
          }
          this.searchingLanguages = false;
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
          this.searchingLanguages = false;
        })
      },

      getJournals(query) {
        if (query.length > 0) {
          // Building url like that because otherwise it encodes spaces with plusses or something weird
          let url = this.apiUrl + 'journal/?multi_search=value:' + query + ';fields:id,journal_name,journal_short;lookuptype:icontains&fields=id,journal_name&format=json'

          this.searchingJournals = true;

          this.$http.get(url).then(response => {
            console.log(response)
            if (response.status === 200) {
              if (response.body.count > 0) this.autocomplete.journals = response.body.results;
              else this.autocomplete.journals = []
            }
            this.searchingJournals = false;
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.searchingJournals = false;
          })
        }
      },

      getReferenceKeywords() {
        if (this.autocomplete.keyword.length <= 0) {
          this.searchingReferenceKeywords = true

          fetchReferenceKeywords().then(response => {
            if (response.status === 200) {
              if (response.body.count > 0) this.autocomplete.keyword = response.body.results;
              else this.autocomplete.keyword = []
            }
            this.searchingReferenceKeywords = false
          }, errResponse => {
            this.searchingReferenceKeywords = false
          })
        }
      },

      /************************
       *** AUTOCOMPLETE END ***
       ************************/



      /***************************
       *** BUILD OBJECTS START ***
       ***************************/

      buildType() {
        if (this.data.type__id !== null) {
          return {
            id: this.data.type__id,
            value: this.data.type__value,
            value_en: this.data.type__value_en,
          }
        } else {
          return null
        }
      },

      buildLanguage() {
        if (this.data.type__id !== null) {
          return {
            id: this.data.language__id,
            value: this.data.language__value,
            value_en: this.data.language__value_en,
          }
        } else {
          return null
        }
      },

      buildJournal() {
          if (this.data.journal__id !== null) {
            return {
              id: this.data.journal__id,
              journal_name: this.data.journal__journal_name,
            }
          } else {
            return null
          }
      },

      buildRelatedData(relatedData, field) {
        console.log(relatedData)
        let attachmentLinks = []
        let localities = []
        let referenceKeywords = []

        for (const data in relatedData) {
          let attachmentLink = {}
          let locality = {}
          let referenceKeyword = {}

          if (field === 'attachment') {
            if (relatedData[data].attachment !== null) {
              attachmentLink.id = relatedData[data].attachment
              attachmentLink.uuid_filename = relatedData[data].attachment__uuid_filename
              attachmentLink.description = relatedData[data].attachment__description
              attachmentLink.description_en = relatedData[data].attachment__description_en
              attachmentLink.author__agent = relatedData[data].attachment__author__agent
              attachmentLinks.push(attachmentLink)
            }
          }

          if (field === 'locality') {
            if (relatedData[data].locality__id !== null) {
              locality.id = relatedData[data].locality__id
              locality.locality = relatedData[data].locality__locality
              locality.locality_en = relatedData[data].locality__locality_en
              localities.push(locality)
            }
          }

          if (field === 'reference_keyword') {
            if (relatedData[data].keyword !== null) {
              referenceKeyword.id = relatedData[data].keyword
              referenceKeyword.keyword = relatedData[data].keyword__keyword
              referenceKeywords.push(referenceKeyword)
            }
          }

        }


        if (field === 'attachment' && attachmentLinks.length > 0) return attachmentLinks
        if (field === 'locality' && localities.length > 0) return localities
        if (field === 'reference_keyword' && referenceKeywords.length > 0) return referenceKeywords

        return null
      },

      /*************************
       *** BUILD OBJECTS END ***
       *************************/



      /*********************
       *** HELPERS START ***
       *********************/

      getRelatedData(query, id) {
        if (query.length > 0) {

          let search = ''
          let fields = 'id'
          switch(id) {
            case 'attachment':
              search += 'multi_search=value:' + query + ';fields:id,author__agent,original_filename,description,description_en;lookuptype:icontains'
              fields += ',author__agent,description,description_en,uuid_filename'
              break
            case 'locality':
              search += 'multi_search=value:' + query + ';fields:id,locality,locality_en;lookuptype:icontains'
              fields += ',locality,locality_en'
              break
            default:
              search += 'id__icontains=' + query
              fields += ''
          }

          console.log(search)

          let url = this.apiUrl
          if (id === 'storage') url += 'location/?' + search + '&fields=' + fields + '&format=json'
          else url += id + '/?' + search + '&fields=' + fields + '&format=json'

          this.searchingRelatedData[id] = true;

          this.$http.get(url).then(response => {
            console.log(response)
            if (response.status === 200) {
              if (response.body.count > 0) {
                this.autocomplete.relatedData[id] = response.body.results;
              }
              else {
                this.autocomplete.relatedData[id] = [];
              }
            }
            this.searchingRelatedData[id] = false;
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.searchingRelatedData[id] = false;
          })
        }
      },

      customLabelForRelatedData(option) {
        switch(this.relatedTable) {
          case 'attachment':
            if (this.$i18n.locale === 'ee') return `${option.id} - (${option.description}) (${option.author__agent})`
            return `${option.id} - (${option.description_en}) (${option.author__agent})`
          case 'locality':
            if (this.$i18n.locale === 'ee') return `${option.id} - (${option.locality})`
            return `${option.id} - (${option.locality_en})`
          default:
            return `${option.id}`
        }
      },

      openGeoInNewWindow(params) {
        let width = 600;
        switch (params.object) {
          case "specimen":
            width = 1050;
            break;
          case "locality":
            width = 1025;
            break;
          case "doi":
            width = 1000;
        }
        window.open('http://geocollections.info/' + params.object + '/' + params.id, '', 'width=' + width + ',height=750')
      },

      /*********************
       *** HELPERS END ***
       *********************/



    },
  }
</script>

<style scoped>
  label {
    margin-bottom: 0.2rem;
  }

  .delete-relation {
    transition: background-color 500ms ease-in-out;
    vertical-align: middle;
  }

  .delete-relation:hover {
    cursor: pointer;
    background-color: rgba(220,53,69, 0.7);
  }
</style>
