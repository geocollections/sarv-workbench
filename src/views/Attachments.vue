<template>
  <div class="attachments">

    <spinner v-show="isLoading"
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
       <p class="h2">{{ $t('header.files') }}</p>
     </div>
     <div class="col-sm-6 ralign">
     	<router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/attachment/add/other_file' }">{{ $t('add.new') }}</router-link>
     </div>
   </div>

    <!-- SEARCH FIELDS START -->
    <div class="row mt-4">
      <div class="col">
        <div class="search-fields">

          <div class="row">

            <!-- IMAGE_NUMBER -->
            <div class="col-sm-2">
              <label :for="`image_number`">{{ $t('edit.imageNumber') }}:</label>
            </div>

            <div class="col-sm-4 mb-2">
              <b-form-input v-model="searchParameters.image_number" id="image_number" type="text"></b-form-input>
            </div>

            <!-- FILENAME -->
            <div class="col-sm-2">
              <label :for="`filename`">{{ $t('edit.filename') }}:</label>
            </div>

            <div class="col-sm-4 mb-2">
              <b-form-input v-model="searchParameters.filename" id="filename" type="text"></b-form-input>
            </div>
          </div>

          <div class="row">

            <!-- SPECIMEN -->
            <div class="col-sm-2">
              <label :for="`specimen`">{{ $t('edit.specimen') }}:</label>
            </div>

            <div class="col-sm-4 mb-2">
              <b-form-input v-model="searchParameters.specimen" id="specimen" type="text"></b-form-input>
            </div>

            <!-- IMAGE INFO -->
            <div class="col-sm-2">
              <label :for="`image_info`">{{ $t('edit.imageInfo') }}:</label>
            </div>

            <div class="col-sm-4 mb-2">
              <b-form-input id="image_info" v-model="searchParameters.imageInfo" type="text"></b-form-input>
            </div>
          </div>

          <div class="row">

            <!-- LOCALITY -->
            <div class="col-sm-2">
              <label :for="`locality`">{{ $t('edit.locality') }}:</label>
            </div>

            <div class="col-sm-4 mb-2">
              <b-form-input id="locality" v-model="searchParameters.locality" type="text"></b-form-input>
            </div>

            <!-- TODO: Add author search for admins -->
            <!--<div class="col-sm-2">-->
            <!--<label :for="`author`">{{ $t('edit.author') }}:</label>-->
            <!--</div>-->



          <!-- CHECKBOXES -->

            <div class="col-6">
              <b-form-checkbox-group v-model="searchParameters.specimen_image_attachment">

                <b-form-checkbox value="2">
                  {{ $t('edit.photoArchive') }}
                </b-form-checkbox>

                <b-form-checkbox value="1">
                  {{ $t('edit.specimenImage') }}
                </b-form-checkbox>

                <b-form-checkbox value="3">
                  {{ $t('edit.otherFiles') }}
                </b-form-checkbox>

                <b-form-checkbox value="4">
                  {{ $t('edit.digitisedReference') }}
                </b-form-checkbox>

              </b-form-checkbox-group>
            </div>
          </div>

          <!-- Removes search preferences like local storage and search parameters-->
          <div class="row mt-3">
            <div class="col">
              <b-button class="border border-dark" variant="light" @click="deleteSearchPreferences">{{ $t('buttons.deletePreferences') }}</b-button>
            </div>
          </div>

        </div>
      </div>
    </div>
    <!-- SEARCH FIELDS END -->


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
          size="md" align="right" :limit="5" :hide-ellipsis="true" :total-rows="response.count" v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
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
                      <font-awesome-icon v-if="searchParameters.orderBy !== 'id' && searchParameters.orderBy !== '-id'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      ID
                  </span>
              </th>

              <th>{{ $t('attachments.format') }}</th>

              <th>
                  <span @click="changeOrder('image_number')">
                      <font-awesome-icon v-if="searchParameters.orderBy !== 'image_number' && searchParameters.orderBy !== '-image_number'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      {{ $t('attachments.number') }}
                  </span>
              </th>

              <th>
                  <span @click="changeOrder('author__agent')">
                      <font-awesome-icon v-if="searchParameters.orderBy !== 'author__agent' && searchParameters.orderBy !== '-author__agent'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      {{ $t('attachments.author') }}
                  </span>
              </th>

              <th>
                  <span @click="changeOrder('date_created')">
                      <font-awesome-icon v-if="searchParameters.orderBy !== 'date_created' && searchParameters.orderBy !== '-date_created'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      {{ $t('attachments.date') }}
                  </span>
              </th>

              <th v-if="showSpecimen">
                  <span @click="changeOrder('specimen')">
                      <font-awesome-icon v-if="searchParameters.orderBy !== 'specimen' && searchParameters.orderBy !== '-specimen'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      {{ $t('attachments.specimen') }}
                  </span>
              </th>

              <th v-if="showReference">
                  <span @click="changeOrder('reference__reference')">
                      <font-awesome-icon v-if="searchParameters.orderBy !== 'reference__reference' && searchParameters.orderBy !== '-reference__reference'" :icon="sort"/>
                      <font-awesome-icon v-else :icon="sortingDirection" />
                      {{ $t('attachments.reference') }}
                  </span>
              </th>

              <th>
                  <span @click="changeOrder('specimen_image_attachment')">
                      <font-awesome-icon v-if="searchParameters.orderBy !== 'specimen_image_attachment' && searchParameters.orderBy !== '-specimen_image_attachment'" :icon="sort"/>
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
          size="md" align="right" :limit="5" :hide-ellipsis="true" :total-rows="response.count" v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
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
  import Spinner from 'vue-simple-spinner'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faFile} from '@fortawesome/free-solid-svg-icons'
  import {faSort} from '@fortawesome/free-solid-svg-icons'
  import {faSortUp} from '@fortawesome/free-solid-svg-icons'
  import {faSortDown} from '@fortawesome/free-solid-svg-icons'

  import { fetchAttachments } from "@/assets/js/api/apiCalls";

  library.add(faFile, faSort, faSortUp, faSortDown)

  export default {
    components: {
      FontAwesomeIcon,
      Spinner
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
        author: null,
        searchParameters: {
          image_number: null,
          filename: null,
          specimen: null,
          imageInfo: null,
          locality: null,
          specimen_image_attachment: ['2', '1', '3', '4'],
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
          // author: null,
        },
        response: {
          count: 0,
          results: []
        },
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
        return this.searchParameters.orderBy.includes('-') ? faSortDown : faSortUp
      }
    },

    watch: {
      'searchParameters': {
        handler: function () {
          this.searchAttachments(this.searchParameters)
        },
        deep: true
      }
    },

    created: function () {
      if (this.$session.exists() && this.$session.get('authUser') !== null) {
        // TODO: How to get passed nicely so it won't initiate watcher
        this.author = this.$session.get('authUser')
      }

      // Gets searchParameters from local storage, #106
      const attachmentSearchHistory = this.$localStorage.get('attachmentSearchHistory', 'fallbackValue')
      if (attachmentSearchHistory !== 'fallbackValue' && Object.keys(attachmentSearchHistory).length !== 0 && attachmentSearchHistory.constructor === Object) {
        this.searchParameters = attachmentSearchHistory
      } else {
        this.searchAttachments(this.searchParameters)
      }
    },

    methods: {

      searchAttachments(searchParameters) {
        this.toggleSpecimen(searchParameters.specimen_image_attachment)
        this.toggleReference(searchParameters.specimen_image_attachment)

        this.isLoading = true

        this.$localStorage.set('attachmentSearchHistory', searchParameters)

        fetchAttachments(searchParameters, this.author).then(response => {
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

      // Deletes local storage value + resets search parameters to default
      deleteSearchPreferences() {
        this.$localStorage.remove('attachmentSearchHistory')
        this.searchParameters = {
          image_number: null,
          filename: null,
          specimen: null,
          imageInfo: null,
          locality: null,
          specimen_image_attachment: ['2', '1', '3', '4'],
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
          // author: null,
        }
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

  .image-preview {
    max-height: 200px;
    max-width: 200px;
    padding: 0.25rem;
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
  }
</style>
