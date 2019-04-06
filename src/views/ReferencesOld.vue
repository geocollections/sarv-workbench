<template>
  <div class="references">

    <spinner v-show="isLoading && showSearch"
             class="loading-overlay-search"
             text-fg-color="#000000"
             line-fg-color="#5cb85c"
             line-bg-color="#000000"
             :line-size="5"
             size="100"
             :font-size="30"
             :message="$t('edit.isLoading')"></spinner>

    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">{{ $t('references.header') }}</p>
      </div>
      <div class="col-sm-6 text-right">
      	<router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/reference/add' }">{{ $t('add.new') }}</router-link>
      </div>
    </div>

    <!-- SEARCH FIELDS START -->
    <div class="row mt-4">
      <div class="col">
        <div class="search-fields">

          <div class="row">

            <!-- AUTHOR -->
            <div class="col-sm-2">
              <label :for="`author`">{{ $t('editReference.author') }}:</label>
            </div>

            <div class="col-sm-4 mb-2">
              <b-form-input v-model="searchParameters.author" id="author" type="text"></b-form-input>
            </div>

            <!-- YEAR-->
            <div class="col-sm-2">
              <label :for="`year`">{{ $t('editReference.year') }}:</label>
            </div>

            <div class="col-sm-4 mb-2">
              <b-form-input v-model="searchParameters.year" id="year" type="number"></b-form-input>
            </div>
          </div>


          <div class="row">

            <!-- TITLE -->
            <div class="col-sm-2">
              <label :for="`title`">{{ $t('editReference.title') }}:</label>
            </div>

            <div class="col-sm-4 mb-2">
              <b-form-input id="title" v-model="searchParameters.title" type="text"></b-form-input>
            </div>

            <!-- BOOK_JOURNAL -->
            <div class="col-sm-2">
              <label :for="`book_journal`">{{ $t('editReference.bookJournal') }}:</label>
            </div>

            <div class="col-sm-4 mb-2">
              <b-form-input id="book_journal" v-model="searchParameters.bookJournal" type="text"></b-form-input>
            </div>
          </div>


          <div class="row">

            <!-- ABSTRACT + KEYWORDS + REMARKS -->
            <div class="col-sm-2">
              <label :for="`abstract_keywords_remarks`">{{ $t('editReference.abstractKeywordsRemarks') }}:</label>
            </div>

            <div class="col-sm-4 mb-2">
              <b-form-input id="abstract_keywords_remarks" v-model="searchParameters.abstractKeywordsRemarks"
                            type="text"></b-form-input>
            </div>

            <!-- ID -->
            <div class="col-sm-2">
              <label :for="`id`">{{ $t('editReference.id') }}:</label>
            </div>

            <div class="col-sm-4 mb-2">
              <b-form-input v-model="searchParameters.id" id="id" type="number"></b-form-input>
            </div>
          </div>


          <div class="row">
          <!-- Removes search preferences like local storage and search parameters-->
            <div class="col-sm-6 mt-3">
              <b-button class="border border-dark" variant="light" @click="deleteSearchPreferences">{{ $t('buttons.deletePreferences') }}</b-button>
            </div>
            <!-- TOGGLE BETWEEN TABLE AND LIST VIEW -->
            <div class="col-sm-6 mt-3">
              <b-form-group>
                <b-form-radio-group v-model="isListView">
                  <b-form-radio :value="false">{{ $t('references.tableView') }}</b-form-radio>
                  <b-form-radio :value="true">{{ $t('references.listView') }}</b-form-radio>
                </b-form-radio-group>
              </b-form-group>
            </div>
          </div>

        </div>
      </div>
    </div>
    <!-- SEARCH FIELDS END -->


    <div class="row mt-4">
      <div class="col">
          <span>
            <b>{{ $t('references.header') }}</b>
            <sup class="font-larger" v-bind:class="{ 'badge-style': response.count > 0 }">
              <b-badge pill variant="info">{{ response.count }}</b-badge>
            </sup>
          </span>
      </div>
    </div>


    <div class="row mt-3" v-if="response.count > 0">
      <div class="col-sm-6 col-md-3 pl-3 pr-3 t-paginate-by-center">
        <b-form-select v-model="searchParameters.paginateBy" class="mb-3">
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
        <!-- Question: Add export? Answer: No currently not needed -->
        <!--<export-buttons filename="dataSearch"></export-buttons>-->
      </div>

      <div class="col-sm-12 col-md-6 pagination-center">
        <b-pagination
          size="md" align="right" :limit="5" :hide-ellipsis="true" :total-rows="response.count"
          v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
        </b-pagination>
      </div>
    </div>


    <!-- REFERENCE TABLE -->
    <div class="row" v-if="!isListView && response.count > 0">
      <div class="col">

        <div class="table-responsive">
          <table class="table table-hover table-bordered">

            <thead class="thead-light">
            <tr class="th-sort">
              <th>
                  <span @click="changeOrder('id')">
                        <font-awesome-icon
                          v-if="searchParameters.orderBy !== 'id' && searchParameters.orderBy !== '-id'"
                          :icon="sort"/>
                        <font-awesome-icon v-else :icon="sortingDirection"/>
                        ID
                    </span>
              </th>

              <th>
                  <span @click="changeOrder('author')">
                      <font-awesome-icon
                        v-if="searchParameters.orderBy !== 'author' && searchParameters.orderBy !== '-author'"
                        :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection"/>
                      {{ $t('references.author') }}
                  </span>
              </th>

              <th>
                  <span @click="changeOrder('year')">
                      <font-awesome-icon
                        v-if="searchParameters.orderBy !== 'year' && searchParameters.orderBy !== '-year'"
                        :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection"/>
                      {{ $t('references.year') }}
                  </span>
              </th>

              <th>
                  <span @click="changeOrder('title')">
                        <font-awesome-icon
                          v-if="searchParameters.orderBy !== 'title' && searchParameters.orderBy !== '-title'"
                          :icon="sort"/>
                        <font-awesome-icon v-else :icon="sortingDirection"/>
                        {{ $t('references.title') }}
                    </span>
              </th>

              <th>
                  <span @click="changeOrder('journal__journal_name')">
                        <font-awesome-icon
                          v-if="searchParameters.orderBy !== 'journal__journal_name' && searchParameters.orderBy !== '-journal__journal_name'"
                          :icon="sort"/>
                        <font-awesome-icon v-else :icon="sortingDirection"/>
                        {{ $t('references.journal') }}
                    </span>
              </th>

              <th>
                  <span @click="changeOrder('volume')">
                        <font-awesome-icon
                          v-if="searchParameters.orderBy !== 'volume' && searchParameters.orderBy !== '-volume'"
                          :icon="sort"/>
                        <font-awesome-icon v-else :icon="sortingDirection"/>
                        {{ $t('references.volume') }}
                    </span>
              </th>

              <th>
                  <span @click="changeOrder('pages')">
                        <font-awesome-icon
                          v-if="searchParameters.orderBy !== 'pages' && searchParameters.orderBy !== '-pages'"
                          :icon="sort"/>
                        <font-awesome-icon v-else :icon="sortingDirection"/>
                        {{ $t('references.pages') }}
                    </span>
              </th>

              <th></th>

              <th></th>

              <th></th>

            </tr>
            </thead>

            <tbody>
            <tr v-for="entity in response.results">

              <td>
                <router-link :to="{ path: '/reference/' + entity.id }" :title="$t('editReference.editMessage')">{{
                  entity.id }}
                </router-link>
              </td>

              <td>{{ entity.author }}</td>

              <td>{{ entity.year }}</td>

              <td>{{ entity.title }}</td>

              <td>{{ entity.journal__journal_name }}</td>

              <td>{{ entity.volume }}</td>

              <td>{{ entity.pages }}</td>

              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'reference', id: entity.id})"
                   :title="$t('editReference.viewMessage')">{{ $t('edit.view') }}</a>
              </td>

              <td>
                <a v-if="entity.doi" href="javascript:void(0)" @click="openDOI({doi: entity.doi})">DOI</a>
              </td>

              <td>
                <a v-if="entity.attachment__filename" href="javascript:void(0)"
                   @click="openPdf({pdf: entity.attachment__filename})">PDF</a>
                <a v-if="entity.attachment__filename === null && entity.url" :href="entity.url" target="_blank" rel="noopener noreferrer">PDF</a>
              </td>
            </tr>
            </tbody>

          </table>
        </div>

      </div>
    </div>

    <!-- LIST VIEW -->
    <list-view v-if="isListView && response.count > 0" :data="response.results" :page="searchParameters.page" :paginate-by="searchParameters.paginateBy" />


    <div class="row mt-3" v-if="response.count > 0">
      <div class="col-sm-6 col-md-3 pl-3 pr-3 t-paginate-by-center">
        <b-form-select v-model="searchParameters.paginateBy" class="mb-3">
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
        <!-- Question: Add export? Answer: No currently not needed -->
        <!--<export-buttons filename="dataSearch"></export-buttons>-->
      </div>

      <div class="col-sm-12 col-md-6 pagination-center">
        <b-pagination
          size="md" align="right" :limit="5" :hide-ellipsis="true" :total-rows="response.count"
          v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
        </b-pagination>
      </div>
    </div>


    <div class="row mt-3" v-if="noResults">
      <div class="col">
        <p>
          {{ $t('references.errors.noFiles1') }}
          <b>
            <router-link :to="{ path: '/reference/add' }">{{ $t('header.addReference') }}</router-link>
          </b>
          {{ $t('references.errors.noFiles2') }}
        </p>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import {library} from '@fortawesome/fontawesome-svg-core'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
  import {faFile} from '@fortawesome/free-solid-svg-icons'
  import {faSort} from '@fortawesome/free-solid-svg-icons'
  import {faSortUp} from '@fortawesome/free-solid-svg-icons'
  import {faSortDown} from '@fortawesome/free-solid-svg-icons'
  import {fetchReferences} from "@/assets/js/api/apiCalls";
  import ListView from "../components/reference/ListView";

  library.add(faFile, faSort, faSortUp, faSortDown)

  export default {
    components: {
      ListView,
      FontAwesomeIcon,
      Spinner,
    },
    props: {
      showSearch: {
        type: Boolean,
        default: true
      }
    },/////
    name: "References",
    data() {
      return {
        noResults: null,
        isLoading: false,
        isListView: false,
        searchParameters: {
          author: null,
          year: null,
          title: null,
          bookJournal: null,
          abstractKeywordsRemarks: null,
          id: null,
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
        },
        response: {
          count: 0,
          results: []
        },
      }
    },

    metaInfo() {
      return {
        title: this.$t('titles.editReference')
      }
    },

    computed: {
      sort() {
        return faSort
      },

      sortingDirection() {
        return this.searchParameters.orderBy.includes('-') ? faSortDown : faSortUp
      }
    },

    watch: {
      'searchParameters': {
        handler: function () {
          this.searchReferences(this.searchParameters)
        },
        deep: true
      },
      'isListView'(newVal, oldVal) {
        this.$localStorage.set('referenceViewType', newVal)
      }
    },

    created: function () {
      // Gets searchParameters from local storage, #106
      const referenceSearchHistory = this.$localStorage.get('referenceSearchHistory', 'fallbackValue')
      if (referenceSearchHistory !== 'fallbackValue' && Object.keys(referenceSearchHistory).length !== 0 && referenceSearchHistory.constructor === Object) {
        this.searchParameters = referenceSearchHistory
      } else {
        this.searchReferences(this.searchParameters)
      }

      this.isListView = this.$localStorage.get('referenceViewType', false)
    },

    methods: {
      searchReferences(searchParameters) {

        this.isLoading = true

        this.$localStorage.set('referenceSearchHistory', searchParameters)

        fetchReferences(searchParameters).then(response => {
          if (response.status === 200) {
            if (response.body.count === 0) this.noResults = true
            if (response.body.count > 0) this.noResults = false
            this.response.count = response.body.count
            this.response.results = response.body.results
          }
          this.isLoading = false
        }, errResponse => {
          this.isLoading = false
        })
      },

      changeOrder(orderValue) {
        if (this.searchParameters.orderBy === orderValue) {
          if (orderValue.charAt(0) !== '-') {
            orderValue = '-' + orderValue;
          } else {
            orderValue = orderValue.substring(1);
          }
        }
        this.searchParameters.page = 1;
        this.searchParameters.orderBy = orderValue;
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
        window.open('https://geocollections.info/' + params.object + '/' + params.id, '', 'width=' + width + ',height=750')
      },

      openDOI(params) {
        window.open('https://doi.org/' + params.doi, '', 'width=1000,height=900')
      },

      openPdf(params) {
        window.open('https://files.geocollections.info/' + params.pdf.substring(0, 2) + '/' + params.pdf.substring(2, 4) + '/' + params.pdf, '', 'width=1000,height=900')
      },

      // Deletes local storage value + resets search parameters to default
      deleteSearchPreferences() {
        this.$localStorage.remove('referenceSearchHistory')
        this.$localStorage.remove('referenceViewType')
        this.searchParameters = {
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
        this.isListView = false
      }
    }
  }
</script>

<style scoped>
  .badge-style > span {
    padding-left: 0.4em;
    padding-right: 0.4em;
  }

  .font-larger {
    font-size: larger;
  }

  .loading-overlay-search {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1020;
    /*background: rgba(255, 255, 255, 0.5);*/
  }

  @media (max-width: 767px) {
    .t-paginate-by-center {
      margin: 0 auto;
      width: unset;
    }

    .export-center {
      text-align: center;
      width: 100%;
    }

    .b-paginate-by-center {
      margin: 0 auto;
    }

    /* Overrides bootstrap rule */
    .pagination-center > .justify-content-end {
      justify-content: center !important;
      width: 100%;
    }
  }

  .th-sort > th > span {
    cursor: pointer;
  }

  .th-sort > th > span:hover {
    color: #000;
  }

  .fa-sort-up, .fa-sort-down {
    color: #007bff;
  }

  span {
    white-space: nowrap;
  }

</style>
