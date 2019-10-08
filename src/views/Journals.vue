<template>
  <div>
    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">{{ $t('header.journals') }}</p>
      </div>
      <div class="col-sm-6 text-right">
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/journal/add' }">{{ $t('add.new') }}</router-link>
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
          <div class="col-md-4" v-for="field in filters">

            <label :for="field.id">{{ $t(field.title) }}:</label>

            <b-form-input v-model="searchParameters[field.id]" :id="field.id" :type="field.type"></b-form-input>

          </div>
        </div>
      </transition>
    </fieldset>

    <!-- SEARCH FIELDS END -->
    <list-module-core
      module="journal"
      title="titles.editJournal"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchJournals"
      search-history="journalSearchHistory"
      view-type="journalViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
    ></list-module-core>

  </div>
</template>

<script>
  import ListModuleCore from "./ListModuleCore";
  import {fetchJournals} from "../assets/js/api/apiCalls";

  export default {
    name: "Journals",
    components: {
      ListModuleCore
    },
    data() {
      return {
        response: {},
        columns: [
          {id: "id", title: "journal.id", type: "number"},
          {id: "journal_name", title: "journal.journalName", type: "text"},
          {id: "journal_short", title: "journal.journalShort", type: "text"},
          {id: "journal_original", title: "journal.journalOriginal", type: "text"},
          {id: "publisher", title: "journal.publisher", type: "text"},
          {id: "remarks", title: "journal.remarks", type: "text"},
        ],
        filters: [
          {id: "journal", title: "journal.journalFilter", type: "text"},
          {id: "publisher", title: "journal.publisherFilter", type: "text"},
          {id: "remarks", title: "journal.remarksFilter", type: "text"},
        ],
        searchParameters: this.setDefaultSearchParameters(),
        block: {search: true}
      }
    },

    methods: {
      fetchJournals() {
        return new Promise((resolve) => {
          resolve(fetchJournals(this.searchParameters))
        });
      },
      searchParametersChanged(newParams) {
        this.searchParameters = newParams
      },
      setDefaultSearchParameters() {
        return {
          journal: null,
          publisher: null,
          remarks: null,
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
        }
      },
      setDefaultSearchParametersFromDeleteButton() {
        this.searchParameters = this.setDefaultSearchParameters()
      },
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
