<template>
  <div>
    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">{{ $t('header.references') }}</p>
      </div>
      <div class="col-sm-6 text-right">
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/reference/add' }">{{ $t('add.new') }}</router-link>
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/library' }">{{ $t('header.libraries') }}</router-link>
      </div>
    </div>
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
</template>

<script>
  import ListModuleCore from "./ListModuleCore";
  import {fetchReferences} from "@/assets/js/api/apiCalls";

  export default {
    components: {
      ListModuleCore
    },
    name: "References",
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
        searchParameters: this.setDefaultSearchParameters()
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
      setDefaultSearchParameters() {
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
          orderBy: ['-id', '-year'],
          // orderBy: '-id',
        }
      },
      setDefaultSearchParametersFromDeleteButton() {
        this.searchParameters = this.setDefaultSearchParameters()
      }
    }
  }
</script>

<style scoped>

</style>
