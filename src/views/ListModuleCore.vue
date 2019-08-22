<template>
  <div>
    <spinner v-show="isLoading"
             class="loading-overlay-search"
             text-fg-color="#000000"
             line-fg-color="#5cb85c"
             line-bg-color="#000000"
             :line-size="5"
             size="100"
             :font-size="30"
             :message="$t('edit.isLoading')"></spinner>

    <div class="d-flex flex-row flex-wrap justify-content-start mt-2" :class="{'d-print-none': $route.meta.table === 'sample'}">
      <!-- Deletes search preferences -->
      <div class="mt-3 mr-3">
        <b-button class="border border-dark" variant="light" @click="deleteSearchPreferences">
          <font-awesome-icon icon="filter" />
          {{ $t('buttons.deletePreferences') }}
        </b-button>
      </div>

      <!-- TOGGLE BETWEEN TABLE AND LIST VIEW -->
      <div class="mt-3 radio-buttons align-self-center" v-if="useListView || useAlternativeTableView">
        <b-form-group>
          <b-form-radio-group v-model="currentView">
            <b-form-radio value="table">{{ $t('references.tableView') }}</b-form-radio>
            <b-form-radio v-if="useListView" value="list">{{ $t('references.listView') }}</b-form-radio>
            <b-form-radio v-if="useAlternativeTableView" value="alternativeTable">{{ $t('references.alternativeTableView') }}</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </div>
    </div>

    <!-- ALTERNATIVE TABLE CONTROLS -->
    <alternative-table-controls class="mt-3" v-if="isAlternativeTable && response.results.length > 0"
                                :columns="Object.keys(response.results[0])"
                                :alternativeTableControls="alternativeTableControls"
                                v-on:set-default-controls="setDefaultAlternativeTableControlsFromResetButton"/>

    <div class="row mt-4" :class="{'d-print-none': $route.meta.table === 'sample'}">
      <div class="col">
          <span>
            <b>{{ $t(module+'.header') }}</b>
            <sup class="font-larger" v-bind:class="{ 'badge-style': response.count > 0 }">
              <b-badge pill variant="info">{{ response.count }}</b-badge>
            </sup>
          </span>
      </div>
    </div>

    <div class="row mt-3" v-if="response.count > 0" :class="{'d-print-none': $route.meta.table === 'sample'}">
      <div class="pl-3 pr-3" :class="{ 'col-lg-6 col-xl-3 top-select-center-xl': combinedView, 'col-sm-6 col-md-3 top-select-center': !combinedView }">
        <b-form-select v-model="searchParameters.paginateBy" class="mb-3" >
          <option :value="10">{{ this.$t('main.pagination', { num: '10' }) }}</option>
          <option :value="25">{{ this.$t('main.pagination', { num: '25' }) }}</option>
          <option :value="50">{{ this.$t('main.pagination', { num: '50' }) }}</option>
          <option :value="100">{{ this.$t('main.pagination', { num: '100' }) }}</option>
          <option :value="250">{{ this.$t('main.pagination', { num: '250' }) }}</option>
          <option :value="500">{{ this.$t('main.pagination', { num: '500' }) }}</option>
          <option :value="1000">{{ this.$t('main.pagination', { num: '1000' }) }}</option>
        </b-form-select>
      </div>

      <div :class="{ 'mb-3': exportButtons, 'col-lg-12 col-xl-3 export-center-xl': combinedView, 'col-sm-12 col-md-3 export-center': !combinedView  }">
        <export-buttons v-if="exportButtons" :filename="module" :table-data="response.results"></export-buttons>
      </div>

      <div v-if="$route.meta.table === 'reference'" class="d-lg-none d-xl-none mb-3 col-sm-6 col-md-6" style="margin: 0 auto;">
        <choose-active-library/>
      </div>

      <div :class="{ 'col-lg-12 col-xl-6 pagination-center-xl': combinedView, 'col-sm-12 col-md-6 pagination-center': !combinedView }">
        <b-pagination
          size="md" align="right" :limit="5" :hide-ellipsis="true" :total-rows="response.count"
          v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
        </b-pagination>
      </div>
    </div>

    <!-- LIST VIEW -->
    <!-- Currently List-View is only used by reference, but if in the future is need for other table types then it should be made universal -->
    <list-view v-if="isListView && response.count > 0"
               :module="module"
               :data="response.results"/>

    <!-- TABLE -->
    <div class="row" v-if="(isTableView || isAlternativeTable) && response.count > 0">
      <div class="col">

        <div class="table-responsive" :class="{ 'fixed-table': isAlternativeTable }">
          <table id="export-table" class="table table-hover table-bordered b-table-fixed">

            <thead class="thead-light" :class="{ 'sticky-header': isAlternativeTable }">
              <tr class="th-sort">
                <!-- MULTI ORDERING -->
                <th class="nowrap" v-if="multiOrdering === true && isTableView" v-for="item in activeColumns">
                  <span @click="changeOrderMulti(item.id)" v-on:dblclick="removeOrder(item.id)" v-if="item.orderBy !== false">
                    <font-awesome-icon icon="sort" v-if="isFieldInOrderBy(item.id) === 0" />
                    <font-awesome-icon icon="sort-up" v-if="isFieldInOrderBy(item.id) === 1" />
                    <font-awesome-icon icon="sort-down" v-if="isFieldInOrderBy(item.id) === -1" />
                    {{ $t(item.title)}}
                    <font-awesome-icon v-if="item.isDate === true" :icon="['far', 'calendar-alt']"/>
                    <i v-if="item.isPrivate" class="fas fa-lock"></i>
                  </span>
                  <span v-if="item.orderBy === false && item.showHeader">{{ $t(item.title) }}</span>
                  <br/>
                </th>

                <!-- REGULAR ORDERING -->
                <th class="nowrap" v-if="multiOrdering === false && isTableView" v-for="item in activeColumns">
                  <span @click="changeOrder(item.id)" v-if="item.orderBy !== false">
                    <font-awesome-icon v-if="searchParameters.orderBy !== item.id && searchParameters.orderBy !== '-'+item.id" :icon="sort"/>
                    <font-awesome-icon v-else :icon="sortingDirection"/>
                    {{ $t(item.title)}}
                    <font-awesome-icon v-if="item.isDate === true" :icon="['far', 'calendar-alt']"/>
                    <i v-if="item.isPrivate" class="fas fa-lock"></i>
                  </span>
                  <span v-if="item.orderBy === false && item.showHeader">{{ $t(item.title) }}</span>
                  <br/>
                </th>

                <!-- ALTERNATIVE TABLE TH START -->
                <!-- MULTI ORDERING for alternativeTable -->
                <th class="break-all-words" :style="'font-size:' + alternativeTableControls.size + 'px;'"
                    v-if="multiOrdering === true && isAlternativeTable && alternativeTableControls.fields.includes(key)"
                    v-for="(value, key) in response.results[0]"
                    :key="key">
                  <span @click="changeOrderMulti(key)" v-on:dblclick="removeOrder(key)">
                    <font-awesome-icon icon="sort" v-if="isFieldInOrderBy(key) === 0" />
                    <font-awesome-icon icon="sort-up" v-if="isFieldInOrderBy(key) === 1" />
                    <font-awesome-icon icon="sort-down" v-if="isFieldInOrderBy(key) === -1" />
                    {{ key }}
                  </span>
                  <br/>
                </th>

                <!-- REGULAR ORDERING for alternativeTable -->
                <th class="break-all-words" :style="'font-size:' + alternativeTableControls.size + 'px;'"
                    v-if="multiOrdering === false && isAlternativeTable && alternativeTableControls.fields.includes(key)"
                    v-for="(value, key) in response.results[0]"
                    :key="key">
                  <span @click="changeOrder(key)">
                    <font-awesome-icon
                      v-if="searchParameters.orderBy !== key && searchParameters.orderBy !== '-'+key"
                      :icon="sort"/>
                    <font-awesome-icon v-else :icon="sortingDirection"/>
                    {{ key }}
                  </span><br/>
                </th>
                <!-- ALTERNATIVE TABLE TH END -->
              </tr>

              <tr>
                <th class="p-0" v-for="item in columns" v-if="showFilters">
                  <b-form-input autocomplete="off" style="display: inline !important;max-width: 100%; " class="col-sm-8"
                                v-model="searchParameters[item.id]" :id="item.id" :type="item.type" v-if="item.type==='text'"></b-form-input>
                  <b-form-input autocomplete="off" style="display: inline !important;max-width: 100%; " class="col-sm-8"
                                v-model="searchParameters[item.id]" :id="item.id" :type="item.type" v-if="item.type==='number'" min="0"></b-form-input>
                  <!--<datepicker style="display: inline !important;max-width: 100%; " :id="item.id"-->
                              <!--v-model="searchParameters[item.id]"-->
                              <!--use-utc="true "-->
                              <!--lang="en"-->
                              <!--:first-day-of-week="1"-->
                              <!--format="DD MMM YYYY"-->
                              <!--input-class="form-control" v-if="item.isDate"></datepicker>-->
                </th>
              </tr>

            </thead>

            <router-view :response="response" :is-library-active="isLibraryActive"  v-if="response.count > 0 && isTableView"/>

            <!-- ALTERNATIVE TABLE VIEW -->
            <alternative-table-view v-if="isAlternativeTable"
                                    module='reference'
                                    :data="response.results"
                                    :controls="alternativeTableControls"/>

          </table>
        </div>

      </div>
    </div>


    <div class="row mt-3" v-if="noResults">
      <div class="col">
        <p>
          {{ $t('add.errors.noResults1') }}
          <b>
            <router-link :to="{ path: '/' + module + '/add' }">{{ $t(module + '.addNew') }}</router-link>
          </b>
          {{ $t('add.errors.noResults2') }}
        </p>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import {library} from '@fortawesome/fontawesome-svg-core'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
  import {faSortDown,faSortUp, faSort } from '@fortawesome/free-solid-svg-icons'
  import { faCalendarAlt as farCalendarAlt } from '@fortawesome/free-regular-svg-icons'
  import Datepicker from 'vue2-datepicker'
  import ExportButtons from "../components/partial/export/ExportButtons";
  import ListView from "../components/partial/ListView";
  import AlternativeTableView from "../components/reference/AlternativeTableView";
  import AlternativeTableControls from "../components/reference/AlternativeTableControls";
  import ChooseActiveLibrary from "../components/partial/ChooseActiveLibrary";

  library.add(faSort, faSortUp, faSortDown, farCalendarAlt)

  export default {
    components: {
      ChooseActiveLibrary,
      AlternativeTableControls,
      AlternativeTableView,
      FontAwesomeIcon,
      Spinner,
      Datepicker,
      ExportButtons,
      ListView
    },
    props: {
      apiCall: {
        type: Function
      },
      columns: {
        type: Array,
        default: []
      },
      module: {
        type: String,
        default: null
      },
      title: {
        type: String,
        default: null
      },
      searchParameters: {
        type: Object
      },
      searchHistory: {
        type: String,
        default: null
      },
      viewType: {
        type: String,
        default: null
      },

      showFilters: {
        type: Boolean,
        default: false
      },

      multiOrdering: {
        type: Boolean,
        default: false
      },

      exportButtons: {
        type: Boolean,
        default: false,
      },

      useListView: {
        type: Boolean,
        default: false,
      },

      useAlternativeTableView: {
        type: Boolean,
        default: false,
      },

      combinedView: {
        type: Boolean,
        default: false,
      },

      isLibraryActive: {
        type: Boolean,
      }

    },
    name: "ListModuleCore",
    data() {
      return {
        noResults: null,
        isLoading: false,
        response: {
          count: 0,
          results: []
        },
        currentView: 'table',
        alternativeTableControls: this.setDefaultAlternativeTableControls(),
      }
    },

    metaInfo() {
      return {
        title: this.$t(this.title)
      }
    },

    computed: {
      sort() {
        return faSort
      },

      sortingDirection() {
        return this.searchParameters.orderBy.includes('-') ? faSortDown : faSortUp
      },

      isTableView() {
        // true and false checks are put just in case, because of migrating from old viewType value page didn't show table.
        // Clear filtering button fixes it but just in case
        return this.currentView === 'table' || this.currentView === 'false' || this.currentView === 'true' || typeof this.currentView === 'boolean'
      },

      isListView() {
        return this.currentView === 'list'
      },

      isAlternativeTable() {
        return this.currentView === 'alternativeTable'
      },

      // Special use case for references (choosing reference to active library).
      activeColumns() {
        return this.columns.filter(column => {
          if (column.type !== 'ACTIVE_LIBRARY_HEADER') {
            return column
          } else if (column.type === 'ACTIVE_LIBRARY_HEADER' && this.isLibraryActive) {
            return column
          }
        })
      }

    },
    watch: {
      'searchParameters': {
        handler: function () {
          this.search(this.searchParameters)
        },
        deep: true
      },
      'currentView'(newVal, oldVal) {
        this.$localStorage.set(this.viewType, newVal)
      }
    },

    created: function () {
      const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue')

      if (searchHistory !== 'fallbackValue' && Object.keys(searchHistory).length !== 0 && searchHistory.constructor === Object) {
        this.$emit('search-params-changed',searchHistory);
      } else {
        this.search(this.searchParameters)
      }

      let viewingType = this.$localStorage.get(this.viewType, 'table')
      // Changes old boolean value to correct string (maybe make the storage value into object or something?)
      if (viewingType === 'false' || viewingType === 'true' || typeof viewingType === 'boolean') this.currentView = 'table'
      else this.currentView = viewingType
    },

    methods: {
      search(searchParameters) {

        this.isLoading = true
        //I don't know how to check if an object is serializable... at least i haven't found the solution
        //sample search returns [object Object] but locality object {locality:null,...}
        // if(this.searchHistory === 'sampleSearchHistory') searchParameters = JSON.stringify(searchParameters);
        this.$localStorage.set(this.searchHistory,  searchParameters)
        this.$emit('search-params-changed',searchParameters);

        this.apiCall().then(response => {
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
        let searchParametes = this.searchParameters;
        searchParametes.page = 1;
        searchParametes.orderBy = orderValue;
        this.$emit('search-params-changed',searchParametes);
      },



      /* MULTI ORDERING CODE START */

      changeOrderMulti(field) {
        let searchParametes = this.searchParameters;

        // Change string to array
        if (typeof searchParametes.orderBy === "string") searchParametes.orderBy = searchParametes.orderBy.split()

        if (searchParametes.orderBy.includes(field)) {
          // Ascending
          this.$set(searchParametes.orderBy, searchParametes.orderBy.indexOf(field), '-' + field);

        } else if (searchParametes.orderBy.includes('-' + field)) {
          // Descending
          this.$set(searchParametes.orderBy, searchParametes.orderBy.indexOf('-' + field), field);

        } else {

          if (searchParametes.orderBy.length > 1) {
            // Removes first and adds field
            searchParametes.orderBy.shift();
            searchParametes.orderBy.push(field);
          } else {
            // Just adds field
            searchParametes.orderBy.push(field)
          }
        }

        // Move it up if it starts to trigger multiple requests
        searchParametes.page = 1;
        this.$emit('search-params-changed',searchParametes);
      },

      // Returns 1 for ascending, -1 for descending and 0 if not in orderBy
      isFieldInOrderBy(field) {
        let searchParametes = this.searchParameters

        // Change string to array
        if (typeof searchParametes.orderBy === "string") searchParametes.orderBy = searchParametes.orderBy.split()

        for (const i in searchParametes.orderBy) {
          if (searchParametes.orderBy[i] === field) {
            return 1;
          }
          if (searchParametes.orderBy[i] === '-' + field) {
            return -1
          }
        }
        return 0;
      },

      removeOrder(field) {
        let searchParametes = this.searchParameters;

        // Change string to array (this should already be array, but just in case)
        if (typeof searchParametes.orderBy === "string") searchParametes.orderBy = searchParametes.orderBy.split()

        // Removing is not possible if there is only 1 field
        if (searchParametes.orderBy.length > 1) {
          if (searchParametes.orderBy.includes(field)) {
            searchParametes.orderBy.splice(searchParametes.orderBy.indexOf(field), 1)
            this.$emit('search-params-changed',searchParametes);
          } else if (searchParametes.orderBy.includes('-' + field)) {
            searchParametes.orderBy.splice(searchParametes.orderBy.indexOf('-' + field), 1)
            this.$emit('search-params-changed',searchParametes);
          }
        }
      },

      /* MULTI ORDERING CODE END */



      setDefaultAlternativeTableControls() {
        return {
          height: '4',
          width: '8',
          size: '14',
          fields: (this.response && this.response.results && this.response.results.length > 0) ? Object.keys(this.response.results[0]) : []
        }
      },

      setDefaultAlternativeTableControlsFromResetButton() {
        this.alternativeTableControls = this.setDefaultAlternativeTableControls()
      },

      // Deletes local storage value + resets search parameters to default
      deleteSearchPreferences() {
        this.$localStorage.remove(this.searchHistory);
        this.$localStorage.remove(this.viewType);
        this.$emit('set-default-search-params', true, this.multiOrdering);
        this.currentView = 'table'
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

  .nowrap {
    white-space: nowrap;
  }

  .break-all-words {
    word-break: break-all;
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

  /* Fixes table so scrolling happens inside table */
  .fixed-table {
    max-height: 65vh;
  }

  /* Sticky header for responsive table */
  .sticky-header th {
    position: sticky;
    position: -webkit-sticky;
    top:0;
    outline: 1px solid #dee2e6;
    outline-offset: -1px;
    box-shadow: 0 2px 0 #cfd5db;
  }

  .radio-buttons >>> .form-group {
    margin-bottom: unset;
  }
</style>
