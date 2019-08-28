<template>
  <div class="reference">
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- REQUIRED INFO -->
    <fieldset class="border-top px-2 mb-2" id="block-requiredFields"
              :style="!validate('reference') ? 'border-color: #dc3545!important;' : ''">
      <legend class="w-auto my-0"
              :class="{ 'text-primary': !block.requiredFields, 'text-danger': !validate('reference') }"
              @click="block.requiredFields = !block.requiredFields">
        {{ $t('doi.requiredFields') }}
        <font-awesome-icon v-if="validate('reference')" color="#28a745" icon="check"/>
        <font-awesome-icon v-if="!validate('reference')" color="#dc3545" icon="exclamation-triangle"/>
      </legend>

      <transition name="fade">
        <div v-show="block.requiredFields">

          <!-- REFERENCE and YEAR -->
          <div class="row">
            <div class="col-md-3">
              <label :for="`reference`">{{ $t('reference.reference') }}:</label>
              <b-form-input id="reference" v-model="reference.reference"
                            :state="isDefinedAndNotNull(reference.reference)" type="text"></b-form-input>
            </div>

            <div class="col-md-2">
              <label :for="`year`">{{ $t('reference.year') }}:</label>
              <b-form-input id="year" v-model="reference.year" :state="isDefinedAndNotNull(reference.year)"
                            type="number"></b-form-input>
            </div>

          <!-- AUTHOR -->

            <div class="col-sm-7">
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
    <fieldset class="border-top px-2 mb-2" id="block-info">
      <legend class="w-auto my-0" :class="{ 'text-primary': !block.info }" @click="block.info = !block.info">
        {{ $t('reference.info') }}
        <font-awesome-icon icon="project-diagram"/>
      </legend>

      <transition name="fade">
        <div v-show="block.info">

          <!-- TYPE, LANGUAGE -->
          <div class="row">
            <div class="col-md-4">
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
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-4">
              <label :for="`language`">{{ $t('reference.language') }}:</label>
              <vue-multiselect v-model="reference.language"
                               id="language"
                               :options="autocomplete.languages"
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
            <div class="col-md-4">
              <label :for="`pages`">{{ $t('reference.pages') }}:</label>
              <b-form-input id="pages" v-model="reference.pages" type="text"></b-form-input>
            </div>
          </div>

          <!-- JOURNAL -->
          <div class="row">
            <div class="col-md-4">
              <label :for="`journal`">{{ $t('reference.journal') }}:</label>
              <vue-multiselect v-model="reference.journal"
                               id="journal"
                               label="journal_name"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.journals"
                               :options="autocomplete.journals"
                               @search-change="autocompleteJournalSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.journal_name }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-4">
              <label :for="`journal_additional`">{{ $t('reference.journalAdditional') }}:</label>
              <b-form-input id="journal_additional" v-model="reference.journal_additional" type="text"></b-form-input>
            </div>
            <div class="col-md-2">
            <label :for="`volume`">{{ $t('reference.volume') }}:</label>
            <b-form-input id="volume" v-model="reference.volume" type="text"></b-form-input>
          </div>

          <div class="col-md-2">
            <label :for="`number`">{{ $t('reference.number') }}:</label>
            <b-form-input id="number" v-model="reference.number" type="text"></b-form-input>
          </div>
        </div>

          <!-- VOLUME and NUMBER -->
          <div class="row">

          </div>

          <!-- PAGES and BOOK EDITOR -->
          <div class="row">


          </div>

          <!-- BOOK and BOOK ORIGINAL -->
          <div class="row">
            <div class="col-md-3">
              <label :for="`book`">{{ $t('reference.book') }}:</label>
              <b-form-input id="book" v-model="reference.book" type="text"></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`book_editor`">{{ $t('reference.book_editor') }}:</label>
              <b-form-input id="book_editor" v-model="reference.book_editor" type="text"></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`publisher`">{{ $t('reference.publisher') }}:</label>
              <b-form-input id="publisher" v-model="reference.publisher" type="text"></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`publisher_place`">{{ $t('reference.publisherPlace') }}:</label>
              <b-form-input id="publisher_place" v-model="reference.publisher_place" type="text"></b-form-input>
            </div>

          </div>

          <!-- PUBLISHER and PUBLISHER PLACE -->
          <div class="row">

          </div>

          <!-- DOI and URL-->
          <div class="d-flex flex-wrap">

            <!-- DOI -->
            <div class="flex-grow-1">
              <div class="d-flex">
                <div class="flex-grow-1">
                  <label :for="`doi`">DOI:</label>
                  <b-form-input id="doi" v-model="reference.doi" type="text"></b-form-input>
                </div>

                <div class="mx-3">
                  <label :for="`check-doi`" style="visibility: hidden; display: block;">DOI:</label>
                  <b-button id="check-doi" variant="info" :disabled="!isDefinedAndNotNull(reference.doi)" @click="checkDoi">
                    {{ $t('reference.checkDoi') }}
                  </b-button>
                </div>
              </div>
            </div>

            <!-- URL -->
            <div class="flex-grow-1">
              <label :for="`url`">
                URL:
                <a v-if="reference.url" class="link text-primary" :href="reference.url" target="_blank">
                  <i class="fas fa-external-link-alt"></i>
                </a>
              </label>
              <b-form-input id="url" v-model="reference.url" type="text" :state="isValidUrl"></b-form-input>
              <b-form-text v-if="!isValidUrl">{{ $t('add.errors.url') }}.</b-form-text>
            </div>
            </div>

        </div>
      </transition>
    </fieldset>

    <!-- OTHER DATA -->
    <fieldset class="border-top px-2 mb-2" id="block-other">
      <legend class="w-auto my-0" :class="{ 'text-primary': !block.other }" @click="block.other = !block.other">
          {{ $t('reference.otherData') }}
          <font-awesome-icon icon="project-diagram"/>
      </legend>

      <transition name="fade">
        <div v-show="block.other">

          <!-- ABSTRACT and AUTHOR KEYWORDS -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`abstract`">{{ $t('reference.abstract') }}:</label>
              <editor :data.sync="reference.abstract" />
            </div>

            <!-- AUTHOR KEYWORDS -->
            <div class="col-sm-12">
              <label :for="`author_keywords`">{{ $t('reference.authorKeywords') }}:</label>
              <b-form-input id="author_keywords" v-model="reference.author_keywords" type="text"></b-form-input>
            </div>
          </div>
          <!-- TITLE ORIGINAL -->
          <div class="row">
            <div class="col-sm-6">
              <label :for="`title_original`">{{ $t('reference.titleOriginal') }}:</label>
              <b-form-textarea :key="componentKey" id="title_original" v-model="reference.title_original" type="text"
                               :rows="1" :max-rows="4"></b-form-textarea>
            </div>
          <!-- TITLE TRANSLATED -->
            <div class="col-sm-6">
              <label :for="`title_translated`">{{ $t('reference.titleTranslated') }}:</label>
              <b-form-textarea :key="componentKey" id="title_translated" v-model="reference.title_translated" type="text"
                               :rows="1" :max-rows="4"></b-form-textarea>
            </div>
          </div>
          <!-- BOOK and BOOK ORIGINAL -->
          <div class="row">
            <div class="col-md-12">
              <label :for="`book_original`">{{ $t('reference.bookOriginal') }}:</label>
              <b-form-input id="book_original" v-model="reference.book_original" type="text"></b-form-input>
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


        </div>
      </transition>
    </fieldset>

    <!-- REMARKS and REFERENCE KEYWORDS -->
    <fieldset class="border-top px-2 mb-2" id="block-description">
      <legend class="w-auto my-0" :class="{ 'text-primary': !block.description }"
              @click="block.description = !block.description">
        {{ $t('reference.description') }}
        <font-awesome-icon icon="pen-fancy"/>
      </legend>

      <transition name="fade">
        <div v-show="block.description">


          <!-- REFERENCE KEYWORDS -->
          <div class="d-flex justify-content-start flex-wrap">
            <div class="mr-3 flex-grow-1">
              <label :for="`keyword`">{{ $t('reference.referenceKeyword') }}:</label>
              <vue-multiselect v-model="relatedData.keyword"
                               id="keyword"
                               label="keyword"
                               track-by="id"
                               :multiple="true"
                               :placeholder="$t('add.inputs.keywords')"
                               :loading="autocomplete.loaders.keyword"
                               :options="autocomplete.keyword"
                               @search-change="autocompleteKeywordSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :close-on-select="false"
                               :show-labels="true">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>

              <!-- KEYWORD INPUT USING GROUP BY -->
