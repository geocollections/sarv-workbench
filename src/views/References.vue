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

    <div class="row" v-if="isCombinedView">
      <div class="col-6 left-side">
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
          v-on:search-params-changed="searchParametersChanged"
          v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
        ></list-module-core>
      </div>

      <div class="col-6 right-side">
        <div class="row">
          <div class="col-sm-9">
            <b-form-input v-model="inputUrl" @keyup.enter="openIframe" placeholder="https://"></b-form-input>
          </div>

          <div class="col-sm-3">
            <b-button variant="primary" @click="openIframe">
              <font-awesome-icon icon="external-link-alt" />
              {{ $t('add.buttons.openIframe') }}
            </b-button>
          </div>
        </div>

        <b-embed
          class="mt-3"
          type="iframe"
          :src="iframeUrl"
          allowfullscreen
        ></b-embed>
      </div>
    </div>

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
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
    ></list-module-core>

  </div>
</template>

<script>
  import ListModuleCore from "./ListModuleCore";
  import {fetchReferences} from "@/assets/js/api/apiCalls";
  import fontAwesomeLib from "../components/mixins/fontAwasomeLib";

  export default {
    components: {
      ListModuleCore
    },
    name: "References",
    mixins: [fontAwesomeLib],
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
          {id:"doi",title:"",type:"text", orderBy: false},
          {id:"attachment__filename",title:"",type:"text", orderBy: false},
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
      }
    },

    methods: {
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
            this.iframeUrl = url
          } else {
            this.iframeUrl = 'http://' + url
          }
        }
      }
    }
  }
</script>

<style scoped>
  .custom-control {
    display: inline;
  }

  .custom-control-label:hover {
    cursor: pointer;
  }

  .left-side {
    border-right: 1.5px solid #6c757d;
  }

  .right-side {
    border-left: 1.5px solid #6c757d;
  }

  .embed-responsive {
    height: 100%;
  }
</style>
