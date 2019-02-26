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

    <div class="row mt-4">
      <div class="col">
        <search-fields v-on:search-data="search"/>
      </div>
    </div>

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
        <b-form-select v-model="searchParameters.watched.paginateBy" class="mb-3">
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
        <!-- TODO: Add export? Answer: No currently not needed -->
        <!--<export-buttons filename="dataSearch"></export-buttons>-->
      </div>

      <div class="col-sm-12 col-md-6 pagination-center">
        <b-pagination
          size="md" align="right" :limit="5" :hide-ellipsis="true" :total-rows="response.count" v-model="searchParameters.watched.page" :per-page="searchParameters.watched.paginateBy">
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
              <th>
                <span @click="changeOrder('id')">
                      <font-awesome-icon v-if="searchParameters.watched.orderBy !== 'id' && searchParameters.watched.orderBy !== '-id'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      ID
                  </span>
              </th>

              <!--<th>-->
                <!--<span @click="changeOrder('reference')">-->
                      <!--<font-awesome-icon v-if="searchParameters.watched.orderBy !== 'reference' && searchParameters.watched.orderBy !== '-reference'" :icon="sort"/>-->
                      <!--<font-awesome-icon v-else :icon="sortingDirection" />-->
                      <!--{{ $t('references.reference') }}-->
                  <!--</span>-->
              <!--</th>-->

              <th>
                <span @click="changeOrder('author')">
                    <font-awesome-icon v-if="searchParameters.watched.orderBy !== 'author' && searchParameters.watched.orderBy !== '-author'" :icon="sort"/>
                    <font-awesome-icon v-else :icon="sortingDirection" />
                    {{ $t('references.author') }}
                </span>
              </th>

              <th>
                <span @click="changeOrder('year')">
                    <font-awesome-icon v-if="searchParameters.watched.orderBy !== 'year' && searchParameters.watched.orderBy !== '-year'" :icon="sort"/>
                    <font-awesome-icon v-else :icon="sortingDirection" />
                    {{ $t('references.year') }}
                </span>
              </th>

              <th>
                <span @click="changeOrder('title')">
                      <font-awesome-icon v-if="searchParameters.watched.orderBy !== 'title' && searchParameters.watched.orderBy !== '-title'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      {{ $t('references.title') }}
                  </span>
              </th>

              <!--<th>-->
                <!--<span @click="changeOrder('book')">-->
                      <!--<font-awesome-icon v-if="searchParameters.watched.orderBy !== 'book' && searchParameters.watched.orderBy !== '-book'" :icon="sort"/>-->
                      <!--<font-awesome-icon v-else :icon="sortingDirection" />-->
                      <!--{{ $t('references.book') }}-->
                  <!--</span>-->
              <!--</th>-->

              <th>
                <span @click="changeOrder('journal__journal_name')">
                      <font-awesome-icon v-if="searchParameters.watched.orderBy !== 'journal__journal_name' && searchParameters.watched.orderBy !== '-journal__journal_name'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      {{ $t('references.journal') }}
                  </span>
              </th>

              <th>
                <span @click="changeOrder('volume')">
                      <font-awesome-icon v-if="searchParameters.watched.orderBy !== 'volume' && searchParameters.watched.orderBy !== '-volume'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      {{ $t('references.volume') }}
                  </span>
              </th>

              <th>
                <span @click="changeOrder('pages')">
                      <font-awesome-icon v-if="searchParameters.watched.orderBy !== 'pages' && searchParameters.watched.orderBy !== '-pages'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      {{ $t('references.pages') }}
                  </span>
              </th>

              <th></th>

              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="entity in response.results">

              <td>
                <router-link :to="{ path: '/reference/' + entity.id }" :title="$t('editReference.editMessage')" >{{ entity.id }}</router-link>
              </td>

              <!--<td>-->
                <!--<router-link :to="{ path: '/reference/' + entity.id }" :title="$t('editReference.editMessage')" >{{ entity.reference }}</router-link>-->
              <!--</td>-->

              <td>{{ entity.author }}</td>

              <td>{{ entity.year }}</td>

              <td>{{ entity.title }}</td>

              <!--<td>{{ entity.book }}</td>-->

              <td>{{ entity.journal__journal_name }}</td>

              <td>{{ entity.volume }}</td>

              <td>{{ entity.pages }}</td>

              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'reference', id: entity.id})" :title="$t('editReference.viewMessage')">{{ $t('edit.view') }}</a>
              </td>

              <td>
                <a v-if="entity.doi" href="javascript:void(0)" @click="openDOI({doi: entity.doi})">DOI</a>
              </td>

            </tr>
            </tbody>

          </table>
        </div>

      </div>
    </div>


    <div class="row mt-3" v-if="response.count > 0">
      <div class="col-sm-6 col-md-3 pl-3 pr-3 t-paginate-by-center">
        <b-form-select v-model="searchParameters.watched.paginateBy" class="mb-3">
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
        <!-- TODO: Add export -->
        <!--<export-buttons filename="dataSearch"></export-buttons>-->
      </div>

      <div class="col-sm-12 col-md-6 pagination-center">
        <b-pagination
          size="md" align="right" :limit="5" :hide-ellipsis="true" :total-rows="response.count" v-model="searchParameters.watched.page" :per-page="searchParameters.watched.paginateBy">
        </b-pagination>
      </div>
    </div>


    <div class="row mt-3" v-if="noResults">
      <div class="col">
        <p>
          {{ $t('references.errors.noFiles1') }}
          <b><router-link :to="{ path: '/reference/add' }">{{ $t('header.addReference') }}</router-link></b>
          {{ $t('references.errors.noFiles2') }}
        </p>
      </div>
    </div>

  </div>