<!--              <vue-multiselect v-model="relatedData.keyword"-->
<!--                               id="keyword"-->
<!--                               label="keyword"-->
<!--                               track-by="id"-->
<!--                               :multiple="true"-->
<!--                               :placeholder="$t('add.inputs.keywords')"-->
<!--                               :loading="autocomplete.loaders.keyword"-->
<!--                               :options="autocomplete.keyword"-->
<!--                               @search-change="autocompleteKeywordSearch"-->
<!--                               :internal-search="false"-->
<!--                               :preserve-search="true"-->
<!--                               :clear-on-select="false"-->
<!--                               :close-on-select="false"-->
<!--                               :show-labels="true"-->
<!--                               :group-label="keywordCategoryLabel"-->
<!--                               group-values="group_results"-->
<!--                               :group-select="true">-->
<!--                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>-->
<!--              </vue-multiselect>-->
            </div>

            <div class="mr-3 my-1 align-self-end">
              <button class="btn btn-outline-danger" :title="$t('add.inputs.keywordsRemove')"
                      :disabled="!isDefinedAndNotEmpty(relatedData.keyword)"
                      @click="relatedData.keyword = null">
                <font-awesome-icon icon="trash-alt"></font-awesome-icon>
              </button>
            </div>

            <div class="mr-2 my-1 align-self-end">
              <router-link class="btn btn-outline-primary"
                           :title="$t('add.new')"
                           :to="{ name: 'Keyword add', query: { reference: JSON.stringify(reference) } }"
                           target="_blank">
                <i class="fas fa-plus"></i>
              </router-link>
            </div>
          </div>

          <!-- REMARKS -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`remarks`">{{ $t('reference.remarks') }}:</label>
              <b-form-input id="reference.remarks" v-model="reference.remarks" type="text"></b-form-input>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- CHECKBOXES -->
    <div class="d-flex flex-row flex-wrap">
      <div class="px-2">
        <b-form-checkbox id="is_oa" v-model="reference.is_oa" :value="true" :unchecked-value="false">
          {{ $t('reference.is_oa') }}
        </b-form-checkbox>
      </div>

      <div class="px-2">
        <b-form-checkbox id="is_private" v-model="reference.is_private" :value="true" :unchecked-value="false">
          {{ $t('otherFiles.private') }}
        </b-form-checkbox>
      </div>

      <div class="px-2">
        <b-form-checkbox id="is_locked" v-model="reference.is_locked" :value="true" :unchecked-value="false">
          {{ $t('otherFiles.locked') }}
        </b-form-checkbox>
      </div>

      <div class="px-2">
        <b-form-checkbox id="is_estonian_reference" v-model="reference.is_estonian_reference" :value="true" :unchecked-value="false">
          {{ $t('reference.is_estonian_reference') }}
        </b-form-checkbox>
      </div>
    </div>


    <!-- DIGITAL VERSION (PDF) -->
    <fieldset class="border-top px-2 mb-2" v-if="$route.meta.isEdit" id="block-digital">
      <legend class="w-auto my-0" :class="{ 'text-primary': !block.digital }" @click="block.digital = !block.digital">
        {{ $t('reference.relatedTables.attachmentDigital') }}
        <font-awesome-icon icon="file-pdf"/>
      </legend>

      <transition name="fade">
        <div v-show="block.digital">

          <multimedia-component v-if="attachment.length === 0" v-on:file-uploaded="addPDF" :recordOptions="false"
                                acceptable-format="application/pdf" :accept-multiple="false"/>
          <file-table :attachments="attachment" object="reference" v-if="attachment.length > 0"/>

        </div>
      </transition>

    </fieldset>

    <!-- RELATED FILES -->
    <fieldset class="border-top px-2 mb-2" id="block-files">
      <legend class="w-auto my-0" :class="{ 'text-primary': !block.files }" @click="block.files = !block.files">
        {{ $t('reference.relatedTables.attachment') }}
        <font-awesome-icon icon="folder-open"/>
      </legend>

      <transition name="fade">
        <div v-show="block.files">

          <div class="d-flex justify-content-start flex-wrap">
            <div class="mr-3 flex-grow-1">
              <label :for="`attachment`">{{ $t('reference.attachments') }}:</label>
              <vue-multiselect v-model="relatedData.attachment"
                               id="attachment"
                               :custom-label="customLabelForAttachment"
                               track-by="id"
                               :multiple="true"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.attachment3"
                               :options="autocomplete.attachment"
                               @search-change="autocompleteAttachmentSearch3"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :close-on-select="false"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="mr-3 my-1 align-self-end">
              <button class="btn btn-outline-danger"
                      :disabled="!isDefinedAndNotEmpty(relatedData.attachment)"
                      @click="relatedData.attachment = []">
                <font-awesome-icon icon="trash-alt"></font-awesome-icon>
              </button>
            </div>
          </div>

          <file-table :attachments="relatedData.attachment" object="reference"
                      v-if="relatedData.attachment.length > 0"/>

        </div>
      </transition>

    </fieldset>

    <!-- RELATED LIBRARIES -->
    <fieldset class="border-top px-2 mb-2" id="block-libraries">
      <legend class="w-auto my-0" :class="{ 'text-primary': !block.libraries }" @click="block.libraries = !block.libraries">
        {{ $t('reference.relatedTables.library') }}
        <font-awesome-icon icon="book"/>
      </legend>

      <transition name="fade">
        <div v-show="block.libraries">

          <div class="d-flex justify-content-start flex-wrap">
            <div class="mr-3 flex-grow-1">
              <label :for="`library`">{{ $t('reference.libraries') }}:</label>
              <vue-multiselect v-model="relatedData.library"
                               id="library"
                               :custom-label="customLabelForLibrary"
                               track-by="library"
                               :multiple="true"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :options="autocomplete.library"
                               :loading="autocomplete.loaders.library"
                               @search-change="autocompleteLibraryAgentSearch2"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :close-on-select="false"
                               :show-labels="false">
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="mr-3 my-1 align-self-end">
              <button class="btn btn-outline-danger"
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
    <fieldset v-if="!$route.meta.isEdit" class="border-top px-2 mb-2" id="block-localities">
      <legend class="w-auto my-0" :class="{ 'text-primary': !block.localities }"
              @click="block.localities = !block.localities">
        {{ $t('reference.relatedTables.locality') }}
        <font-awesome-icon icon="map-marked"/>
      </legend>

      <transition name="fade">
        <div v-show="block.localities">

          <div class="row">
            <div class="col">
              <label :for="`locality`">{{ $t('reference.localities') }}:</label>
              <vue-multiselect v-model="relatedData.locality"
                               id="locality"
                               :multiple="true"
                               track-by="id"
                               :options="autocomplete.locality"
                               :internal-search="false"
                               :preserve-search="true"
                               :close-on-select="false"
                               @search-change="autocompleteLocalitySearch2"
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
    <div class="row" v-if="$route.meta.isEdit">
      <div class="col mt-2">
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

        <div class="row mb-2 pt-1" v-if="relatedData[activeTab] !== null && relatedData[activeTab].length > 0">
          <div class="col pagination-center">
            <b-pagination
              size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="relatedData.count[activeTab]"
              v-model="relatedData.page[activeTab]" :per-page="10">
            </b-pagination>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import sidebarMixin from '../../mixins/sidebarMixin'
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
    fetchAddDoiGeolocation, fetchLibrariesFromLibraryAgent, fetchListLibraries, fetchJournal
  } from "../../assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'
  import {toastSuccess, toastError} from "@/assets/js/iziToast/iziToast";
  import formManipulation from '../../mixins/formManipulation'
  import autocompleteMixin from '../../mixins/autocompleteMixin'
  import copyForm from '../../mixins/copyForm'
  import LocalityReference from "./relatedTables/LocalityReference"
  import FileTable from "../partial/FileTable";
  import LocalityTable from "../locality/LocalityTable";
  import MultimediaComponent from "../partial/MultimediaComponent";
  import fontAwesomeLib from "../../mixins/fontAwasomeLib";
  import {toastInfo} from "../../assets/js/iziToast/iziToast";
  import formSectionsMixin from "../../mixins/formSectionsMixin";
  import Editor from "../partial/editor/Editor";
  import {mapState} from "vuex";
  import LinkedKeywordTable from "../keyword/LinkedKeywordTable";

  export default {
    name: "Reference",
    components: {
      LinkedKeywordTable,
      Editor,
      MultimediaComponent,
      LocalityTable,
      VueMultiselect,
      Spinner,
      LocalityReference,
      FileTable
    },
    mixins: [formManipulation, copyForm, autocompleteMixin, sidebarMixin, fontAwesomeLib, formSectionsMixin],

    data() {
      return this.setInitialData()
    },
    computed: {
      sidebarUserAction() {
        return this.$store.state['sidebarUserAction']
      },

      isValidUrl() {
        if (this.reference.url && this.reference.url.length > 0) {
          let regex = RegExp('^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$');
          return regex.test(this.reference.url)
        } else return true
      },

      ...mapState(["currentUser"])
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
          copyFields: ['id', 'reference', 'year', 'author', 'title', 'title_original', 'title_translated', 'type', 'language', 'journal', 'journal_additional',
            'volume', 'number', 'pages', 'book_editor', 'book', 'book_original', 'publisher', 'publisher_place', 'doi', 'url', 'isbn',
            'issn', 'abstract', 'author_keywords', 'remarks', 'book_editor', 'figures', 'is_locked',
            'is_oa', 'is_private', 'is_estonian_reference', 'language'],
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
            other: true,
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
        fetchListReferenceTypes().then(response => this.autocomplete.types = this.handleResponse(response));
        fetchListLanguages().then(response => this.autocomplete.languages = this.handleResponse(response));
        // fetchListKeywords().then(response => this.autocomplete.keyword = this.handleResponse(response));
        // fetchListLibraries(this.currentUser.id).then(response => this.autocomplete.library = this.handleResponse(response));

        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          this.$emit('set-object', 'reference');
          fetchReference(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);
            if (handledResponse.length > 0) {
              this.$emit('object-exists', true);
              this.reference = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.reference)
              this.removeUnnecessaryFields(this.reference, this.copyFields);
              this.forceRerender()
              this.$emit('data-loaded', this.reference)
              this.sendingData = false;
              this.getListRecords('reference')
            } else {
              this.sendingData = false;
              this.$emit('object-exists', false);
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

          fetchAttachmentForReference(this.$route.params.id).then(response => this.attachment = this.handleResponse(response));

          fetchLibrariesForReference(this.$route.params.id).then(response => this.relatedData.library = this.handleResponse(response));

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
        if (objectToUpload.is_estonian_reference !== null) uploadableObject.is_estonian_reference = objectToUpload.is_estonian_reference === true ? '1' : '0';

        // Adding related data
        uploadableObject.related_data = {};
        uploadableObject.related_data.keyword = this.relatedData.keyword;
        uploadableObject.related_data.attachment = this.relatedData.attachment;
        uploadableObject.related_data.locality = this.relatedData.locality;
        uploadableObject.related_data.library = cloneDeep(this.relatedData.library);

        if (this.isDefinedAndNotNull(this.relatedData.library)) {
          uploadableObject.related_data.library.forEach((library, index) => {
            uploadableObject.related_data.library[index] = {
              id: library.library ? library.library : library.id
            }
          });
        }

        console.log('This object is sent in string format:');
        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
      },

      fillAutocompleteFields(obj) {
        this.reference.type = {id: obj.type__id, value: obj.type__value, value_en: obj.type__value_en, ris_type: obj.type__ris_type};
        this.reference.language = {id: obj.language__id, value: obj.language__value, value_en: obj.language__value_en, iso1: obj.language__iso1};
        this.reference.journal = {id: obj.journal__id, journal_name: obj.journal__journal_name}
      },

      fillRelatedDataAutocompleteFields(obj) {
        obj.locality = {locality: obj.locality__locality, locality_en: obj.locality__locality_en, id: obj.locality};
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
          abstractRemarks: null,
          keywords: null,
          id: null,
          libraryAuthorIdTitle: null,
          userAdded: null,
          isEstonianReference: false,
          solrSearch: null,
          page: 1,
          paginateBy: 50,
          orderBy: this.isMultiOrdering ? ['-id', '-year'] : '-id',
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
        if (this.$i18n.locale === 'ee') return `${option.library} - (${option.library__title})`
        return `${option.library} - (${option.library__title_en})`
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
          // console.log(errResponse)
          this.sendingData = false;
          toastError({text: this.$t('reference.doiCheckUnsuccessful')})
        })
      },

      updateFieldsUsingDoi(data) {
        let reference = ''

        /* YEAR */
        if (data['published-print']) {
          if (data['published-print']['date-parts'].length > 0) {
            this.reference.year = data['published-print']['date-parts'][0][0] + ''
            reference = this.reference.year
          }
        } else if (data.issued) {
          if (data.issued['date-parts'].length > 0) {
            this.reference.year = data.issued['date-parts'][0][0] + ''
            reference = this.reference.year
          }
        }

        /* AUTHOR */
        if (data.author && data.author.length > 0) {
          let author = '';
          let authorForReferenceField = '';

          // Author for reference field
          if (data.author.length === 1) authorForReferenceField = data.author[0].family + ', ';
          else if (data.author.length === 2) authorForReferenceField = data.author[0].family + ' & ' + data.author[1].family + ', ';
          else if (data.author.length > 2) authorForReferenceField = data.author[0].family + ' et al., ';

          for (let item in data.author) {
            if (typeof data.author[item].given !== 'undefined' && data.author[item].given.includes(' ')) {
              let given = data.author[item].given.split(' ');
              let givenFormatted = given.map((name, index) => given[index].charAt(0).toUpperCase()); // ['Test', 'hello'] --> ['T', 'H']

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
          this.reference.author = author.trim().slice(0, -1);
          reference = authorForReferenceField + reference
        }

        this.reference.reference = reference;

        if (data['container-title'] && data['container-title'].length > 0) {
          let journalName = data['container-title'][0]
          fetchJournal(journalName).then(response => {
            let journal = this.handleResponse(response)
            if (journal.length === 1) this.reference.journal = { id: journal[0].id, journal_name: journal[0].journal_name }
          })
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
        // if (data.URL) this.reference.url = data.URL
        if (data.publisher) {
          if (data.type !== 'journal-article') this.reference.publisher = data.publisher
        }
        if (data.type === 'journal-article') {
          this.type = {
            id: 1,
            value: 'artikkel ajakirjas',
            value_en: 'article in journal'
          }
        }

        toastInfo({text: this.$t('reference.doiCheckSuccessful')})
      },

      addPDF(fileData) {
        this.addFileAsObject(fileData, 'reference');
      },

      /**
       * Returns boolean value whether to show DOI button or not.
       *
       * (this.isDefinedAndNotNull(this.reference.type) && this.reference.type.id > 3) --> Checks if type exists and id is higher than 3
       * this.isDefinedAndNotNullAndNotEmptyString(this.reference.doi) --> Checks if DOI exists
       * this.isUserAllowedTo('add', 'doi') --> Checks if user has rights to add to doi table
       * (this.validate('reference') === 1) --> Checks if reference required fields are filled
       */
      showDoiButton() {
        return this.isDefinedAndNotNull(this.reference.type) && this.reference.type.id > 3
          && this.isDefinedAndNotNullAndNotEmptyString(this.reference.doi)
          && this.$_permissionsMixin_isUserAllowedTo('add', 'doi') && this.validate('reference') === 1
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
              title_translated: this.reference.title_translated,
              language: this.reference.language.id,
              publisher: this.reference.publisher,
              abstract: this.reference.abstract,
              reference: this.reference.id,
              subjects: this.reference.author_keywords + this.reference.tags, // Todo: Tags was dropped so change it to reference keywords
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

  .url-link {

  }
</style>
