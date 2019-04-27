<template>
  <div class="library">
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">
        {{ $t('library.generalInfo') }}
        <font-awesome-icon icon="project-diagram"/>
      </legend>

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

      <!-- ABSTRACT -->
      <div class="row">
        <div class="col-sm-2">
          <label :for="`abstract`">{{ $t('library.abstract') }}:</label>
        </div>

        <div class="col-sm-10 mb-2">
<!--          <b-form-textarea id="abstract" v-model="library.abstract" type="text" size="sm"-->
<!--                           :rows="1" :max-rows="20"></b-form-textarea>-->

          <editor-menu-bar :editor="editorAbstract">
            <div slot-scope="{ commands, isActive, getMarkAttrs }">

              <form class="mb-1" v-if="linkMenuIsActive" @submit.prevent="setLinkUrl(commands.link, linkUrl, 'editorAbstract')">
                <div class="row">
                  <div class="col-9 pr-0">
                    <input class="form-control form-control-sm" type="text" v-model="linkUrl" placeholder="https://" ref="linkInput" @keydown.esc="hideLinkMenu('editorAbstract')"/>
                  </div>

                  <span>
                    <button class="btn btn-outline-success btn-sm ml-1 mr-1" @click="setLinkUrl(commands.link, linkUrl, 'editorAbstract')">
                      <font-awesome-icon icon="check" />
                    </button>
                  </span>

                  <span>
                    <button class="btn btn-outline-danger btn-sm" @click="setLinkUrl(commands.link, null, 'editorAbstract')">
                      <font-awesome-icon icon="times" />
                    </button>
                  </span>
                </div>
              </form>

              <button
                class="btn btn-outline-dark btn-sm mr-1 mb-1"
                :class="{ 'active': isActive.bold() }"
                @click="commands.bold">
                <strong>Bold</strong>
              </button>

              <button
                class="btn btn-outline-dark btn-sm mr-1 mb-1"
                :class="{ 'active': isActive.italic() }"
                @click="commands.italic">
                <strong><em>Italic</em></strong>
              </button>

              <button
                class="btn btn-outline-dark btn-sm mr-1 mb-1"
                :class="{ 'active': isActive.link() }"
                @click="showLinkMenu(getMarkAttrs('link'), 'editorAbstract')">
                <strong><u>Link</u></strong>
              </button>

            </div>
          </editor-menu-bar>

          <editor-content class="editor editor-sm" :editor="editorAbstract" />
        </div>
      </div>

      <!-- ABSTRACT_EN -->
      <div class="row">
        <div class="col-sm-2">
          <label :for="`abstract_en`">{{ $t('library.abstract_en') }}:</label>
        </div>

        <div class="col-sm-10 mb-2">
