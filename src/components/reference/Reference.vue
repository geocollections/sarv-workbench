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
        <i v-if="validate('reference')" class="fas fa-check text-success"></i>
        <i v-if="!validate('reference')" class="fas fa-exclamation-triangle text-danger"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.requiredFields">

          <!-- REFERENCE and YEAR -->
          <div class="row">
            <div class="col-md-3">
              <label :for="`reference`">{{ $t('reference.reference') }}:</label>
              <b-form-input id="reference" v-model="reference.reference"
                            :state="isNotEmpty(reference.reference)" type="text"></b-form-input>
            </div>

            <div class="col-md-2">
              <label :for="`year`">{{ $t('reference.year') }}:</label>
              <b-form-input id="year" v-model="reference.year" :state="isNotEmpty(reference.year)"
                            type="number"></b-form-input>
            </div>

          <!-- AUTHOR -->

            <div class="col-sm-7">
              <label :for="`author`">{{ $t('reference.author') }}:</label>
              <b-form-input id="author" v-model="reference.author" :state="isNotEmpty(reference.author)"
                            type="text"></b-form-input>
            </div>
          </div>


          <!-- TITLE -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`title`">{{ $t('reference.title') }}:</label>
              <b-form-textarea id="title" v-model="reference.title"
                               :state="isNotEmpty(reference.title)" type="text"
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
        <i class="fas fa-project-diagram"></i>
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
                  <label :for="`doi`">
                    DOI:
                    <a v-if="reference.doi" class="link text-primary" :href="getDoiUrl(reference.doi)" target="_blank" rel="noopener noreferrer">
                      <i class="fas fa-external-link-alt"></i>
                    </a>
                  </label>
                  <b-form-input id="doi" v-model="reference.doi" type="text"></b-form-input>
                </div>

                <div class="mx-3">
                  <label :for="`check-doi`" style="visibility: hidden; display: block;">DOI:</label>
                  <b-button id="check-doi" variant="info" :disabled="!isNotEmpty(reference.doi)" @click="checkDoi">
                    {{ $t('reference.checkDoi') }}
                  </b-button>
                </div>
              </div>
            </div>

            <!-- URL -->
            <div class="flex-grow-1">
              <label :for="`url`">
                URL:
                <a v-if="reference.url && isValidUrl" class="link text-primary" :href="reference.url" target="_blank">
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
        <i class="fas fa-project-diagram"></i>
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
              <b-form-textarea id="title_original" v-model="reference.title_original" type="text"
                               :rows="1" :max-rows="4"></b-form-textarea>
            </div>
          <!-- TITLE TRANSLATED -->
            <div class="col-sm-6">
              <label :for="`title_translated`">{{ $t('reference.titleTranslated') }}:</label>
              <b-form-textarea id="title_translated" v-model="reference.title_translated" type="text"
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
        <i class="fas fa-pen-fancy"></i>
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
                      :disabled="!isNotEmpty(relatedData.keyword)"
                      @click="relatedData.keyword = null">
                <i class="far fa-trash-alt"></i>
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
    <div class="d-flex flex-row flex-wrap mb-2">
      <div class="px-2">
        <b-form-checkbox id="is_oa" v-model="reference.is_oa">
          {{ $t('reference.is_oa') }}
        </b-form-checkbox>
      </div>

      <div class="px-2">
        <b-form-checkbox id="is_private" v-model="reference.is_private">
          {{ $t('otherFiles.private') }}
        </b-form-checkbox>
      </div>

      <div class="px-2">
        <b-form-checkbox id="is_locked" v-model="reference.is_locked">
          {{ $t('otherFiles.locked') }}
        </b-form-checkbox>
      </div>

      <div class="px-2">
        <b-form-checkbox id="is_estonian_reference" v-model="reference.is_estonian_reference">
          {{ $t('reference.is_estonian_reference') }}
        </b-form-checkbox>
      </div>

      <div class="px-2">
        <b-form-checkbox id="is_estonian_author" v-model="reference.is_estonian_author">
          {{ $t('reference.is_estonian_author') }}
        </b-form-checkbox>
      </div>
    </div>

    <!-- DIGITAL VERSION (PDF) -->
    <fieldset class="border-top px-2 mb-2" v-if="$route.meta.isEdit" id="block-digital">
      <legend class="w-auto my-0 mb-2" :class="{ 'text-primary': !block.digital }" @click="block.digital = !block.digital">
        {{ $t('reference.relatedTables.attachmentDigital') }}
        <i class="far fa-file-pdf"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.digital">

          <multimedia-component v-if="attachment.length === 0"
                                v-on:file-uploaded="addPDF"
                                :recordOptions="false"
                                acceptable-format="application/pdf"
                                :accept-multiple="false"
                                :show-try-again-button="true"/>
          <file-table :attachments="attachment" object="reference" v-if="attachment.length > 0"/>

        </div>
      </transition>

    </fieldset>

    <!-- RELATED FILES -->
    <fieldset class="border-top px-2 mb-2" id="block-files">
      <legend class="w-auto my-0" :class="{ 'text-primary': !block.files }" @click="block.files = !block.files">
        {{ $t('reference.relatedTables.attachment') }}
        <i class="far fa-folder-open"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.files">

          <div class="d-flex justify-content-between">
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
                      :disabled="!isNotEmpty(relatedData.attachment)"
                      @click="relatedData.attachment = []">
                <i class="far fa-trash-alt"></i>
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
        <i class="fas fa-book"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.libraries">

          <div class="d-flex justify-content-between">
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
                      :disabled="!isNotEmpty(relatedData.library)"
                      @click="relatedData.library = []">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
          </div>

        </div>
      </transition>

    </fieldset>

    <!-- RELATED LOCALITIES -->
