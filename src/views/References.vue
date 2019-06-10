<template>
  <div>
    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">
          {{ $t('header.references') }}
          <span class="h4 text-muted" v-if="isCombinedView">({{ $t('add.buttons.combinedViewEnabled') }})</span>
        </p>
      </div>
      <div class="col-sm-6 text-right">
        <!-- Combined view button available only on very large screens -->
        <span class="custom-control custom-switch pr-2">
            <input type="checkbox" class="custom-control-input" id="combinedSwitch" v-model="isCombinedView">
            <label class="custom-control-label pl-0" for="combinedSwitch">
              {{ $t(isCombinedView ? 'add.buttons.combinedViewEnabled' : 'add.buttons.combinedViewDisabled')}}
            </label>
        </span>

        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/reference/add' }">{{ $t('add.new') }}</router-link>
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/library' }">{{ $t('header.libraries') }}</router-link>
      </div>
    </div>

    <div v-if="isCombinedView" class="row mb-1" :class="{ 'break-out': isCombinedView }" :style="'width:' + freeSpacePercentage + 'vw;'">
      <div class="col">
        <label for="combinedViewRangeInput" class="m-0">{{ $t('messages.combinedViewChangeSize') }}</label>
      </div>
      <b-form-input id="combinedViewRangeInput" v-model="combinedViewSize" type="range" min="0" max="12"></b-form-input>
    </div>

    <!-- COMBINED VIEW START -->
    <div v-if="isCombinedView" class="row fluid-movement" :class="{ 'break-out': isCombinedView }" :style="'width:' + freeSpacePercentage + 'vw;'">
      <div class="left-side" :class="'col-' + combinedViewLeftColSize">
        <!-- SEARCH FIELDS START -->
        <div class="row mt-4">
          <div class="col">
            <div class="search-fields">
              <div class="d-flex flex-row flex-wrap">
                <div class="col-sm-6" v-for="field,idx in filters">

                  <div class="row">
                    <div class="col-sm-4">
                      <label :for="field.id">{{ $t(field.title) }}:</label>
                    </div>

                    <div class="col-sm-8 mb-2">
                      <b-form-input v-model="searchParameters[field.id]" :id="field.id" :type="field.type"></b-form-input>

                      <b-form-text v-if="field.id === 'solrSearch'">{{ $t('messages.solrSearchInfo') }}.</b-form-text>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SEARCH FIELDS END -->
        <list-module-core
          module="reference"
          title="titles.editReference"
          :columns="columns"
          :searchParameters="searchParameters"
          :api-call="fetchReferences"
          search-history="referenceSearchHistory"
          view-type="referenceViewType"
          :multi-ordering="true"
          :export-buttons="true"
          :use-list-view="true"
          :use-alternative-table-view="true"
          :combined-view="isCombinedView"
          v-on:search-params-changed="searchParametersChanged"
          v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
          v-on:add-reference-to-active-library="addReferenceToActiveLibrary"
        ></list-module-core>
      </div>

      <div class="right-side" :class="'col-' + combinedViewRightColSize">
        <div class="row">
          <div class="col-xl-9 mb-2">
            <b-form-input v-model="inputUrl" @keyup.enter="openIframe" placeholder="https://"></b-form-input>
          </div>

          <div class="col-xl-3 mb-3">
            <b-button variant="primary" @click="openIframe">
              <font-awesome-icon icon="external-link-alt" />
              {{ $t('add.buttons.openIframe') }}
            </b-button>
          </div>
        </div>

        <b-embed
          type="iframe"
          :src="iframeUrl"
          allowfullscreen
        ></b-embed>
      </div>
    </div>
    <!-- COMBINED VIEW END -->

    <!-- SEARCH FIELDS START -->
    <div class="row mt-4" v-if="!isCombinedView">
      <div class="col">
        <div class="search-fields">
          <div class="d-flex flex-row flex-wrap">
            <div class="col-sm-6" v-for="field,idx in filters">

              <div class="row">
                <div class="col-sm-4">
                  <label :for="field.id">{{ $t(field.title) }}:</label>
                </div>

                <div class="col-sm-8 mb-2">
                  <b-form-input v-model="searchParameters[field.id]" :id="field.id" :type="field.type"></b-form-input>

                  <b-form-text v-if="field.id === 'solrSearch'">{{ $t('messages.solrSearchInfo') }}.</b-form-text>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- SEARCH FIELDS END -->
    <list-module-core
      v-if="!isCombinedView"
      module="reference"
      title="titles.editReference"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchReferences"
      search-history="referenceSearchHistory"
      view-type="referenceViewType"
      :multi-ordering="true"
      :export-buttons="true"
      :use-list-view="true"
      :use-alternative-table-view="true"
      :is-library-active="isLibraryActive"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
      v-on:add-reference-to-active-library="addReferenceToActiveLibrary"
    ></list-module-core>

  </div>
