<template>
  <div class="attachments">

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
        <search-fields v-if="showSearch" v-on:search-data="search"/>
      </div>
    </div>


    <div class="row mt-4">
      <div class="col">
        <span>
          <b>{{ $t('attachments.header') }}</b>
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


    <div class="row" v-if="response.count > 0">
      <div class="col">

        <div class="table-responsive">
          <table class="table table-hover table-bordered">

            <thead class="thead-light">
            <tr class="th-sort">
              <th>{{ $t('attachments.file') }}</th>

              <th>
                  <span @click="changeOrder('id')">
                      <font-awesome-icon v-if="searchParameters.watched.orderBy !== 'id' && searchParameters.watched.orderBy !== '-id'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      ID
                  </span>
              </th>

              <th>{{ $t('attachments.format') }}</th>

              <th>
                  <span @click="changeOrder('image_number')">
                      <font-awesome-icon v-if="searchParameters.watched.orderBy !== 'image_number' && searchParameters.watched.orderBy !== '-image_number'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      {{ $t('attachments.number') }}
                  </span>
              </th>

              <th>
                  <span @click="changeOrder('author__agent')">
                      <font-awesome-icon v-if="searchParameters.watched.orderBy !== 'author__agent' && searchParameters.watched.orderBy !== '-author__agent'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      {{ $t('attachments.author') }}
                  </span>
              </th>

              <th>
                  <span @click="changeOrder('date_created')">
                      <font-awesome-icon v-if="searchParameters.watched.orderBy !== 'date_created' && searchParameters.watched.orderBy !== '-date_created'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      {{ $t('attachments.date') }}
                  </span>
              </th>

              <th v-if="showSpecimen">
                  <span @click="changeOrder('specimen')">
                      <font-awesome-icon v-if="searchParameters.watched.orderBy !== 'specimen' && searchParameters.watched.orderBy !== '-specimen'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      {{ $t('attachments.specimen') }}
                  </span>
              </th>

              <th v-if="showReference">
                  <span @click="changeOrder('reference__reference')">
                      <font-awesome-icon v-if="searchParameters.watched.orderBy !== 'reference__reference' && searchParameters.watched.orderBy !== '-reference__reference'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      {{ $t('attachments.reference') }}
                  </span>
              </th>

              <th>
                  <span @click="changeOrder('specimen_image_attachment')">
                      <font-awesome-icon v-if="searchParameters.watched.orderBy !== 'specimen_image_attachment' && searchParameters.watched.orderBy !== '-specimen_image_attachment'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      {{ $t('attachments.specimenImageAttachment') }}
                  </span>
              </th>

              <th></th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="entity in response.results">

              <td class="text-center">
                <router-link v-if="entity.uuid_filename !== null" :title="$t('edit.editMessage')" :to="{ path: '/attachment/' + entity.id }">
                  <img class="image-preview"
                       v-if="entity.uuid_filename.endsWith('jpg') || entity.uuid_filename.endsWith('jpeg') || entity.uuid_filename.endsWith('png')"
                       :src="getFileLink({size: 'small', filename: entity.uuid_filename})"/>
                  <font-awesome-icon v-else size="3x" :icon="file" />
                </router-link>

                <router-link :title="$t('edit.editMessage')" :to="{ path: '/attachment/' + entity.id }">
                  <font-awesome-icon v-if="entity.uuid_filename === null" size="3x" :icon="file" />
                </router-link>
              </td>

              <td>
                <router-link :to="{ path: '/attachment/' + entity.id }" :title="$t('edit.editMessage')" >{{ entity.id }}</router-link>
              </td>

              <td>{{ entity.uuid_filename.split('.')[1] }}</td>

              <td>{{ entity.image_number }}</td>

              <td>
                <span v-if="entity.author__agent">{{ entity.author__agent }}</span>
                <span v-else>{{ entity.author_free }}</span>
              </td>

              <td>
                <span v-if="entity.date_created !== null">{{ entity.date_created | moment('ddd, MMM Do YYYY') }}</span>
                <span v-if="entity.date_created === null && entity.date_created_free !== null">{{ entity.date_created_free }}</span>
              </td>

              <td v-if="showSpecimen">
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'specimen', id: entity.specimen})">
                  <!-- TODO: Get specimen name -->
                  {{ entity.specimen }}
                </a>
              </td>

              <td v-if="showReference">
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'reference', id: entity.reference_id})">
                  {{ entity.reference__reference }}
                </a>
              </td>

              <td>
                <span v-if="entity.specimen_image_attachment === 1">{{ $t('attachments.specimenFile') }}</span>
                <span v-if="entity.specimen_image_attachment === 2">{{ $t('attachments.photoArchiveFile') }}</span>
                <span v-if="entity.specimen_image_attachment === 3">{{ $t('attachments.otherFile') }}</span>
                <span v-if="entity.specimen_image_attachment === 4">{{ $t('attachments.digitisedReferenceFile') }}</span>
              </td>

              <td>
                <a href="javascript:void(0)" @click="openGeoInNewWindow({object: 'file', id: entity.id})" :title="$t('edit.viewMessage')">{{ $t('edit.view') }}</a>
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
          {{ $t('attachments.errors.noFiles1') }}
          <b><router-link :to="{ path: '/attachment/add/photo_archive' }">{{ $t('header.addAttachment') }}</router-link></b>
          {{ $t('attachments.errors.noFiles2') }}
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

  import SearchFields from '@/components/attachment/SearchFields.vue'
  import Spinner from 'vue-simple-spinner'

  library.add(faFile, faSort, faSortUp, faSortDown)

  export default {
    components: {
      FontAwesomeIcon,
      SearchFields,
      Spinner
    },
    props: {
      // TODO: Maybe delete it because this is not used in front page anymore
      showSearch: {
        type: Boolean,
        default: true
      }
    },
    name: "Attachments",
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/attachment/',
        noResults: null,
        isLoading: false,
        searchFields: '',
        showSpecimen: true,
        showReference: true,
        searchParameters: {
          watched: {
            page: 1,
            paginateBy: 50,
            // TODO: Maybe change order functionality to multi
            orderBy: '-id',
          },
          author: null,
          fields: 'id,uuid_filename,author__agent,author_free,date_created,date_created_free,image_number,specimen,reference_id,reference__reference,specimen_image_attachment'
        },
        response: {
          count: 0,
          results: []
        },
      }
    },
    metaInfo () {
      return {
        // Because Attachments.vue is also used in Dashboard.vue, front page shows user's attachments
        title: this.showSearch ? this.$t('titles.editAttachment') : this.$t('titles.dashboard')
      }
    },
    computed: {
      file() {
        return faFile
      },

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
          this.searchMyFiles(this.searchParameters, this.searchFields)
        },
        deep: true
      }
    },

    created: function () {
      if (this.$session.exists() && this.$session.get('authUser') !== null) {
        this.searchParameters.author = this.$session.get('authUser')
      }

      // Gets searchParameters from local storage, #106
      const attachmentSearchHistory = this.$localStorage.get('attachmentSearchHistory', 'fallbackValue')
      if (attachmentSearchHistory !== 'fallbackValue' && Object.keys(attachmentSearchHistory).length !== 0 && attachmentSearchHistory.constructor === Object) {
        this.searchParameters = attachmentSearchHistory.searchParameters
      }

      // Only run search here if front page without search fields
      // Otherwise initial search is triggered in SearchFields.vue
      if (!this.showSearch) this.searchMyFiles(this.searchParameters)
    },

    methods: {

      search(searchData, specimenImageAttachment) {
        // Search data is saved because if user changes pagination then the search won't get reset
        this.searchFields = searchData;

        this.toggleSpecimen(specimenImageAttachment)
        this.toggleReference(specimenImageAttachment)

        if (searchData.length > 0) {
          this.searchMyFiles(this.searchParameters, searchData)
        } else {
          this.searchMyFiles(this.searchParameters)
        }
      },

      searchMyFiles(searchParameters, url) {
        if (typeof url !== 'undefined' && url.length > 0) {
          url = this.apiUrl + '?' + url
          // url = this.apiUrl + '?' + encodeURIComponent(url)
        } else {
          url = this.apiUrl
        }

        console.log(url)

        // Gets attachmentSearchHistory from local storage,
        // appends search parameters (page, paginateBy, orderBy) to it and saves it again
        let attachmentSearchHistory = this.$localStorage.get('attachmentSearchHistory', 'fallbackValue')
        if (attachmentSearchHistory !== 'fallbackValue' && Object.keys(attachmentSearchHistory).length !== 0 && attachmentSearchHistory.constructor === Object) {
          attachmentSearchHistory.searchParameters = searchParameters
          this.$localStorage.set('attachmentSearchHistory', attachmentSearchHistory)
        } else {
          // Use case if attachmentSearchHistory doesn't exist in local storage
          attachmentSearchHistory = {}
          attachmentSearchHistory.searchParameters = searchParameters
          this.$localStorage.set('attachmentSearchHistory', attachmentSearchHistory)
        }


        this.isLoading = true

        // TODO: Append or_search author data to url few lines up
        this.$http.get(url, {
          params: {
            or_search: 'author_id:' + searchParameters.author.agent_id + ';user_added:' + searchParameters.author.user,
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
        window.open('http://geocollections.info/' + params.object + '/' + params.id, '', 'width=' + width + ',height=750')
      },

      getFileLink(params) {
        if (params.size) {
          return 'https://files.geocollections.info/' + params.size
            + '/' + params.filename.substring(0,2)
            + '/' + params.filename.substring(2,4)
            + '/' + params.filename;
        } else {
          return 'https://files.geocollections.info/' + params.filename.substring(0,2)
            + '/' + params.filename.substring(2,4)
            + '/' + params.filename;
        }
      },

      // Toggle methods are used to show field specimen or reference link in table
      toggleSpecimen(specimenImageAttachment) {
        specimenImageAttachment.includes('1') ? this.showSpecimen = true : this.showSpecimen = false
      },

      toggleReference(specimenImageAttachment) {
        specimenImageAttachment.includes('4') ? this.showReference = true : this.showReference = false
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

  .image-preview {
    max-height: 200px;
    max-width: 200px;
    padding: 0.25rem;
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
  }
</style>
