<template>
  <div>
    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">{{ $t('header.libraries') }}</p>
      </div>
      <div class="col-sm-6 ralign">
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/library/add' }">{{ $t('add.new') }}</router-link>
      </div>
    </div>
    <!-- SEARCH FIELDS START -->
    <div class="row mt-4">
      <div class="col">
        <div class="search-fields">
          <div class="d-flex flex-row flex-wrap">
            <div class="col-sm-6" v-for="field,idx in filters">
              <label class="col-sm-4 p-0" :for="field.id">{{ $t(field.title) }}:</label>
              <b-form-input style="display: inline !important; " class="col-sm-8 mb-2"
                            v-model="searchParameters[field.id]" :id="field.id" :type="field.type">
              </b-form-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- SEARCH FIELDS END -->
    <list-module-core
      module="library"
      title="titles.editLibrary"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchLibraries"
      search-history="librarySearchHistory"
      view-type="libraryViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
    ></list-module-core>

  </div>
</template>

<script>
  import ListModuleCore from "./ListModuleCore";
  import { fetchLibraries } from "@/assets/js/api/apiCalls";

  export default {
    components: {
      ListModuleCore
    },
    name: "Libraries",
    data() {
      return {
        response: {},
        columns:[
          {id:"id",title:"library.id",type:"number"},
          {id:"author_txt",title:"library.author_txt",type:"text"},
          {id:"title",title:"library.title",type:"text"},
          {id:"is_private",title:"library.isPrivate",type:"text"},
          {id:"reference",title:"library.reference",type:"text", orderBy: false},
        ],
        filters:[
          {id:"author_txt",title:"library.author_txt",type:"text"},
          {id:"year",title:"library.year",type:"number"},
          {id:"title",title:"library.title",type:"text"},
          {id:"reference",title:"library.reference",type:"text"},
        ],
        searchParameters: this.setDefaultSearchParameters()
      }
    },
    methods: {
      fetchLibraries() {
        return new Promise((resolve) => {
          resolve(fetchLibraries(this.searchParameters))
        });
      },
      searchParametersChanged(newParams) {
        this.searchParameters = newParams
      },
      setDefaultSearchParameters() {
        return {
          author_txt: null,
          year: null,
          title: null,
          reference: null,
          id: null,
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
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