</template>

<script>
  import ListModuleCore from "./ListModuleCore";
  import {fetchReferences} from "@/assets/js/api/apiCalls";
  import fontAwesomeLib from "../components/mixins/fontAwasomeLib";
  import sidebarMixin from "../components/mixins/sidebarMixin";
  import {fetchAddReferenceToLibrary} from "../assets/js/api/apiCalls";
  import {toastError, toastSuccess} from "../assets/js/iziToast/iziToast";

  export default {
    components: {
      ListModuleCore
    },
    name: "References",
    mixins: [fontAwesomeLib, sidebarMixin],
    data() {
      return {
        response: {},
        columns:[
          {id:"id",title:"reference.id",type:"number"},
          {id:"author",title:"reference.author",type:"text"},
          {id:"year",title:"reference.year",type:"number"},
          {id:"title",title:"reference.title",type:"text"},
          {id:"journal",title:"reference.journal",type:"text"},
          {id:"volume",title:"reference.volume",type:"text"},
          {id:"pages",title:"reference.pages",type:"text"},
          {id:"id",title:"",type:"text", orderBy: false},
          {id:"doi",title:"reference.doi",type:"text"},
          {id:"attachment__filename",title:"reference.pdf",type:"text"},
          {id:"",title:"reference.library",type:"ACTIVE_LIBRARY_HEADER", orderBy: false, showHeader: true},
        ],
        filters:[
          {id:"author",title:"reference.author",type:"text"},
          {id:"year",title:"reference.year",type:"number"},
          {id:"title",title:"reference.title",type:"text"},
          {id:"bookJournal",title:"reference.bookJournal",type:"text"},
          {id:"abstractKeywordsRemarks",title:"reference.abstractKeywordsRemarks",type:"text"},
          {id:"id",title:"reference.id",type:"number"},
          {id:"libraryAuthor",title:"reference.libraryAuthor",type:"text"},
          {id:"libraryIdTitle",title:"reference.libraryIdTitle",type:"text"},
          {id:"solrSearch",title:"reference.solrSearch",type:"text"},
        ],
        searchParameters: this.setDefaultSearchParameters(),
        isCombinedView: false,
        inputUrl: null,
        iframeUrl: null,
        combinedViewSize: 6,
        freeSpacePercentage: 73.3,
        agent: null,
      }
    },

    computed: {
      combinedViewLeftColSize() {
        if (this.combinedViewSize > 0 && this.combinedViewSize < 12) return this.combinedViewSize
        else if (this.combinedViewSize == 0) return 1
        else if (this.combinedViewSize == 12) return 11
      },

      combinedViewRightColSize() {
        if (this.combinedViewSize > 0 && this.combinedViewSize < 12) return 12 - this.combinedViewSize
        else if (this.combinedViewSize == 0) return 11
        else if (this.combinedViewSize == 12) return 1
      },

      sidebarUserAction() {
        return this.$store.state['sidebarUserAction']
      },

      activeLibrary() {
        return this.$store.state['activeLibrary']
      },

      isLibraryActive() {
        return this.$store.state['activeLibrary'] !== null;
      }
    },

    created() {
      // Gets user data from session storage
      if (this.$session.exists() && this.$session.get('authUser') !== null) {
        const user = this.$session.get('authUser')
        this.agent = {
          id: user.agent_id,
          agent: null,
          forename: user.user,
          surename: null,
          user: user.user,
        }
        //console.log(this.agent);
      }

      // Used by sidebar
      const searchHistory = this.$localStorage.get('librarySearchHistory', 'fallbackValue');
      let params = this.isDefinedAndNotNull(searchHistory) && searchHistory.hasOwnProperty('id') && searchHistory !== 'fallbackValue' && searchHistory !== '[object Object]' ? searchHistory : this.searchParameters;
      this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', {
        searchHistory: 'librarySearchHistory',
        search: params,
        request: 'FETCH_LIBRARIES',
        title: 'header.libraries',
        object: 'library',
        field: 'library__title_en',
        agent: this.agent
      });
    },

    mounted() {
      window.addEventListener('resize', this.handleResize);
    },

    beforeDestroy() {
      window.removeEventListener('resize', this.handleResize);
    },

    watch: {
      'sidebarUserAction' (newVal, oldVal) {
        console.log(newVal)
        console.log(oldVal)
        this.handleSidebarUserAction(newVal, 'reference')
      },
    },

    methods: {
      isDefinedAndNotNull(value) {return !!value && value !== null},

      fetchReferences() {
        return new Promise((resolve) => {
          resolve(fetchReferences(this.searchParameters))
        });
      },
      searchParametersChanged(newParams) {
        this.searchParameters = newParams
      },
      setDefaultSearchParameters(isMultiOrdering) {
        return {
          author: null,
          year: null,
          title: null,
          bookJournal: null,
          abstractKeywordsRemarks: null,
          id: null,
          libraryAuthor: null,
          libraryIdTitle: null,
          solrSearch: null,
          page: 1,
          paginateBy: 50,
          orderBy: isMultiOrdering ? ['-id', '-year'] : '-id',
        }
      },
      setDefaultSearchParametersFromDeleteButton(arg1, isMultiOrdering) {
        this.searchParameters = this.setDefaultSearchParameters(isMultiOrdering)
      },

      openIframe() {
        let url = this.inputUrl
        if (url !== null) {
          url = url.toLowerCase()
          if (url.startsWith('https://') || url.startsWith('http://')) {
            this.iframeUrl = null
            this.iframeUrl = url
          } else {
            this.iframeUrl = null
            this.iframeUrl = 'http://' + url
          }
        }
      },

      handleResize() {
        // If window width goes under 1600 then remove combined view because combined view is only for very large screens
        if (window.innerWidth < 1600) {
          // Calculates percent of how much space is available
          this.isCombinedView = false
        } else {
          // Calculates free space percentage
          // sidebar = 260
          // margin-left = 177
          this.freeSpacePercentage = (100 * (window.innerWidth - 427)) / window.innerWidth
        }
      },

      addReferenceToActiveLibrary(id) {
        let formData = new FormData()
        formData.append('data', JSON.stringify({reference: id, library: this.activeLibrary.library}))

        fetchAddReferenceToLibrary(formData).then(response => {
          if (typeof response.body.message !== 'undefined') {
            if (this.$i18n.locale === 'ee' && typeof response.body.message_et !== 'undefined') {
              toastSuccess({text: response.body.message_et});
            } else {
              toastSuccess({text: response.body.message});
            }
          }
          if (typeof response.body.error !== 'undefined') {
            if (this.$i18n && this.$i18n.locale === 'ee' && typeof response.body.error_et !== 'undefined') {
              toastError({text: response.body.error_et});
            } else {
              toastError({text: response.body.error});
            }
          }
        }, errResponse => {
          if (typeof errResponse.body.error !== 'undefined') toastError({text: errResponse.body.error})
          toastError({text: this.$t('messages.uploadError')})
        })

      }

    }
  }
