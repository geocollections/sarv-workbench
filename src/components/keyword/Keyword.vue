<template>
  <div>
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- GENERAL INFO -->
    <fieldset class="border p-2 mb-2" ref="info" id="block-info">
      <legend class="w-auto" :class="{'text-primary': !block.info}" @click="block.info = !block.info">
        {{ $t('keyword.generalInfo') }}
        <font-awesome-icon icon="project-diagram"/>
      </legend>

      <transition name="fade">
        <div v-if="block.info">

          <!-- KEYWORD, LANGAUGE and KEYWORD CATEGORY -->
          <div class="row">
            <div class="col-md-4">
              <label :for="`keyword`">{{ $t('keyword.keyword') }}:</label>
              <b-form-input id="name" v-model="keyword.keyword" :state="isDefinedAndNotNull(keyword.keyword)" type="text" maxlength="100"></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`language`">{{ $t('keyword.language') }}:</label>
              <vue-multiselect v-model="keyword.language"
                               id="project"
                               :options="autocomplete.language"
                               track-by="id"
                               :label="commonLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :class="isDefinedAndNotNull(keyword.language) ? 'valid' : 'invalid'"
                               :allow-empty="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-4">
              <label :for="`keyword_category`">{{ $t('keyword.keyword_category') }}:</label>
              <vue-multiselect id="keyword_category"
                               v-model="keyword.keyword_category"
                               :label="nameLabel"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.keyword_category"
                               :options="autocomplete.keyword_category"
                               :class="isDefinedAndNotNull(keyword.keyword_category) ? 'valid' : 'invalid'"
                               @search-change="autocompleteKeywordCategorySearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[nameLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

          <!-- RELATED KEYWORD and REMARKS -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`related_keyword`">{{ $t('keyword.related_keyword') }}:</label>
              <vue-multiselect id="related_keyword"
                               v-model="keyword.related_keyword"
                               label="keyword"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.related_keyword"
                               :options="autocomplete.related_keyword"
                               @search-change="autocompleteRelatedKeywordSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.keyword }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label :for="`remarks`">{{ $t('keyword.remarks') }}:</label>
              <b-form-input id="remarks" v-model="keyword.remarks" type="text"></b-form-input>
            </div>
          </div>

        </div>
      </transition>
    </fieldset>
  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import formManipulation from "../../mixins/formManipulation";
  import autocompleteMixin from "../../mixins/autocompleteMixin";
  import {fetchListLanguages, fetchKeyword, fetchKeywords} from "../../assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'

  export default {
    name: "Keyword",
    components: {
      Spinner,
      VueMultiselect
    },
    mixins: [formManipulation, autocompleteMixin],

    data() {
      return this.setInitialData()
    },

    created() {
      // USED BY SIDEBAR
      if (this.$route.meta.isEdit) {
        const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
        let params = (searchHistory && searchHistory !== 'fallbackValue') ? searchHistory : this.searchParameters;
        // let params = this.isDefinedAndNotNull(searchHistory) && searchHistory.hasOwnProperty('id') && searchHistory !== 'fallbackValue' && searchHistory !== '[object Object]' ? searchHistory : this.searchParameters;
        this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', {
          searchHistory: 'keywordSearchHistory',
          defaultSearch: this.setDefaultSearchParameters(),
          search: params,
          request: 'FETCH_KEYWORDS',
          title: 'header.keywords',
          object: 'keyword',
          field: 'keyword',
          databaseId: this.databaseId,
          block: this.block
        });
      }

      this.loadFullInfo();
    },

    '$route.params.id': {
      handler: function (newVal, oldVal) {
        this.reloadData()
      },
      deep: true
    },

    methods: {
      setInitialData() {
        return {
          searchHistory: 'keywordSearchHistory',
          copyFields: ['id', 'keyword', 'language', 'keyword_category', 'related_keyword', 'remarks'],
          autocomplete: {
            loaders: {
              keyword_category: false,
              related_keyword: false
            },
            language: [],
            keyword_category: [],
            related_keyword: []
          },
          requiredFields: ['keyword', 'language', 'keyword_category'],
          keyword: {
            language: {
              id: 1,
              value: 'inglise',
              value_en: 'English',
            }
          },
          previousRecord: {},
          nextRecord: {},
          searchParameters: this.setDefaultSearchParameters(),
          block: {
            info: true,
          }
        }
      },

      loadFullInfo() {
        fetchListLanguages().then(response => {
          this.autocomplete.language = this.handleResponse(response);
        });

        if (this.$route.meta.isEdit) {
          this.sendingData = true;

          fetchKeyword(this.$route.params.id).then(response => {
            let handledResponse = this.handleResponse(response);
            if (handledResponse.length > 0) {
              this.keyword = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.keyword);
              this.removeUnnecessaryFields(this.keyword, this.copyFields);

              this.$emit('data-loaded', this.keyword);
              this.$emit('set-object', 'keyword');
              this.sendingData = false;
              // this.getListRecords('keyword')

            } else {
              this.sendingData = false;
            }
          });

        }
      },

      formatDataForUpload(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload);

        if (this.isDefinedAndNotNull(objectToUpload.language)) uploadableObject.language = objectToUpload.language.id;
        if (this.isDefinedAndNotNull(objectToUpload.keyword_category)) uploadableObject.keyword_category = objectToUpload.keyword_category.id;
        if (this.isDefinedAndNotNull(objectToUpload.related_keyword)) uploadableObject.related_keyword = objectToUpload.related_keyword.id;

        console.log('This object is sent in string format:');
        console.log(uploadableObject);
        return JSON.stringify(uploadableObject)
      },

      fillAutocompleteFields(obj) {
        this.keyword.language = { id: obj.language, value: obj.language__value, value_en: obj.language__value_en};
        this.keyword.keyword_category = { id: obj.keyword_category, name: obj.keyword_category__name, name_en: obj.keyword_category__name_en };
        this.keyword.related_keyword = { id: obj.related_keyword, keyword: obj.related_keyword__keyword };
      },

      fetchList(localStorageData) {
        console.log(localStorageData)
        let params = this.isDefinedAndNotNull(localStorageData) && localStorageData !== 'fallbackValue' && localStorageData !== '[object Object]' ? localStorageData : this.searchParameters;
        return new Promise((resolve) => {
          resolve(fetchKeywords(params))
        });
      },

      setDefaultSearchParameters() {
        return {
          id: null,
          term: null,
          language: null,
          keyword_category: null,
          related_keyword: null,
          page: 1,
          paginateBy: 10,
          orderBy: '-id',
        }
      },
    }
  }
</script>

<style scoped>
  label {
    margin: 5px 0 0 0;
    color: #999;
    font-size: 0.8rem;
  }
</style>