</template>

<script>
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faFile} from '@fortawesome/free-solid-svg-icons'
  import {faSort} from '@fortawesome/free-solid-svg-icons'
  import {faSortUp} from '@fortawesome/free-solid-svg-icons'
  import {faSortDown} from '@fortawesome/free-solid-svg-icons'

  import SearchFields from '@/components/reference/SearchFields.vue'
  import Spinner from 'vue-simple-spinner'

  library.add(faFile, faSort, faSortUp, faSortDown)

  export default {
    components: {
      FontAwesomeIcon,
      Spinner,
      SearchFields,
    },
    props: {
      showSearch: {
        type: Boolean,
        default: true
      }
    },
    name: "References",
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/reference/',
        noResults: null,
        isLoading: false,
        searchParameters: {
          watched: {
            page: 1,
            paginateBy: 50,
            // TODO: Maybe change order functionality to multi
            orderBy: '-id',
          },
          // author: null,
          fields: 'id,reference,author,year,title,title_original,book,journal__journal_name,volume,pages,doi',
          searchFields: '',
        },
        response: {
          count: 0,
          results: []
        },
      }
    },

    metaInfo () {
      return {
        title: this.$t('titles.editReference')
      }
    },

    computed: {
      sort() {
        return faSort
      },

      sortingDirection() {
        return this.searchParameters.watched.orderBy.includes('-') ? faSortDown : faSortUp
      }
    },

    watch: {
      'searchParameters.watched': {
        handler: function () {
          this.searchMyFiles(this.searchParameters)
        },
        deep: true
      }
    },

    created: function () {
      // if (this.$session.exists() && this.$session.get('authUser') !== null) {
      //   this.searchParameters.author = this.$session.get('authUser')
      // }

      // Remembers search parameters set by the user #106 https://github.com/geocollections/sarv-edit/issues/106
      console.log('hi i am created')
      const referenceSearchHistory = this.$localStorage.get('referenceSearchHistory', 'fallbackValue')
      if (referenceSearchHistory !== 'fallbackValue' && Object.keys(referenceSearchHistory).length !== 0 && referenceSearchHistory.constructor === Object) {
        this.searchParameters.watched = referenceSearchHistory.watched // {page, paginate, order}
        this.searchParameters.searchFields = referenceSearchHistory.searchFields // 'field_name1=field_value1&field_name2=field_value2'
      }

      this.searchMyFiles(this.searchParameters)
    },

    methods: {
      search(searchData) {
        // Search data is saved because if user changes pagination then the search won't get reset
        this.searchParameters.searchFields = searchData;
        this.searchMyFiles(this.searchParameters)

        // if (searchData.length > 0) {
        //   this.searchMyFiles(this.searchParameters, searchData)
        // } else {
        //   this.searchMyFiles(this.searchParameters)
        // }
      },

      searchMyFiles(searchParameters) {
        let url = searchParameters.searchFields

        console.log('this is saved to storage')
        console.log(searchParameters)
        // Saving search parameters to local storage for more comfortable user experience
        this.$localStorage.set('referenceSearchHistory', searchParameters)

        if (typeof url !== 'undefined' && url.length > 0) {
          // searchParameters.searchFields = this.apiUrl + '?' + searchParameters.searchFields
          searchParameters.searchFields = ''
          searchParameters.searchFields = '?' + url
          // url = this.apiUrl + '?' + encodeURIComponent(url)
        } else {
          // searchParameters.searchFields = this.apiUrl
          searchParameters.searchFields = ''
        }

        console.log(searchParameters.searchFields)

        this.isLoading = true

        this.$http.get(this.apiUrl + searchParameters.searchFields, {
          params: {
            // References can be seen by anyone
            // user_added: searchParameters.author.user,
            page: searchParameters.watched.page,
            paginate_by: searchParameters.watched.paginateBy,
            order_by: searchParameters.watched.orderBy,
            fields: searchParameters.fields,
            format: 'json',
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (response.body.count === 0) this.noResults = true
            if (response.body.count > 0) this.noResults = false
            this.response.count = response.body.count
            this.response.results = response.body.results
          }
          this.isLoading = false
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
          this.isLoading = false
        })
      },

      changeOrder(orderValue) {
        if (this.searchParameters.watched.orderBy === orderValue) {
          if (orderValue.charAt(0) !== '-') {
            orderValue = '-' + orderValue;
          } else {
            orderValue = orderValue.substring(1);
          }
        }
        this.searchParameters.watched.page = 1;
        this.searchParameters.watched.orderBy = orderValue;
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
        let width = 1000;
        window.open('https://doi.org/' + params.doi, '', 'width=' + width + ',height=750')
      },
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
