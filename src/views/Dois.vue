<template>
  <div>
    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">{{ $t('header.dois') }}</p>
      </div>
      <div class="col-sm-6 text-right">
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/doi/add' }">{{ $t('add.new') }}</router-link>
      </div>
    </div>

    <!-- SEARCH FIELDS START -->
    <fieldset class="border p-2" id="block-search">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.search }" @click="block.search = !block.search">
        <i class="fas fa-search"></i>
        {{ $t('edit.search') }}
      </legend>

      <transition name="fade">
        <div class="row" v-if="filters.length > 0 && block.search">
          <div class="col-md-4" v-for="field,idx in filters">

            <label :for="field.id">{{ $t(field.title) }}:</label>

            <b-form-input v-model="searchParameters[field.id]" :id="field.id" :type="field.type"></b-form-input>

          </div>
        </div>
      </transition>
    </fieldset>

    <!-- SEARCH FIELDS END -->
    <list-module-core
      module="doi"
      title="titles.editDoi"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchDois"
      search-history="doiSearchHistory"
      view-type="doiViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
    ></list-module-core>

  </div>
</template>

<script>
  import ListModuleCore from "./ListModuleCore";
  import {fetchDois} from "../assets/js/api/apiCalls";

  export default {
    components: {
      ListModuleCore
    },
    name: "Dois",

    data() {
      return {
        response: {},
        columns: [
          {id: "id", title: "doi.identifier", type: "number"},
          {id: "creators", title: "doi.creators", type: "text"},
          {id: "publication_year", title: "doi.year", type: "text"},
          {id: "title", title: "doi.title", type: "text"},
          {id: "resource_type__value", title: "doi.resource_type", type: "text"},
          {id: "datacite_created", title: "doi.datacite_created", type: "text", orderBy: false, showHeader: true},
          {id: "id", title: "", type: "text", orderBy: false},
          // {id:"identifier",title:"",type:"text", orderBy: false},
        ],
        filters: [
          {id: "identifier", title: "doi.identifier", type: "text"},
          {id: "creators", title: "doi.creators", type: "text"},
          {id: "publication_year", title: "doi.year", type: "number"},
          {id: "title", title: "doi.title", type: "text"},
        ],
        searchParameters: this.setDefaultSearchParameters(),
        block: {search: true}
      }
    },

    created: function () {
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
    },

    methods: {
      fetchDois() {
        return new Promise((resolve) => {
          resolve(fetchDois(this.searchParameters))
        });
      },
      searchParametersChanged(newParams) {
        this.searchParameters = newParams
      },
      setDefaultSearchParameters() {
        return {
          identifier: null,
          creators: null,
          publication_year: null,
          title: null,
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
  label {
    margin: 5px 0 0 0;
    color: #999;
    font-size: 0.8rem;
  }
</style>
