<template>
  <div class="reference">
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- REQUIRED INFO -->
    <fieldset class="border p-2 mb-2" id="block-requiredFields"
              :style="!validate('reference') ? 'border-color: #dc3545!important;' : ''">
      <legend class="w-auto mb-0"
              :class="{ 'text-primary': !block.requiredFields, 'text-danger': !validate('reference') }"
              @click="block.requiredFields = !block.requiredFields">
        {{ $t('doi.requiredFields') }}
        <font-awesome-icon v-if="validate('reference')" color="#28a745" icon="check"/>
        <font-awesome-icon v-if="!validate('reference')" color="#dc3545" icon="exclamation-triangle"/>
      </legend>

      <transition name="fade">
        <div v-if="block.requiredFields">

          <!-- REFERENCE and YEAR -->
          <div class="row">
            <div class="col-md-9">
              <label :for="`reference`">{{ $t('reference.reference') }}:</label>
              <b-form-input id="reference" v-model="reference.reference"
                            :state="isDefinedAndNotNull(reference.reference)" type="text"></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`year`">{{ $t('reference.year') }}:</label>
              <b-form-input id="year" v-model="reference.year" :state="isDefinedAndNotNull(reference.year)"
                            type="number"></b-form-input>
            </div>
          </div>

          <!-- AUTHOR -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`author`">{{ $t('reference.author') }}:</label>
              <b-form-input id="author" v-model="reference.author" :state="isDefinedAndNotNull(reference.author)"
                            type="text"></b-form-input>
            </div>
          </div>


          <!-- TITLE -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`title`">{{ $t('reference.title') }}:</label>
              <b-form-textarea :key="componentKey" id="title" v-model="reference.title"
                               :state="isDefinedAndNotNull(reference.title)" type="text"
                               :rows="1" :max-rows="4"></b-form-textarea>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>

    <!-- GENERAL INFO -->
    <fieldset class="border p-2 mb-2" id="block-info">
      <legend class="w-auto" :class="{ 'text-primary': !block.info }" @click="block.info = !block.info">
        {{ $t('reference.info') }}
        <font-awesome-icon icon="project-diagram"/>
      </legend>

      <transition name="fade">
        <div v-if="block.info">

          <!-- TITLE ORIGINAL -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`title_original`">{{ $t('reference.titleOriginal') }}:</label>
              <b-form-textarea :key="componentKey" id="title_original" v-model="reference.title_original" type="text"
                               :rows="1" :max-rows="4"></b-form-textarea>
            </div>
          </div>

          <!-- TYPE, LANGUAGE -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`type`">{{ $t('reference.type') }}:</label>
              <vue-multiselect v-model="reference.type"
                               id="type"
                               :options="autocomplete.types"
                               track-by="id"
                               :label="commonLabel"
                               :loading="autocomplete.loaders.types"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ $i18n.locale=== 'ee' ? option.value : option.value_en }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label :for="`language`">{{ $t('reference.language') }}:</label>
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
            <div class="col-md-6">
              <label :for="`journal`">{{ $t('reference.journal') }}:</label>
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
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.journal_name }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label :for="`journal_additional`">{{ $t('reference.journalAdditional') }}:</label>
              <b-form-input id="journal_additional" v-model="reference.journal_additional" type="text"></b-form-input>
            </div>

          </div>

          <!-- VOLUME and NUMBER -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`volume`">{{ $t('reference.volume') }}:</label>
              <b-form-input id="volume" v-model="reference.volume" type="text"></b-form-input>
            </div>

            <div class="col-md-6">
              <label :for="`number`">{{ $t('reference.number') }}:</label>
              <b-form-input id="number" v-model="reference.number" type="text"></b-form-input>
            </div>
          </div>

          <!-- PAGES and BOOK EDITOR -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`pages`">{{ $t('reference.pages') }}:</label>
              <b-form-input id="pages" v-model="reference.pages" type="text"></b-form-input>
            </div>

            <div class="col-md-6">
              <label :for="`book_editor`">{{ $t('reference.book_editor') }}:</label>
              <b-form-input id="book_editor" v-model="reference.book_editor" type="text"></b-form-input>
            </div>
          </div>

          <!-- BOOK and BOOK ORIGINAL -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`book`">{{ $t('reference.book') }}:</label>
              <b-form-input id="book" v-model="reference.book" type="text"></b-form-input>
            </div>

            <div class="col-md-6">
              <label :for="`book_original`">{{ $t('reference.bookOriginal') }}:</label>
              <b-form-input id="book_original" v-model="reference.book_original" type="text"></b-form-input>
            </div>
          </div>

          <!-- PUBLISHER and PUBLISHER PLACE -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`publisher`">{{ $t('reference.publisher') }}:</label>
              <b-form-input id="publisher" v-model="reference.publisher" type="text"></b-form-input>
            </div>

            <div class="col-md-6">
              <label :for="`publisher_place`">{{ $t('reference.publisherPlace') }}:</label>
              <b-form-input id="publisher_place" v-model="reference.publisher_place" type="text"></b-form-input>
            </div>
          </div>

          <!-- DOI and URL-->
          <div class="row">
            <div class="col-7 col-md-5">
              <label :for="`doi`">DOI:</label>
              <b-form-input id="doi" v-model="reference.doi" type="text"></b-form-input>

            </div>

            <div class="col-5 col-md-2">
              <label :for="`check-doi`" style="visibility: hidden; display: block;">DOI:</label>
              <b-button id="check-doi" variant="info" :disabled="!isDefinedAndNotNull(reference.doi)" @click="checkDoi">
                {{ $t('reference.checkDoi') }}
              </b-button>
            </div>

            <div class="col-sm-12 col-md-5">
              <label :for="`url`">URL:</label>
              <b-form-input id="url" v-model="reference.url" type="text"></b-form-input>
            </div>
          </div>

          <!-- ISBN and ISSN -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`isbn`">ISBN:</label>
              <b-form-input id="isbn" v-model="reference.isbn" type="text"></b-form-input>
            </div>

            <div class="col-md-6">
              <label :for="`issn`">ISSN:</label>
              <b-form-input id="issn" v-model="reference.issn" type="text"></b-form-input>
            </div>
          </div>

          <!-- ABSTRACT -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`abstract`">{{ $t('reference.abstract') }}:</label>
              <b-form-textarea :key="componentKey" id="abstract" v-model="reference.abstract" type="text" size="sm"
                               :rows="1" :max-rows="20"></b-form-textarea>
            </div>
          </div>

        </div>
      </transition>


    </fieldset>

    <!-- REMARKS and KEYWORDS -->
    <fieldset class="border p-2 mb-2" id="block-description">
      <legend class="w-auto" :class="{ 'text-primary': !block.description }"
              @click="block.description = !block.description">
        {{ $t('reference.description') }}
        <font-awesome-icon icon="pen-fancy"/>
      </legend>

      <transition name="fade">
        <div v-if="block.description">

          <!-- AUTHOR KEYWORDS -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`author_keywords`">{{ $t('reference.authorKeywords') }}:</label>
              <b-form-input id="author_keywords" v-model="reference.author_keywords" type="text"></b-form-input>
            </div>
          </div>

          <!-- REMARKS -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`remarks`">{{ $t('reference.remarks') }}:</label>
              <b-form-textarea :key="componentKey" id="remarks" v-model="reference.remarks" type="text" size="sm"
                               :rows="1" :max-rows="20"></b-form-textarea>
            </div>
          </div>

          <!-- ALLOW TEMPORARILY USER TAGS -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`tags`">Kasutaja märksõnad (ajutine lahendus):</label>
              <b-form-input id="tags" v-model="reference.tags" type="text"></b-form-input>
            </div>
          </div>

          <!-- REFERENCE KEYWORDS -->
          <div class="row">
            <div class="col-10 col-md-11">
              <label :for="`keyword`">{{ $t('reference.referenceKeyword') }}:</label>
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

            <div class="col-2 col-md-1 pl-0">
              <label style="visibility: hidden; display: block;">Empty</label>
              <button class="btn btn-outline-danger" :title="$t('add.inputs.keywordsRemove')"
                      :disabled="!isDefinedAndNotEmpty(relatedData.keyword)"
                      @click="relatedData.keyword = null">
                <font-awesome-icon icon="trash-alt"></font-awesome-icon>
              </button>
            </div>
          </div>

        </div>
      </transition>

    </fieldset>

    <!-- DIGITAL VERSION (PDF) -->
    <fieldset class="border p-2 mb-2" v-if="$route.meta.isEdit" id="block-digital">
      <legend class="w-auto" :class="{ 'text-primary': !block.digital }" @click="block.digital = !block.digital">
        {{ $t('reference.relatedTables.attachmentDigital') }}
        <font-awesome-icon icon="file-pdf"/>
      </legend>

      <transition name="fade">
        <div v-if="block.digital">

          <multimedia-component v-if="attachment.length === 0" v-on:file-uploaded="addFiles" :recordOptions="false"
                                acceptable-format="application/pdf" :accept-multiple="false"/>
          <file-table :attachments="attachment" object="reference" v-if="attachment.length > 0"/>

        </div>
      </transition>

    </fieldset>

    <!-- RELATED FILES -->
    <fieldset class="border p-2 mb-2" id="block-files">
      <legend class="w-auto" :class="{ 'text-primary': !block.files }" @click="block.files = !block.files">
        {{ $t('reference.relatedTables.attachment') }}
        <font-awesome-icon icon="folder-open"/>
      </legend>

      <transition name="fade">
        <div v-if="block.files">

          <div class="row">
            <div class="col">
              <!-- loader is 'attachment3' because of #158, regarding problem 2 -->
              <vue-multiselect v-model="relatedData.attachment"
                               id="attachment"
                               :multiple="true"
                               track-by="id"
                               :options="autocomplete.attachment"
                               :internal-search="false"
                               :preserve-search="true"
                               :close-on-select="false"
                               @search-change="autcompleteAttachmentSearch3"
                               :custom-label="customLabelForAttachment"
                               :loading="autocomplete.loaders.attachment3"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

          <file-table :attachments="relatedData.attachment" object="reference"
                      v-if="relatedData.attachment.length > 0"/>

        </div>
      </transition>

    </fieldset>

    <!-- RELATED LIBRARIES -->
    <fieldset class="border p-2 mb-2" id="block-libraries">
      <legend class="w-auto" :class="{ 'text-primary': !block.libraries }" @click="block.libraries = !block.libraries">
        {{ $t('reference.relatedTables.library') }}
        <font-awesome-icon icon="book"/>
      </legend>

      <transition name="fade">
        <div v-if="block.libraries">

          <div class="row">
            <div class="col-10 col-md-11">
              <vue-multiselect v-model="relatedData.library"
                               id="library"
                               :multiple="true"
                               track-by="id"
                               :options="autocomplete.library"
                               :internal-search="false"
                               :preserve-search="true"
                               :close-on-select="false"
                               @search-change="autcompleteLibrarySearch"
                               :custom-label="customLabelForLibrary"
                               :loading="autocomplete.loaders.library"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-2 col-md-1 pl-0">
              <button class="btn btn-outline-danger" :title="$t('add.inputs.keywordsRemove')"
                      :disabled="!isDefinedAndNotEmpty(relatedData.library)"
                      @click="relatedData.library = []">
                <font-awesome-icon icon="trash-alt"></font-awesome-icon>
              </button>
            </div>
          </div>

        </div>
      </transition>

    </fieldset>

    <!-- RELATED LOCALITIES -->
    <fieldset class="border p-2 mb-2" id="block-localities">
      <legend class="w-auto" :class="{ 'text-primary': !block.localities }"
              @click="block.localities = !block.localities">
        {{ $t('reference.relatedTables.locality') }}
        <font-awesome-icon icon="map-marked"/>
      </legend>

      <transition name="fade">
        <div v-if="block.localities">

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

                  <td v-translate="{et:entity.locality,en:entity.locality_en}"></td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </transition>

    </fieldset>

    <!-- SHOWING RELATED_DATA -->
    <div class="row">
      <div class="col mt-4">
        <ul class="nav nav-tabs tab-links mb-3" style="flex-wrap: nowrap !important">
          <li class="nav-item">
            <a href="#" v-on:click.prevent="setActiveTab('locality_reference')" class="nav-link"
               :class="{ active: activeTab === 'locality_reference' }">
              {{ $t('reference.relatedTables.locality_reference') }}
            </a>
          </li>
        </ul>

        <locality-reference :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                            v-on:related-data-added="addRelatedData"
                            v-on:related-data-modified="editRelatedData"
                            v-on:edit-row="editRow"
                            v-on:allow-remove-row="allowRemove"/>

        <div class="row mb-4 pt-1">
          <div class="col pagination-center"
               v-if="relatedData[activeTab] !== null && relatedData[activeTab].length > 0">
            <b-pagination
              size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="relatedData.count[activeTab]"
              v-model="relatedData.page[activeTab]" :per-page="10">
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
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false, 'reference', true)"
                :title="$t('edit.buttons.saveAndLeave') ">
          <font-awesome-icon icon="door-open"/>
          {{ $t('edit.buttons.saveAndLeave') }}
        </button>

        <button class="btn btn-success mr-2 mb-2 pr-5 pl-5" :disabled="sendingData"
                @click="add(true, 'reference', true)"
                :title="$t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') ">
          <font-awesome-icon icon="save"/>
          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}
        </button>

        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="reset('reference', $route.meta.isEdit)"
                :title="$t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') ">
          <font-awesome-icon icon="ban"/>
          {{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}
        </button>

        <button v-if="$route.meta.isEdit && showDoiButton()" class="float-right btn btn-primary mb-2"
                :disabled="sendingData"
                @click="addNewDoi()">
          <font-awesome-icon :icon="['far', 'plus-square']"/>
          {{ $t('edit.buttons.saveNewDoi') }}
        </button>
      </div>
    </div>


  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import sidebarMixin from './../mixins/sidebarMixin'
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
    fetchLibrariesForReference,
    fetchAddDoi,
    fetchAddAttachmentLink,
    fetchAddDoiGeolocation
  } from "../../assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'
  import {toastSuccess, toastError} from "@/assets/js/iziToast/iziToast";
  import formManipulation from './../mixins/formManipulation'
  import autocompleteFieldManipulation from './../mixins/autocompleFormManipulation'
  import copyForm from './../mixins/copyForm'
  import LocalityReference from "./relatedTables/LocalityReference"
  import FileTable from "../partial/FileTable";
  import LocalityTable from "../locality/LocalityTable";
  import MultimediaComponent from "../partial/MultimediaComponent";
  import fontAwesomeLib from "../mixins/fontAwasomeLib";
  import permissionsMixin from "../mixins/permissionsMixin";
  import {toastInfo} from "../../assets/js/iziToast/iziToast";
  import localStorageMixin from "../mixins/localStorageMixin";

  export default {
    name: "Reference",
    components: {
      MultimediaComponent,
      LocalityTable,
      VueMultiselect,
      Spinner,
      LocalityReference,
      FileTable
    },
    mixins: [formManipulation, copyForm, autocompleteFieldManipulation, sidebarMixin, fontAwesomeLib, permissionsMixin, localStorageMixin],

    data() {
      return this.setInitialData()
    },
    computed: {
      sidebarUserAction() {
        return this.$store.state['sidebarUserAction']
      }
    },
    created() {
      // USED BY SIDEBAR
      if (this.$route.meta.isEdit) {
        const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
        let params = this.isDefinedAndNotNull(searchHistory) && searchHistory.hasOwnProperty('id') && searchHistory !== 'fallbackValue' && searchHistory !== '[object Object]' ? searchHistory : this.searchParameters;
        this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', {
          searchHistory: 'referenceSearchHistory',
          defaultSearch: this.setDefaultSearchParameters(),
          search: params,
          request: 'FETCH_REFERENCES',
          title: 'header.references',
          object: 'reference',
          field: 'reference',
          block: this.block
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
      'sidebarUserAction'(newval, oldval) {
        this.handleSidebarUserAction(newval, 'reference')
      },
      'newlyAddedDoiId'(newval, oldval) {
        if (typeof newval !== 'undefined' && newval !== null) {
          let attachment = this.attachment;
          let locality = this.relatedData.locality;

          if (typeof attachment !== 'undefined' && attachment !== null && attachment.length > 0) {
            let attachmentLinkFormData = new FormData();
            attachmentLinkFormData.append('data', JSON.stringify({
              doi: newval,
              attachment: attachment[0].id,
            }));
            fetchAddAttachmentLink(attachmentLinkFormData).then(response => {
              if (response.status === 200) this.toastResponseMessages(response)
            }, errResponse => {
              toastError({text: 'Attachment Link upload failed!'});
            });
          }
          if (typeof locality !== 'undefined' && locality !== null && locality.length > 0) {
            let doiGeolocationFormData = new FormData();
            locality.forEach((entity) => {
              doiGeolocationFormData.append('data', JSON.stringify({
                doi: newval,
                locality: entity.id
              }))
            })
            fetchAddDoiGeolocation(doiGeolocationFormData).then(response => {
              if (response.status === 200) this.toastResponseMessages(response)
            }, errResponse => {
              toastError({text: 'Doi Geolocation upload failed!'});
            });
          }

          this.$router.push({path: '/doi/' + newval})
        }
      }
    },

    methods: {

      setTab(type) {
        this.activeTab = type
      },

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
              attachment3: false, // For #158, regarding p-2
              library: false,
            },
            types: [],
            languages: [],
            journals: [],
            keyword: [],
            locality: [],
            attachment: [],
            library: [],
          },
          requiredFields: ['reference', 'year', 'author', 'title'],
          reference: {
            year: '' // Adding it because of reactivity issue
          },
          previousRecord: {},
          nextRecord: {},
          searchParameters: this.setDefaultSearchParameters(),
          attachment: {},
          doi: {},
          newlyAddedDoiId: null,
          componentKey: 0,
          block: {
            requiredFields: true,
            info: true,
            description: true,
            digital: true,
            files: true,
            libraries: true,
            localities: true
          }
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

        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          fetchReference(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);
            if (handledResponse.length > 0) {
              this.reference = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.reference)
              this.removeUnnecessaryFields(this.reference, this.copyFields);
              this.forceRerender()
              this.$emit('data-loaded', this.reference)
              this.$emit('set-object', 'reference')
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
                original_filename: entity.attachment__original_filename,
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

          fetchLibrariesForReference(this.$route.params.id).then(response => {
            let library = this.handleResponse(response)

            this.relatedData.library = library.map(entity => {
              return {
                id: entity.library,
                title: entity.library__title,
                title_en: entity.library__title_en,
              }
            })
          })

          // FETCH FIRST TAB RELATED DATA
          this.tabs.forEach(entity => {
            this.loadRelatedData(entity);
          });

          this.$on('tab-changed', this.setTab);

          this.$emit('related-data-info', this.tabs);

          this.setActiveTab('locality_reference')
        }

      },

      forceRerender() {
        this.componentKey += 1;
      },

      setDefaultRelatedData() {
        return {
          locality_reference: [],
          attachment: [],
          keyword: [],
          locality: [],
          library: [],
          copyFields: {
            locality_reference: ['locality', 'type', 'pages', 'figures', 'remarks'],
          },
          insert: {
            locality_reference: {},
          },
          page: {
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
        uploadableObject.related_data.library = this.relatedData.library

        console.log('This object is sent in string format:')
        console.log(uploadableObject)
        return JSON.stringify(uploadableObject)
      },

      fillAutocompleteFields(obj) {
        this.reference.type = {id: obj.type__id, value: obj.type__value, value_en: obj.type__value_en}
        this.reference.language = {id: obj.language__id, value: obj.language__value, value_en: obj.language__value_en}
        this.reference.journal = {id: obj.journal__id, journal_name: obj.journal__journal_name}
      },

      fillRelatedDataAutocompleteFields(obj) {
        obj.locality = {locality: obj.locality__locality, locality_en: obj.locality__locality_en, id: obj.locality}
        return obj
      },

      // TODO: Put request here, which are currently in loadFullInfo method + blockVisibility
      loadRelatedData(object) {
        let query;

        if (object === 'locality_reference') {
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
      checkRequiredFields(type) {

      },

      formatRelatedData(objectToUpload) {
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
          orderBy: this.multiOrdering ? ['-id', '-year'] : '-id',
          // orderBy: '-id',
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

      customLabelForLibrary(option) {
        if (this.$i18n.locale === 'ee') return `${option.id} - (${option.title})`
        return `${option.id} - (${option.title_en})`
      },

      checkDoi() {
        this.sendingData = true;
        fetchDoiCheck(this.reference.doi).then(response => {
          this.sendingData = false;
          if (response.status === 200) {
            if (response.body.status === 'ok') {
              this.updateFieldsUsingDoi(response.body.message)
            }
          }
        }, errResponse => {
          console.log(errResponse)
          this.sendingData = false;
          toastError({text: this.$t('reference.doiCheckUnsuccessful')})
        })
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
            if (typeof data.author[item].given !== 'undefined' && data.author[item].given.includes(' ')) {
              let given = data.author[item].given.split(' ')
              let givenFormatted = given.map((name, index) => given[index].charAt(0).toUpperCase()) // ['Test', 'hello'] --> ['T', 'H']

              // If family is all caps then change it
              if (data.author[item].family === data.author[item].family.toUpperCase()) {
                // Todo: If caps contains '-' then add use case
                // First name is abbreviated
                author += data.author[item].family.charAt(0).toUpperCase()
                  + data.author[item].family.substring(1).toLowerCase() + ', '
                  + givenFormatted.join('. ') + '., '
              } else {
                // First name is abbreviated
                author += data.author[item].family + ', ' + givenFormatted.join('. ') + '., '
              }
            } else {
              if (data.author[item].family === data.author[item].family.toUpperCase()) {
                author += data.author[item].family.charAt(0).toUpperCase()
                  + data.author[item].family.substring(1).toLowerCase() + ', '
                  + data.author[item].given.charAt(0).toUpperCase() + '., '
              } else {
                author += data.author[item].family + ', ' + data.author[item].given.charAt(0).toUpperCase() + '., '
              }
            }
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
        if (data.page) {
          if (typeof this.reference.pages !== 'undefined' && this.reference.pages !== null) {
            if (!this.reference.pages.includes('-')) this.reference.pages = data.page
            else if (this.reference.pages.includes('-') && data.page.includes('-')) this.reference.pages = data.page
          } else {
            this.reference.pages = data.page
          }
        }
        if (data.URL) this.reference.url = data.URL
        if (data.publisher) this.reference.publisher = data.publisher

        toastInfo({text: this.$t('reference.doiCheckSuccessful')})
      },

      addFiles(data) {
        this.addFileAsObject(data, 'reference', this.reference);
      },

      /**
       * Returns boolean value wether to show DOI button or not.
       *
       * (this.isDefinedAndNotNull(this.reference.type) && this.reference.type.id > 3) --> Checks if type exists and id is higher than 3
       * this.isDefinedAndNotNullAndNotEmptyString(this.reference.doi) --> Checks if DOI exists
       * this.isUserAllowedTo('add', 'doi') --> Checks if user has rights to add to doi table
       * (this.validate('reference') === 1) --> Checks if reference required fields are filled
       */
      showDoiButton() {
        return this.isDefinedAndNotNull(this.reference.type) && this.reference.type.id > 3
          && this.isDefinedAndNotNullAndNotEmptyString(this.reference.doi)
          && this.isUserAllowedTo('add', 'doi') && this.validate('reference') === 1
      },

      // newlyAddedDoiID watcher triggers DOI related data requests + route push
      addNewDoi() {
        if (this.validate('reference')) {
          // TODO: Should make into nicer modal or something
          // Asking for user confirmation
          if (confirm(this.$t('reference.doiConfirmation'))) {
            this.sendingData = true;

            let doiFormData = new FormData();
            doiFormData.append('data', JSON.stringify({
              creators: this.reference.author,
              publication_year: this.reference.year,
              title: this.reference.title,
              title_alternative: this.reference.title_original,
              language: this.reference.language.id,
              publisher: this.reference.publisher,
              abstract: this.reference.abstract,
              reference: this.reference.id,
              subjects: this.reference.author_keywords + this.reference.tags,
              resource_type: 12,
              version: 1.0,
              formats: 'pdf',
            }));

            fetchAddDoi(doiFormData).then(response => {
              if (response.status === 200) {
                // Watcher triggers DOI related data requests + route push
                this.newlyAddedDoiId = response.body.id
                this.sendingData = false
                this.toastResponseMessages(response)
              }
            }, errResponse => {
              this.sendingData = false
              toastError({text: 'DOI upload failed!'});
            });
          } else {
            toastInfo({text: this.$t('messages.userCancelled')})
          }
        } else toastError({text: this.$t('messages.checkForm')})
      },

    },
  }
</script>

<style scoped>
  label {
    margin: 5px 0 0 0;
    /*padding: 0;*/
    color: #999;
    font-size: 0.8rem;
  }

  .link:hover {
    cursor: pointer;
  }
</style>