</script>

<style scoped>

  .custom-control {
    display: none;
  }

  /* Show combined view button only on very large screen */
  @media (min-width: 1600px) {
    .custom-control {
      display: inline;
    }
  }

  .custom-control-label:hover {
    cursor: pointer;
  }

  .custom-range {
    transition: all .5s linear;
  }

  .left-side {
    border-right: 2px solid #6c757d;
    /*border-left: 2px solid #6c757d;*/
  }

  .right-side {
    border-left: 2px solid #6c757d;
    /*border-right: 2px solid #6c757d;*/
  }

  /* iframe */
  .embed-responsive {
    height: 100vw;
  }

  @media (min-width: 992px) {
    .break-out {
      /* less than sidebar width, because otherwise there is too much margin. */
      /* Combined view is possible only on 1600px and up, so actually no need to use media query */
      margin-left: 177px;
    }
  }

  .break-out {
    /* Source: https://medium.com/@simonlidesign/an-elegant-way-to-break-the-bootstrap-container-2912628e4829 */
    /*width: 98vw; Width is changed inline and calculated by resize event */
    left: calc(-1 * (100vw - 104.5%) / 2);
    position: relative;
  }

  .fluid-movement div {
    -webkit-transition: all 300ms linear;
    transition: all 300ms linear;
  }

</style>
