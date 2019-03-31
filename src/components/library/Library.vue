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
                         v-model="library.agent"
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

    <div v-if="$route.meta.isEdit">
      <hr>

      <div class="row">
        <div class="col-sm-6">
          <p class="h2">{{ $t('library.libraryReference') }}</p>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-2">
          <label :for="`add_reference`">{{ $t('header.addReference') }}:</label>
        </div>

        <div class="col-sm-4 mb-2">
          <b-form-input id="add_reference" type="text"></b-form-input>
        </div>
      </div>

      <library-reference :data="libraryReference" v-on:remove-reference-from-library="removeReference"></library-reference>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import VueMultiselect from 'vue-multiselect'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faTimes} from '@fortawesome/free-solid-svg-icons'
  import { fetchLibrary, fetchLibraries, fetchLibraryReference } from "../../assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'
  import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";
  import formManipulation  from './../mixins/formManipulation'
  import autocompleteFieldManipulation  from './../mixins/autocompleFormManipulation'
  import LibraryReference from "./relatedTables/LibraryReference";

  library.add(faTimes)

  export default {
    name: "Library",
    components: {
      LibraryReference,
      FontAwesomeIcon,
      VueMultiselect,
      Spinner,
    },
    mixins: [formManipulation,autocompleteFieldManipulation],

    data() { return this.setInitialData() },

    created() { this.loadFullInfo() },

    watch: {
      '$route.params.id': {
        handler: function (newval, oldval) {
          this.reloadData()
        },
        deep: true
      }
    },

    methods: {

      // setTab(type) { this.activeTab = type },

      setInitialData() {
        return {
          searchHistory: 'librarySearchHistory',
          copyFields: ['id', 'agent', 'year', 'title', 'title_en', 'keywords', 'abstract', 'abstract_en', 'is_private'],
          autocomplete: {
            loaders: { agent: false },
            agent: [],
          },
          requiredFields: [],
          library: {},
          libraryReference: {},
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

          fetchLibraryReference(this.$route.params.id).then(response => {
            let handleResponse = this.handleResponse(response);
            if (handleResponse.length > 0) {
              this.libraryReference = this.handleResponse(response);
            }
          });
        }
      },

      formatDataForUpload(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload)
        if (this.isDefinedAndNotNull(objectToUpload.agent)) uploadableObject.agent = objectToUpload.agent.id

        console.log('This object is sent in string format:')
        console.log(uploadableObject)
        return JSON.stringify(uploadableObject)
      },

      fillAutocompleteFields(obj){
        this.library.agent = { agent: obj.author__agent, id: obj.author }
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
          paginateBy: 50,
          orderBy: '-id',
        }
      },

      removeReference(reference) {
        console.log('REMOVE: ' + reference)
      }
    }
  }
</script>

<style scoped>

</style>