<!--          <b-form-textarea id="abstract_en" v-model="library.abstract_en" type="text" size="sm"-->
<!--                           :rows="1" :max-rows="20"></b-form-textarea>-->

          <editor-menu-bar :editor="editorAbstractEn">
            <div slot-scope="{ commands, isActive, getMarkAttrs }">

              <form class="mb-1" v-if="linkMenuIsActiveAbstractEn" @submit.prevent="setLinkUrl(commands.link, linkUrlAbstractEn, 'editorAbstractEn')">
                <div class="row">
                  <div class="col-9 pr-0">
                    <input class="form-control form-control-sm" type="text" v-model="linkUrlAbstractEn" placeholder="https://" ref="linkInputAbstractEn" @keydown.esc="hideLinkMenu('editorAbstractEn')"/>
                  </div>

                  <span>
                    <button class="btn btn-outline-success btn-sm ml-1 mr-1" @click="setLinkUrl(commands.link, linkUrlAbstractEn, 'editorAbstractEn')">
                      <font-awesome-icon icon="check" />
                    </button>
                  </span>

                  <span>
                    <button class="btn btn-outline-danger btn-sm" @click="setLinkUrl(commands.link, null, 'editorAbstractEn')">
                      <font-awesome-icon icon="times" />
                    </button>
                  </span>
                </div>
              </form>

              <button
                class="btn btn-outline-dark btn-sm mr-1 mb-1"
                :class="{ 'active': isActive.bold() }"
                @click="commands.bold">
                <strong>Bold</strong>
              </button>

              <button
                class="btn btn-outline-dark btn-sm mr-1 mb-1"
                :class="{ 'active': isActive.italic() }"
                @click="commands.italic">
                <strong><em>Italic</em></strong>
              </button>

              <button
                class="btn btn-outline-dark btn-sm mr-1 mb-1"
                :class="{ 'active': isActive.link() }"
                @click="showLinkMenu(getMarkAttrs('link'), 'editorAbstractEn')">
                <strong><u>Link</u></strong>
              </button>

            </div>
          </editor-menu-bar>

          <editor-content class="editor editor-sm" :editor="editorAbstractEn" />
        </div>
      </div>

    </fieldset>

    <!-- LIBRARY MEMBERS -->
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">
        {{ $t('library.libraryAgent') }}
        <font-awesome-icon icon="user-friends"/>
      </legend>
      <div class="row">

        <!-- Prop: internal-search must be false otherwise it also filters by label -->
        <div class="col-11 mb-2 mr-0">
          <vue-multiselect v-model="relatedData.library_agent"
                           id="library_agent"
                           @search-change="autcompleteLibraryAgentSearch"
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

        <div class="col-1 mb-2 ml-0 pl-0">
          <button class="btn btn-outline-danger" :title="$t('add.inputs.keywordsRemove')"
                  :disabled="!isDefinedAndNotEmpty(relatedData.library_agent)"
                  @click="relatedData.library_agent = []">
            <font-awesome-icon icon="trash-alt"></font-awesome-icon>
          </button>
        </div>
      </div>
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
              {{ $t('library.relatedTables.libraryReferenceList') }} <font-awesome-icon icon="list-ol"/>
            </a>
          </li>

        </ul>

        <library-reference-list-view :data="relatedData.library_reference_list" :active-tab="activeTab"></library-reference-list-view>

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

        <library-reference :related-data="relatedData" :autocomplete="autocomplete" :active-tab="activeTab"/>
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

    <div class="row mt-3 mb-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false, 'library')">
          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}
        </button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(true, 'library')">
          {{ $t($route.meta.isEdit? 'edit.buttons.saveAndContinue':'add.buttons.addAnother') }}
        </button>
        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData"
                @click="$route.meta.isEdit ? leaveFromEditView('library') : reset('library')">
          {{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}
        </button>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import {library} from '@fortawesome/fontawesome-svg-core'
  import VueMultiselect from 'vue-multiselect'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
  import {faTimes} from '@fortawesome/free-solid-svg-icons'
  import {fetchLibrary, fetchLibraries, fetchLibraryReference, fetchLibraryAgent} from "../../assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'
  import {toastSuccess, toastError} from "@/assets/js/iziToast/iziToast";
  import formManipulation from './../mixins/formManipulation'
  import autocompleteFieldManipulation from './../mixins/autocompleFormManipulation'
  import copyForm from './../mixins/copyForm'
  import LibraryReference from "./relatedTables/LibraryReference";
  import LibraryReferenceListView from "./relatedTables/LibraryReferenceListView";
  import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from 'tiptap'
  import {
    Bold,
    Italic,
    Link,
  } from 'tiptap-extensions'

  library.add(faTimes)

  export default {
    name: "Library",
    components: {
      LibraryReferenceListView,
      LibraryReference,
      FontAwesomeIcon,
      VueMultiselect,
      Spinner,
      EditorContent,
      EditorMenuBar,
      EditorMenuBubble
    },
    mixins: [formManipulation, copyForm, autocompleteFieldManipulation],

    data() {
      return this.setInitialData()
    },

    created() {
      this.loadFullInfo()
    },

    beforeDestroy() {
      this.editor.destroy()
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
          editorAbstract: this.setDefaultEditorData('abstract'),
          editorAbstractEn: this.setDefaultEditorData('abstract_en'),
          linkUrl: null,
          linkMenuIsActive: false,
          linkUrlAbstractEn: null,
          linkMenuIsActiveAbstractEn: false,
        }
      },

      reloadData() {
        Object.assign(this.$data, this.setInitialData());
        this.loadFullInfo()
      },

      loadFullInfo() {
        fetchLibraryAgent(this.$route.params.id).then(response => {
          let libraryAgent = this.handleResponse(response);
          this.relatedData.library_agent = libraryAgent.map(entity => {
            return {
              agent: entity.agent__agent,
              id: entity.agent
            }
          })
        })

        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          fetchLibrary(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);
            if (handledResponse.length > 0) {
              this.library = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.library)
              this.removeUnnecessaryFields(this.library, this.copyFields);
              this.$emit('data-loaded', this.library)
              this.$emit('set-object', 'library')
              this.sendingData = false;
              this.getListRecords('library')
              this.updateEditorContent()
            } else {
              this.sendingData = false;
            }
          });

          // FETCH FIRST TAB RELATED DATA
          this.tabs.forEach(entity => {
            // Skips library_reference_list because it is static view
            if (entity !== 'library_reference_list') {
              console.log(entity)
              this.loadRelatedData(entity);
            }
          });

          this.$on('tab-changed', this.setTab);

          this.$on('related-data-modified', this.editRelatedData);
          this.$on('related-data-added', this.addRelatedData);
          this.$on('edit-row', this.editRow);
          this.$on('allow-remove-row', this.allowRemove);

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
        console.log(localStorageData)
        return new Promise((resolve) => {
          resolve(fetchLibraries(params))
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

      setDefaultEditorData(field) {
        return new Editor({
          extensions: [
            new Bold(),
            new Italic(),
            new Link(),
          ],
          onUpdate: ({ getHTML }) => {
            this.library[field] = getHTML()
          },
        })
      },

      updateEditorContent() {
        this.editorAbstract.setContent(this.library.abstract)
        this.editorAbstractEn.setContent(this.library.abstract_en)
      },

      showLinkMenu(attrs, field) {
        if (field === 'editorAbstract') {
          this.linkUrl = attrs.href
          this.linkMenuIsActive = true
          this.$nextTick(() => {
            this.$refs.linkInput.focus()
          })
        } else {
          this.linkUrlAbstractEn = attrs.href
          this.linkMenuIsActiveAbstractEn = true
          this.$nextTick(() => {
            this.$refs.linkInputAbstractEn.focus()
          })
        }
      },

      hideLinkMenu(field) {
        if (field === 'editorAbstract') {
          this.linkUrl = null
          this.linkMenuIsActive = false
        } else {
          this.linkUrlAbstractEn = null
          this.linkMenuIsActiveAbstractEn = false
        }
      },

      setLinkUrl(command, url, field) {
        command({ href: url })
        this.hideLinkMenu(field)
        this[field].focus()
      },
    }
  }
</script>

<style>
  .editor {
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    -webkit-transition: border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
    transition: border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
    resize: none;
    overflow-y: scroll;
    height: auto;
    max-height: 430px;
  }

  .editor-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    border-radius: 0.2rem;
  }

  .ProseMirror {
    padding: 0.25rem 0.5rem;
  }
</style>