<!--    <fieldset v-if="!$route.meta.isEdit" class="border-top px-2 mb-2" id="block-localities">-->
<!--      <legend class="w-auto my-0" :class="{ 'text-primary': !block.localities }"-->
<!--              @click="block.localities = !block.localities">-->
<!--        {{ $t('reference.relatedTables.locality') }}-->
<!--        <font-awesome-icon icon="map-marked"/>-->
<!--      </legend>-->

<!--      <transition name="fade">-->
<!--        <div v-show="block.localities">-->

<!--          <div class="row">-->
<!--            <div class="col">-->
<!--              <label :for="`locality`">{{ $t('reference.localities') }}:</label>-->
<!--              <vue-multiselect v-model="relatedData.locality"-->
<!--                               id="locality"-->
<!--                               :multiple="true"-->
<!--                               track-by="id"-->
<!--                               :options="autocomplete.locality"-->
<!--                               :internal-search="false"-->
<!--                               :preserve-search="true"-->
<!--                               :close-on-select="false"-->
<!--                               @search-change="autocompleteLocalitySearch2"-->
<!--                               :custom-label="customLabelForLocality"-->
<!--                               :loading="autocomplete.loaders.locality"-->
<!--                               :placeholder="$t('add.inputs.autocomplete')"-->
<!--                               :show-labels="false">-->
<!--                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>-->
<!--              </vue-multiselect>-->
<!--            </div>-->
<!--          </div>-->

<!--          <div class="row mt-2" v-if="relatedData.locality.length > 0">-->
<!--            <div class="table-responsive-sm col-12">-->
<!--              <table class="table table-hover table-bordered">-->
<!--                <thead class="thead-light">-->
<!--                <tr>-->
<!--                  <th>ID</th>-->
<!--                  <th>{{ $t('reference.relatedTables.locality') }}</th>-->
<!--                </tr>-->
<!--                </thead>-->
<!--                <tbody>-->
<!--                <tr v-for="entity in relatedData.locality">-->
<!--                  <td @click="windowOpenNewTab('locality', '/locality/' + entity.id)" class="link">-->
<!--                    <font-awesome-icon size="1x" icon="eye" color="blue"/>-->
<!--                    {{ entity.id }}-->
<!--                  </td>-->

<!--                  <td v-translate="{et:entity.locality,en:entity.locality_en}"></td>-->
<!--                </tr>-->
<!--                </tbody>-->
<!--              </table>-->
<!--            </div>-->
<!--          </div>-->

<!--        </div>-->
<!--      </transition>-->

