<template>
  <div>
    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">{{ $t('header.analyses') }}</p>
      </div>
      <div class="col-sm-6 text-right">
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/analysis/add' }">{{ $t('add.new') }}</router-link>
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
      module="analysis"
      title="titles.editDoi"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchAnalyses_"
      search-history="analysisSearchHistory"
      view-type="analysisViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
    ></list-module-core>

  </div>
</template>

<script>
  import ListModuleCore from "./ListModuleCore";
  import {fetchAnalyses} from "../assets/js/api/apiCalls";
  import permissionsMixin from "../components/mixins/permissionsMixin";

  export default {
    components: {
      ListModuleCore
    },
    name: "Analyses",
    mixins: [permissionsMixin],

    data() {
      return {
        response: {},
        columns: [
          {id: "id", title: "analysis.id", type: "number"},
          {id: "sample__id", title: "analysis.sample__id", type: "text"},
          {id: "sample__number", title: "analysis.sample__number", type: "text"},
          {id: "sample__locality__locality", title: "analysis.sample__locality", type: "text"},
          {id: "sample__depth", title: "analysis.sample__depth", type: "text"},
          {id: "analysis_method__analysis_method", title: "analysis.analysis_method", type: "text"},
          {id: "date", title: "analysis.date_", type: "date"},
          {id: "lab_txt", title: "analysis.labor_txt", type: "text"},
          {id: "agent__agent", title: "analysis.agent", type: "text"}
        ],
        filters: [
          {id: "id", title: "analysis.id", type: "number"},
          {id: "analysis_method", title: "analysis.analysis_method", type: "text"},
          {id: "agentAndLab", title: "analysis.agentAndLab", type: "text"},
        ],
        searchParameters: this.setDefaultSearchParameters(),
        block: {search: true}
      }
    },

    methods: {
      fetchAnalyses_() {
        return new Promise((resolve) => {
          resolve(fetchAnalyses(this.searchParameters, this.currentUser, this.databaseId))
        });
      },
      searchParametersChanged(newParams) {
        this.searchParameters = newParams
      },
      setDefaultSearchParameters() {
        return {
          id: null,
          analysis_method: null,
          agentAndLab: null,
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
