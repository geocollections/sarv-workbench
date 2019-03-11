<template>
  <div class="reference">

    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$t('add.overlay') + ' ' + loadingPercent + '%'"></spinner>
    <button v-show="sendingData" @click="cancelRequest" class="abort-request-overlay btn btn-danger">{{ $t('add.buttons.cancel') }}</button>

    <!-- REFERENCE and YEAR -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`reference`">{{ $t('reference.reference') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="reference" v-model="reference.reference" :state="referenceState" type="text"></b-form-input>
      </div>


      <div class="col-sm-2 lbl-right">
        <label :for="`year`">{{ $t('reference.year') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="year" v-model="reference.year" :state="yearState" type="number"></b-form-input>
      </div>
    </div>
    
    <!-- AUTHOR -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`author`">{{ $t('reference.author') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-input id="author" v-model="reference.author" :state="authorState" type="text"></b-form-input>
      </div>
    </div>
    

    <!-- TITLE -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`title`">{{ $t('reference.title') }}:</label>
      </div>

      <div class="col-sm-10 mb-2">
        <b-form-textarea id="title" v-model="reference.title" :state="titleState" type="text"
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
                         @open="maybeGetTypes"
                         track-by="id"
                         :label="typeLabel"
                         :loading="searchingTypes"
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
      <div class="col-sm-2 lbl-right">
        <label :for="`journal`">{{ $t('reference.journal') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <vue-multiselect v-model="reference.journal"
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
    
    <!-- DOI and URL -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`doi`">DOI:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="doi" v-model="reference.doi" type="text"></b-form-input>
      </div>


      <div class="col-sm-2 lbl-right">
        <label :for="`url`">URL:</label>
      </div>

      <div class="col-sm-4 mb-2">
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
        <vue-multiselect v-model="reference.related_data.keyword"
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
                @click="reference.related_data.keyword = null">
          <font-awesome-icon icon="trash-alt"></font-awesome-icon>
        </button>
      </div>
    </div>    
    
    <!-- RELATED DATA -->
    <div class="row">
      <div class="col-sm-2 lbl-right">
        <label :for="`related_data`">{{ $t('otherFiles.relatedData') }}:</label>
      </div>

      <div class="col-sm-4">
        <b-form-select id="related_data" v-model="relatedTable" class="mb-3">
          <option :value="null">{{ this.$t('otherFiles.relatedDataDefault') }}</option>
          <option value="attachment">{{ this.$t('reference.relatedTables.attachment') }}</option>
          <option value="locality">{{ this.$t('reference.relatedTables.locality') }}</option>
        </b-form-select>
      </div>


      <div class="col-sm-2 lbl-right" v-if="relatedTable !== null">
        <label :for="relatedTable">{{ this.$t('reference.relatedTables.' + relatedTable) }}:</label>
      </div>

      <div class="col-sm-4" v-if="relatedTable !== null">
        <vue-multiselect v-model="reference.related_data[relatedTable]"
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

      <!-- ATTACHMENT -->
      <div class="col-sm-6" v-if="reference.related_data.attachment !== null && reference.related_data.attachment.length > 0">

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
            <tr v-for="(entity, index) in reference.related_data.attachment">
              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'file', id: entity.id})">
                  {{ entity.id }}
                </a>
              </td>

              <td class="text-center">
                <file-preview :data="entity" />
              </td>

              <td class="text-center delete-relation" @click="reference.related_data.attachment.splice(index, 1)">
                <font-awesome-icon icon="times"></font-awesome-icon>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- LOCALITY -->
      <div class="col-sm-6" v-if="reference.related_data.locality !== null && reference.related_data.locality.length > 0">

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
            <tr v-for="(entity, index) in reference.related_data.locality">
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

              <td class="text-center delete-relation" @click="reference.related_data.locality.splice(index, 1)">
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


    <div class="row mt-3 mb-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false)">{{ $t('add.buttons.add') }}</button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(true)">{{ $t('add.buttons.addAnother') }}</button>
        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="reset">{{ $t('add.buttons.clearFields') }}</button>
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

  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import FilePreview from '@/components/partial/FilePreview.vue';
  import cloneDeep from 'lodash/cloneDeep'

  import {
    fetchListReferenceTypes,
    fetchListLanguages,
    fetchJournals,
    fetchReferenceKeywords
  } from "@/assets/js/api/apiCalls";

  import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";

  library.add(faPlus, faTrashAlt, faTimes)

  export default {
    components: {
      FontAwesomeIcon,
      VueMultiselect,
      FilePreview,
      Spinner,
    },
    name: "Reference",
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/',
        loadingPercent: 0,
        sendingData: false,
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
        reference: {
          reference: null,
          author: null,
          type: {
            "id": 1,
            "value": "artikkel ajakirjas",
            "value_en": "article in journal"
          },
          language: {
            "id": 1,
            "value": "inglise",
            "value_en": "English"
          },
          year: null,
          title: null,
          title_original: null,
          book: null,
          book_original: null,
          publisher: null,
          publisher_place: null,
          journal: null,
          journal_additional: null,
          volume: null,
          number: null,
          pages: null,
          figures: null,
          doi: null,
          url: null,
          isbn: null,
          issn: null,
          abstract: null,
          author_keywords: null,
          tags: null,
          remarks: null,
          journal_txt: null,
          is_oa: '0',
          is_private: '0',
          is_locked: '0',
          related_data: {
            locality: null,
            attachment: null,
            keyword: null,
          }
        },
      }
    },

    computed: {
      referenceState() {
        return this.reference.reference !== null && this.reference.reference.length > 0
      },

      authorState() {
        return this.reference.author !== null && this.reference.author.length > 0
      },

      yearState() {
        return this.reference.year !== null && this.reference.year.length > 0
      },

      titleState() {
        return this.reference.title !== null && this.reference.title.length > 0
      },

      typeLabel() {
        return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
      },

      languageLabel() {
        return this.$i18n.locale === 'ee' ? 'value' : 'value_en'
      },

      removeReferenceKeyword() {
        return this.reference.related_data.keyword !== null && this.reference.related_data.keyword.length > 0
      },
    },

    methods: {

      add(addAnother) {

        if (this.referenceState && this.authorState && this.yearState && this.titleState && !this.sendingData) {

          this.sendingData = true
          this.loadingPercent = 0

          let formData = new FormData()

          const dataToUpload = this.formatDataForUpload(this.reference);
          formData.append('data', dataToUpload)

          this.$http.post(this.apiUrl + 'add/reference/', formData, {
            before(request) {
              this.previousRequest = request
            },
            progress: (e) => {
              if (e.lengthComputable) {
                // console.log("e.loaded: %o, e.total: %o, percent: %o", e.loaded, e.total, (e.loaded / e.total ) * 100);
                this.loadingPercent = Math.round((e.loaded / e.total) * 100)
              }
            }
          }).then(response => {
            console.log(response)
            this.sendingData = false
            if (response.status === 200) {
              if (typeof response.body.message !== 'undefined') {

                if (this.$i18n.locale === 'ee' && typeof response.body.message_et !== 'undefined') {
                  toastSuccess({text: response.body.message_et});
                } else {
                  toastSuccess({text: response.body.message});
                }

                if (!addAnother) {
                  this.$router.push({ path: '/reference' })
                }
              }
              if (typeof response.body.error !== 'undefined') {

                if (this.$i18n.locale === 'ee' && typeof response.body.error_et !== 'undefined') {
                  toastError({text: response.body.error_et});
                } else {
                  toastError({text: response.body.error});
                }

              }
            }
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse))
            this.sendingData = false
            toastError({text: this.$t('messages.uploadError')})
          })

        } else if (this.sendingData) {
          // This shouldn't run unless user deletes html elements and tries to press 'add' button again
          toastError({text: this.$t('messages.easterEggError')})
        } else {
          toastError({text: this.$t('messages.checkForm')})
        }

      },

      cancelRequest() {
        this.previousRequest.abort()
      },

      formatDataForUpload(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload)

        // Building correct fields
        if (objectToUpload.type !== null) uploadableObject.type = objectToUpload.type.id
        if (objectToUpload.language !== null) uploadableObject.language = objectToUpload.language.id
        if (objectToUpload.journal !== null) uploadableObject.journal = objectToUpload.journal.id


        /**************************
         *** RELATED DATA START ***
         **************************/

        if (objectToUpload.locality !== null && typeof objectToUpload.locality !== 'undefined') {
          if (objectToUpload.locality.length === 0) uploadableObject.locality = null
        }
        if (objectToUpload.attachment !== null && typeof objectToUpload.attachment !== 'undefined') {
          if (objectToUpload.attachment.length === 0) uploadableObject.attachment = null
        }

        /************************
         *** RELATED DATA END ***
         ************************/



        console.log('This object is sent in string format:')
        console.log(uploadableObject)

        return JSON.stringify(uploadableObject)
      },



      /**************************
       *** AUTOCOMPLETE START ***
       **************************/

      maybeGetTypes() {
        return this.autocomplete.types.length <= 0 ? this.getTypes() : null
      },

      getTypes() {
        this.searchingTypes = true;

        fetchListReferenceTypes({value__isnull: 'false', value_en__isnull: 'false',}).then(response => {
          if (response.status === 200) {
            if (response.body.count > 0) {
              this.autocomplete.types = response.body.results;
            } else {
              this.autocomplete.types = []
            }
          }
          this.searchingTypes = false;
        }, errResponse => {
          this.searchingTypes = false;
        })
      },

      maybeGetLanguages() {
        return this.autocomplete.languages.length <= 0 ? this.getLanguages() : null
      },

      getLanguages() {
        this.searchingLanguages = true;

        fetchListLanguages({value__isnull: 'false', value_en__isnull: 'false'}).then(response => {
          if (response.status === 200) {
            if (response.body.count > 0) {
              this.autocomplete.languages = response.body.results;
            } else {
              this.autocomplete.languages = []
            }
          }
          this.searchingLanguages = false;
        }, errResponse => {
          this.searchingLanguages = false;
        })
      },

      getJournals(query) {
        if (query.length > 0) {
          this.searchingJournals = true;

          fetchJournals(query).then(response => {
            if (response.status === 200) {
              if (response.body.count > 0) this.autocomplete.journals = response.body.results;
              else this.autocomplete.journals = []
            }
            this.searchingJournals = false;
          }, errResponse => {
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
       *** RELATED DATA START  ***
       ***************************/

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

      /*************************
       *** RELATED DATA END  ***
       *************************/



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

      openInNewWindow(params) {
        if (typeof (params.width) === 'undefined') {
          params.width = 800;
        }
        if (typeof (params.height) === 'undefined') {
          params.height = 750;
        }
        window.open(location.origin + '/' + params.object + '/add', '', 'width=' + params.width + ',height=' + params.height)
      },

      reset() {
        this.reference = {
          reference: null,
          author: null,
          type: {
            "id": 1,
            "value": "artikkel ajakirjas",
            "value_en": "article in journal"
          },
          language: {
            "id": 1,
            "value": "inglise",
            "value_en": "English"
          },
          year: null,
          title: null,
          title_original: null,
          book: null,
          bookOriginal: null,
          publisher: null,
          publisher_place: null,
          journal: null,
          journal_additional: null,
          volume: null,
          number: null,
          pages: null,
          figures: null,
          doi: null,
          url: null,
          isbn: null,
          issn: null,
          abstract: null,
          author_keywords: null,
          journal_txt: null,
          remarks: null,
          is_oa: '0',
          is_private: '0',
          is_locked: '0',
          related_data: {
            locality: null,
            attachment: null,
            keyword: null,
          }
        }
      },

    }

  }
</script>

<style scoped>
  label {
	margin-bottom: 0.1rem;
    font-size: 0.9rem;
	color: #666;
  }

  .dragging {
    color: #fff;
    background-color: #007bff;
  }

  .delete-relation {
    transition: background-color 500ms ease-in-out;
    vertical-align: middle;
  }

  .delete-relation:hover {
    cursor: pointer;
    background-color: rgba(220,53,69, 0.7);
  }
  
  @media (min-width: 576px) {
	  .lbl-right {
		  text-align: right;
	  }
  }
</style>