<!--    </fieldset>-->

    <!-- SHOWING RELATED_DATA -->
    <div class="row">
      <div class="col mt-2">

        <ul class="nav nav-tabs nav-fill mb-3">

          <li class="nav-item" v-for="tab in relatedTabs" :key="tab.name">
            <a href="#" @click.prevent="setTab(tab.name)" class="nav-link" :class="{ active: activeTab === tab.name }">
              <span>{{ $t('reference.relatedTables.' + tab.name) }}</span>

              <span>
                <sup>
                  <b-badge pill variant="light">{{ relatedData.count[tab.name] }}&nbsp;</b-badge>
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
              v-model="relatedData.searchParameters[activeTab].page" :per-page="relatedData.searchParameters[activeTab].paginateBy">
            </b-pagination>
          </div>
        </div>

        <locality-reference :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"
                            v-on:add-related-data="addRelatedData"
                            v-on:set-default="setDefault"
                            v-on:edit-row="editRow"
                            v-on:remove-row="removeRow" />
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import sidebarMixin from '../../mixins/sidebarMixin'
  import {
    fetchReference,
    fetchListReferenceTypes,
    fetchListLanguages,
    fetchDoiCheck,
    fetchReferenceKeyword,
    fetchAttachmentLink,
    fetchLocalityReferenceForReference,
    fetchAttachmentForReference,
    fetchLibrariesForReference,
    fetchAddDoi,
    fetchAddAttachmentLink,
    fetchAddDoiGeolocation,
    fetchJournal, fetchListLocalityReferenceType
  } from "../../assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'
  import {toastError} from "@/assets/js/iziToast/iziToast";
  import formManipulation from '../../mixins/formManipulation'
  import autocompleteMixin from '../../mixins/autocompleteMixin'
  import copyForm from '../../mixins/copyForm'
  import LocalityReference from "./relatedTables/LocalityReference"
  import FileTable from "../partial/FileTable";
  import LocalityTable from "../locality/LocalityTable";
  import MultimediaComponent from "../partial/MultimediaComponent";
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
      Spinner,
      LocalityReference,
      FileTable
    },
    mixins: [formManipulation, copyForm, autocompleteMixin, sidebarMixin, formSectionsMixin],

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

      ...mapState(["currentUser", "databaseId"])
    },

    created() {
      // USED BY SIDEBAR
      if (this.$route.meta.isEdit) {
        const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
        let params = this.isNotEmpty(searchHistory) && searchHistory.hasOwnProperty('id') && searchHistory !== 'fallbackValue' ? searchHistory : this.searchParameters;
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
      'relatedData.searchParameters': {
        handler: function (newVal, oldVal) {
          this.loadRelatedData(this.activeTab)
        },
        deep: true
      },
      // This value is changed in formManipulation.js when file upload is successful (value will be savedObjectsId)
      'isFileAddedAsObject': {
        handler: function (newVal, oldVal) {
          if (this.isNotEmpty(newVal)) fetchAttachmentForReference(this.$route.params.id).then(response => this.attachment = this.handleResponse(response));
        }
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
          relatedTabs: [
            { name: 'locality_reference', iconClass: 'fas fa-globe' },
          ],
          searchHistory: 'referenceSearchHistory',
          activeTab: 'locality_reference',
          relatedData: this.setDefaultRelatedData(),
          copyFields: ['id', 'reference', 'year', 'author', 'title', 'title_original', 'title_translated', 'type', 'language', 'journal', 'journal_additional',
            'volume', 'number', 'pages', 'book_editor', 'book', 'book_original', 'publisher', 'publisher_place', 'doi', 'url', 'isbn',
            'issn', 'abstract', 'author_keywords', 'remarks', 'book_editor', 'figures', 'is_locked',
            'is_oa', 'is_private', 'is_estonian_reference', 'is_estonian_author', 'language'],
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
              locality_reference_type: false,
            },
            types: [],
            languages: [],
            journals: [],
            keyword: [],
            locality: [],
            attachment: [],
            library: [],
            locality_reference_type: [],
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
        this.loadAutocompleteFields();

        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          this.$emit('set-object', 'reference');

          fetchReference(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);

            if (handledResponse.length > 0) {
              this.$emit('object-exists', true);
              this.reference = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.reference);

              this.removeUnnecessaryFields(this.reference, this.copyFields);
              this.$emit('data-loaded', this.reference);
              this.sendingData = false;
            } else {
              this.sendingData = false;
              this.$emit('object-exists', false);
            }
          });

          this.loadAutocompleteFields(false, true);

          // Load Related Data which is in tabs
          this.relatedTabs.forEach(tab => {
            this.loadRelatedData(tab.name);
          });

          this.$on('tab-changed', this.setTab);

          this.$emit('related-data-info', this.relatedTabs.map(tab => tab.name));

          this.setTab('locality_reference')
        }

      },

      loadAutocompleteFields(regularAutocompleteFields = true, relatedDataAutocompleteFields = false) {
        if (regularAutocompleteFields) {
          fetchListReferenceTypes().then(response => this.autocomplete.types = this.handleResponse(response));
          fetchListLanguages().then(response => this.autocomplete.languages = this.handleResponse(response));
          // fetchListKeywords().then(response => this.autocomplete.keyword = this.handleResponse(response));
          // fetchListLibraries(this.currentUser.id).then(response => this.autocomplete.library = this.handleResponse(response));
          // Related data autocomplete list
          fetchListLocalityReferenceType().then(response => this.autocomplete.locality_reference_type = this.handleResponse(response))
        }

        if (relatedDataAutocompleteFields) {
          fetchReferenceKeyword(this.$route.params.id).then(response => {
            let referenceKeyword = this.handleResponse(response);
            this.relatedData.keyword = referenceKeyword.map(entity => {
              return {
                keyword: entity.keyword__keyword,
                id: entity.keyword
              }
            })
          });

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
          });

          fetchAttachmentForReference(this.$route.params.id).then(response => this.attachment = this.handleResponse(response));
          fetchLibrariesForReference(this.$route.params.id).then(response => this.relatedData.library = this.handleResponse(response));
          // fetchListLocalityReferenceType().then(response => this.autocomplete.locality_reference_type = this.handleResponse(response))
        }
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
          insert: this.setDefaultInsertRelatedData(),
          searchParameters: {
            locality_reference: {
              page: 1,
              paginateBy: 10,
              orderBy: 'id'
            },
            attachment: {
              page: 1,
              paginateBy: 10,
              orderBy: 'id'
            },
            keyword: {
              page: 1,
              paginateBy: 10,
              orderBy: 'id'
            },
            locality: {
              page: 1,
              paginateBy: 10,
              orderBy: 'id'
            },
          },
          count: {
            locality_reference: 0,
            attachment: 0,
            keyword: 0,
            locality: 0,
          }
        }
      },

      setDefaultInsertRelatedData() {
        return {
          locality_reference: {},
        }
      },

      formatDataForUpload(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload);

        // Autocomplete fields
        if (this.isNotEmpty(objectToUpload.type)) uploadableObject.type = objectToUpload.type.id;
        if (this.isNotEmpty(objectToUpload.language)) uploadableObject.language = objectToUpload.language.id;
        if (this.isNotEmpty(objectToUpload.journal)) uploadableObject.journal = objectToUpload.journal.id;


        // Adding related data
        uploadableObject.related_data = {};

        if (this.isNotEmpty(this.relatedData.keyword)) uploadableObject.related_data.keyword = this.relatedData.keyword;
        else uploadableObject.related_data.keyword = null;

        if (this.isNotEmpty(this.relatedData.attachment)) uploadableObject.related_data.attachment = this.relatedData.attachment;
        else uploadableObject.related_data.attachment = null;

        if (this.isNotEmpty(this.relatedData.library)) {
          uploadableObject.related_data.library = cloneDeep(this.relatedData.library);
          uploadableObject.related_data.library.forEach((library, index) => {
            uploadableObject.related_data.library[index] = {
              id: library.library ? library.library : library.id
            }
          });
        } else uploadableObject.related_data.library = null;

        // Adding related data only on add view
        if (!this.$route.meta.isEdit) {
          // uploadableObject.related_data = {};
          if (this.isNotEmpty(this.relatedData.locality_reference)) {
            uploadableObject.related_data.locality = cloneDeep(this.relatedData.locality_reference);
            uploadableObject.related_data.locality.forEach((loc_ref, index) => {
              uploadableObject.related_data.locality[index]['id'] = loc_ref.locality
            });
          } else uploadableObject.related_data.locality = null
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
        obj.type = {id: obj.type, value: obj.type__value, value_en: obj.type__value_en};
        return obj
      },

      unformatRelatedDataAutocompleteFields(obj, objectID) {
        let newObject = cloneDeep(obj);

        if (objectID) newObject.id = objectID;

        if (this.isNotEmpty(obj.locality)) {
          newObject.locality = obj.locality.id;
          newObject.locality__locality = obj.locality.locality;
          newObject.locality__locality_en = obj.locality.locality_en;
        }
        if (this.isNotEmpty(obj.type)) {
          newObject.type = obj.type.id;
          newObject.type__value = obj.type.value;
          newObject.type__value_en = obj.type.value_en;
        }

        return newObject
      },

      // TODO: Put request here, which are currently in loadFullInfo method + blockVisibility
      loadRelatedData(object) {
        let query;

        if (object === 'locality_reference') {
          query = fetchLocalityReferenceForReference(this.$route.params.id, this.relatedData.searchParameters.locality_reference)
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
        uploadableObject.reference = this.reference.id;

        if (this.isNotEmpty(uploadableObject.locality)) {
          uploadableObject.locality = uploadableObject.locality.id ? uploadableObject.locality.id : uploadableObject.locality;
        }
        if (this.isNotEmpty(uploadableObject.type)) {
          uploadableObject.type = uploadableObject.type.id ? uploadableObject.type.id : uploadableObject.type;
        }

        console.log('This object is sent in string format (related data):')
        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
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
          isEstonianReference: null,
          isEstonianAuthor: null,
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
       * (this.isNotEmpty(this.reference.type) && this.reference.type.id > 3) --> Checks if type exists and id is higher than 3
       * this.isDefinedAndNotNullAndNotEmptyString(this.reference.doi) --> Checks if DOI exists
       * this.isUserAllowedTo('add', 'doi') --> Checks if user has rights to add to doi table
       * (this.validate('reference') === 1) --> Checks if reference required fields are filled
       */
      showDoiButton() {
        return this.isNotEmpty(this.reference.type) && this.reference.type.id > 3
          && this.isNotEmpty(this.reference.doi)
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
