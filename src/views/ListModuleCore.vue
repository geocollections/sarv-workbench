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

    <div class="row mt-4">
      <div class="col">
          <span>
            <b>{{ $t(module+'.header') }}</b>
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
    <div class="row" v-if="response.count > 0">
      <div class="col">

        <div class="table-responsive">
          <table class="table table-hover table-bordered">

            <thead class="thead-light">
              <tr class="th-sort">
                <th class="nowrap" v-for="item in columns">
                    <span @click="changeOrder(item.id)" v-if="item.orderBy !== false">
                          <font-awesome-icon
                            v-if="searchParameters.orderBy !== item.id && searchParameters.orderBy !== '-'+item.id"
                            :icon="sort"/>
                          <font-awesome-icon v-else :icon="sortingDirection"/>
                          {{ $t(item.title)}}
                      </span>
                </th>
              </tr>
            </thead>

            <router-view :response="response"/>

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
  import _ from 'lodash'
  import Spinner from 'vue-simple-spinner'
  import {library} from '@fortawesome/fontawesome-svg-core'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
  import {faSort} from '@fortawesome/free-solid-svg-icons'
  import {faSortUp} from '@fortawesome/free-solid-svg-icons'
  import {faSortDown} from '@fortawesome/free-solid-svg-icons'


  library.add(faSort, faSortUp, faSortDown)

  export default {
    components: {
      FontAwesomeIcon,
      Spinner,
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

    },
    watch: {
      'searchParameters': {
        handler: function () {
          console.log('WATHCing')
          this.search(this.searchParameters)
        },
        deep: true
      },
      'isListView'(newVal, oldVal) {
        this.$localStorage.set(this.viewType, newVal)
      }
    },

    created: function () {
      const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue')
      console.log(searchHistory.constructor === Object)
      if (searchHistory !== 'fallbackValue' && Object.keys(searchHistory).length !== 0 && searchHistory.constructor === Object) {
        this.$emit('search-params-changed',searchHistory);
      } else {
        this.search(this.searchParameters)
      }

      this.isListView = this.$localStorage.get(this.viewType, false)
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

      // Deletes local storage value + resets search parameters to default
      deleteSearchPreferences() {
        this.$localStorage.remove(this.searchHistory)
        this.$localStorage.remove(this.viewType)
        this.$emit('set-default-search-params',true);
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

  .nowrap {
    white-space: nowrap;
  }
</style>
