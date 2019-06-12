<template>
  <div>
    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">{{ $t('header.localities') }}</p>
      </div>
      <div class="col-sm-6 text-right">
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/locality/add' }">{{ $t('add.new') }}</router-link>
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
      module="locality"
      title="titles.editLocality"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchLocalities"
      search-history="localitySearchHistory"
      view-type="localityViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
    ></list-module-core>

  </div>

</template>

<script>
  import ListModuleCore from "./ListModuleCore";
  import {fetchLocalities} from "@/assets/js/api/apiCalls";

  export default {
    components: {
      ListModuleCore
    },
    name: "Localities",
    data() {
      return {
        response: {},
        columns: [
          {id: "id", title: "editLocality.id", type: "number"},
          {id: "locality", title: "editLocality.locality", type: "text"},
          {id: "number", title: "editLocality.number", type: "text"},
          {id: "country", title: "editLocality.country", type: "text"},
          {id: "agent", title: "editLocality.agent", type: "text"}
        ],
        filters: [
          {id: "id", title: "editLocality.id", type: "number"},
          {id: "locality", title: "editLocality.locality", type: "text"},
          {id: "number", title: "editLocality.number", type: "text"},
          {id: "country", title: "editLocality.country", type: "text"},
          {id: "agent", title: "editLocality.agent", type: "text"}
        ],
        searchParameters: this.setDefaultSearchParameters(),
        block: {search: true}
      }
    },
    methods: {
      fetchLocalities() {
        return new Promise((resolve) => {
          resolve(fetchLocalities(this.searchParameters))
        });
      },
      searchParametersChanged(newParams) {
        this.searchParameters = newParams
      },
      setDefaultSearchParameters() {
        return {
          locality: null,
          number: null,
          county: null,
          country: null,
          agent: null,
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
  label {
    margin: 5px 0 0 0;
    color: #999;
    font-size: 0.8rem;
  }
</style>
